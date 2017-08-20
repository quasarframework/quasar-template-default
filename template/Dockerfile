FROM node:8-alpine
RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*
RUN npm install -g cordova quasar-cli
RUN cordova --version

WORKDIR /var/www

ENV NODE_ENV=development
COPY package.json /var/wwwpackage.json
RUN npm install

COPY . /var/www

EXPOSE 8080
VOLUME /var/www

CMD ["quasar", "dev"]