#!/usr/bin/env node
import { execSync } from "child_process";

const switchToMainBranch = () => {
  console.log("Switch to main branch...");

  const res = execSync("git remote show origin", {
    encoding: "utf8",
  });

  const mainBranch = res.match(/HEAD branch: (?<mainBranch>.+)/)?.groups
    .mainBranch;

  if (mainBranch) {
    execSync(`git switch ${mainBranch}`, { stdio: "inherit" });
  } else {
    throw Error("Not found main branch.");
  }
};

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
