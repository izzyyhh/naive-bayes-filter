import SpamFilter from "./spam-filter";

const readline = require("readline");

const spamFilter = new SpamFilter("data.txt");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter text to classify, empty to quit: "
});

rl.prompt();
rl.on("line", line => {
    if (line === "") {
        process.exit(0);
    }

    const text = line.trim();

    for (const cls of ["spam", "ham"]) {
        console.log(`P(${cls} | "${text}"): ${spamFilter.pClassText(cls, text) * 100}%`);
    }
    console.log(`"${text}" is${spamFilter.isSpam(text) ? "" : " not"} spam\n`);

    rl.prompt();
});
