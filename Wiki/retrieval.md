# Wiki 검색과 근거 확인

1. [Wiki 인덱스](index.md)에서 프로젝트를 찾고 스냅샷의 확인 날짜와 범위를 읽는다.
2. 질문에 맞는 결정, 교훈, 이력의 ID를 조회한다. 결정의 배경과 대안은 해당 기록 본문에서 확인한다.
3. `depends_on`은 전제, `supersedes`는 대체, `related_to`는 맥락이다. 대체 기록을 읽을 때 화살표 방향을 확인한다.
4. 근거 링크를 열고 소스·병합·CI·배포·실사용의 검증 범위를 각각 표시한다. 확인일이 오래됐으면 현재 상태를 다시 대조한다.
5. 공개 가능한 새 사실을 반영하려면 [handoff 계약](handoff.md)과 [기록 정책](capture-policy.md)을 따른다.

| 확인할 질문 | 출발점 |
| --- | --- |
| 선택 이유와 대안 | [WIKI-0002](decisions/WIKI-0002.md), [BLR-0012](decisions/BLR-0012.md) |
| 과거 실패와 해결 | [PWL-0010](lessons/PWL-0010.md) |
| 대체된 결정 | [PWC-0013](decisions/PWC-0013.md) → [PWC-0011](decisions/PWC-0011.md) |
| 마지막으로 확인한 상태 | [PRJ-LLM-WIKI](projects/llm-wiki.md)와 공개 실행 내역 |
| 포트폴리오에 설명할 설계 근거 | [PWC-0130](decisions/PWC-0130.md)의 배경·대안·출처 |

## 로컬 클론에서 실행

```bash
python scripts/wiki_query.py search "OCI Always Free 장기 운영" --project pawcycle
python scripts/wiki_query.py relations PWC-0013
python scripts/wiki_query.py audit
python scripts/wiki_query.py evaluate
```

검색기는 Markdown 인덱스, 제목, 본문을 사용하고 ID를 직접 찾는다. 관계 명령의 JSON 출력은 원본을 수정하지 않으며, 인접한 들어오는·나가는 관계를 확인하거나 인수인계 자료에 활용할 수 있다. `audit`의 중복 후보는 같은 프로젝트의 정규화된 제목을 비교한 결과다. 오래된 스냅샷은 `updated_at`으로 고르는 검토 후보다. 각 후보는 [출처](schema.md)를 대조한 다음 수정 여부를 판단한다.

[검색 회귀 사례](search-cases.json)는 대상 ID, 상태, 근거 문구를 확인한다. 이 평가는 고정된 질의의 후보 탐색을 검증한다. 외부 출처의 현재 가용성과 각 서비스의 답변 정확도는 별도로 확인해야 한다.

## 클라이언트에서 읽기

| 클라이언트 | 접근 경로 |
| --- | --- |
| ChatGPT | GitHub 연결 또는 접근 가능한 공개 [Wiki 인덱스](https://github.com/guseoh/cs/blob/main/Wiki/index.md) |
| Codex | 최신 Git 작업 복사본에서 `Wiki/index.md`와 관련 원문, 필요 시 위 CLI |
| Claude | 허용된 GitHub 연결 또는 로컬 클론에서 같은 인덱스·기록·출처 |

공통 요청 예시: “최신 `main`의 Wiki 인덱스에서 프로젝트와 관련 ID를 찾고 근거를 읽어줘. 대체 관계, 결정 상태, 확인 날짜를 명시하고 실제 운영 확인 여부를 구분해줘.” 권한이나 연결이 없는 클라이언트는 접근 가능한 원문을 명시하고 이전 대화에서 검색 결과를 추정하지 않는다.

Obsidian에서 [Wiki 결정 탐색 Base](decision-dashboard.base)를 열면 프로젝트별 결정, 관계, 최근 갱신 및 재확인 후보를 볼 수 있다. 편집은 해당 노트와 기존 리뷰 절차에서 이뤄진다.
