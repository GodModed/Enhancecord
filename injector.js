import CDP from "chrome-remote-interface";
import fs from "fs";

/**
 * @type {CDP.Client}
 */
let client;

(async () => {
    const css = await fs.promises.readFile("theme.css", "utf-8");
    // make a string to apply that css to the body
    // append a style tag with the css to the body
    const appendStyleSheet = `(document.body.appendChild(document.createElement("style"))).classList.add("theme")`;
    const cssString = `document.querySelector(".theme").innerHTML = \`${css}\``;
    let discordOpen = false;
    let lastTwoChecks = [false, false];
    while (true) {
        try {
            if (discordOpen) {
                await client.close();
                discordOpen = false;
                lastTwoChecks = [false, lastTwoChecks[0]];
                continue;
            }
            if (!discordOpen) {
                client = await CDP({
                    port: 9223
                });
                const { Page, Runtime } = client;
                await Promise.all([Page.enable(), Runtime.enable()]);
                // if both checks are true, then don't inject css
                if (!lastTwoChecks[0] && !lastTwoChecks[1]) {
                    await Runtime.evaluate({
                        expression: appendStyleSheet
                    });
                    await Runtime.evaluate({
                        expression: cssString
                    });
                }
                lastTwoChecks = [true, lastTwoChecks[0]];
                discordOpen = true;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        } catch (e) {
            discordOpen = false;
            lastTwoChecks = [false, false];
            console.log("Failed to inject css, retrying in 5 seconds...");
            console.log(e);
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
})();

// read user input
// if user input is "reload" then reload the css
// if user input is "exit" then exit the program
// if user input is "reset" then reset the css
// if user input is "help" then show the help menu
// read user input loop
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdout.write("Enter a command: ");
process.stdin.on("data", async (text) => {
    process.stdout.write("\n");
    text = text.trim();
    if (text === "reload") {
        const css = await fs.promises.readFile("theme.css", "utf-8");
        const cssString = `document.querySelector(".theme").innerHTML = \`${css}\``;
        await client.Runtime.evaluate({
            expression: cssString
        });
        console.log("Reloaded css");
    }
    else if (text === "reset") {
        const removeCss = `document.querySelector(".theme").innerHTML = ""`;
        await client.Runtime.evaluate({
            expression: removeCss
        });
        console.log("Reset css");
    }
    else if (text === "exit") {
        console.log("Exiting...");
        process.exit();
    }
    else if (text === "help") {
        console.log("reload - reloads the css file");
        console.log("reset - resets the css file");
        console.log("exit - exits the program");
        console.log("help - shows this menu");
    }
    else {
        console.log("Invalid command, type 'help' for a list of commands");
    }
    process.stdout.write("\n");
    process.stdout.write("Enter a command: ")
});