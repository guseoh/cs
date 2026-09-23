---
category: Performance
status: 진행중
tags:
  - Study
  - Performance
---

# Performance Engineering 학습 로드맵

이 디렉터리는 PawCycle 작업 로그를 옮겨 놓는 곳이 아니다. 특정 프로젝트를 떠나 Java/Spring 백엔드 개발자가 성능 문제를 설계하고 측정하고 분석할 때 다시 꺼내 볼 수 있는 **독립 학습 자료**다.

성능은 “Redis를 붙이면 빨라진다”, “Connection Pool을 늘리면 처리량이 오른다” 같은 기술 목록으로 공부하면 금방 막힌다. 실제 문제는 어떤 자원이 한계에 도달했는지, 요청이 어디에서 기다리는지, 측정 결과가 정말 변경의 효과인지 증명하는 일이다.

이 시리즈는 다음 흐름으로 진행한다.

~~~text
성능 요구 정의
→ 기준선과 실험 조건
→ 부하 모델
→ 결과 지표와 내부 지표
→ OS / Container
→ JVM / GC / Native Memory
→ Tomcat / HikariCP / DB
→ Latency / Queueing / Tail
→ Observer Effect
→ Before / After
→ 데이터 규모와 분포
→ 최소 개선
→ 동일 조건 재측정
~~~

## 문서

1. [[01. 성능 엔지니어링과 기준선]]
2. [[02. 부하 테스트와 Workload Modeling]]
3. [[03. Observability와 계층별 병목 분리]]
4. [[04. Linux와 Container 성능 지표 읽기]]
5. [[05. JVM GC Thread Native Memory 성능]]
6. [[06. Tomcat HikariCP DB Queueing]]
7. [[07. Latency Percentile과 Tail Latency]]
8. [[08. Observer Effect와 Same-host Calibration]]
9. [[09. Before After와 성능 실험의 인과관계]]
10. [[10. 대규모 데이터 Volume Cardinality Distribution Skew]]
11. [[11. 국내 기술 블로그 성능 사례 지도]]
12. [[12. 성능 문제 분석 플레이북]]
13. [[13. 재현 가능한 성능 실험과 안전한 격리]]

실제 PawCycle 적용 과정은 [[../../Project/pawCycle/Performance/README|Project/pawCycle/Performance]]에서 분리해서 기록한다.

## 작성 기준 — 요약 메모가 아니라 설명글

이 디렉터리의 문서는 용어 사전이나 시험 직전 요약 노트처럼 작성하지 않는다. 사용자가 이 문서만 읽고도 개념이 왜 필요한지, 숫자를 어떻게 해석하는지, 어느 지점에서 잘못 판단하기 쉬운지까지 따라갈 수 있는 **설명형 학습 글**을 기준으로 한다.

새 용어나 지표가 등장하면 가능한 한 다음 흐름을 따른다.

~~~text
왜 이 개념이 필요한가
→ 쉬운 말로 무엇을 뜻하는가
→ 실제 숫자나 예시를 어떻게 읽는가
→ 비슷한 용어와 무엇이 다른가
→ 이 값 하나만 보면 왜 위험한가
→ 어떤 지표·계층과 같이 봐야 하는가
→ 실제 운영 사례에서는 어떻게 사용됐는가
→ 더 읽을 한글 자료는 무엇인가
~~~

예를 들어 p95를 설명할 때 “95%가 이 값 이하” 한 줄로 끝내지 않는다. 요청을 작은 응답 시간부터 정렬했을 때 어느 위치를 뜻하는지, p95가 200ms라면 남은 약 5%는 무엇을 의미하는지, 평균과 무엇이 다르고 p99·최대값·오류율을 왜 함께 보는지까지 설명한다.

용어는 **한글을 먼저 사용**한다. 영어가 공식 명칭이거나 검색에 필요한 경우 처음 등장할 때만 괄호로 보조한다.

~~~text
응답 시간(Latency)
처리량(Throughput)
고유값 수/고유도(Cardinality)
값의 분포(Distribution)
쏠림(Skew)
누락된 반복 실행(dropped iteration)
준비 구간(Warm-up)
~~~

JVM, GC, JPA, MySQL, Redis, Kafka, k6처럼 제품명·표준 기술명은 그대로 사용하되, 그 용어가 현재 문장에서 무엇을 뜻하는지는 한국어로 설명한다.

한 줄짜리 정의와 단어 나열을 본문 설명의 중심으로 사용하지 않는다. 짧은 표나 흐름도는 설명을 보조하는 용도이며, 앞뒤 문단에서 **왜 그 표를 보는지와 어떻게 읽는지**를 풀어서 쓴다.

자료는 가능하면 한국 기업 기술 블로그와 한글 공식 문서를 우선한다. 카카오, LINE/LY, NAVER D2, 우아한형제들, 올리브영 같은 실제 운영 사례를 개념 바로 아래에 연결하고, 필요한 경우 Grafana k6, MySQL, JVM 같은 공식 문서를 보조 근거로 사용한다.

## 읽는 기준

모든 지표를 외우는 것이 목표가 아니다. 각 장에서 다음 질문을 반복한다.

~~~text
이 지표는 무엇을 의미하는가?
왜 이 값이 증가하는가?
이 값 하나만 보고 결론내리면 왜 위험한가?
어떤 다른 지표와 같이 봐야 하는가?
어떤 실험으로 가설을 반증할 수 있는가?
~~~

## 국내 기술 글을 같이 읽는다

공식 문서는 정의와 사용법을 확인하기 좋지만 실제 운영에서 어떤 순서로 가설을 버리고 문제를 좁히는지까지 항상 보여 주지는 않는다. 그래서 다음 국내 기술 글을 각 장의 개념과 실제 사례에 연결한다.

- [LINE — 서버 사이드 테스트 자동화 여정 4](https://engineering.linecorp.com/ko/blog/server-side-test-automation-4/)
- [LINE — 서버 사이드 테스트 자동화 여정 5](https://engineering.linecorp.com/ko/blog/server-side-test-automation-5/)
- [카카오 — 메시징 서버의 스트레스 테스트 노하우](https://tech.kakao.com/posts/822)
- [우아한형제들 — 결제 시스템 성능, 부하, 스트레스 테스트](https://techblog.woowahan.com/2572/)
- [우아한형제들 — 신규 포인트 시스템 전환기 #2](https://techblog.woowahan.com/2588/)
- [NAVER D2 — 자바 애플리케이션 성능 튜닝의 도](https://d2.naver.com/helloworld/184615)
- [NAVER D2 — Garbage Collection 모니터링 방법](https://d2.naver.com/helloworld/6043)
- [NAVER D2 — Garbage Collection 튜닝](https://d2.naver.com/helloworld/37111)
- [LINE — messaging-hub 트러블 슈팅](https://engineering.linecorp.com/ko/blog/messaing-hub-troubleshooting/)
- [우아한형제들 — HikariCP Dead lock에서 벗어나기 이론편](https://techblog.woowahan.com/2664/)
- [우아한형제들 — HikariCP Dead lock에서 벗어나기 실전편](https://techblog.woowahan.com/2663/)
