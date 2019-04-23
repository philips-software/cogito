#!/usr/bin/env bash

LAST_WEEK_SUNDAY=`date -v-monday -v-8d +%Y-%m-%d`
LAST_WEEK_MONDAY=`date -v-monday -v-7d +%Y-%m-%d`
LAST_SUNDAY=`date -v-monday -v-1d +%Y-%m-%d`

git log --all --numstat --date=short --pretty=format:'--%h--%ad--%aN' --no-renames --after=$LAST_WEEK_SUNDAY --until=$LAST_SUNDAY > codemaat.txt

if [ -s codemaat.txt ]
then
  echo "We've got ourselves some changes in period: $LAST_WEEK_MONDAY till $LAST_SUNDAY (both inclusive)!"
  docker run -v $(pwd):/data --rm philipssoftware/code-maat -l /data/codemaat.txt -c git2 -a abs-churn > abs-churn.txt
  awk -F"," 'NR<=1{print;next}NR>1 {print;x+=$2;y+=$3;z+=$4}END{print "Total," x "," y "," z}' abs-churn.txt > churn.txt
else
  echo "Nothing happened in $LAST_WEEL_SUNDAY till $LAST_SUNDAY"
  echo "Total, 0, 0, 0" > churn.txt
fi

echo
echo
echo "==========================================================================="
echo "Results are stored in a file 'churn.txt' which can be downloaded in gitlab."
echo "==========================================================================="
echo
echo "This will be the content of that file:"
echo
cat churn.txt
