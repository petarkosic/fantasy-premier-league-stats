![Home Page](./client/src/assets/home-page.png 'Home Page')
![Player of the Week](./client/src/assets/player-of-the-week.png 'Player of the Week')
![Player info](./client/src/assets/player-modal.png 'Player info')

## Fantasy Premier League Stats

The Fantasy Premier League Stats offers a user-friendly interface for football enthusiasts and fantasy football players to access player statistics and track player performance.

## Contents

1. [Features](#features)
2. [Requirements](#requirements)
3. [How to run](#how-to-run)
   - [With Docker](#with-docker)
   - [Without Docker](#without-docker)

## Features

- **Player Search**: Quickly find player information and stats.
  <br/>
- **Player of the Week**: Discover the standout performers of every week of the football season, highlighting the top players based on the points earned.
  <br/>
- **More Info**: Open a modal with detailed information, including a graph of goals and assists during the season and a heatmap showing player positions during their last match.
  <br/>

## Requirements

- Node js 16.+ (https://nodejs.org)
- RapidAPI Account for heatmap data (https://rapidapi.com/hub)
- Docker (https://www.docker.com/) (only if running the app using docker)

---

## How to run

<br/>

### With Docker

If you prefer to use docker, make sure that you have docker installed and running on your machine.

Clone the project and navigate to it:

```
git clone https://github.com/petarkosic/fantasy-premier-league-stats.git
cd /fantasy-premier-league-stats
```

If you want the heatmap data, create an `.env` file inside the `/server` folder.

```
X_RapidAPI_Key=<your-rapid-api-key>
X_RapidAPI_Host=sofasport.p.rapidapi.com
RapidAPI_Url=https://sofasport.p.rapidapi.com/v1/search/multi
RapidAPI_Heatmap_Url=https://sofasport.p.rapidapi.com/v1/players/heatmap
```

To start the application, from the root project directory run:

```
docker compose up -d
```

- Default port for client side is **3000**. (http://127.0.0.1:3000/)
- Default port for server side is **5000**. (http://127.0.0.1:5000/)
- Default port for prometheus is **9090**. (http://127.0.0.1:9090/)
- Default port for grafana is **4000**. (http://127.0.0.1:4000/)

To stop the application, from the root project directory run:

```
docker compose down
```

<br/>

### Without Docker

Make sure that you have node.js 16.+ version installed.
Prometheus and grafana are not available without docker.

```
git clone https://github.com/petarkosic/fantasy-premier-league-stats.git
cd /fantasy-premier-league-stats
cd /server
npm install

cd ..
cd /client
npm install
```

If you want the heatmap data, create an `.env` file inside the `/server` folder.

```
X_RapidAPI_Key=<your-rapid-api-key>
X_RapidAPI_Host=sofasport.p.rapidapi.com
RapidAPI_Url=https://sofasport.p.rapidapi.com/v1/search/multi
RapidAPI_Heatmap_Url=https://sofasport.p.rapidapi.com/v1/players/heatmap
```

To start the server, open `/server` folder and run:

```
npm run dev
```

To start the client, open `/client` folder and run:

```
npm run dev
```

- Default port for client side is **3000**. (http://127.0.0.1:3000/)
- Default port for server side is **5000**. (http://127.0.0.1:5000/)
