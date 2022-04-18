import { useEffect, useState } from 'react'

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isButtonInvisible, setIsButtonInvisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
    }, 1000)
    setTimeout(() => {
      setIsButtonInvisible(true)
    }, 2000)
  }, [])

  return (
    <div>
      <h1>Hello World</h1>
      {isButtonVisible && <button>Button</button>}
      {!isButtonInvisible && <button>Invisible Button</button>}
    </div>
  )
}
