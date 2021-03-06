---
published: true
tags:
  - technology
  - quantitative-methods
---
a.k.a. How to work with your coworkers in a friendly way.

## Introduction

Git is a versioning system. There are several types of versioning systems, of two major categories.

|               | **Free**              | **Propreitary** |
|---------------|-------------------|-------------|
| **Centralized**   | Apache Subversion | Perforce    |
| **Decentralized** | Git               | BitKeeper   |


I will focus on Git & Github since it is most frequently used, however, this list works for other Git systems as well such as BitBucket. Git works in the following way:

1. Initialization - configuring user information and repositories (storage areas)
2. Staging/Adding - setting up files to be added to repositories
3. Commiting/Merging - integrating changes and context before uploading into repositories
4. Pushing - uploading into repositories
5. Sharing/Inspecting/Comparing

<span style="color:blue">I've highlighted important commands in blue.</span>

## Setup

| Command                                                | Purpose              |
|--------------------------------------------------------|----------------------|
| [windows.github.com](https://desktop.github.com/)                                     | windows installation |
| [mac.github.com](https://desktop.github.com/)                                         | mac installation     |
| [git config --global   user.name “[firstname lastname]”](https://git-scm.com/docs/git-config) | set your name        |
| [git config --global user.email   “[valid-email]”](https://git-scm.com/docs/git-config)       | set your email       |
| [git config --global color.ui auto](https://git-scm.com/docs/git-config)                      | set cli color        |

## Initialization

| Command | Purpose |
|---------|---------|
| [git init](https://git-scm.com/docs/git-init) | <span style="color:blue">initialize a repository in the current directory</span> |
| [git clone [url]](https://git-scm.com/docs/git-clone)  | <span style="color:blue">clone a repository into the current directory </span> |

## Staging

| Command                                 | Purpose                                                      |
|-----------------------------------------|--------------------------------------------------------------|
| [git status](https://git-scm.com/docs/git-status)                              | shows modified staged files                                  |
| [git add [file]](https://git-scm.com/docs/git-add)                          | stage a file for a commit                                    |
| [git add -a](https://git-scm.com/docs/git-add)                              | <span style="color:blue">stage all changed files for commit</span>                           |
| [git reset [file]](https://git-scm.com/docs/git-reset)                        | unstage a file                                               |
| [git reset -a](https://git-scm.com/docs/git-reset)                            | unstage all files                                            |
| [git diff](https://git-scm.com/docs/git-diff)                                | diff of what's staged but not commited                       |
| [git commit -m "[descriptive   message]"](https://git-scm.com/docs/git-commit) | <span style="color:blue">description of what's changed, i.e. "added search by person"</span> |

## Branching & Merging

| Command                  | Purpose                                                 |
|--------------------------|---------------------------------------------------------|
| [git branch](https://git-scm.com/docs/git-branch)               | list all branches                                       |
| [git branch [branch-name]](https://git-scm.com/docs/git-branch) | creates a new branch with branch-name at current commit |
| [git checkout [branch]](https://git-scm.com/docs/git-checkout)    | <span style="color:blue">switch to another branch and check it out</span>               |
| [git merge [branch]](https://git-scm.com/docs/git-merge)       | <span style="color:blue">merge the specified branch into the current checkout</span>    |
| [git merge origin master](https://git-scm.com/docs/git-merge)       | <span style="color:blue">merge the specified branch into the origin master repository</span>    |
| [git log](https://git-scm.com/docs/git-log)                  | show all commits in current branch's history            |

## Inspecting & Comparing

| Command                      | Purpose                                         |
|------------------------------|-------------------------------------------------|
| [git log](https://git-scm.com/docs/git-log)                      | show all commits in current branch's history    |
| [git log [branchB]..[branchA]](https://git-scm.com/docs/git-log) | shows commits on branchA not on branch B        |
| [git diff [branchB]..[branchA]](https://git-scm.com/docs/git-diff) | shows dif of commits on branchA not on branch B |
| [git log --follow [file]](https://git-scm.com/docs/git-log)      | shows commits for file                          |
| [git show [SHA]](https://git-scm.com/docs/git-show)               | show any object in Git in readable format       |

## Sharing & Updating

| Command                        | Purpose                                 |
|--------------------------------|-----------------------------------------|
| [git remote add [alias] [url]](https://help.github.com/en/github/using-git/adding-a-remote) | add git URL as alias                    |
| [git fetch [alias]](https://git-scm.com/docs/git-fetch)              | fetch all branches from Git             |
| [git merge [alias]/[branch]](https://git-scm.com/docs/git-merge)     | merge remote branch into current branch |
| [git push [alias] [branch]](https://git-scm.com/docs/git-push)      | transmit local commits to remote branch |
| [git pull](https://git-scm.com/docs/git-pull)                       | fetch and merge commits from branch     |

## Tracking Path Changes

| Command                          | Purpose                                              |
|----------------------------------|------------------------------------------------------|
| [git rm [file]](https://git-scm.com/docs/git-rm)                    | remove file from project and stage removal           |
| [git mv [current-path] [new-path]](https://git-scm.com/docs/git-mv) | change and stage existing file path                  |
| [git log --stat -M](https://git-scm.com/docs/git-log)                | show all commit logs with indiciation of moved paths |

## Rewrite History

| Command                      | Purpose                                                   |
|------------------------------|-----------------------------------------------------------|
| [git rebase [branch]](https://git-scm.com/docs/git-rebase)          | apply current commits ahead of specified   branch         |
| [git reset --hard [commit]](https://git-scm.com/docs/git-reset)    | clear staging, rewrite working tree from specified commit |


## Temporary Commits

| Command        | Purpose                                  |
|----------------|------------------------------------------|
| [git stash](https://git-scm.com/docs/git-stash)      | save modified and staged changes         |
| [git stash list](https://git-scm.com/docs/git-stash) | list stack-order of stashed file changes |
| [git stash pop](https://git-scm.com/docs/git-stash)  | write working from top of stash stack    |
| [git stash drop](https://git-scm.com/docs/git-stash) | discard changes from top of stash stack  |


![Funny image on Git from XKCD](https://imgs.xkcd.com/comics/git.png)

___
source: [Git Cheat Sheet Education](https://education.github.com/git-cheat-sheet-education.pdf) & my experience on frequently used commands not in there
