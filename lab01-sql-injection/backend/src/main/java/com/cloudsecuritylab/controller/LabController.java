package com.cloudsecuritylab.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class LabController {

    private final List<Map<String, Object>> labs = List.of(
            Map.of(
                    "id", 1,
                    "code", "LAB 01",
                    "title", "SQL Injection",
                    "layer", "Database",
                    "description", "사용자 입력이 SQL Query에 직접 반영될 때 발생하는 보안 문제를 실험합니다."
            ),
            Map.of(
                    "id", 2,
                    "code", "LAB 02",
                    "title", "XSS",
                    "layer", "Browser / Client",
                    "description", "사용자 입력이 브라우저에서 실행되는 과정을 실험합니다."
            ),
            Map.of(
                    "id", 3,
                    "code", "LAB 03",
                    "title", "Brute Force",
                    "layer", "Authentication",
                    "description", "반복적인 인증 요청이 인증 시스템에 미치는 영향을 실험합니다."
            ),
            Map.of(
                    "id", 4,
                    "code", "LAB 04",
                    "title", "SSRF",
                    "layer", "Server / Internal Network",
                    "description", "서버가 내부 네트워크 요청을 대신 수행하는 보안 문제를 실험합니다."
            ),
            Map.of(
                    "id", 5,
                    "code", "LAB 05",
                    "title", "Availability",
                    "layer", "Infrastructure / Resource",
                    "description", "통제된 부하를 통해 시스템 자원과 가용성 변화를 관찰합니다."
            )
    );

    @GetMapping("/api/labs")
    public List<Map<String, Object>> getLabs() {
        return labs;
    }

    @GetMapping("/api/labs/{id}")
    public Map<String, Object> getLab(@PathVariable int id) {

        return labs.stream()
                .filter(lab -> (int) lab.get("id") == id)
                .findFirst()
                .orElseThrow();
    }
}