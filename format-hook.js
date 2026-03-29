#!/usr/bin/env node
const { execSync } = require("child_process");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node format-hook.js <file-path>");
  process.exit(1);
}

execSync(`npx prettier --write "${filePath}"`, { stdio: "inherit" });
