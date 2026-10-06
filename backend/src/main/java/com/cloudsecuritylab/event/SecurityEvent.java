package com.cloudsecuritylab.event;

import java.time.LocalDateTime;

public class SecurityEvent {

    private Long eventId;
    private String eventType;
    private String source;
    private String target;
    private String severity;
    private String result;
    private LocalDateTime timestamp;

    public SecurityEvent(
            Long eventId,
            String eventType,
            String source,
            String target,
            String severity,
            String result,
            LocalDateTime timestamp
    ) {
        this.eventId = eventId;
        this.eventType = eventType;
        this.source = source;
        this.target = target;
        this.severity = severity;
        this.result = result;
        this.timestamp = timestamp;
    }

    public Long getEventId() {
        return eventId;
    }

    public String getEventType() {
        return eventType;
    }

    public String getSource() {
        return source;
    }

    public String getTarget() {
        return target;
    }

    public String getSeverity() {
        return severity;
    }

    public String getResult() {
        return result;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}