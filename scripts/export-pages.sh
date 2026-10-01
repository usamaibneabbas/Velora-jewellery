#!/usr/bin/env bash
# Builds a static export for GitHub Pages into /docs.
# GitHub: Settings → Pages → Deploy from a branch → <this branch> → /docs
set -euo pipefail
cd "$(dirname "$0")/.."
REPO_PATH="${PAGES_BASE_PATH:-/Velora-jewellery}"
rm -rf .next out
PAGES_BASE_PATH="$REPO_PATH" NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://usamaibneabbas.github.io$REPO_PATH}" npx next build --webpack
rm -rf docs && mv out docs
touch docs/.nojekyll   # keep the _next/ folder (Jekyll ignores underscore folders)
rm -rf .next           # don't leave a Pages-configured build behind
echo "Exported to docs/"
