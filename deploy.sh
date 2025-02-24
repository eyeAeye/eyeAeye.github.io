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

echo "📌 Committing and pushing changes in gh-pages (public folder)..."
# Go To Public folder
cd public
# Add changes to git.
git add .

msg="rebuilding site $(date)"
if [ $# -eq 1 ]; then
  msg="$1"
fi
git commit -m "$msg"
git push origin gh-pages
cd ..

# add commit for main branch later if needed
