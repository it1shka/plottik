// this file will contain interface logic
// for the display page 

import API, {DataScheme} from './api.js'
import popup from './popup.js'
import { sleep } from './lib.js'

// again, we will implement the logic
// of /display page using a singleton:
export default new class DisplayTab {
  private data: DataScheme[] = []

  constructor() {
    this.dataUpdateLoop()
  }

  // starts an endless async loop
  // whichi will pull data from server
  // every 10 seconds and trigger
  // and update each time
  private dataUpdateLoop = async () => {
    while (true) {
      const maybeNewData = await API.fetch()
      // if failed to get data,
      // show error message and
      // try again in 3 seconds
      if (maybeNewData === null) {
        popup()
          .title('Failed to retrieve data')
          .message('Will try again in 3 seconds')
          .timeout(1500)
          .show()
        await sleep(3000);
        continue
      }
      // update data field and
      // show user that we did it
      // wait for 10 seconds
      this.data = maybeNewData
      popup()
        .title('Success')
        .color('green')
        .message('Data is up to date')
        .timeout(1500)
        .show()
      this.triggerDataDisplay()
      await sleep(1e4)
    }
  }

  private triggerDataDisplay = () => {
    console.log(this.data)
  }
}
