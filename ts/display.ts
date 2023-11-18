// this file will contain interface logic
// for the display page 

import API, {DataScheme} from './api.js'
import popup from './popup.js'
import { sleep } from './lib.js'

// again, we will implement the logic
// of /display page using a singleton:
export default new class DisplayTab {
  // basically, we will load d3 lib
  // from CDN since it's easy
  // I believe that this "dirty"
  // method is sufficient enough 
  // for a small project like this
  private d3: any
  private data: DataScheme[] = []
  private readonly svgDisplays: string[] = [
    '#main-data-display',
    '#second-data-display',
    '#third-data-display'
  ]

  constructor() {
    // we dynamically load d3
    // if it was successful, then we proceed
    // otherwise we show error message
    import("https://cdn.jsdelivr.net/npm/d3@7/+esm")
      .then(mod => {
        this.d3 = mod
        popup()
          .title('D3 is loaded')
          .color('green')
          .message('Start drawing data')
          .timeout(1500)
          .show()
        this.dataUpdateLoop()
      })
      .catch(reason => {
        console.error(reason)
        popup()
          .title('Failed to import D3 lib')
          .message('App will not work properly')
          .timeout(5000)
          .show()
      })
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

  // triggers on every data fetch
  private triggerDataDisplay = () => {
    // for every data piece, we display it on 
    // some particular svg
    for (let i = 0; i < Math.min(this.data.length, this.svgDisplays.length); i++) {
      const data = this.data[i].data
        .split(',')
        .map(chunk => Number(chunk.trim()))
        .filter(num => !Number.isNaN(num))
      const svgDisplay = this.svgDisplays[i]
      this.updateBargraph(svgDisplay, data)
    }
  }
  
  // updates one particular data screen
  // (there are three in total)
  private updateBargraph = (id: string, data: number[]) => {
    try {
      const display = this.d3.select(id)
      const displayWidth = display.attr('width')
      const displayHeight = display.attr('height')

      // creating scales
      const xScale = this.d3
        .scaleBand()
        .domain(this.d3.range(data.length))
        .range([0, displayWidth])
        .padding(0.2)
      const yScale = this.d3
        .scaleLinear()
        .domain([-100, 100])
        .range([0, displayHeight])
      
      // entering new things
      display
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (_, index) => xScale(index))
        .attr('y', value => displayHeight - yScale(value))
        .attr('width', xScale.bandwidth())
        .attr('height', value => yScale(value))
        .attr('fill', value => value > 0 ? 'royalblue' : '#fc4503')

      display
        .selectAll('rect')
        .data(data)
        .transition()
        .duration(500)
        .attr('x', (_, index) => xScale(index))
        .attr('y', value => displayHeight - yScale(value))
        .attr('width', xScale.bandwidth())
        .attr('height', value => yScale(value))
        .attr('fill', value => value > 0 ? 'royalblue' : '#fc4503')
    } catch (error) {
      console.error(error)
      popup()
        .title('Error')
        .message(`Failed to update data on ${id}`)
        .timeout(1500)
        .show()
    }
  }
}
