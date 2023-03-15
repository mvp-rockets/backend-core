#!/usr/bin/env bash
set -e
if [ -z "$1" ]
then
    echo "No argument supplied"
    exit 1
fi
sam build
STACK_NAME=$( jq '.stack_name' ./config/$1.json | tr -d '"' )
SAM_PARAMETERS=$( jq '.parameters' ./config/$1.json | jq -r '.[] | "\(.ParameterKey)=\(.ParameterValue)"' )
sam deploy --stack-name=$STACK_NAME --parameter-overrides $SAM_PARAMETERS --config-file ../samconfig.toml --config-env=$1