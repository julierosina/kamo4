#!/bin/bash
# Kamo — GitHub repository setup script
# Usage: bash setup-github.sh YOUR_GITHUB_USERNAME

USERNAME=$1
if [ -z "$USERNAME" ]; then
  echo "Usage: bash setup-github.sh YOUR_GITHUB_USERNAME"
  exit 1
fi

echo "Setting up GitHub repository for: $USERNAME"

# Initialize git
git init
git add .
git commit -m "Initial commit — Kamo v2"

# Add remote
git remote add origin "https://github.com/$USERNAME/kamo.git"

echo ""
echo "Now go to https://github.com/new and create a repo named 'kamo'"
echo "Then run:"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "For GitHub Pages deployment:"
echo "  npm install --save-dev gh-pages"
echo "  # Add to package.json scripts: \"deploy\": \"gh-pages -d dist\""
echo "  npm run build && npm run deploy"
echo ""
echo "Your site will be live at: https://$USERNAME.github.io/kamo/"
