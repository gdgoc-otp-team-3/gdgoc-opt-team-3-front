#!/bin/bash
# Build script to prepare project files for deployment
# Note: This script is not used by GitHub Actions workflow
# The workflow has its own build steps

cd ../
# Remove existing output directory if it exists
rm -rf output
mkdir output

# Copy project files, excluding unnecessary directories
cd gdgoc-opt-team-3-front
find . -maxdepth 1 -not -path "./output" -not -path "./.git" -not -path "./.github" -not -path "./node_modules" -not -path "./dist" -exec cp -R {} ../output/ \;

