'use client'

import { createElement, useEffect, useState } from "react"
import { Loader } from 'lucide-react'

export function List<T>({
  children,
  endpoint,
  adapter,
}: {
  children: React.ReactElement
  endpoint: string
  adapter?: T
}) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [data, setData] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    fetch(endpoint, {
      method: "GET",
    })
      .then((res) => {
        if (res.status === 200) return res.json()
        else throw new Error(res.statusText)
      })
      .catch((err) => console.log(err))
      .then((data) => {
        if (Array.isArray(data)) setData(data)
        
        setIsLoaded(true)
      })
  }, [])

  if (data.length > 0 && isLoaded)
    return data.map((props) => {
      
      const generated = {
        ...props,
      }

      for (const key in adapter) {
        let value = adapter[key] as string

        const params = value?.match(/(?<=\[)[^\[\]]*(?=\])/g) ?? [] 

        for (const param of params) {
          value = value.replaceAll(`[${param}]`, props[param] as string)
        }
        
        generated[key] = value
      }

      return createElement(children.type, generated)
    })

  if (!isLoaded) return (
    <div className="h-full w-full flex justify-center items-center">
      <Loader className="w-4 h-4 animate-spin" />
    </div>
  )
  
  return null
}
