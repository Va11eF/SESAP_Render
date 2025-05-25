# Stage 1: Build .NET app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy solution and projects
COPY CapstoneController.sln ./
COPY CapstoneController/*.csproj ./CapstoneController/
COPY CapstoneController/. ./CapstoneController/

# Restore and build
RUN dotnet restore CapstoneController/CapstoneController.csproj
RUN dotnet publish CapstoneController/CapstoneController.csproj -c Release -o /app/out

# Stage 2: Runtime + Node.js + Python
FROM mcr.microsoft.com/dotnet/aspnet:8.0

# Install Node.js (LTS), Python, pip, and venv
RUN apt-get update && \
    apt-get install -y curl python3 python3-pip python3-venv && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy published .NET app from build stage
COPY --from=build /app/out ./out

# Copy frontend and Python code
COPY client ./client
COPY requirements.txt .
COPY scripts ./scripts
COPY server.js .
COPY start.sh .
COPY uploads ./uploads

# Build React frontend
WORKDIR /app/client
RUN npm install
RUN npm run build

# Copy built React app into static files folder if needed
# (depends on where your Express app looks — e.g., "client/build")
# If you use Vite, adjust the static path accordingly
# E.g., if using Vite's dist output:
# RUN cp -r dist ../out/client

# Python setup
WORKDIR /app
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

# Optional: expose ports
EXPOSE 5000 5084

# Start app
CMD ["./start.sh"]
