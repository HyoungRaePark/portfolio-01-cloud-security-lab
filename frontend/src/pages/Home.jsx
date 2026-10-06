import LabCard from '../components/LabCard'
import '../css/Home.css'

function Home({ status, labs }) {
    return (
        <div className="home">
            <header className="header">
                <div>
                    <h1>Cloud Security Lab</h1>
                    <p>Attack · Observe · Analyze · Defend · Validate</p>
                </div>

                <div className="system-status">
                    <span>System Status</span>

                    <strong>
                        {status === 'UP' ? '● ONLINE' : `● ${status}`}
                    </strong>
                </div>
            </header>

            <main>
                <section className="intro">
                    <p>PORTFOLIO PROJECT 01</p>

                    <h2>Security Labs</h2>

                    <span>
            보안 문제를 재현하고 시스템에서 발생하는 변화를 관찰합니다.
          </span>
                </section>

                <section className="lab-grid">
                    {labs.map(lab => (
                        <LabCard key={lab.id} lab={lab} />
                    ))}
                </section>
            </main>
        </div>
    )
}

export default Home