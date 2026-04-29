'use client'

import { useEffect, useState } from 'react'

export default function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div id="st-preloader">
      <div className="st-preloader-wave">
        <img src="/images/st-loader.png" alt="preloader" />
      </div>
    </div>
  )
}
