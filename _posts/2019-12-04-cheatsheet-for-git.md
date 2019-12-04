---
published: false
---
a.k.a. How to work with your coworkers in a friendly way.

Git works in the following way:



**SETUP**

| Command                                                | Purpose              |
|--------------------------------------------------------|----------------------|
| windows.github.com                                     | windows installation |
| mac.github.com                                         | mac installation     |
| git config --global   user.name “[firstname lastname]” | set your name        |
| git config --global user.email   “[valid-email]”       | set your email       |
| git config --global color.ui auto                      | set cli color        |

**INITIALZIATION**

| Command | Purpose |
|---------|---------|
| git init | initialize a repository in the current   directory |
| git clone [url] | clone a repository into the current directory |

**STAGING**

| Command                                 | Purpose                                                      |
|-----------------------------------------|--------------------------------------------------------------|
| git status                              | shows modified staged files                                  |
| git add [file]                          | stage a file for a commit                                    |
| git add -a                              | stage all changed files for commit                           |
| git reset [file]                        | unstage a file                                               |
| git reset -a                            | unstage all files                                            |
| git diff                                | diff of what's staged but not commited                       |
| git commit -m "[descriptive   message]" | description of what's changed, i.e. "added search by person" |



source: [Git Cheat Sheet Education](https://education.github.com/git-cheat-sheet-education.pdf)