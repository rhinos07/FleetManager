#!/bin/bash
# Build script for FleetController Frontend

set -e

echo "Building FleetController Frontend..."
echo "================================="

cd "$(dirname "$0")/Vda5050FleetController/wwwroot"

echo "Installing npm dependencies..."
npm install

echo "Building TypeScript and bundling..."
npm run build

echo ""
echo "✓ Frontend build completed successfully!"
echo "  Output: Vda5050FleetController/wwwroot/dist/bundle.js"
