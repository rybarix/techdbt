#!/usr/bin/env node
import process from "node:process";
import fs from "node:fs";
import { Scanner, FileTreeScanner } from "./scanner.js";
import { Fmt } from "./fmt.js";

function printHelpMessage() {
  console.log(
    `
Usage: dbt [directory]

Scans the specified directory (or current directory if not provided) for TODO, FIXME, and REFACTOR comments.

Options:
  -h, --help    Show this help message

Example:
  dbt ./src
    `.trim()
  );
}

async function main() {
  // Check if help flag is provided
  if (process.argv.includes("-h") || process.argv.includes("--help")) {
    printHelpMessage();
    process.exit(0);
  }

  // Parse command line arguments for output format
  let outputFormat = "ctxt"; // Default to ctxt - colored output
  let startDir = ".";
  const args = process.argv.slice(2);

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-o" && i + 1 < args.length) {
      const format = args[i + 1].toLowerCase();
      if (["txt", "json", "jsonl", "ctxt"].includes(format)) {
        outputFormat = format;
        i++; // Skip the next argument as it's the format
      } else {
        console.error("Invalid output format. Using default (ctxt).");
      }
    } else if (!args[i].startsWith("-")) {
      startDir = args[i];
    }
  }

  // Check if the specified path exists
  if (!fs.existsSync(startDir)) {
    console.error(`Error: The specified path '${startDir}' does not exist.`);
    process.exit(1);
  }
  // Check if file or directory is provided
  const isFile = fs.statSync(startDir).isFile();
  const scanner = isFile
    ? new Scanner(startDir)
    : new FileTreeScanner(startDir);
  const findings = await scanner.scan();
  const outputFindings = isFile ? [findings] : findings;

  // Output findings based on the specified format
  let output = "";
  switch (outputFormat) {
    case "json":
      output = Fmt.toJSON(outputFindings);
      break;
    case "jsonl":
      output = Fmt.toJSONL(outputFindings);
      break;
    case "txt":
      output = Fmt.toString(outputFindings);
      break;
    case "ctxt":
    default:
      output = Fmt.toStdout(outputFindings);
  }

  console.log(output);
}

main();
