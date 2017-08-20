# Quasar App

> A Quasar project

## Develop using docker
This will allow you to develop the quasar app in a docker container.

Open two terminals pointing to the same project root. Use one to run `docker-compose up` and another to ssh into the running container to run wanted commands with `npm run bash`

``` bash

# Run docker-compose in one terminal
$ docker-compose up

# ssh into the running container
$ npm run bash
```

To work with `quasar dev --play` you must use manually reference the ip port of your computer instead of the one used by the docker container.

``` bash

# On a mac
$ ifconfig
```

## Develop using local environment

### Build Setup

``` bash

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ quasar dev

# build for production with minification
$ quasar build

# lint code
$ quasar lint
```
