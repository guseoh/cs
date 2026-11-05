# #301–#400 요청 완료 및 main 대조 — 2026-11-04

#301–#330의 기존 처리를 보존하고 #331–#400 70건을 번호순으로 추가 조사했다. 요청 범위 100건 전체에 원본별 판정이 있으며 현재 **400 완료 / 103 미완료 / 503 목록, 다음 #401**이다. 이번 재개분은 결정14개(PWC-0108–0121)·교훈5개(PWL-0043–0047)를 신규 등록했다.

Checkout 정확성/무효 측정/NO_CHANGE, Querydsl·topology·typed read 선택, T07 목표 개정, T09 구조 교정, T10 잠금/시간/fixture/CI 실패와 대체 PR, Runtime0 뒤 전체 closure, OCI 알림의 offline/live/health 경계, DTO.from 사용자 선호와 transaction 밖 물질화 한계를 연결했다. 원본 #334의 runner 리뷰 지적, #338/Seoul 실패, #378 Windows 중단 및 최종 reviewer gap, #397/#400 외부 review 부재를 남겼다.

원본 #331–#400의 변경파일747개를 manifest에 대조했다. 누락 patch 중 대형 Python4개는 원문·구조를 보충했고 이미지22개는 픽셀 재검증 없이 metadata/당시 보고로 제한한다. #503은 새 존재·Draft metadata만 추가했으며 상세 처리하지 않았다. 제품·운영·DB·Cloud·Secret·Provider·부하 실행은 없다. 원본 #401 이후의 closure 댓글 링크는 연결 근거이며 그 PR들의 독립 전수 완료를 뜻하지 않는다.

## 현재 main 대조의 범위

PawCycle main `caad5233269f52ccd31f6e93e54c77a464766b36`의 정확한 파일을 읽었다. [blob 목록](checkpoint-301-400.sources.json). BackendArchitectureTests는 ordinary Runtime JDBC0/isolated9를 요구한다. architecture current-state 절은 Application/API0·Persistence/API0·maintenance5KEEP·21Adapter KEEP와 source/guard 한계를 설명한다. 문서 말미의 closure recommendation DEFER는 #438 handoff 당시 문구이며 #339/#371의10월21일 사용자 공식 종료 댓글과 시점을 구분한다.

현재 InventoryService의 locking read+CAS, Checkout findResult의 무잠금 replay, Cleanup LocalDateTime/native4DML, SubscriptionFailure와 RecommendationView의 List.copyOf, CodeRabbit completed-summary 검증 코드 및 A1 capacity monitor 소스를 제한 대조했다. 이는 새 compile/test/운영 검증이 아니다. #400 이후 이미 변한 코드를 과거 구현 당시 상태로 덮어쓰지 않는다. cs main은 재개 시 `53758f5255185a0ccbd5fc93c5d70a9b2ab2c474`로 앞서 진행돼 있었고 기존 Draft branch를 보존했다. 병합 충돌을 검토 없이 main에 합치지 않는다.

## 대체 PR의 실제 blob 대조

| 원본 → 후속 | 핵심 대조 | 판정 |
| --- | --- | --- |
| #359 → #364 | 공유16중15blob동일, validator1차이와 test1추가 | T10핵심15 보존; 원본 미병합/후속 병합 |
| #366 → #367 | 공유3모두 변경, diagnostics test1추가 | 최종 요청별 반환 검증은 단순 같은 파일 복사가 아님 |
| #379 → #380 | 4중3동일,runbook1차이 | 알림 구현 보존·문서/CI 상태 차이 |
| #383 → #384 | 4중2동일,test/runbook2차이 | 최종 offline35와 초기33 구분 |

## 검증·재개

이번 변경은 Wiki에만 한정한다. 최종 Wiki validator·22개 도구 회귀·대장 연속성/manifest/Journal stable key와 exact HEAD GitHub CI를 별도로 확인한다. 원본 테스트/부하/OCI/Discord/DB는 실행하지 않았다. 다음 독립 source는 #401이다. #301–#330은 재처리하지 않았으며 기존 판정·불확실성을 보존했다.
