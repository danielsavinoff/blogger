'use client'

import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const media = window.matchMedia(query)

  const [isMatch, setIsMatch] = useState<boolean>(media.matches)

  useEffect(() => {
    const onResize = () => setIsMatch(media.matches)

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isMatch])

  return isMatch
}