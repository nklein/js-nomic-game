
import { readJsonFromStdin } from "./src/node-utils.js";
import { decide } from "./src/decide.js";

async function start() {
  const list_of_augmented = await readJsonFromStdin();
  process.stdout.write(JSON.stringify(decide(list_of_augmented).toJson()) + "\n");
}

start();
