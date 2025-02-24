#!/bin/bash

# Exit script if any command fails
set -e

echo "🔄 Pulling latest changes from gh-pages into public/..."
cd public
git checkout gh-pages
git pull origin gh-pages
cd ..

echo "⚡ Building Hugo site..."
hugo

echo "✅ Build complete!"
