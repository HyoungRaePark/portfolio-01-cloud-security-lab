package com.cloudsecuritylab.controller;

import com.cloudsecuritylab.dto.LabLoginRequest;
import com.cloudsecuritylab.event.SecurityEventService;
import com.cloudsecuritylab.repository.LabUserRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/labs/1")
@CrossOrigin(origins = "http://localhost:5173")
public class SqlInjectionLabController {

    private final LabUserRepository labUserRepository;
    private final SecurityEventService securityEventService;

    public SqlInjectionLabController(
            LabUserRepository labUserRepository,
            SecurityEventService securityEventService
    ) {
        this.labUserRepository = labUserRepository;
        this.securityEventService = securityEventService;
    }

    @GetMapping("/baseline/users")
    public List<Map<String, Object>> getBaselineUsers() {

        // [BASELINE]
        // 공격 실험 전 DB 연결과 정상 조회 동작을 검증하기 위한 API다.
        return labUserRepository.findAll();
    }

    @PostMapping("/baseline/login")
    public Map<String, Object> baselineLogin(
            @RequestBody LabLoginRequest request
    ) {

        // [BASELINE]
        // 입력값을 안전한 방식으로 처리한 로그인 결과를 확인한다.
        boolean success = labUserRepository.baselineLogin(
                request.username(),
                request.password()
        );

        return Map.of(
                "lab", "LAB 01",
                "mode", "BASELINE",
                "success", success,
                "message", success
                        ? "Login successful"
                        : "Invalid username or password"
        );
    }

    @PostMapping("/vulnerable/login")
    public Map<String, Object> vulnerableLogin(
            @RequestBody LabLoginRequest request
    ) {

        /*
         * [LAB ONLY - INTENTIONALLY VULNERABLE]
         *
         * LAB 01 SQL Injection 실험 전용 Endpoint.
         * 실제 인증 시스템과 분리된 가짜 사용자 데이터만 대상으로 한다.
         */

        boolean success = labUserRepository.vulnerableLogin(
                request.username(),
                request.password()
        );

        /*
         * 현재 LAB에서 사용하는 SQL Injection 실험값인지 확인한다.
         *
         * 일반 로그인 성공과 공격에 의한 인증 우회를
         * 구분하기 위한 LAB 전용 판별이다.
         */
        boolean attackPayload =
                request.username() != null &&
                        request.username().contains("' OR '1'='1'");

        /*
         * 공격 입력을 사용했고,
         * 취약한 로그인에서 인증까지 성공한 경우에만
         * SQL Injection 인증 우회 이벤트를 기록한다.
         */
        if (attackPayload && success) {

            securityEventService.createEvent(
                    "SQL_INJECTION",
                    "LAB_01",
                    "/api/labs/1/vulnerable/login",
                    "HIGH",
                    "AUTH_BYPASS_SUCCESS"
            );
        }

        String executedSql = labUserRepository.buildVulnerableSql(
                request.username(),
                request.password()
        );

        return Map.of(
                "lab", "LAB 01",
                "mode", "VULNERABLE",
                "success", success,
                "message", success
                        ? "Login successful"
                        : "Invalid username or password",
                "executedSql", executedSql
        );
    }

    @PostMapping("/defended/login")
    public Map<String, Object> defendedLogin(
            @RequestBody LabLoginRequest request
    ) {

        boolean success = labUserRepository.defendedLogin(
                request.username(),
                request.password()
        );

        return Map.of(
                "lab", "LAB 01",
                "mode", "DEFENDED",
                "success", success,
                "message", success
                        ? "Login successful"
                        : "Invalid username or password"
        );
    }
}