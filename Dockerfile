FROM node:18.14.2

RUN apt update && apt install -y git zsh vim

WORKDIR /app

COPY package.json package-lock.json .

RUN npm ci -y

COPY ecosystem.config.js src .

EXPOSE 3000

ENTRYPOINT npm start

CMD /bin/bash
