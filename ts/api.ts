// this file will contain
// a singleton class that will
// handle all API interactions

// schema that describes data
interface DataScheme {
  id: number
  created_at: string
  updated_at: string
  data: string
}

export default new class API {
  // relative path to API constroller
  private readonly apiURL = '/api'

  // used to put a new record 
  // to a database
  put = async (data: string) => {
    try {
      const url = `${this.apiURL}/put`
      const result = await window.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: data
      })
      return result.ok
    } catch (error) {
      console.error(error)
      return false
    }
  }

  // used to fetch n new records
  // from a database
  fetch = async () => {
    try {
      const url = `${this.apiURL}/fetch`
      const result = await window.fetch(url, {
        method: 'GET',
      })
      if (!result.ok) {
        console.log('Failed to fetch data')
        return null
      }
      const data = await result.json()
      return data as DataScheme[]
      
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
