---
published: true
---
This is a quick cheatsheet for relevant UNIX and VIM commands!

A couple of notes: first, you can access the Terminal through your UNIX computer. Second, when I say or, it means that there are 2 equivalent commands, not that you should type or. For example, you can move to the home directory using one of two commands: [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) or [cd~](http://man7.org/linux/man-pages/man1/cd.1p.html). You should not type <span style="color:blue">cd or cd~</span> into the terminal.

**Basic Navigation**

| Command | Description | Example |
|---  |---  |---|
| [pwd](http://man7.org/linux/man-pages/man1/pwd.1.html) | Present working directory | /Users/username |
| [man](http://man7.org/linux/man-pages/man1/man.1.html) | The manual/help file for the command | man pwd |
| [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) Subdir | Move to a folder in the directory | cd Data |
| [cd ..](http://man7.org/linux/man-pages/man1/cd.1p.html) | Move to directory above | cd .. |
| [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) or [cd ~](http://man7.org/linux/man-pages/man1/cd.1p.html) | Move to home directory | cd .. |
| [df](http://man7.org/linux/man-pages/man1/df.1.html) | Outputs amount of free space in the directory |  |
| [top](http://man7.org/linux/man-pages/man1/top.1.html) | Outputs process status of processes running on computer |  |
| [ps](https://linux.die.net/man/1/ps) | Outputs process status of processes running on computer, related to you |  |
| [ps aux](https://linux.die.net/man/1/ps) | Outputs process status of processes running on computer, related to all users |  |
| [ps -jim](https://linux.die.net/man/1/ps) | Outputs process status of processes running on computer, related to user jim |  |
| [grep](http://man7.org/linux/man-pages/man1/grep.1.html) | print lines that match regex patterns |  |
| [history](http://man7.org/linux/man-pages/man3/history.3.html) | provides you with last 10 commands |  |
| ! 234 | reuse last command at line number specified or regex speicified |  |

**Working with directories**

The dash after a command is used to indicate flags.

| Command | Description | Example |
|---  |---  |---|
| [ls](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents | ... |
| [ls -l](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents in long format (size, owner, protections, etc.) | ... |
| [ls -a](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents (including hidden files such as .bash) | ... |
| [ls x*](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents starting with x. You can use this * anywhere. | xanadu |
| [ls x?](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents which start with x and have one character after | xa |
| [mkdir](http://man7.org/linux/man-pages/man2/mkdir.2.html) FolderA | Creates a new directory |  |
| [rmdir](http://man7.org/linux/man-pages/man2/mkdir.2.html) FolderA | Deletes a directory |  |

You can chain together flags to create larger commands.

**Redirecting content**

| Command | Description | Example |
|---  |---  |---|
| ls [>](http://man7.org/linux/man-pages/man1/ls.1.html) Directory.out  | Replace/Create a file named Directory.out results of ls -alh                |                 |
| ls [>>](http://man7.org/linux/man-pages/man1/ls.1.html) Directory.out | Append to Directory.out file results of ls -alh                             |                 |

**Working with files**

| Command | Description | Example |
|---  |---  |---|
| [cat](http://man7.org/linux/man-pages/man1/cat.1.html) Test.out | Lists entire contents of file |  |
| [head](http://man7.org/linux/man-pages/man1/head.1.html) Test.out | Lists first 10 lines of file |  |
| [tail](http://man7.org/linux/man-pages/man1/tail.1.html) Test.out | Lists last 10 lines of file |  |
| [more](http://man7.org/linux/man-pages/man1/more.1.html) Test.out | After head/tail, allows you to scroll down |  |
| [less](http://man7.org/linux/man-pages/man1/less.1.html) Test.out | After head/tail, allows you to scroll up |  |
| [rm](http://man7.org/linux/man-pages/man1/rm.1.html) Test.out | Deletes a file |  |
| [touch](http://man7.org/linux/man-pages/man1/touch.1.html) Test.out | Creates a file |  |
| [vim](http://man7.org/linux/man-pages/man1/vi.1p.html) Test.out | Edits a file using vim |  |
| [diff](http://man7.org/linux/man-pages/man1/diff.1.html) Out.out New.out | Lists lines where 2 files differ. |  |
| [cp](http://man7.org/linux/man-pages/man1/cp.1.html) Out.out ~/data/ | Copys file to directory |  |
| [mv](http://man7.org/linux/man-pages/man1/mv.1.html) Out.out ~/data/ | Moves file to directory |  |
| [wc](http://man7.org/linux/man-pages/man1/wc.1.html) Out.out | Gives a line, word, and character count of the file |  |
| [sort](https://linux.die.net/man/1/sort) Out.out | Sorts a file in alphabetical order |  |
| [paste](https://linux.die.net/man/1/paste) In.out Out.out | Adds two files side by side |  |
| [cut](https://linux.die.net/man/1/cut) -d ' ' -f 2-3 In.out | Extracts file at specified columns with delimiter |  |
| [join](https://linux.die.net/man/1/join) A.out B.out | Merges two files horizontally based on a common column |  |

**Shortcuts with Files**
| Command | Description |
|---  |---  |
| ctrl-h | deletes last character |
| ctrl-w | deletes last word |
| ctrl-u | deletes last line |
| ctrl-d | end text input/exit program |
| ctrl-s | freeze terminal window |
| ctrl-q | unfreeze terminal window |
| ctrl-\ | terminates terminal |
| ctrl-z | suspend terminal (sleep) |


You can use flags on these commands. For example, doing rm -r \*.csv will recursively remove all csv files from the current directory.
  
**File Protections**

All files on UNIX have three levels of protection:
- read (r)
- write (w)
- execute (x)

They are structured for three groups:
- user (u)
- group (g)
- world (w)

You can see the protections by running [ll](http://man7.org/linux/man-pages/man1/ls.1.html).

For example, for any given file, the protection (string on the far left) might look like this:

<span style="color:green">-rw-r--r--	1	bans	staff	6	8	Jun	17:12	test</span>

You can read this protections string in groups of three starting with user then group then the world. In this instance, the user has read write permissions while the group and world have read permissions.

To change the permissions/protection on a file or folder, you can run the command [chmod](http://man7.org/linux/man-pages/man1/chmod.1.html). Chmod works in the octal (or base 8) system, where:
- 4 means read access
- 2 means write access
- 1 means execute access

So, to have read and execute access would be 4 + 1 = 5. To use chmod, you determine the level of access for the user, group and world in the following format:

[chmod](http://man7.org/linux/man-pages/man1/chmod.1.html) ugw

For example, to have group and world read access and user read, write, and execute access would be:

[chmod](http://man7.org/linux/man-pages/man1/chmod.1.html) 744

**Supersers and Installing Software**

To install software or perform system administration tasks, you need superuser powers. To login as the superuser, use the su command and enter the password. However, you often don't have access to this as you are not the systems administrator. In this case, you would use [sudo](https://linux.die.net/man/8/sudo). For example, to update python 3.6:

[sudo](https://linux.die.net/man/8/sudo) apt-get install python3.6

**Linking Commands -- Piping**

Piping takes the output from one command into another command. For example, if you want to see all the python processes you are running:

ps [\|](https://linux.die.net/man/7/pipe) grep python

**Shell Scripts and Make files**

To be written.

**Accessing and running computers remotely, moving files**

TO be written.

**Storage and Version Control**
| Command | Description |
|---  |---  |
| gzip file.txt | compresses (zips) file |
| gunzip file.txt | unzips file |
| zip Backup.zip * | zips files in directory |
| zip -r Backup.zip * | zips files and directories in directory |
| unzip Backup.zip | unzips zip file |

