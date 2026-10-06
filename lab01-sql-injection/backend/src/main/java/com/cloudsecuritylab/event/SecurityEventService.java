package com.cloudsecuritylab.event;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class SecurityEventService {

    private final List<SecurityEvent> events = new ArrayList<>();
    private final AtomicLong eventIdGenerator = new AtomicLong(1);

    public SecurityEvent createEvent(
            String eventType,
            String source,
            String target,
            String severity,
            String result
    ) {
        SecurityEvent event = new SecurityEvent(
                eventIdGenerator.getAndIncrement(),
                eventType,
                source,
                target,
                severity,
                result,
                LocalDateTime.now()
        );

        events.add(event);

        return event;
    }

    public List<SecurityEvent> getEvents() {
        return new ArrayList<>(events);
    }

    public void clearEvents() {
        events.clear();
    }
}