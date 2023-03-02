#!/usr/bin/env bash
set -e
if [ -z "$1" ]
then
    echo "No argument supplied"
    exit 1
fi
# Change to the parent directory
#cd /path/to/parent/directory

# Loop through all directories in the parent directory
for dir in */; do
  # Change to the directory
  cd "$dir"
  # Check if a script file exists
  if [ -f sam_deploy.sh ]; then
    # Execute the script file
    yes | ./sam_deploy.sh $1
  fi
  # Change back to the parent directory
  cd ..
done
