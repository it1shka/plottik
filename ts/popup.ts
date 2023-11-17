// in this file i will define a system
// for popup messages that will appear
// in the upper part of the screen

import { sleep } from './lib.js'

// object that will describe our
// popup message
type PopupConfig = Partial<{
  title:   string
  message: string
  color:   string
  timeout: number
}>

// singleton that will manage
// our popups
const PopupScheduler = new class {
  private readonly popups: PopupConfig[] = []
  private running = false

  // method that will handle the UI component
  // of displaying the popup
  private showPopup = async () => {
    // getting our first popup from the queue
    const config = this.popups.shift()!

   // creating popup root
    const popupRoot = document.createElement('aside')
    popupRoot.classList.add('popup')

    // creating popup title
    const popupTitle = document.createElement('h2')
    popupTitle.textContent = config.title ?? 'Unknown message'
    popupTitle.style.color = config.color ?? 'red'
    popupRoot.appendChild(popupTitle)

    // creating popup message
    const popupMessage = document.createElement('p')
    popupMessage.textContent = config.message ?? 'No content'
    popupRoot.appendChild(popupMessage)

    // mounting popup and activating it
    document.body.appendChild(popupRoot)
    await sleep(10)
    popupRoot.classList.add('active')
   
    // waiting and deleting the popup
    await sleep(config.timeout ?? 2500)
    popupRoot.classList.remove('active')
    await sleep(1500)
    popupRoot.remove()
  }

  // executes until this.popups is empty
  private executionLoop = async () => {
    this.running = true
    while (this.popups.length > 0) {
      await this.showPopup()
    }
    this.running = false
  }

  // function that schedules a popup
  // and starts a loop if it is not running
  schedulePopup = (config: PopupConfig) => {
    this.popups.push(config)
    if (!this.running) {
      this.executionLoop()
    }
  }
}

// pattern builder for
// building our popup messages
class PopupBuilder {
  private readonly state: PopupConfig = {}

  constructor(passedState?: PopupConfig) {
    if (passedState) {
      this.state = passedState
    }
  }

  title = (value: string) => {
    return new PopupBuilder({
      ...this.state,
      title: value
    })
  }

  message = (value: string) => {
    return new PopupBuilder({
      ...this.state,
      message: value
    })
  }

  color = (value: string) => {
    return new PopupBuilder({
      ...this.state,
      color: value
    })
  }

  timeout = (value: number) => {
    return new PopupBuilder({
      ...this.state,
      timeout: value
    })
  }

  // just the last function that
  // actually displays the popup
  show = () => {
    PopupScheduler.schedulePopup(this.state)
  }
}

// we just export a function
// that will create an empty popup builder
export default () => new PopupBuilder
