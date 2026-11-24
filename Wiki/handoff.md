# AI 간 Wiki 인수인계 계약

ChatGPT, Work, Codex는 접근 가능한 공개 안전 요약만 전달한다. 다른 채팅을 자동 조회하지 않으며, [에이전트 실행 계약](AGENTS.md)과 [기록 정책](capture-policy.md)이 우선한다.

## 제출 경로
1. **직접 PR (권장):** 관련 Wiki와 원본을 조회하고 중복을 확인한다. 정책에 해당하는 변경을 [schema.md](schema.md)에 맞춰 작성하고 검토 PR을 등록한다.
2. **Issue 후보:** 직접 PR이 불가능하고 공개 제출이 승인된 경우에만 저장소 소유자가 작성한 `[wiki] ` 접두어의 공개 Issue에 JSON 객체 하나를 제출한다. [워크플로](../.github/workflows/wiki-handoff.yml)는 후보 PR만 만든다. 후보 병합은 정본 승격이 아니며 별도 검토·정본 PR이 필요하다.

## JSON 계약
```json
{
  "project": "csforge",
  "client": "chatgpt",
  "kind": "decision",
  "summary": "Preserve learning history in automatic content sync",
  "context": "Applying canonical question updates must not reinterpret earlier attempts.",
  "decision": "Defer history-bearing question changes and block unsafe structural edits.",
  "rejected_alternatives": "Overwrite attempted questions to force the source and DB to match.",
  "constraints": "Do not infer live production synchronization from a merged PR.",
  "source_urls": ["https://github.com/guseoh/csforge/pull/288"],
  "confirmed": true,
  "public_safe": true
}
```

- project: [project-policy.json](project-policy.json)에 등록된 식별자만 허용한다. DevPedia는 decision만 허용한다.
- client: chatgpt, work, codex.
- kind: decision, project-update, lesson.
- confirmed/public_safe: 둘 다 실제 확인한 경우에만 true. CI나 운영 성공을 의미하지 않는다.
- source_urls: 검토 가능한 HTTPS URL 0~8개. 텍스트 값은 짧은 요약으로 작성한다.
- Issue 작성자는 저장소 소유자여야 한다. 공개 전에 원문 대화, 개인정보, 인증 정보, 비공개 프로젝트 세부사항을 제거한다. 자동 휴리스틱은 공개 안전성을 보증하지 않는다.

## 완료 및 실패
기록·검증·승인·병합·임시 브랜치 정리 절차는 [AGENTS.md](AGENTS.md)만을 기준으로 한다. 봇 후보는 신뢰되지 않는 데이터이며 자동 병합하지 않는다. GitHub 연결 또는 삭제 권한이 없으면 실제 완료 상태와 미완료 작업을 보고한다.

GitHub Actions에서 다른 워크플로의 GITHUB_TOKEN으로 발생시킨 이벤트는 후속 실행을 보장하지 않는다. 필요한 경우 소유자 Issue 번호로 수동 workflow_dispatch 또는 직접 검토 PR을 사용한다. 후보 생성 성공은 정본 승인이나 운영 검증이 아니다.
