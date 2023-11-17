package main

import (
	"log"
	"os"
  "fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// our basic model that 
// we will be saving in the db
// and for simplicity we will
// save the raw data
type DataRecord struct {
  gorm.Model
  Data string `json:"data"`
}

// public database instance
var DB *gorm.DB

// this function will be
// setting up the database
// sqlite + gorm
func initializeDatabase() {
  databaseFile := os.Getenv("DB")
  if databaseFile == "" {
    databaseFile = "database.db"
  }
  database, err := gorm.Open(sqlite.Open(databaseFile))
  if err != nil {
    fmt.Println("Failed to initialize the database: ")
    log.Fatal(err)
  }
  if err := database.AutoMigrate(&DataRecord{}); err != nil {
    fmt.Println("Database migration failed: ")
    log.Fatal(err)
  }
  DB = database
}

// function that will save 
// a new record in the database
func newDataRecord(data string) error {
  record := DataRecord { Data: data }
  return DB.Create(&record).Error
}

// function that returns
// n last records 
// from the database
func getLastDataRecords(n int) ([]DataRecord, error) {
  var records []DataRecord
  result := DB.
    Order("created_at desc").
    Limit(n).
    Find(&records).
    Error
  return records, result
}
