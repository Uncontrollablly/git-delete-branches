#!/usr/bin/env node
import { execSync } from "child_process";

function switchToMainBranch() {
  console.log("Switch to main branch...");

  const mainBranches = execSync("git branch --list main master", {
    encoding: "utf8",
  });

  let mainBranch = null;
  if (mainBranches.includes("main")) {
    mainBranch = "main";
  } else if (mainBranches.includes("master")) {
    mainBranch = "master";
  } else {
    throw Error('Neither "main" nor "master" branch found.');
  }

  execSync(`git switch ${mainBranch}`, { stdio: "inherit" });
}

const fetchRemoteBranches = () => {
  console.log("Fetch remote branches...");

  execSync("git fetch -p", { stdio: "inherit" });
};

const getBranchesToBeDeleted = () => {
  const result = execSync("git branch -vv | grep ': gone' | awk '{print $1}'", {
    encoding: "utf8",
  });

  if (!result) {
    console.log("No local branches need to be deleted.");
    return [];
  }

  return result.split("\n").filter(Boolean);
};

const deleteBranches = (branchesToBeDeleted) => {
  console.log(`Start deleting branches:\n${branchesToBeDeleted.join("\n")}`);

  execSync(`git branch -d ${branchesToBeDeleted.join(" ")}`, {
    stdio: "inherit",
  });

  console.log("Branches were deleted successfully!");
};

try {
  fetchRemoteBranches();

  switchToMainBranch();

  const branches = getBranchesToBeDeleted();

  if (branches.length) deleteBranches(branches);
} catch (error) {
  console.error("Error executing command:", error.message);
}
