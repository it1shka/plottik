# Plottik: App for plots

This application was created as 
a first part of recruitment task
for sofixit company

## Original task:

Create an application that uses
any database, e.g. mongo, mysql.
The application should have 2 pages.

1. A couple of controls to enter data and save it to the server.
- Data validation

2. Display of a graph from the entered data.
- Refreshing the chart every 10 seconds
- d3 library
- Data for the chart to be entered on the 1st page in any of the
controls.

## My implementation:

1. Four pages: 
- main page (index.html) contains links to upload and display
- upload page (upload.html) contains controls for uploading data
- display page (display.html) displays last 3 data entries
- 404 page (404.html) serves as a universal endpoint

2. Server part:
- Golang as language
- Gin-Gonic as http server library
- SQLite as database 
- GORM as ORM 

3. Client part:
- Vanilla TypeScript with ESNext modules
- SCSS as CSS preprocessor
- d3 lib since it was required
- Using a little bit of server-side templating

## Why these technologies?

The aim was to provide a simple application
and I was choosing my tech stack to be as simple
as possible. 

1. No JS frameworks
- I believe that if project is simple enough, 
you can just go with vanilla js. Using something 
like React or Angular would just overcomplicate it
2. No build tools (webpack, rollup, parcel, etc.)
- Again, simple import statements are fine for me
unless you really need to optimize your bundle 
(treeshake) and manage complex dependencies 
3. TypeScript
- Easy to add to a project, better than JavaScript
since it has nice autocomplete in my text editor
and catches some fraction of errors.
Better than JSDoc since it's more pleasant to write.
4. Golang + batteries (Gin, GORM)
- Golang allows you to rapidly develop servers
for your front-end part. Best backend tool
in terms of development speed for me

## Nice additional features that I implemented:

1. Popup system
- Creates beautiful messages, errors and warnings
2. History of uploads using window.localStorage
3. Additional two pages: index.html and 404.html
4. Minimal adaptivity capabilities for mobile devices
5. Nice styling
6. Realtime data validation

## How to test on local machine

### Please, install Go and Node.js beforehand!

1. Clone from github
2. chmod +x dev.py script
3. Run dev.py script
4. Open in browser (localhost:8080)

In the form of shell script it would 
look the following way:
```shell
git clone https://github.com/it1shka/plottik
cd plottik
chmod +x dev.py
./dev.py & open http://localhost:8080
# and then you need to refresh a page
# since it takes some time to start
# the server
```
