---
published: false
---
## Cheatsheet for Unix Commands

This is a quick cheatsheet for relevant UNIX commands! Enjoy :)

When I say or, it means that there are 2 equivalent commands, not that you should type or. For example, you can move to the home directory using one of two commands: <span style="color:blue">cd</span> or <span style="color:blue">cd~</span>. You should not type <span style="color:blue">cd or cd~</span> into the terminal.

**Basic Navigation**

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| pwd | Present working directory | /Users/username |
| man | The manual/help file for the command | man pwd |
| cd Subdir | Move to a folder in the directory | cd Data |
| cd .. | Move to directory above | cd .. |
| cd or cd ~ | Move to home directory | cd .. |

**Working with directories**

The dash after a command is used to indicate flags.

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| ls | List directory contents | ... |
| ls -l | List directory contents in long format (size, owner, protections, etc.) | ... |
| ls -a | List all directory contents (including hidden files such as .bash) | ... |
| ls x* | List all directory contents starting with x. You can use this * anywhere. | xanadu |
| ls x? | List all directory contents which start with x and have one character after | xa |
| mkdir FolderA | Creates a new directory |  |
| rmdir FolderA | Deletes a directory |  |

You can chain together flags to create larger commands.

**Redirecting content**

| Command                  | Description                                                                 | Example         |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| ls -alh > Directory.out  | Replace/Create a file named Directory.out results of ls -alh                |                 |
| ls -alh >> Directory.out | Append to Directory.out file results of ls -alh                             |                 |

**Working with files**

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| cat Test.out | Lists entire contents of file |  |
| head Test.out | Lists first 10 lines of file |  |
| tail Test.out | Lists last 10 lines of file |  |
| more Test.out | After head/tail, allows you to scroll down |  |
| less Test.out | After head/tail, allows you to scroll up |  |
| rm Test.out | Deletes a file |  |
| touch Test.out | Creates a file |  |
| vim Test.out | Edits a file using vim |  |
| diff Out.out New.out | Lists lines where 2 files differ. |  |
| cp Out.out ~/data/ | Copys file to directory |  |
| mv Out.out ~/data/ | Moves file to directory |  |

You can use flags on these commands. For example, doing rm -r \*.csv will recursively remove all csv files from the current directory.



