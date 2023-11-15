package main

import ( 
  "github.com/gin-gonic/gin" 
  "os"
  "fmt"
  "bytes"
  "strings"
  "log"
)

// sets up the environment
// by reading .env file
func setupEnv() {
  data, err := os.ReadFile(".env")
  if err != nil {
    fmt.Println("Failed to read .env file")
    return
  }
  stringData := bytes.NewBuffer(data).String()
  parts := strings.Split(stringData, "\n")
  for _, part := range parts {
    pair := strings.Split(part, "=")
    if len(pair) != 2 {
      continue
    }
    key := pair[0]
    value := pair[1]
    os.Setenv(key, value)
  }
}

func main() {
  // setting up database and env
  setupEnv()
  initializeDatabase()
  // creating and initializing application
  app := gin.Default()
  initializeServer(app)
  // determining the port and running
  maybePort := os.Getenv("PORT")
  if maybePort == "" {
    maybePort = ":8080"
  }
  fmt.Printf("Running on port %s...", maybePort)
  log.Fatal(app.Run(maybePort))
}
