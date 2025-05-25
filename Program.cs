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



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var sqlConBuilder = new MySqlConnector.MySqlConnection();

sqlConBuilder.ConnectionString = builder.Configuration.GetConnectionString("AivenMySQL");
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

async Task<IResult?> runPythonScript(string scriptPath, string workingDirectory)
{
    var startInfo = new ProcessStartInfo
    {
        FileName = "python",
        Arguments = $"\"{scriptPath}\"",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true,
        WorkingDirectory = workingDirectory
    };

    using var process = new Process { StartInfo = startInfo };

    try
    {
        process.Start();
        var stdOut = await process.StandardOutput.ReadToEndAsync();
        var stdErr = await process.StandardError.ReadToEndAsync();

        if (!process.WaitForExit(60000))
        {
            process.Kill();
            return Results.Problem($"{Path.GetFileName(scriptPath)} timed out.");
        }

        if (process.ExitCode != 0)
        {
            return Results.Problem($"{Path.GetFileName(scriptPath)} failed. Error: {stdErr}");
        }

        Console.WriteLine($"[DEBUG] {Path.GetFileName(scriptPath)} output:\n{stdOut}");
    }
    catch (Exception ex)
    {
        return Results.Problem($"Exception running {Path.GetFileName(scriptPath)}: {ex.Message}");
    }

    return null;
}


/* Stores interview information from frontend to database */
app.MapPost("api/v1/interviews", async (ICapstoneRepo repo, IMapper mapper, InterviewDto interviewDto) => {
    var interviewmodel = mapper.Map<Interviews>(interviewDto);
    ///

    string baseDirectory = Directory.GetCurrentDirectory();

    Console.WriteLine("[DEBUG] Starting the Python populateDatabase script");

    // Run populateDatabase.py
    var populateScript = Path.Combine(baseDirectory, "populateDatabase.py");
    var result1 = await runPythonScript(populateScript, baseDirectory);
    if (result1 is not null) return result1;

    Console.WriteLine("[DEBUG] Starting the Python QueryAll script");

    // Run queryAll.py
    var queryScript = Path.Combine(baseDirectory, "queryAll.py");
    var result2 = await runPythonScript(queryScript, baseDirectory);
    if (result2 is not null) return result2;

    Console.WriteLine("[DEBUG] Starting the Python generateCharts script");

    // Run generateCharts.py
    var chartScript = Path.Combine(baseDirectory, "generateCharts.py");
    var result3 = await runPythonScript(chartScript, baseDirectory);
    if (result3 is not null) return result3;
    

    ///
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

app.Run();


