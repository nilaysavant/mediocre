import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Used to reset the scroll on path change
 * @returns
 */
const ScrollReset = () => {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return null
}

export default ScrollReset
