// the whole logic of
// UploadTab will be presented
// in a singleton class

import popup from './popup.js'
import API from './api.js'

export default new class UploadTab {
  private data = ''
  private dataInput!: HTMLInputElement
  private validationLabel!: HTMLElement

  // your requests will be saved in
  // local storage history
  private readonly historyKey = 'it1shka/plottik/history'
  private history: string[]
  private historyElements!: HTMLElement[]

  // constructor loads all the
  // neccessary html elements
  constructor() {
    this.mountInput()
    this.mountValidationLabel()
    this.mountForm()
    // now, time to load history
    this.mountHistory()
    this.history = this.initializeHistory()
    this.updateHistory()
    //
    console.log('All components were mounted successfully')
  }

  // this method will load our input.upload-input 
  // element, and bind an event listener to it
  private mountInput = () => {
    const maybeInput = 
      document.getElementById('upload-input') ??
      document.querySelector('input')
    if (maybeInput === null || maybeInput.tagName !== 'INPUT') {
      throw new Error('Failed to mount data input')
    }
    this.dataInput = maybeInput as HTMLInputElement
    this.dataInput.oninput = () => {
      this.data = this.dataInput.value
      this.triggerDataValidation()
    }
  }

  // this method mounts validation label
  private mountValidationLabel = () => {
    const maybeLabel = 
      document.getElementById("upload-container__validation_label") ??
      document.querySelector("small")
    if (maybeLabel === null) {
      throw new Error('Failed to mount validation label')
    }
    this.validationLabel = maybeLabel
  }

  // this method will mount form,
  // override it's default behaviour on submit
  // such that instead of reloading a page, 
  // we will send a POST HTTP request to 
  // our server API
  private mountForm = () => {
    const maybeForm = 
      document.getElementById("upload-container__form") ??
      document.querySelector("form")
    if (maybeForm === null || maybeForm.tagName !== 'FORM') {
      throw new Error('Failed to mount form')
    }
    const formElement = maybeForm as HTMLFormElement
    formElement.onsubmit = event => {
      event.preventDefault()
      const maybeError = this.performDataValidation()
      if (maybeError) {
        popup()
          .title('Data is invalid')
          .message(maybeError)
          .timeout(3000)
          .show()
        return
      }
      // calling api
      API.put(this.data)
        .then(success => {
          if (!success) {
            popup()
              .title('API Failure')
              .message('Failed to upload data to the server')
              .timeout(2500)
              .show()
            return
          }
          popup()
            .title('Success!')
            .color('green')
            .message('Successfully uploaded data')
            .timeout(2500)
            .show()
        })

      // Writing to history and doing cleanup
      this.addHistoryRecord(this.data)
      this.dataInput.value = ''
      this.data = ''
    }
  }

  // mounting history component
  private mountHistory = () => {
    const maybeHistory = 
      document.querySelector('.upload-container__history') ??
      document.querySelector('ul')
    if (maybeHistory === null) {
      throw new Error('Failed to mount history')
    }
    const children = Array.from(maybeHistory.children)
    const listElements = children.filter(elem => {
      return elem.tagName === 'LI'
    }) as HTMLElement[]
    this.historyElements = listElements
  }

  // pulling previous requests from local storage
  private initializeHistory = (): string[] => {
    if (!window.localStorage) {
      return []
    }
    const maybeRawData = window.localStorage.getItem(this.historyKey)
    if (maybeRawData === null) {
      return []
    }
    const historyRecords = JSON.parse(maybeRawData) as string[]
    return historyRecords
  }

  // updates history on 1) initialization 2) change
  private updateHistory = () => {
    for (let i = 0; i < this.historyElements.length; i++) {
      const elem = this.historyElements[i]
      if (i < this.history.length) {
        const record = this.history[i]
        elem.textContent = record
        elem.onclick = () => {
          this.data = record
          this.dataInput.value = record
          this.triggerDataValidation()
        }
        continue
      }
      elem.textContent = 'No record'
    }
  }

  // adds a record to history
  private addHistoryRecord = (record: string) => {
    this.history.unshift(record)
    while (this.history.length > 3) {
      this.history.pop()
    }
    if (window.localStorage) {
      const data = JSON.stringify(this.history)
      window.localStorage.setItem(this.historyKey, data) 
    }
    this.updateHistory()
  }

  // that method will perform data validation
  // if data is invalid, it will modify 
  // the label below the input and the input itself
  private triggerDataValidation = () => {
    const error = this.performDataValidation()
    if (error === null) {
      this.validationLabel.textContent = 'Everything is alright!'
      this.validationLabel.style.color = 'green'
      this.dataInput.style.color = 'inherit'
      return
    }
    // if we encounter an error: 
    this.validationLabel.textContent = error
    this.validationLabel.style.color = 'red'
    this.dataInput.style.color = 'red'
  }

  // method that will check whether
  // this.data field is valid or not
  // thus it returns an optional string
  // which represents an error
  private performDataValidation = (): string | null => {
    const parts = this.data.split(',')
    if (parts.length < 5) {
      return 'The length of data should be at least 5'
    }
    for (const part of parts) {
      const trimmed = part.trim()
      if (!/^\-?\d+$/.test(trimmed)) {
        return 'Each part should be a natural number'
      }
      const intPart = Number(trimmed)
      if (intPart < 0) {
        return 'Each part should be a natural number (positive integer)'
      }
    }
    return null
  }
}
