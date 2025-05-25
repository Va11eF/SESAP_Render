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

# Install Node.js (LTS), Python3, pip, and venv support
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip python3-venv && \
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

# Create and activate a Python virtual environment, install dependencies
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

# Make the venv the default Python environment
ENV PATH="/opt/venv/bin:$PATH"

# Expose backend and frontend ports (optional)
EXPOSE 5000 5084

# Start script
CMD ["./start.sh"]
