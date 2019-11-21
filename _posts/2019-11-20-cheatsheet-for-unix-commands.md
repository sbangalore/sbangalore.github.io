---
published: true
---
This is a quick cheatsheet for relevant UNIX and VIM commands!

A couple of notes: first, you can access the Terminal through your UNIX computer. Second, when I say or, it means that there are 2 equivalent commands, not that you should type or. For example, you can move to the home directory using one of two commands: <span style="color:blue">cd</span> or <span style="color:blue">cd~</span>. You should not type <span style="color:blue">cd or cd~</span> into the terminal.

**Basic Navigation**

| Command | Description | Example |
|---  |---  |---|
| [pwd](http://man7.org/linux/man-pages/man1/pwd.1.html) | Present working directory | /Users/username |
| [man](http://man7.org/linux/man-pages/man1/man.1.html) | The manual/help file for the command | man pwd |
| [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) Subdir | Move to a folder in the directory | cd Data |
| [cd ..](http://man7.org/linux/man-pages/man1/cd.1p.html)</span> | Move to directory above | cd .. |
| [cd](http://man7.org/linux/man-pages/man1/cd.1p.html) or [cd ~](http://man7.org/linux/man-pages/man1/cd.1p.html) | Move to home directory | cd .. |
| [df](http://man7.org/linux/man-pages/man1/df.1.html) | Outputs amount of free space in the directory |  |
| [top](http://man7.org/linux/man-pages/man1/top.1.html) | Outputs process status of processes running on computer |  |
| [ps]( "http://man7.org/linux/man-pages/man1/ps.1.html") | Outputs process status of processes running on computer, related to you |  |
| [ps aux](http://man7.org/linux/man-pages/man1/ps.1.html) | Outputs process status of processes running on computer, not related to you |  |
| [ps -jim](http://man7.org/linux/man-pages/man1/ps.1.html) | Outputs process status of processes running on computer, related to user jim |  |
| [grep](http://man7.org/linux/man-pages/man1/grep.1.html) | print lines that match regex patterns |  |

**Working with directories**

The dash after a command is used to indicate flags.

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| [ls](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents | ... |
| [ls -l](http://man7.org/linux/man-pages/man1/ls.1.html) | List directory contents in long format (size, owner, protections, etc.) | ... |
| [ls -a](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents (including hidden files such as .bash) | ... |
| [ls x*](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents starting with x. You can use this * anywhere. | xanadu |
| [ls x?](http://man7.org/linux/man-pages/man1/ls.1.html) | List all directory contents which start with x and have one character after | xa |
| [mkdir](http://man7.org/linux/man-pages/man2/mkdir.2.html) FolderA | Creates a new directory |  |
| [rmdir](http://man7.org/linux/man-pages/man2/mkdir.2.html) FolderA | Deletes a directory |  |

You can chain together flags to create larger commands.

**Redirecting content**

| Command                  | Description                                                                 | Example         |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
| [ls -alh](http://man7.org/linux/man-pages/man1/ls.1.html) > Directory.out  | Replace/Create a file named Directory.out results of ls -alh                |                 |
| [ls -alh](http://man7.org/linux/man-pages/man1/ls.1.html) >> Directory.out | Append to Directory.out file results of ls -alh                             |                 |

**Working with files**

| Command | Description | Example |
|--------------------------|-----------------------------------------------------------------------------|-----------------|
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
| [wc](http://man7.org/linux/man-pages/man1/wc.1.html) Out.out ~/data/ | Gives a line, word, and character count of the file |  |

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
