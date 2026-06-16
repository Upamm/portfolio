#!/usr/bin/env bun
import { Client } from "ssh2";
import fs from "fs";
import path from "path";

// Git SSH proxy - acts as a drop-in SSH client for git
// Git calls: <this-script> [-p port] [user@host] <remote-command>

const SSH_KEY_PATH = path.join(process.env.HOME || "/home/z", ".ssh", "id_rsa");
const privateKey = fs.readFileSync(SSH_KEY_PATH);

const gitArgs = process.argv.slice(2);
let targetHost = "";
let targetPort = 22;
let targetUser = "git";
let remoteCmd = "";

let i = 0;
while (i < gitArgs.length) {
  const arg = gitArgs[i];
  if (arg === "-p") {
    targetPort = parseInt(gitArgs[i + 1], 10);
    i += 2;
    continue;
  }
  if (arg === "-o") {
    // skip option
    i += 2;
    continue;
  }
  if (arg.includes("@")) {
    const parts = arg.split("@");
    targetUser = parts[0];
    targetHost = parts[1];
  } else if (arg.startsWith("-")) {
    i++;
    continue;
  } else {
    remoteCmd = arg;
  }
  i++;
}

if (!targetHost) {
  console.error("[git-ssh-proxy] No target host found in args:", gitArgs);
  process.exit(1);
}

const conn = new Client();

conn.on("ready", () => {
  conn.exec(remoteCmd, (err, stream) => {
    if (err) {
      console.error("[git-ssh-proxy] exec error:", err.message);
      process.exit(1);
    }
    // Pipe process stdin → SSH channel
    process.stdin.setRawMode?.(false);
    process.stdin.pipe(stream.stdin);
    // Pipe SSH channel stdout → process stdout
    stream.stdout.on("data", (data) => process.stdout.write(data));
    stream.stderr.on("data", (data) => process.stderr.write(data));
    // Handle close
    stream.on("close", (code) => {
      conn.end();
      process.exit(code || 0);
    });
  });
});

conn.on("error", (err) => {
  console.error("[git-ssh-proxy] SSH error:", err.message);
  process.exit(1);
});

conn.connect({
  host: targetHost,
  port: targetPort,
  username: targetUser,
  privateKey,
});
