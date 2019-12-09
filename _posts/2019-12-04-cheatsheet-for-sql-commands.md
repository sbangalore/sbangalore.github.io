---
published: false
tags:
  - technology
  - quantitative-methods
---
When Excel spreadsheets get huge ... we get databases. I discuss common SQL commands to work with databases.

# Brief

While you can work with databases in Excel, Python, and more, it's usually too slow. You end up spending a day sipping coffee while looking at a computer screen (if you had a hangover the previous day though, it's not a bad excuse to chill at work). In here, I bring you some command SQL commands and structure that I use when at work.

Different versions of SQL have different commands, but there should be some generalities.

# Commands

## Reading & Exploring Data Structure

You first load up your database. For example, in SQLite,

```json
$ sqlite3 C:\users\bans\databases\MyDB.db
```

You can run the following commands to get an idea of your data structure.

| Command     | Usage	      |
| :---        |          ---: |
| .tables     | what tables are available   |
| .schema   | what's the structure of the tables      |
| .read FILENAME     | read in commands form a file   |
| .import FILE TABLE   | import raw data into a table      |
| .mode MODE ?TABLE?     | what mode the output should take   |
| .seperator STRING   | symbol to seperate variables in output      |
| .output FILENAME     | direct data to an output file   |
| .backup ?DB? FILENAME   | back up the db to a file      |


There are about 20 commands that I always use.

``` json
SELECT *
```
``` json
SELECT
```
``` json
SELECT
```
``` json
SELECT
```
``` json
SELECT
```





# Structuring

SQL commands are structured as follows:

```json
SELECT column1, function_name(column2)
FROM table_name
WHERE condition
GROUP BY column1, column2
ORDER BY column1, column2;

function_name: Name of the function used for example, SUM() , AVG().
table_name: Name of the table.
condition: Condition used.
```


# Examples

This is a sample sql command I used recently to aggregate the number of unique trades and prices in a dataset.

```json
SELECT
	CAST(LEFT(IIROC_SETTLEMENT_DATE, 4) AS INT) AS YR, 
	COUNT(DISTINCT IIROC_PARENT_REPO_ID) AS NUMREPOS,
	COUNT (DISTINCT IIROC_PRICE_RAW) AS NUMPRICES
FROM 
	MTRSDM.MTRS.USER_REPO_TRADE_TRANS_ALL_VW
WHERE
	SUBSTRING(IIROC_SEC_INSTR_TYPE_CODE,1,3) = 'GOC'
	AND IIROC_TRANS_TYPE_CODE = 'NEW'
GROUP BY
	CAST(LEFT(IIROC_SETTLEMENT_DATE, 4) AS INT)
ORDER BY
	YR
```
