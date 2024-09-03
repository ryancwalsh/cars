# `./helpers/scrapers/loop.sh`

#!/bin/bash

# URL to visit
URL="http://localhost:3000/api/ratings/determineMissing"

# Number of times to visit the URL
NUM_VISITS=30

# Maximum delay variation (in seconds)
MAX_DELAY_VARIATION=10

# Loop to make requests
for ((i=1; i<=NUM_VISITS; i++))
do
  # Get the current date and time
  CURRENT_DATETIME=$(date +"%Y-%m-%d %H:%M:%S")

  # Visit the URL
  echo "$CURRENT_DATETIME - Visit $i: $URL"
  curl -s "$URL" > /dev/null

  # Random delay
  RANDOM_DELAY=$((50 + RANDOM % (MAX_DELAY_VARIATION + 1)))
  echo "Sleeping for $RANDOM_DELAY seconds..."
  sleep $RANDOM_DELAY
done

echo "Completed $NUM_VISITS visits."
