---
published: true
---
This is a quick cheatsheet for relevant UNIX and VIM commands!

A couple of notes: first, you can access the Terminal through your UNIX computer. Second, when I say or, it means that there are 2 equivalent commands, not that you should type or. For example, you can move to the home directory using one of two commands: <span style="color:blue">cd</span> or <span style="color:blue">cd~</span>. You should not type <span style="color:blue">cd or cd~</span> into the terminal.

**Basic Navigation**

| Command | Description | Example |
|---  |---  |---|
[pwd](http://man7.org/linux/man-pages/man1/pwd.1.html) | Present working directory | /Users/username |
| <span style="color:blue">[man](http://man7.org/linux/man-pages/man1/man.1.html)</span> | The manual/help file for the command | man pwd |
| <span style="color:blue">[cd Subdir](http://man7.org/linux/man-pages/man1/cd.1p.html)</span> | Move to a folder in the directory | cd Data |
| <span style="color:blue">[cd ..](http://man7.org/linux/man-pages/man1/cd.1p.html)</span> | Move to directory above | cd .. |
| <span style="color:blue">[cd](http://man7.org/linux/man-pages/man1/cd.1p.html)</span> or <span style="color:blue">cd ~</span> | Move to home directory | cd .. |
| <span style="color:blue">[df](http://man7.org/linux/man-pages/man1/df.1.html)</span> | Outputs amount of free space in the directory |  |
| <span style="color:blue">[top](http://man7.org/linux/man-pages/man1/top.1.html)</span> | Outputs process status of processes running on computer |  |
| <span style="color:blue">[ps]( "http://man7.org/linux/man-pages/man1/ps.1.html")</span> | Outputs process status of processes running on computer, related to you |  |
| <span style="color:blue">[ps aux](http://man7.org/linux/man-pages/man1/ps.1.html)</span> | Outputs process status of processes running on computer, not related to you |  |
| <span style="color:blue">[ps -jim](http://man7.org/linux/man-pages/man1/ps.1.html)</span> | Outputs process status of processes running on computer, related to user jim |  |
| <span style="color:blue">[grep](http://man7.org/linux/man-pages/man1/grep.1.html)</span> | print lines that match regex patterns |  |

**Working with directories**

The dash after a command is used to indicate flags.

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| <span style="color:blue">ls</span> | List directory contents | ... |
| <span style="color:blue">ls -l</span> | List directory contents in long format (size, owner, protections, etc.) | ... |
| <span style="color:blue">ls -a</span> | List all directory contents (including hidden files such as .bash) | ... |
| <span style="color:blue">ls x*</span> | List all directory contents starting with x. You can use this * anywhere. | xanadu |
| <span style="color:blue">ls x?</span> | List all directory contents which start with x and have one character after | xa |
| <span style="color:blue">mkdir FolderA</span> | Creates a new directory |  |
| <span style="color:blue">rmdir FolderA</span> | Deletes a directory |  |

You can chain together flags to create larger commands.

**Redirecting content**

| Command                  | Description                                                                 | Example         |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| <span style="color:blue">ls -alh > Directory.out</span>  | Replace/Create a file named Directory.out results of ls -alh                |                 |
| <span style="color:blue">ls -alh >> Directory.out</span> | Append to Directory.out file results of ls -alh                             |                 |

**Working with files**

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| <span style="color:blue">cat Test.out</span> | Lists entire contents of file |  |
| <span style="color:blue">head Test.out</span> | Lists first 10 lines of file |  |
| <span style="color:blue">tail Test.out</span> | Lists last 10 lines of file |  |
| <span style="color:blue">more Test.out</span> | After head/tail, allows you to scroll down |  |
| <span style="color:blue">less Test.out</span> | After head/tail, allows you to scroll up |  |
| <span style="color:blue">rm Test.out</span> | Deletes a file |  |
| <span style="color:blue">touch Test.out</span> | Creates a file |  |
| <span style="color:blue">vim Test.out</span> | Edits a file using vim |  |
| <span style="color:blue">diff Out.out New.out</span> | Lists lines where 2 files differ. |  |
| <span style="color:blue">cp Out.out ~/data/</span> | Copys file to directory |  |
| <span style="color:blue">mv Out.out ~/data/</span> | Moves file to directory |  |
| <span style="color:blue">wc Out.out ~/data/</span> | Gives a line, word, and character count of the file |  |

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

You can see the protections by running <span style="color:blue">ll</span>.

For example, for any given file, the protection (string on the far left) might look like this:

<span style="color:green">-rw-r--r--	1	bans	staff	6	8	Jun	17:12	test</span>

You can read this protections string in groups of three starting with user then group then the world. In this instance, the user has read write permissions while the group and world have read permissions.

To change the permissions/protection on a file or folder, you can run the command <span style="color:blue">chmod</span>. Chmod works in the octal (or base 8) system, where:
- 4 means read access
- 2 means write access
- 1 means execute access

So, to have read and execute access would be 4 + 1 = 5. To use chmod, you determine the level of access for the user, group and world in the following format:

<span style="color:blue">chmod ugw</span>

For example, to have group and world read access and user read, write, and execute access would be:

<span style="color:blue">chmod 744</span>.
