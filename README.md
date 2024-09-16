# git-delete-branches

## Introduction

A command used to batch delete local Git branches that no longer exist on the remote.

For example, there are three local branches: `feature-a` is your current branch and has a remote branch; `feature-b` is a branch whose remote branch is already deleted(e.g. pull request is merged); `test` is a local branch without any remote branch.

```bash
  main
* feature-a
  feature-b
  test
```

After run the command, the result will be:

```bash
* main
  feature-a
  test
```

## Usage

```bash
npx git-delete-branches
```

or

```bash
// globally install
npm install -g git-delete-branches

// usage
git delete-branches
```

## System Requirements

This command is available on the following platforms:

- **Linux**
- **macOS**
