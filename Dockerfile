FROM node:20.12.2

ARG USER_ID=1000
ARG GROUP_ID=1000

RUN if [ ${USER_ID:-0} -ne 0 ] && [ ${GROUP_ID:-0} -ne 0 ]; then \
    userdel -f node &&\
    if getent group node ; then groupdel node; fi &&\
    groupadd -g ${GROUP_ID} node &&\
    useradd -l -u ${USER_ID} -g node node &&\
    install -d -m 0755 -o node -g node /home/node &&\
    chown --changes --silent --no-dereference --recursive \
          --from=0:0 ${USER_ID}:${GROUP_ID} \
        /home/node \
        /app \
;fi

USER node
