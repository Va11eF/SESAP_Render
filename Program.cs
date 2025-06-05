/*
**   Program.cs

*    Main file of the dotnet minimal api microcontroller
*    Builds the api, connects to the database, and provides routing capabilities 
*    and middleware for all of the endpoints. Also uses processes to run python scripts
*    to reach the LLM
*/

using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql;
using CapstoneController.Data;
using AutoMapper;
using CapstoneController.Dtos;
using CapstoneController.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;


/* Creats a builder object and populates required parameters such as database connection and establishes the repository */

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var sqlConBuilder = new MySqlConnector.MySqlConnection();

var envConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
sqlConBuilder.ConnectionString = string.IsNullOrEmpty(envConnectionString)
    ? builder.Configuration.GetConnectionString("AivenMySQL")
    : envConnectionString;
//sqlConBuilder.UserID = builder.Configuration["UserId"];
//sqlConBuilder.Password = builder.Configuration["Password"];

builder.Services.AddDbContext<AppDbContext>(opt => opt.UseMySql(sqlConBuilder.ConnectionString, new MySqlServerVersion(new Version(10, 11, 10))));
builder.Services.AddScoped<ICapstoneRepo, CapstoneRepo>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();



if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

/* Runs a python script given a script path (filename) and the working directory for output */
async Task<IResult?> runPythonScript(string scriptPath, string workingDirectory)
{   
    // Creates a new process so that python scripts can be ran from C#
    var startInfo = new ProcessStartInfo
    {
        FileName = "python3",
        Arguments = $"\"{scriptPath}\"",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true,
        WorkingDirectory = workingDirectory
    };

    Console.WriteLine($"[DEBUG] Running: {startInfo.FileName} {startInfo.Arguments}");
    Console.WriteLine($"[DEBUG] In directory: {startInfo.WorkingDirectory}");


    // This launches the newly created function in order to run the python script
    using var process = new Process { StartInfo = startInfo };

    try
    {
        // This is what starts the launched process
        process.Start();

        // Used to read debugging prints from python script
        var stdOut = await process.StandardOutput.ReadToEndAsync();
        var stdErr = await process.StandardError.ReadToEndAsync();

        //Gives the script time to run, if it goes over time then it kills it and returns an error
        if (!process.WaitForExit(60000))
        {
            process.Kill();
            return Results.Problem($"{Path.GetFileName(scriptPath)} timed out.");
        }

        // Makes sure that the process exited with a 0, otherwise there was an error
        if (process.ExitCode != 0)
        {
            return Results.Problem($"{Path.GetFileName(scriptPath)} failed. Error: {stdErr}");
        }


    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Exception starting script {scriptPath}: {ex.Message}");
        Console.WriteLine($"[ERROR] StackTrace: {ex.StackTrace}");
        return Results.Problem($"Exception running {Path.GetFileName(scriptPath)}: {ex.Message}");
    }

    return null;
}


/* Stores interview information from frontend to database */
app.MapPost("api/v1/interviews", async (ICapstoneRepo repo, IMapper mapper, InterviewDto interviewDto) => {
    var interviewmodel = mapper.Map<Interviews>(interviewDto);

    //string baseDirectory = Directory.GetCurrentDirectory();

    // Run populateDatabase.py
    // var populateScript = Path.Combine(baseDirectory, "populateDatabase.py");

    // var result1 = await runPythonScript(populateScript, baseDirectory);
    // if (result1 is not null) return result1;

    // Run queryAll.py
    // var queryScript = Path.Combine(baseDirectory, "queryAll.py");
    // var result2 = await runPythonScript(queryScript, baseDirectory);
    // if (result2 is not null) return result2;


    // Run generateCharts.py
    // var chartScript = Path.Combine(baseDirectory, "generateCharts.py");
    // var result3 = await runPythonScript(chartScript, baseDirectory);
    // if (result3 is not null) return result3;
    

    await repo.CreateInterview(interviewmodel);
    await repo.SaveChanges();

    return Results.Created($"{interviewDto}", interviewDto);
});

/* Deletes an interview from the database with a specific id */
app.MapDelete("api/v1/interviews/{id}", async (ICapstoneRepo repo, IMapper mapper, int id) => {
    var interview = await repo.GetInterviewById(id);
    if (interview == null){
        return Results.NotFound();
    }

    repo.DeleteInterview(interview);

    await repo.SaveChanges();

    return Results.NoContent();
});

/* Gets all the interviews from the database to the frontend */
app.MapGet("api/v1/interviews", async (ICapstoneRepo repo, IMapper mapper) => {
    var interviews = await repo.GetAllInterviews();
    return Results.Ok(mapper.Map<IEnumerable<InterviewDto>>(interviews));
});

/* Gets all the interviews from the database to the frontend */
app.MapGet("api/v1/whitelistedUsers", async (ICapstoneRepo repo, IMapper mapper) => {
    var whitelistedUsers = await repo.GetAllWhitelistedUsers();
    return Results.Ok(mapper.Map<IEnumerable<WhitelistedUsersDto>>(whitelistedUsers));
});

app.MapPost("api/v1/whitelistedUsers", async (ICapstoneRepo repo, IMapper mapper, WhitelistedUsersDto whitelistedUserDto) => {
    var whitelistModel = mapper.Map<WhitelistedUsers>(whitelistedUserDto);

    await repo.CreateWhitelistedUser(whitelistModel);
    await repo.SaveChanges();

    return Results.Created($"{whitelistedUserDto}", whitelistedUserDto);
});

app.Run();


