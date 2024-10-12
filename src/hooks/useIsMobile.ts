import { useEffect, useState } from 'react'

// Custom Hook: useIsMobile
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor

    const isMobileDevice =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(userAgent)
    setIsMobile(isMobileDevice)
  }, []) // Empty dependency array ensures it runs only once on mount

  return isMobile
}
