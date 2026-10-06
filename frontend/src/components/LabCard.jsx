import { Link } from 'react-router-dom'
import '../css/LabCard.css'

function LabCard({ lab }) {
    return (
        <div className="lab-card">
            <span className="lab-code">{lab.code}</span>

            <h3>{lab.title}</h3>

            <p>{lab.layer}</p>

            <Link
                className="lab-button"
                to={`/labs/${lab.id}`}
            >
                LAB 열기
            </Link>
        </div>
    )
}

export default LabCard