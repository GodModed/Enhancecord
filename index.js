// kill discord
import { killDiscord, injectToFile, runTask} from "./util.js";

async function main() {
    console.log("Attempting to inject into Discord...");
    await runTask("Kill Discord", killDiscord);
    await runTask("Create shortcut", injectToFile);
}

main();