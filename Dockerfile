# Use official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy and restore .NET project
COPY CapstoneController.sln ./
COPY CapstoneController.csproj ./
COPY . ./
RUN dotnet restore
RUN dotnet build -c Release -o /app/out

# Stage 2: Use Node.js + Python + .NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Install Node.js (LTS)
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy build output from build stage
COPY --from=build /app/out ./

# Copy everything else for frontend and Python scripts
COPY . .

# Install frontend dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose backend and frontend ports (optional)
EXPOSE 5000 5084

# Start script
CMD ["./start.sh"]
