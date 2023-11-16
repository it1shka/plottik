// the whole logic of
// UploadTab will be presented
// in a singleton class

import popup from './popup.js'

export default new class UploadTab {
  private data = ''
  private dataInput!: HTMLInputElement
  private validationLabel!: HTMLElement

  // constructor loads all the
  // neccessary html elements
  constructor() {
    this.mountInput()
    this.mountValidationLabel()
    this.mountForm()
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
      }
      // TODO: ...
    }
  }

  // TODO: implement API class

  // TODO: implement history

  // that method will perform data validation
  // if data is invalid, it will modify 
  // the label below the input
  private triggerDataValidation = () => {
    // TODO: ...
  }

  // method that will check whether
  // this.data field is valid or not
  private performDataValidation = (): string | null => {
    return 'TODO: implement validation'
  }
}
