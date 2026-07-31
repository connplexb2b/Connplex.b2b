const fs = require('fs');
const readline = require('readline');

async function main() {
  const filePath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\e426d6b7-9afc-4de8-b329-64e175219d96\\.system_generated\\logs\\transcript.jsonl";
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      const stepIndex = obj.step_index || index;
      if (obj.content && (obj.content.includes("temp_ticketing_bundle") || obj.content.includes("bundle"))) {
        console.log(`Step ${stepIndex} mentions bundle:`);
        // print a few lines around the mention
        const lines = obj.content.split('\n');
        lines.forEach(l => {
          if (l.includes("bundle") || l.includes("temp_ticketing_bundle") || l.includes("ticketing")) {
            console.log("  ", l.trim().slice(0, 150));
          }
        });
        console.log("---");
      }
    } catch (e) {
      // ignore
    }
    index++;
  }
}

main().catch(console.error);
