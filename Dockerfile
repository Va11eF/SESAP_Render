# Stage 1: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY CapstoneController.sln ./
COPY . ./

RUN dotnet restore
RUN dotnet publish CapstoneController.csproj -c Release -o /out

# Stage 2: Build and run everything
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

WORKDIR /app

# Copy and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy entire source
COPY . .

# Build frontend
RUN npm run build

# Set up Python environment
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

# Copy .NET publish output to known location
COPY --from=build /out ./dotnet

EXPOSE 5000

CMD ["./start.sh"]
