#!/usr/bin/env bash

LAST_WEEK_MONDAY=`date -v-monday -v-7d +%Y-%m-%d`
LAST_WEEK_SUNDAY=`date -v-monday -v-1d +%Y-%m-%d`

git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames --after=$LAST_WEEK_MONDAY --until=$LAST_WEEK_SUNDAY > codemaat.txt
docker run -v $(pwd):/data --rm philipssoftware/code-maat -l /data/codemaat.txt -c git2 -a abs-churn
