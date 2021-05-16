# Webssh Frontend

This is a frontend for an application that provides users with an SSH client in the browser.

## Before you start

Copy `.env.example` to `.env` and change the attributes to fit your needs.

## Development version

### Installation

```
npm install
```

Installs dependencies.

### Start the server

```
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Production Version

The production version is rolled out using Docker.

### Installation

```
docker-compose build
```

Creates a container based on NGINX to host the production version of the application.

### Start

```
docker-compose up -d
```

Starts the Docker stack in detached mode.

By default the stack listens to port 3000 bound localhost. \
The stack was designed to be used behind the reverse proxy [Traefik](https://github.com/traefik/traefik).
