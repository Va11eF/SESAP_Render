# Stage 1: Build .NET backend (Narratives functionality)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy entire backend source and solution
COPY CapstoneController.sln ./
COPY . ./

RUN dotnet restore
RUN dotnet publish CapstoneController.csproj -c Release -o /out

# Stage 2: Build & run everything
FROM node:18-slim

# Install Python, curl, and .NET runtime
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv curl gnupg && \
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg && \
    install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/ && \
    sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/microsoft.list' && \
    apt-get update && \
    apt-get install -y aspnetcore-runtime-8.0 && \
    rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Copy and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy all source files (frontend + backend + scripts)
COPY . .

# Build Vite frontend (outputs to /app/dist)
RUN npm run build

# Setup Python venv and install dependencies
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

# Copy .NET publish output
COPY --from=build /out ./dotnet

# Expose app port
EXPOSE 5000

# Start the main server
CMD ["./start.sh"]