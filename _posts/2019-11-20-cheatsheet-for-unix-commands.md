---
published: true
tags:
  - technology
  - quantitative-methods
---
This is a quick cheatsheet for relevant UNIX and VIM commands!

A couple of notes: first, you can access the Terminal through your UNIX computer. Second, when I say or, it means that there are 2 equivalent commands, not that you should type or. For example, you can move to the home directory using one of two commands: [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) or [cd~](http://man7.org/linux/man-pages/man1/cd.1p.html). You should not type <span style="color:blue">cd or cd~</span> into the terminal.

## Basic Navigation

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

## Working with directories

The dash after a command is used to indicate flags.

| Command | Description | Example |
|---  |---  |---|
| [ls](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents | ... |
| [ls -l](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents in long format (size, owner, protections, etc.) | ... |
| [ls -a](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents (including hidden files such as .bash) | ... |
| [ls x*](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents starting with x. You can use this * anywhere. | xanadu |
| [ls x?](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents which start with x and have one character after | xa |
| [mkdir FolderA](http://man7.org/linux/man-pages/man2/mkdir.2.html) | Creates a new directory |  |
| [rmdir FolderA](http://man7.org/linux/man-pages/man2/mkdir.2.html) | Deletes a directory |  |

You can chain together flags to create larger commands.

## Redirecting content

| Command | Description | Example |
|---  |---  |---|
| [ls > Directory.out](http://man7.org/linux/man-pages/man1/ls.1.html)  | Replace/Create a file named Directory.out results of ls -alh                |                 |
| [ls >> Directory.out](http://man7.org/linux/man-pages/man1/ls.1.html) | Append to Directory.out file results of ls -alh                             |                 |

## Working with files

| Command | Description | Example |
|---  |---  |---|
| [cat Test.out](http://man7.org/linux/man-pages/man1/cat.1.html) | Lists entire contents of file |  |
| [head Test.out](http://man7.org/linux/man-pages/man1/head.1.html)  | Lists first 10 lines of file |  |
| [tail Test.out](http://man7.org/linux/man-pages/man1/tail.1.html) | Lists last 10 lines of file |  |
| [more Test.out](http://man7.org/linux/man-pages/man1/more.1.html) | After head/tail, allows you to scroll down |  |
| [less Test.out](http://man7.org/linux/man-pages/man1/less.1.html) | After head/tail, allows you to scroll up |  |
| [rm Test.out](http://man7.org/linux/man-pages/man1/rm.1.html) | Deletes a file |  |
| [touch Test.out](http://man7.org/linux/man-pages/man1/touch.1.html) | Creates a file |  |
| [vim Test.out](http://man7.org/linux/man-pages/man1/vi.1p.html) | Edits a file using vim |  |
| [diff Out.out New.out](http://man7.org/linux/man-pages/man1/diff.1.html) | Lists lines where 2 files differ. |  |
| [cp Out.out ~/data/](http://man7.org/linux/man-pages/man1/cp.1.html) | Copys file to directory |  |
| [mv Out.out ~/data/](http://man7.org/linux/man-pages/man1/mv.1.html) | Moves file to directory |  |
| [wc Out.out](http://man7.org/linux/man-pages/man1/wc.1.html) | Gives a line, word, and character count of the file |  |
| [sort Out.out](https://linux.die.net/man/1/sort) | Sorts a file in alphabetical order |  |
| [paste In.out Out.out](https://linux.die.net/man/1/paste) | Adds two files side by side |  |
| [cut -d ' ' -f 2-3 In.out](https://linux.die.net/man/1/cut) | Extracts file at specified columns with delimiter |  |
| [join A.out B.out(https://linux.die.net/man/1/join) | Merges two files horizontally based on a common column |  |

## Shortcuts with Files

| Command | Description |
|---------|------------------------|
| [ctrl-h](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | deletes last character |
| [ctrl-w](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | deletes last word |
| [ctrl-u](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | deletes last line |
| [ctrl-d](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | end text input/exit program |
| [ctrl-s](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | freeze terminal window |
| [ctrl-q](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | unfreeze terminal window |
| [ctrl-\\](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | terminates terminal |
| [ctrl-z](http://homepages.math.uic.edu/~hanson/UNIX/UnixDictionary.html#UNIX-CTRL) | suspend terminal (sleep) |


You can use flags on these commands. For example, doing rm -r \*.csv will recursively remove all csv files from the current directory.
  
## File Protections

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

## Linking Commands -- Piping

Piping takes the output from one command into another command. For example, if you want to see all the python processes you are running:

ps [\|](https://linux.die.net/man/7/pipe) grep python

## Shell Scripts and Make files

To be written.

## Accessing and running computers remotely, moving files

### SSH

You can use secure shell client (ssh) to access a remote computer and then execute commands onto it.

| Command | Description |
|---  |---  |
| [ssh username@bank.ca](https://linux.die.net/man/1/ssh) | ssh into a remote computer |
| [ssh -p username@bank.ca](https://linux.die.net/man/1/ssh) | ssh into a computer at specific port |

You can look up ipaddresses through nameserver lookup and then ssh into an IP adress if you don't know the name of the server.

| Command | Description |
|---  |---  |
| [nslookup 176.34.155.23](https://linux.die.net/man/1/nslookup) * | this is the ip for a specific website |
| [nslookup duckduckgo.com](https://linux.die.net/man/1/nslookup) | this gives the address for the specific ip|
| [ssh username@176.34.155.23](https://linux.die.net/man/1/ssh) | you can ssh into an IP address |

### SCP

You can copy files securely using scp.

| Command | Description |
|---  |---  |
| [scp username@bank.com:Docs/accounts.csv accounts.csv](https://linux.die.net/man/1/scp) | Securely copy a file into the current directory |
| [scp -P 40 username@bank.com:Docs/accounts.csv accounts.csv](https://linux.die.net/man/1/scp) | use a different port if that port is blocked |
| [scp accounts.csv username@bank.com:Docs/accountsCopy.csv](https://linux.die.net/man/1/scp) | you can send a file too |

### Nohup

You can run long jobs remotely, even after logging out of your account. There are two solutions: nohup, which forces the operating system to ignore the hangup signal issued after you log out of your account. Let's assume you want to run a file called TakesLongTime. With the first command, when you use the & symbol, it tells Unix to create a process seperate from the one in the command window.

```
$ nohup TakesLongTime &
$ exit
```

This will not handle input and output. For that, you should have an error and out file.

```
$ nohup TakesLongTime > TakesLongTime.out 2> TakesLongTime.err < /project/null &
# exit
```

We will redirect the output, `stdout` to `TakesLongTime.out` and take the input from `/project/null`. This will prevent the program from hanging.

### Screen


## Storage and Version Control

Sometimes files are large. These commands offer ways to archive and compress them.

| Command | Description |
|---  |---  |
| [gzip file.txt](https://linux.die.net/man/1/gzip) | compresses (zips) file |
| [gunzip file.txt](https://linux.die.net/man/1/gunzip) | unzips file |
| [zip Backup.zip](https://linux.die.net/man/1/zip) * | zips files in directory |
| [zip -r Backup.zip \*](https://linux.die.net/man/1/zip) | zips files and directories in directory |
| [unzip Backup.zip](https://linux.die.net/man/1/unzip) | unzips zip file |
