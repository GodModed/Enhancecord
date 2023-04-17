# Enhancecord
This is a Discord client that allows you to set themes for Discord. It is currently in development and plugins are not yet supported.

## Features

* Set themes for Discord
* Reload themes while Discord is running
* Supports themes from [BetterDiscord](https://betterdiscord.app/) and [Powercord](https://powercord.dev/)
* Themes are written in CSS

## Requirements

* Discord
* Node.js
* NPM

## Installation

1. Clone this repository
2. Install the dependencies
3. Run the setup script
```bash
npm install
npm run setup
```

## Usage

1. Launch the new shortcut that was created on your desktop named "Enhancecord"
2. Write your theme to the theme.css file
3. Run the server script
```bash
npm run server
```
You can use commands in the terminal to reload the theme or quit the server.

| Commands | Definitions                                         |
|----------|-----------------------------------------------------|
| reload   | updates the css which is on the Discord client      |
| reset    | revers the css back to normal on the Discord client |
| exit     | stops the program                                   |
| help     | shows this table                                    |

## TODO
* Add support for plugins
* Create a plugin API
* Add a plugin manager
* Create a CONTRIBUTING.md file
* Create a LEARN.md file