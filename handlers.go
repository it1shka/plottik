package main

import (
  "github.com/gin-gonic/gin"
  "net/http"
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
  ctx.HTML(http.StatusOK, "index.html", gin.H{})
}

func uploadPage(ctx *gin.Context) {

}

func displayPage(ctx *gin.Context) {

}

func fetchAPI(ctx *gin.Context) {

}

func putAPI(ctx *gin.Context) {

}

func notFoundPage(ctx *gin.Context) {

}
