#!/bin/bash

# Check if a file name is provided as an argument
if [ $# -ne 1 ]; then
  echo "Usage: $0 <text_file>"
  exit 1
fi

text_file="$1"

# Check if the file exists
if [ ! -f "$text_file" ]; then
  echo "File not found: $text_file"
  exit 1
fi

while IFS= read -r line; do
  eval "$line"
  echo "Sleeping for 5sec"
  sleep 5
  echo "sleep completed"
done <"$text_file"
