Stationery Management
=====================
---
Introduction
------------
>Web application developed in Ruby on Sinatra. This is used for tracking the stationery stock movement in the company to the different departments.It is having purchase module, consumption module and several repots on purchase, consumption, department wise, supplier wise etc. It uses AJAX request for selecting a particular item from the item master and jQuery library for creating the data entry grid for the purchase and consumption module.


Getting Started
---------------

###Prerequisites###
1. ruby 1.8 or higher
2. sinatra
3. mysql

###First step. :- Getting the source code.

<code> git clone git@github.com:krishnau2/Stationery.git </code>

Change directory to Stationery

<code>cd Stationery</code>

Installing dependent gems.

<code>bundle install</code>

Creating Database and associated tables. (*Assuming that mysql user name is root and no password.*)

<code> mysql -uroot -e"create database rStationery" </code>

<code> mysql -uroot rStationery < Stationery/lib/migrations/dump_schema.sql </code>


Running - From the project directory

<code>rackup</code> *The application will start in localhost:9292*

In browser:- <http://localhost:9292>

###Screen shot 

![Alt text](https://github.com/krishnau2/Stationery/raw/master/screenshot/Screenshot-1.jpg )

