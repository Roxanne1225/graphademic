import { useState, useEffect } from 'react'

/**
 * Wrapper for making api requests within React components
 * 
 * @param {function} fetcher a function which returns a Promise
 * @param  {...any} params the params passed to fetcher
 */
export function useFetch(fetcher, ...params) {
  const [isReceived, setIsRecieved] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    async function request() {
      const data = await fetcher(...params)

      setData(data)
      setIsRecieved(true)
    }

    request()
  }, [])

  return {
    isReceived,
    data
  }
}