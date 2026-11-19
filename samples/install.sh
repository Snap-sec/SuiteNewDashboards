#!/bin/bash

# Node.js Application Installer
# This script installs and sets up a Node.js application from a zip file and installs Go and Nuclei

set -e  # Exit immediately if a command exits with a non-zero status

# Text formatting
BOLD="\e[1m"
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"

# Print colored message
echo_color() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${RESET}"
}

# Check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Print header
echo_color $BOLD "=== VS SCANNER INSTALLER ==="
echo ""

# Configuration - Change these values
ZIP_URL="https://suite.snapsec.co/sample/download/executor.zip"  # Replace with your actual zip file URL
APP_DIR="$HOME/vs_scanner"                      # Default installation directory
APP_PORT=3018                                  # Default port for the application

# Ask for installation directory
read -p "Installation directory [$APP_DIR]: " input_dir
APP_DIR=${input_dir:-$APP_DIR}

# Ask for port
read -p "Application port [$APP_PORT]: " input_port
APP_PORT=${input_port:-$APP_PORT}

# Check for required tools
echo_color $BOLD "\nChecking prerequisites..."

# Check for unzip
if ! command_exists unzip; then
  echo_color $RED "unzip is not installed. Installing unzip..."
  if command_exists apt-get; then
    sudo apt-get update && sudo apt-get install -y unzip
  elif command_exists yum; then
    sudo yum install -y unzip
  elif command_exists brew; then
    brew install unzip
  else
    echo_color $RED "Could not install unzip. Please install unzip manually and run this script again."
    exit 1
  fi
fi

# Check for Node.js and npm
if ! command_exists node || ! command_exists npm; then
  echo_color $RED "Node.js and/or npm are not installed. Installing Node.js (which includes npm)..."
  if command_exists apt-get; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  elif command_exists yum; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
  elif command_exists brew; then
    brew install node
  else
    echo_color $RED "Could not install Node.js. Please install Node.js manually and run this script again."
    exit 1
  fi
fi

# Install Go
if ! command_exists go; then
  echo_color $YELLOW "\nInstalling Go..."
  if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y golang
  elif command_exists yum; then
    sudo yum install -y golang
  elif command_exists brew; then
    brew install go
  else
    # Fallback to manual installation
    GO_VERSION="1.21.8"
    echo_color $YELLOW "Installing Go $GO_VERSION manually..."
    curl -LO "https://golang.org/dl/go${GO_VERSION}.linux-amd64.tar.gz"
    sudo tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
    rm "go${GO_VERSION}.linux-amd64.tar.gz"
    echo "export PATH=\$PATH:/usr/local/go/bin" >> "$HOME/.bashrc"
    export PATH=$PATH:/usr/local/go/bin
  fi
fi

# Install Nuclei
if ! command_exists nuclei; then
  echo_color $YELLOW "\nInstalling Nuclei..."
  go install -v github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
  # Move nuclei to a system path if installed in GOPATH
  if [ -f "$HOME/go/bin/nuclei" ]; then
    sudo mv "$HOME/go/bin/nuclei" /usr/local/bin/
  fi
fi

# Create installation directory if it doesn't exist
echo_color $BOLD "\nPreparing installation directory..."
mkdir -p "$APP_DIR"

# Download and extract the zip file
echo_color $BOLD "\nDownloading and extracting application..."
cd "$APP_DIR"
curl -LO "$ZIP_URL"
unzip *.zip
rm *.zip

# Install dependencies
echo_color $BOLD "\nInstalling Node.js dependencies..."
npm install

# Set up environment variables
echo_color $BOLD "\nSetting up environment..."
if [ -f .env.example ]; then
  cp .env.example .env
  echo "PORT=$APP_PORT" >> .env
  echo_color $GREEN "Created .env file from template."
else
  echo "PORT=$APP_PORT" > .env
  echo_color $GREEN "Created new .env file."
fi

# Create a start script
echo_color $BOLD "\nCreating startup script..."
cat > "$APP_DIR/start.sh" << EOF
#!/bin/bash
cd "$APP_DIR"
npm start
EOF
chmod +x "$APP_DIR/start.sh"

# Final instructions
echo_color $GREEN "\n✅ Installation completed successfully!"
echo ""
echo_color $BOLD "Usage:"
echo "1. To start the application manually: $APP_DIR/start.sh"
echo ""
echo "The application should be accessible at: http://localhost:$APP_PORT"
echo ""
echo_color $YELLOW "Note: Make sure your firewall allows connections to port $APP_PORT if you want to access the application remotely."
echo_color $YELLOW "Additional Notes:"
echo "- Nuclei is installed and available in your system PATH"
echo "- Go is installed and configured"