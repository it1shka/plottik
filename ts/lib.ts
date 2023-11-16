// this file will contain misc functions

// function that allows you to 
// asynchroniously wait for some time
// example: await sleep(1000)
export const sleep = (time: number) => {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}
