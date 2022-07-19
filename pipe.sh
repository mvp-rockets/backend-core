#
# Required globals:
#   NAME
#
# Optional globals:
#   GREETING (default: "Hello World")
#   DEBUG (default: "false")
source "$(dirname "$0")/common.sh"
info "Executing the pipe..."
enable_debug() {
  if [[ "${DEBUG}" == "true" ]]; then
    info "Enabling debug mode."
    set -x
  fi
}
enable_debug
# required parameters
NAME=${NAME:?'NAME environment variable missing.'}
# default parameters
GREETING=${GREETING:="Hello world"}
DEBUG=${DEBUG:="false"}
run echo "${GREETING} ${NAME}"
if [[ "${status}" == "0" ]]; then
  success "Success!"
else
  fail "Error!"
fi