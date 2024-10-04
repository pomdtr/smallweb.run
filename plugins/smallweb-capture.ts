// Import Astral
import { launch } from "jsr:@astral/astral@0.4.3";
import { Command } from "jsr:@cliffy/command@1.0.0-rc.5";

const command = new Command().arguments("<app> [out]").action(
    async (_, app, output) => {
        // Launch the browser
        const browser = await launch();

        // Open a new page
        const page = await browser.newPage(`https://${app}.localhost`);

        // Take a screenshot of the page and save that to disk
        const screenshot = await page.screenshot();
        Deno.writeFileSync(output || `${app}.png`, screenshot);

        browser.close();
    },
);

await command.parse();
