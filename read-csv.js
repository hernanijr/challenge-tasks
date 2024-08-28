import fs from "node:fs";
import { parse } from "csv-parse";

const __dirname = new URL(".", import.meta.url).pathname;

const processFile = async () => {
  const records = [];
  const parser = fs.createReadStream(`${__dirname}/data.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  let isFirstIteration = true;
  for await (const record of parser) {
    if (isFirstIteration) {
      isFirstIteration = false;
      continue; // Skip the first iteration
    }
    const task = {
      title: record[0],
      description: record[1],
    };
    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        console.log(data);
      });
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  console.info(records);
})();
