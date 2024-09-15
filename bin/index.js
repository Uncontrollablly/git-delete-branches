#!/usr/bin/env node
import { execSync } from "child_process";

function switchToMainBranch() {
  const mainBranches = execSync("git branch --list main master", {
    encoding: "utf8",
  })
    .split("\n")
    .map((mainBranches) => mainBranches.trim());

  let mainBranch = null;
  if (mainBranches.includes("main")) {
    mainBranch = "main";
  } else if (mainBranches.includes("master")) {
    mainBranch = "master";
  } else {
    console.error('Neither "main" nor "master" branch found.');
    return;
  }

  execSync(`git checkout ${mainBranch}`, { stdio: "inherit" });

  console.log(`Switched to ${mainBranch}.`);
}

const getRemoteBranches = () => {
  execSync("git fetch -p", { stdio: "inherit" });
};

const getBranchesToBeDeleted = () => {
  const result = execSync("git branch -vv | grep ': gone' | awk '{print $1}'", {
    encoding: "utf8",
  });

  if (!result) {
    console.log("No local branches need to be deleted.");
    return;
  }

  return result.split("\n").filter(Boolean);
};

const deleteBranches = (branchesToBeDeleted) => {
  console.log(`Start deleting branches:\n${branchesToBeDeleted.join("\n")}`);

  execSync(`git branch -d ${branchesToBeDeleted.join(" ")}`, {
    stdio: "inherit",
  });

  console.log("Branches were deleted successfully");
};

try {
  switchToMainBranch();

  getRemoteBranches();

  deleteBranches(getBranchesToBeDeleted());
} catch (error) {
  console.error("Error executing command:", error.message);
}
