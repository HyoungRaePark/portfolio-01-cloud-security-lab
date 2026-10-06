import { useState } from 'react'
import SecurityEventPanel from './SecurityEventPanel'
import '../css/SqlInjectionExperiment.css'

function SqlInjectionExperiment() {
    const [username, setUsername] = useState('alice')
    const [password, setPassword] = useState('test123')

    const [baselineResult, setBaselineResult] = useState(null)
    const [vulnerableResult, setVulnerableResult] = useState(null)

    const [defendedResult, setDefendedResult] = useState(null)
    const [retestLoading, setRetestLoading] = useState(false)

    const [loading, setLoading] = useState(false)
    const [experimentStage, setExperimentStage] = useState('baseline')
    const [eventRefreshKey, setEventRefreshKey] = useState(0)

    const runSingleLogin = async (mode, loginUsername, loginPassword) => {
        const response = await fetch(
            `http://localhost:8080/api/labs/1/${mode}/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loginUsername,
                    password: loginPassword,
                }),
            }
        )

        return response.json()
    }

    const runBaselineTest = async () => {
        setLoading(true)
        setExperimentStage('baseline')
        setBaselineResult(null)
        setVulnerableResult(null)

        const normalUsername = 'alice'
        const normalPassword = 'test123'

        setUsername(normalUsername)
        setPassword(normalPassword)

        try {
            const baseline = await runSingleLogin(
                'baseline',
                normalUsername,
                normalPassword
            )

            setBaselineResult(baseline)
        } catch (error) {
            console.error('LAB 01 정상 상태 확인 실패:', error)

            setBaselineResult({
                mode: 'ERROR',
                success: false,
                message: '백엔드 서버에 연결할 수 없습니다.',
            })
        } finally {
            setLoading(false)
        }
    }

    const runAttackTest = async () => {
        setLoading(true)
        setExperimentStage('attack')
        setBaselineResult(null)
        setVulnerableResult(null)

        const attackUsername = "alice' OR '1'='1' -- "
        const attackPassword = 'wrong'

        setUsername(attackUsername)
        setPassword(attackPassword)

        try {
            const [baseline, vulnerable] = await Promise.all([
                runSingleLogin(
                    'baseline',
                    attackUsername,
                    attackPassword
                ),
                runSingleLogin(
                    'vulnerable',
                    attackUsername,
                    attackPassword
                ),
            ])

            setBaselineResult(baseline)
            setVulnerableResult(vulnerable)
            setEventRefreshKey((current) => current + 1)
        } catch (error) {
            console.error('LAB 01 공격 재현 실패:', error)

            const errorResult = {
                mode: 'ERROR',
                success: false,
                message: '백엔드 서버에 연결할 수 없습니다.',
            }

            setBaselineResult(errorResult)
            setVulnerableResult(errorResult)
        } finally {
            setLoading(false)
        }
    }

    const attackFinished =
        experimentStage === 'attack' &&
        baselineResult !== null &&
        vulnerableResult !== null

    const bypassDetected =
        attackFinished &&
        baselineResult.success === false &&
        vulnerableResult.success === true

    const runRetest = async () => {
        setRetestLoading(true)
        setDefendedResult(null)

        const attackUsername = "alice' OR '1'='1' -- "
        const attackPassword = 'wrong'

        setUsername(attackUsername)
        setPassword(attackPassword)

        try {
            const [vulnerable, defended] = await Promise.all([
                runSingleLogin(
                    'vulnerable',
                    attackUsername,
                    attackPassword
                ),
                runSingleLogin(
                    'defended',
                    attackUsername,
                    attackPassword
                ),
            ])

            setVulnerableResult(vulnerable)
            setDefendedResult(defended)

            setEventRefreshKey((current) => current + 1)
        } catch (error) {
            console.error('재검증 실패:', error)
        } finally {
            setRetestLoading(false)
        }
    }

    return (
        <section
            className="sql-experiment notranslate"
            translate="no"
        >
            <div className="experiment-title">
                <div>
                    <span className="section-label">
                        LAB 01 실험
                    </span>

                    <h2>SQL Injection 실험</h2>
                </div>

                <p>
                    정상 상태를 확인한 뒤 공격을 재현하고,
                    발생한 결과와 원인을 단계별로 확인합니다.
                </p>
            </div>

            <div className="experiment-dashboard">

                {/* 01 정상 상태 */}
                <div className="dashboard-panel baseline-panel">
                    <div className="panel-heading">
                        <span className="panel-number">01</span>

                        <div>
                            <h3>정상 상태</h3>

                            <p>
                                공격 전에 정상적인 로그인 기능이
                                동작하는지 먼저 확인합니다.
                            </p>
                        </div>
                    </div>

                    <div className="normal-state-content">
                        <div className="login-form">
                            <label>
                                사용자 이름
                                <input
                                    type="text"
                                    value="alice"
                                    readOnly
                                />
                            </label>

                            <label>
                                비밀번호
                                <input
                                    type="text"
                                    value="test123"
                                    readOnly
                                />
                            </label>
                        </div>

                        <div className="sql-query-block safe">
                            <div className="query-title">
                                <span className="status-dot safe-dot" />
                                <strong>안전한 SQL 처리</strong>
                            </div>

                            <p>
                                사용자 입력을 SQL 명령과 분리하여
                                데이터로 처리합니다.
                            </p>

                            <code>
                                SELECT * FROM lab_users
                                <br />
                                WHERE username = ?
                                <br />
                                AND password = ?
                            </code>

                            <div className="query-summary safe-summary">
                                입력값 = 데이터
                            </div>
                        </div>

                        <button
                            type="button"
                            className="compare-button"
                            disabled={loading}
                            onClick={runBaselineTest}
                        >
                            {loading &&
                            experimentStage === 'baseline'
                                ? '정상 상태 확인 중...'
                                : '정상 상태 확인'}
                        </button>

                        {experimentStage === 'baseline' &&
                            baselineResult && (
                                <div
                                    className={
                                        baselineResult.success
                                            ? 'experiment-conclusion normal-conclusion'
                                            : 'experiment-conclusion neutral-conclusion'
                                    }
                                >
                                    <strong>
                                        {baselineResult.success
                                            ? '정상 로그인 확인'
                                            : '정상 로그인 실패'}
                                    </strong>

                                    <p>
                                        {baselineResult.success
                                            ? '올바른 계정 정보로 정상적인 인증이 수행되었습니다.'
                                            : baselineResult.message}
                                    </p>
                                </div>
                            )}
                    </div>
                </div>

                {/* 02 공격 재현 */}
                <div className="dashboard-panel attack-panel">
                    <div className="panel-heading">
                        <span className="panel-number">02</span>

                        <div>
                            <h3>공격 재현</h3>

                            <p>
                                동일한 SQL Injection 입력을 안전한 처리와
                                취약한 처리에 전달하여 결과를 비교합니다.
                            </p>
                        </div>
                    </div>

                    <div className="attack-input-box">
                        <span>SQL Injection 실험값</span>

                        <code>
                            alice&apos; OR &apos;1&apos;=&apos;1&apos; --
                        </code>

                        <span>비밀번호: wrong</span>
                    </div>

                    <div className="query-comparison">
                        <div className="sql-query-block safe">
                            <div className="query-title">
                                <span className="status-dot safe-dot" />

                                <strong>안전한 처리</strong>
                            </div>

                            <p>
                                공격 문자열을 SQL 명령이 아닌
                                데이터로 취급합니다.
                            </p>

                            <code>
                                SELECT * FROM lab_users
                                <br />
                                WHERE username = ?
                                <br />
                                AND password = ?
                            </code>

                            <div className="query-summary safe-summary">
                                SQL 구조 변경 불가
                            </div>
                        </div>

                        <div className="sql-query-block vulnerable">
                            <div className="query-title">
                                <span className="status-dot danger-dot" />

                                <strong>취약한 처리</strong>
                            </div>

                            <p>
                                사용자 입력을 SQL 문자열에
                                직접 연결합니다.
                            </p>

                            <code>
                                SELECT * FROM lab_users
                                <br />
                                WHERE username = '{username}'
                                <br />
                                AND password = '{password}'
                            </code>

                            <div className="query-summary danger-summary">
                                입력값이 SQL 구조에 영향을 줄 수 있음
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="compare-button"
                        disabled={loading}
                        onClick={runAttackTest}
                    >
                        {loading &&
                        experimentStage === 'attack'
                            ? '공격 재현 중...'
                            : 'SQL Injection 공격 재현'}
                    </button>

                    {attackFinished && (
                        <div className="comparison-results">
                            <div className="comparison-card safe-result">
                                <span className="comparison-label">
                                    안전한 처리
                                </span>

                                <strong
                                    className={
                                        baselineResult.success
                                            ? 'login-success'
                                            : 'login-failed'
                                    }
                                >
                                    {baselineResult.success
                                        ? '로그인 성공'
                                        : '로그인 실패'}
                                </strong>

                                <p>{baselineResult.message}</p>
                            </div>

                            <div className="comparison-arrow">
                                VS
                            </div>

                            <div className="comparison-card vulnerable-result">
                                <span className="comparison-label">
                                    취약한 처리
                                </span>

                                <strong
                                    className={
                                        vulnerableResult.success
                                            ? 'login-success'
                                            : 'login-failed'
                                    }
                                >
                                    {vulnerableResult.success
                                        ? '로그인 성공'
                                        : '로그인 실패'}
                                </strong>

                                <p>{vulnerableResult.message}</p>
                            </div>
                        </div>
                    )}

                    {bypassDetected && (
                        <div className="experiment-conclusion danger-conclusion">
                            <strong>인증 우회 발생</strong>

                            <p>
                                같은 공격 입력을 사용했지만 안전한
                                처리에서는 인증에 실패하고, 취약한
                                처리에서는 인증에 성공했습니다.
                            </p>
                        </div>
                    )}

                    {attackFinished && !bypassDetected && (
                        <div className="experiment-conclusion neutral-conclusion">
                            <strong>
                                인증 우회가 확인되지 않았습니다
                            </strong>

                            <p>
                                두 방식의 결과와 서버의 SQL 처리
                                상태를 확인합니다.
                            </p>
                        </div>
                    )}
                </div>

                {/* 03 결과 관찰 */}
                <div className="dashboard-panel observation-panel">
                    <div className="panel-heading">
                        <span className="panel-number">03</span>

                        <div>
                            <h3>결과 관찰</h3>

                            <p>
                                공격 과정에서 시스템에 발생한
                                보안 이벤트를 확인합니다.
                            </p>
                        </div>
                    </div>

                    {/* 보안 이벤트 수집 API 연결 준비 완료*/}
                    <SecurityEventPanel refreshKey={eventRefreshKey} />

                </div>

                {/* 04 원인 분석 */}
                <div className="dashboard-panel analysis-panel">
                    <div className="panel-heading">
                        <span className="panel-number">04</span>

                        <div>
                            <h3>원인 분석</h3>

                            <p>
                                동일한 공격 입력에서 인증 결과가
                                달라진 원인을 분석합니다.
                            </p>
                        </div>
                    </div>

                    <div className="interpretation-grid">
                        <div>
                            <strong>안전한 처리</strong>

                            <p>
                                공격 문자열 전체를 사용자 이름이라는
                                하나의 데이터로 취급합니다.
                            </p>

                            <span>
                                공격값 → 데이터 처리 → 사용자 불일치
                                → 인증 실패
                            </span>
                        </div>

                        <div>
                            <strong>취약한 처리</strong>

                            <p>
                                사용자 입력이 SQL 문자열에 직접 들어가
                                SQL 조건 자체에 영향을 줄 수 있습니다.
                            </p>

                            {vulnerableResult?.executedSql && (
                                <div className="executed-sql-box">
                                    <span>실제 실행된 SQL</span>

                                    <code>
                                        {vulnerableResult.executedSql}
                                    </code>
                                </div>
                            )}

                            <span>
                                공격값 → SQL 조건 변경 → 인증 조건 영향
                                → 인증 우회
                            </span>
                        </div>
                    </div>

                    {bypassDetected && (
                        <div className="experiment-conclusion danger-conclusion">
                            <strong>원인 확인</strong>

                            <p>
                                네트워크나 데이터베이스에 직접 접근한 것이
                                아니라, 애플리케이션이 허용받은 데이터베이스
                                연결 경로에서 취약한 SQL 처리 방식이
                                악용되었습니다.
                            </p>
                        </div>
                    )}
                </div>

                {/*05 방어적용*/}
                <section className="dashboard-panel defense-panel">
                    <div className="panel-heading">
                        <span className="panel-number">05</span>

                        <div>
                            <h3>방어 적용</h3>
                            <p>
                                원인 분석을 바탕으로 SQL 처리 방식을
                                Parameterized Query로 변경합니다.
                            </p>
                        </div>
                    </div>

                    <div className="defense-flow">
                        <div className="defense-step defense-before">
                            <span>취약 원인</span>

                            <strong>문자열 직접 결합</strong>

                            <code>
                                {'"WHERE username = \'" + username + "\'"'}
                            </code>

                            <p>
                                사용자 입력이 SQL 문장의 구조에
                                영향을 줄 수 있습니다.
                            </p>
                        </div>

                        <div className="defense-arrow">
                            →
                        </div>

                        <div className="defense-step defense-after">
                            <span>방어 적용</span>

                            <strong>Parameterized Query</strong>

                            <code>
                                {'WHERE username = ? AND password = ?'}
                            </code>

                            <p>
                                SQL 명령과 사용자 입력 데이터를
                                분리하여 처리합니다.
                            </p>
                        </div>
                    </div>

                    <div className="defense-summary">
                        <strong>변경 핵심</strong>

                        <p>
                            공격 문자열 자체를 차단하는 것이 아니라,
                            사용자 입력이 SQL 명령으로 해석되지 않도록
                            SQL 처리 구조를 변경했습니다.
                        </p>
                    </div>
                </section>

                {/*06 재검증*/}
                <section className="dashboard-panel revalidation-panel">
                    <div className="panel-heading">
                        <span className="panel-number">06</span>

                        <div>
                            <h3>재검증</h3>
                            <p>
                                방어 전과 방어 후에 동일한 SQL Injection Payload를
                                다시 전송하여 결과를 비교합니다.
                            </p>
                        </div>
                    </div>

                    <div className="retest-payload">
                        <span>동일 공격 Payload</span>

                        <code>
                            {"alice' OR '1'='1' -- "}
                        </code>

                        <button
                            type="button"
                            className="retest-button"
                            onClick={runRetest}
                            disabled={retestLoading}
                        >
                            {retestLoading
                                ? '재검증 중...'
                                : '동일 조건으로 재공격'}
                        </button>
                    </div>

                    {vulnerableResult && defendedResult ? (
                        <>
                            <div className="retest-results">
                                <div className="retest-card retest-before">
                                    <span>방어 전 · VULNERABLE</span>

                                    <strong
                                        className={
                                            vulnerableResult.success
                                                ? 'login-failed'
                                                : 'login-success'
                                        }
                                    >
                                        {vulnerableResult.success
                                            ? '인증 우회 성공'
                                            : '인증 우회 실패'}
                                    </strong>

                                    <p>
                                        취약한 SQL 문자열 결합 방식을 사용한 결과
                                    </p>
                                </div>

                                <div className="retest-arrow">
                                    →
                                </div>

                                <div className="retest-card retest-after">
                                    <span>방어 후 · DEFENDED</span>

                                    <strong
                                        className={
                                            defendedResult.success
                                                ? 'login-failed'
                                                : 'login-success'
                                        }
                                    >
                                        {defendedResult.success
                                            ? '인증 우회 성공'
                                            : '인증 우회 차단'}
                                    </strong>

                                    <p>
                                        Parameterized Query를 적용한 결과
                                    </p>
                                </div>
                            </div>

                            {!defendedResult.success &&
                                vulnerableResult.success && (
                                    <div className="retest-conclusion">
                                        <strong>방어 검증 성공</strong>

                                        <p>
                                            동일한 공격 Payload를 사용했지만,
                                            Parameterized Query 적용 후에는
                                            인증 우회가 발생하지 않았습니다.
                                        </p>
                                    </div>
                                )}
                        </>
                    ) : (
                        <div className="empty-result">
                            동일 조건으로 재공격하여 방어 적용 전·후 결과를
                            비교합니다.
                        </div>
                    )}
                </section>

            </div>
        </section>
    )
}

export default SqlInjectionExperiment