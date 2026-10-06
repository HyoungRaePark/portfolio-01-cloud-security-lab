import { useEffect, useState } from 'react'
import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom'

import Home from './pages/Home'
import LabDetail from './pages/LabDetail'

function App() {
    const [status, setStatus] = useState('CHECKING')
    const [labs, setLabs] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/api/health')
            .then(response => response.json())
            .then(data => setStatus(data.status))
            .catch(() => setStatus('OFFLINE'))

        fetch('http://localhost:8080/api/labs')
            .then(response => response.json())
            .then(data => setLabs(data))
            .catch(error => {
                console.error('LAB 목록 조회 실패:', error)
            })
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Home status={status} labs={labs} />}
                />

                <Route
                    path="/labs/:id"
                    element={<LabDetail />}
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App