package com.cloudsecuritylab.event;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/security-events")
@CrossOrigin(origins = "http://localhost:5173")
public class SecurityEventController {

    private final SecurityEventService securityEventService;

    public SecurityEventController(
            SecurityEventService securityEventService
    ) {
        this.securityEventService = securityEventService;
    }

    @GetMapping
    public List<SecurityEvent> getEvents() {
        return securityEventService.getEvents();
    }

    @DeleteMapping
    public void clearEvents() {
        securityEventService.clearEvents();
    }
}