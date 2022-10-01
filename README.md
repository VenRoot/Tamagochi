# Tamagochi
Little Tamagochi project for my friend


# Code seperation

The project is seperated into 3 parts:

* The backend, which is a REST API written in Typescript using Express
* The frontend, which is a web app written in Typescript and HTML
* The desktop app, which is an electron app written in Typescript accessing the frontend directly and not containing any logic

# Installation

## Frontend

The frontend is a web app, so you can just open the `index.html` file in your browser or visit [this link](https://tamagochi.alexandru.rocks/).

## Backend

The backend is hosted at my own servers, but you can also run it locally. To do so, you need to check the [requirements](#requirements).
Then you can install the backend by running `npm install` and then `npm start` in the Backend directory.
Make sure, you provide valid TLS certificates in the `certs` directory with TLS v1.3 enabled.

### Requirements

* NodeJS, perferably the latest version (>v18)
* NPM, perferably the latest version (>v8)
* TypeScript (npm install -g typescript)
