#!/usr/bin/env bash
set -e
if [ -z "$1" ]
then
    echo "No argument supplied"
    exit 1
fi
sam build
SAM_PARAMETERS=$( cat ./config/$1.json | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' )
sam deploy --parameter-overrides $SAM_PARAMETERS --config-file ../samconfig.toml --config-env=$1