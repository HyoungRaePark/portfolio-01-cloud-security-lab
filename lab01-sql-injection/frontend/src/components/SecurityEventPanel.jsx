import { useEffect, useState } from 'react'
import '../css/SecurityEventPanel.css'

function SecurityEventPanel({ refreshKey = 0 }) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState(false)

    const loadEvents = async () => {
        setLoading(true)
        setError(false)

        try {
            const response = await fetch(
                'http://localhost:8080/api/security-events'
            )

            if (!response.ok) {
                throw new Error('보안 이벤트 조회 실패')
            }

            const data = await response.json()

            const lab01Events = data
                .filter((event) => event.source === 'LAB_01')
                .reverse()
                .slice(0, 5)

            setEvents(lab01Events)
        } catch (error) {
            console.error('보안 이벤트 조회 실패:', error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const clearEvents = async () => {
        const confirmed = window.confirm(
            '수집된 보안 이벤트 기록을 삭제하시겠습니까?'
        )

        if (!confirmed) {
            return
        }

        setDeleting(true)
        setError(false)

        try {
            const response = await fetch(
                'http://localhost:8080/api/security-events',
                {
                    method: 'DELETE',
                }
            )

            if (!response.ok) {
                throw new Error('보안 이벤트 삭제 실패')
            }

            setEvents([])
        } catch (error) {
            console.error('보안 이벤트 삭제 실패:', error)
            setError(true)
        } finally {
            setDeleting(false)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [refreshKey])

    const formatTime = (timestamp) => {
        if (!timestamp) {
            return '-'
        }

        return new Date(timestamp).toLocaleTimeString('ko-KR')
    }

    const formatResult = (result) => {
        if (result === 'AUTH_BYPASS_SUCCESS') {
            return '인증 우회 성공'
        }

        return result
    }

    return (
        <div className="security-event-panel">
            <div className="event-toolbar">
                <div>
                    <strong>최근 보안 이벤트</strong>
                    <span>최대 5건 표시</span>
                </div>

                <button
                    type="button"
                    className="event-delete-button"
                    onClick={clearEvents}
                    disabled={deleting || events.length === 0}
                >
                    {deleting ? '삭제 중...' : '기록 삭제'}
                </button>
            </div>

            {error && (
                <div className="event-message event-error">
                    보안 이벤트 처리 중 오류가 발생했습니다.
                </div>
            )}

            {!error && loading && (
                <div className="event-message">
                    보안 이벤트를 확인하고 있습니다.
                </div>
            )}

            {!error && !loading && events.length === 0 && (
                <div className="event-message">
                    아직 수집된 보안 이벤트가 없습니다.
                    공격 재현 후 이벤트가 이곳에 표시됩니다.
                </div>
            )}

            {!error && !loading && events.length > 0 && (
                <div className="event-table-wrapper">
                    <table className="event-table">
                        <thead>
                        <tr>
                            <th>발생 시각</th>
                            <th>이벤트</th>
                            <th>대상</th>
                            <th>위험도</th>
                            <th>결과</th>
                        </tr>
                        </thead>

                        <tbody>
                        {events.map((event) => (
                            <tr key={event.eventId}>
                                <td>
                                    {formatTime(event.timestamp)}
                                </td>

                                <td>
                                    <strong>
                                        {event.eventType}
                                    </strong>
                                </td>

                                <td>
                                    {event.target}
                                </td>

                                <td>
                                        <span
                                            className={`severity-badge severity-${event.severity?.toLowerCase()}`}
                                        >
                                            {event.severity}
                                        </span>
                                </td>

                                <td>
                                    {formatResult(event.result)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default SecurityEventPanel