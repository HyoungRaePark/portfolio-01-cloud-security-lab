import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('CHECKING')

  useEffect(() => {
    fetch('http://localhost:8080/api/health')
        .then(response => response.json())
        .then(data => {
          setStatus(data.status)
        })
        .catch(() => {
          setStatus('OFFLINE')
        })
  }, [])

  return (
      <div>
        <h1>Cloud Security Lab</h1>

        <h2>System Status</h2>

        <p>
          {status === 'UP' ? '● ONLINE' : `● ${status}`}
        </p>
      </div>
  )
}

export default App