package com.cloudsecuritylab.dto;

public record LabLoginRequest(
        String username,
        String password
) {
    // [LAB ONLY]
    // LAB 01에서 SQL 입력값의 처리 방식을 비교하기 위한 단순 DTO다.
    //
    // 실제 서비스 인증 시스템에서는 입력 검증, 인증 정책,
    // 비밀번호 해시 검증 등의 추가 보안 처리가 필요하다.
}