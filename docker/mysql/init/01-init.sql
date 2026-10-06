CREATE DATABASE IF NOT EXISTS security_lab;

USE security_lab;

CREATE TABLE lab_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,

    -- [LAB ONLY]
    -- SQL Injection 실험에서 DB 조회 결과를 직관적으로 확인하기 위해
    -- 비밀번호를 단순 문자열로 저장한다.
    --
    -- 실제 서비스에서는 평문 비밀번호를 저장하면 안 되며,
    -- BCrypt 등의 단방향 해시를 사용해야 한다.
    password VARCHAR(100) NOT NULL,

    role VARCHAR(20) NOT NULL
);

-- [LAB ONLY]
-- 아래 계정은 Cloud Security Lab에서만 사용하는 가짜 실험 데이터다.
-- 실제 사용자 정보나 실제 비밀번호를 사용하지 않는다.
INSERT INTO lab_users (username, password, role)
VALUES
    ('alice', 'test123', 'USER'),
    ('bob', 'hello456', 'USER'),
    ('admin', 'labadmin', 'ADMIN');