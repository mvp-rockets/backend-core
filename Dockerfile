FROM alpine:3.8
RUN apk update && apk add bash
COPY pipe /
ENTRYPOINT ["/pipe.sh"]