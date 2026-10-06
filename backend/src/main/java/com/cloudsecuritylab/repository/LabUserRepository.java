package com.cloudsecuritylab.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class LabUserRepository {

    private final JdbcTemplate jdbcTemplate;

    public LabUserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findAll() {

        // [BASELINE]
        // LAB 01의 공격 실험을 시작하기 전에
        // Spring Boot → MySQL의 정상적인 조회가 가능한지 확인하기 위한 Query다.
        //
        // 현재 Query에는 사용자 입력값이 포함되지 않으므로
        // SQL Injection 실험용 취약 Query가 아니다.
        String sql = """
                SELECT id, username, role
                FROM lab_users
                ORDER BY id
                """;

        return jdbcTemplate.queryForList(sql);
    }

    public boolean baselineLogin(String username, String password) {

        // [BASELINE / SECURITY]
        // 공격 실험 전 정상적인 로그인 동작을 확인하기 위한 Query다.
        //
        // 사용자 입력값을 SQL 문자열에 직접 이어 붙이지 않고
        // ? Placeholder를 사용하여 Query와 데이터를 분리한다.
        //
        // 이후 LAB ONLY 취약 구현에서는 의도적으로 이 원칙을 깨뜨려
        // SQL Injection 발생 과정을 비교한다.
        String sql = """
            SELECT COUNT(*)
            FROM lab_users
            WHERE username = ?
              AND password = ?
            """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                username,
                password
        );

        return count != null && count > 0;
    }


    public boolean defendedLogin(String username, String password) {

        /*
         * [DEFENSE]
         *
         * 사용자 입력값을 SQL 문자열에 직접 연결하지 않고
         * Placeholder를 사용하여 SQL 명령과 데이터를 분리한다.
         *
         * LAB 01에서 확인한 SQL Injection의 원인인
         * 문자열 직접 결합을 제거한 방어 구현이다.
         */

        String sql = """
            SELECT COUNT(*)
            FROM lab_users
            WHERE username = ?
              AND password = ?
            """;

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class,
                username,
                password
        );

        return count != null && count > 0;
    }


    public String buildVulnerableSql(
            String username,
            String password
    ) {
        return "SELECT COUNT(*) FROM lab_users " +
                "WHERE username = '" + username + "' " +
                "AND password = '" + password + "'";
    }

    public boolean vulnerableLogin(String username, String password) {

        /*
         * [LAB ONLY - INTENTIONALLY VULNERABLE]
         *
         * SQL Injection이 발생하는 원리를 관찰하기 위해
         * 사용자 입력값을 SQL 문자열에 직접 연결한다.
         *
         * 절대로 실제 서비스에서 사용하면 안 된다.
         *
         * [PRODUCTION]
         * 실제 서비스에서는 PreparedStatement / Parameterized Query를 사용해
         * SQL 명령과 사용자 입력 데이터를 분리해야 한다.
         */

        String sql = buildVulnerableSql(username, password);

        // [LAB ONLY]
        // 실제로 어떤 SQL 문장이 만들어졌는지 터미널에서 관찰하기 위한 로그다.
        // 실제 서비스에서는 비밀번호 등 민감한 입력값을 로그에 기록하면 안 된다.
        System.out.println("[LAB 01][VULNERABLE SQL] " + sql);

        Integer count = jdbcTemplate.queryForObject(
                sql,
                Integer.class
        );

        return count != null && count > 0;
    }

}