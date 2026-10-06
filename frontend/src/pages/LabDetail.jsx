import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../css/LabDetail.css'

import SqlInjectionExperiment from '../components/SqlInjectionExperiment'

function LabDetail() {
    const { id } = useParams()
    const [lab, setLab] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8080/api/labs/${id}`)
            .then(response => response.json())
            .then(data => setLab(data))
            .catch(error => {
                console.error('LAB 조회 실패:', error)
            })
    }, [id])

    if (!lab) {
        return (
            <div className="lab-detail">
                LAB 정보를 불러오는 중...
            </div>
        )
    }

    const experimentSteps = [
        {
            number: '01',
            title: '정상 상태',
            description: '공격 전 정상 동작을 확인합니다.',
        },
        {
            number: '02',
            title: '공격 재현',
            description: '취약점을 이용한 공격을 재현합니다.',
        },
        {
            number: '03',
            title: '결과 관찰',
            description: '서버와 데이터의 변화를 확인합니다.',
        },
        {
            number: '04',
            title: '원인 분석',
            description: '공격이 성공한 원인을 분석합니다.',
        },
        {
            number: '05',
            title: '방어 적용',
            description: '취약한 구조를 안전하게 수정합니다.',
        },
        {
            number: '06',
            title: '재검증',
            description: '같은 공격으로 방어 결과를 확인합니다.',
        },
    ]

    return (
        <div className="lab-detail">
            <Link className="back-link" to="/">
                ← Security Labs
            </Link>

            <header className="lab-overview">
                <div className="lab-overview-main">
                    <span className="lab-code">{lab.code}</span>

                    <div className="lab-title-row">
                        <h1>{lab.title}</h1>
                        <span className="lab-layer">{lab.layer}</span>
                    </div>

                    <p>{lab.description}</p>
                </div>
            </header>

            <section className="flow-section">
                <div className="section-heading">
                    <span className="section-label">실험 진행 과정</span>
                    <h2>문제를 재현하고 방어까지 검증합니다</h2>
                </div>

                <div className="experiment-flow">
                    {experimentSteps.map(step => (
                        <div className="flow-step" key={step.number}>
                            <strong>{step.number}</strong>

                            <div>
                                <span>{step.title}</span>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {Number(id) === 1 && (
                <SqlInjectionExperiment />
            )}
        </div>
    )
}

export default LabDetail