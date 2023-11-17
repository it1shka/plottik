package main

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// Function that will be responsible for
// setting up handlers for my endpoints.
//
// We will have:
// 1. Main page "/"
// 2. Page to upload data "/upload"
// 3. Page to display data with d3 lib "/display"
// 4. Static server for html, js, css files "/static"
// 5. 404 page "*"
//
// API endpoints:
// 1. Put data "/api/put"
// 2. Fetch data "/api/fetch"
func initializeServer(app *gin.Engine) {
  // loading html templates from ./temlates folder
  app.LoadHTMLGlob("templates/*.html")

  // normal endpoints
  app.GET("/", mainPage)
  app.GET("/upload", uploadPage)
  app.GET("/display", displayPage)
  app.Static("/static", "static")
  
  // API endpoints
  api := app.Group("/api")
  api.GET("/fetch", fetchAPI)
  api.POST("/put", putAPI)

  // 404 handler
  app.NoRoute(notFoundPage)
}

func mainPage(ctx *gin.Context) {
  ctx.HTML(http.StatusOK, "index.html", gin.H{
    "title": "Plottik: main page",
  })
}

func uploadPage(ctx *gin.Context) {
  ctx.HTML(http.StatusOK, "upload.html", gin.H{
    "title": "Plottik: upload data",
  })
}

func displayPage(ctx *gin.Context) {
  ctx.HTML(http.StatusOK, "display.html", gin.H{
    "title": "Plottik: display dashboard",
  })
}

const FetchAmount = 3
func fetchAPI(ctx *gin.Context) {
  records, err := getLastDataRecords(FetchAmount)
  if err != nil {
    ctx.String(http.StatusInternalServerError, "Failed to get data records")
    return
  }
  ctx.JSON(http.StatusOK, records)
}

// here I define a function to validate
// data on the server. Basically, 
// our data should be integers separated
// by commas with arbitrary number of spaces
// in between
func validateData(data string) bool {
  parts := strings.Split(data, ",")
  for _, part := range parts {
    trimmed := strings.TrimSpace(part)
    if _, err := strconv.Atoi(trimmed); err != nil {
      return false
    }
  }
  return true
}

func putAPI(ctx *gin.Context) {
  rawData, err := ctx.GetRawData()
  if err != nil {
    ctx.String(http.StatusInternalServerError, "Failed to get request body")
    return
  }
  strData := string(rawData)
  if !validateData(strData) {
    ctx.String(http.StatusBadRequest, "You provided invalid data")
    return
  }
  if err := newDataRecord(strData); err != nil {
    ctx.String(http.StatusInternalServerError, "Failed to create a database record")
    return
  }
  ctx.String(http.StatusAccepted, "Successfully created a record")
}

func notFoundPage(ctx *gin.Context) {
  ctx.HTML(http.StatusNotFound, "404.html", gin.H{
    "title": "Plottik: 404 Route Not Found",
  })
}
