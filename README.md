# lucky-radio-web

A web interface for managing and controlling music radio stations through the [lucky-radio-api](https://github.com/12LuckyDev/lucky-radio-api).

## The application allows you to:

- Play and stop music
- Switch between radio stations
- View available radio stations
- Add new radio stations
- Edit existing stations
- Delete stations
- Control music playback through MPD via the API

The frontend communicates with `lucky-radio-api`, which handles the radio station database and integration with MPD (Music Player Daemon).

## API Integration

The application requires a running instance of `lucky-radio-api`.

The API is responsible for:

- Managing radio stations
- Storing station data in SQLite
- Controlling MPD playback
- Switching between radio streams

Make sure the API is running and accessible from the device running the frontend.

Configure the API URL using the VITE_API_URL for dev and API_URL for docker compose.

## Docker Image Configuration

The Docker image works well with Docker Compose and can be easily configured using the provided example configuration.

See the [compose.example.yaml](compose.example.yaml) file for an example Docker Compose setup.

## Development

```sh
npm install
npm start
```

Starts the frontend in development mode.

## Build

```sh
npm run build
```

Builds the application for production.

The production build can then be served using a web server or containerized using Docker.

## Docker Image

The Docker image is intended to run on a Raspberry Pi using `linux/arm64`.

On Windows, make sure Docker Desktop is running and build the image with:

```bash
docker buildx build --platform linux/arm64 -t lucky-radio-web:latest --load .
```

Or use:

```text
build.bat
```

The script builds the ARM64 image and exports it as:

```text
lucky-radio-web.tar
```

## Deploy to Raspberry Pi

Copy the image to the Raspberry Pi:

```bash
scp lucky-radio-web.tar pi@raspberry:/tmp/
```

Load the image:

```bash
docker load -i /tmp/lucky-radio-web.tar
```

Then start the container:

```bash
docker compose up -d
```

## Docker Compose

The frontend is designed to work together with [lucky-radio-api](https://github.com/12LuckyDev/lucky-radio-api) and the [lucky-mpd](https://github.com/12LuckyDev/lucky-mpd) container.

A typical setup consists of:

```text
┌─────────────────────────┐
│   lucky-radio-web       │
│       Web Interface     │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      lucky-radio-api    │
│     REST API + SQLite   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        lucky-mpd        │
│   Music Player Daemon   │
│         :6600           │
└─────────────────────────┘
```

The frontend only communicates with the REST API. MPD is accessed by the backend and does not need to be exposed directly to the frontend.
