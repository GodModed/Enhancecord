import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import fsExists from 'fs.promises.exists'
import { username } from "username";
import CDS from "create-desktop-shortcuts"

const execAsync = promisify(exec);

let dicsordType = "Discord"

export async function killDiscord() {
    // kill Discord.exe
    await execAsync('taskkill /f /im Discord.exe').then(() => {
        dicsordType = "Discord"
    }).catch(() => { });
    await execAsync('taskkill /f /im DiscordCanary.exe').then(() => {
        dicsordType = "DiscordCanary"
    }).catch(() => { });
    await execAsync('taskkill /f /im DiscordPTB.exe').then(() => {
        dicsordType = "DiscordPTB"
    }).catch(() => { });
}

export async function runTask(name, task) {
    console.log(`Running task: ${name}`);
    await task();
    console.log(`Finished task: ${name}`);
}

export async function injectToFile() {
    const hostUsername = await username();
    // loop through every discord server
    // promisify fs.exists
    let noExistCounter = 0;
    let discords = [dicsordType]
    for await (const discord of discords) {
        const exists = await fsExists(`C:\\Users\\${hostUsername}\\AppData\\Local\\${discord}`);
        if (!exists) {
            noExistCounter++;
        };
        if (!exists && noExistCounter === 3) {
            console.log("Discord is not installed.");
            process.exit(1);
        }
        if (!exists) return;
        const appFolder = await getLatestAppVersion();
        CDS({
            verbose: false,
            windows: {
                filePath: `C:\\Users\\${hostUsername}\\AppData\\Local\\${discord}\\${appFolder}\\Discord.exe`,
                arguments: `--remote-debugging-port=9223`,
                name: "Enhancecord",
                comment: "A lightweight themed Discord Launcher"
            }
        });
        // get index.js file in discord-desktop-core-1/discord_desktop_core and append javascript to it
        const javascript = `
        const electron = require("electron");
        electron.session.defaultSession.webRequest.onHeadersReceived(function(details, callback) {
            const headers = Object.keys(details.responseHeaders);
            for (let h = 0; h < headers.length; h++) {
                const key = headers[h];
                if (key.toLowerCase().indexOf("content-security-policy") !== 0) continue;
                delete details.responseHeaders[key];
            }
            callback({cancel: false, responseHeaders: details.responseHeaders});
        });
        `
        // check if index.js.bak exists
        const indexFileBakExists = await fsExists(`C:\\Users\\${hostUsername}\\AppData\\Local\\${discord}\\${appFolder}\\modules\\discord_desktop_core-1\\discord_desktop_core\\index.js.bak`);
        if (!indexFileBakExists) {
            const indexFile = `C:\\Users\\${hostUsername}\\AppData\\Local\\${discord}\\${appFolder}\\modules\\discord_desktop_core-1\\discord_desktop_core\\index.js`;
            // backup index.js
            await fs.promises.copyFile(indexFile, `${indexFile}.bak`);
            // append javascript to index.js
            await fs.promises.appendFile(indexFile, javascript);
        }
    };
}

export async function getLatestAppVersion() {
    const folders = await fs.promises.readdir(`C:\\Users\\${await username()}\\AppData\\Local\\${dicsordType}`);
    // get every folder that stars with app-
    const appFolders = folders.filter((folder) => folder.startsWith("app-"));
    return appFolders[appFolders.length - 1];
}