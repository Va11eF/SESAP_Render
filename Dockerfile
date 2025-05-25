# Stage 1: Build .NET backend (Narratives functionality)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY CapstoneController.sln ./
COPY CapstoneController.csproj ./
COPY . ./

RUN dotnet restore
RUN dotnet build -c Release -o /out
RUN dotnet publish -c Release -o /out

# Stage 2: Build & run everything
FROM node:18-slim

# Install Python and .NET runtime
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

# Copy frontend/public-related files
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build frontend (assumes React source is in ./src and ./public)
RUN npm run build || echo "No build step (vite dev-only setup)"

# Python setup
RUN python3 -m venv /opt/venv && \
    . /opt/venv/bin/activate && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

# Copy .NET output from build stage
COPY --from=build /out ./dotnet

# Default ports (adjust if needed)
EXPOSE 5000 5084

# Launch server.js as main entry point
CMD ["node", "server.js"]