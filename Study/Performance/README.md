---
category: Performance
status: 진행중
tags:
  - Study
  - Performance
  - Roadmap
---

# Performance Engineering 학습 로드맵

이 디렉터리는 성능 관련 용어를 짧게 외우기 위한 요약 노트가 아니다.

목표는 Java/Spring 백엔드 서비스를 실제로 측정하고 개선할 때 필요한 개념을 **원인과 결과의 흐름으로 이해할 수 있는 설명 자료**를 만드는 것이다.

예를 들어 p95는 “95%가 이 값 이하”라는 한 문장으로 끝내지 않는다. 요청 시간을 왜 분포로 봐야 하는지, 평균과 무엇이 다른지, p95가 올라가면 어떤 대기 원인을 의심할 수 있는지, 오류율과 실제 처리량을 왜 함께 봐야 하는지까지 연결한다.

HikariCP pending도 “Connection을 기다리는 수”라는 정의만 적지 않는다. 어떤 상황에서 pending이 생기는지, Query가 느릴 때와 Pool이 작을 때가 어떻게 다른지, Pool을 늘리면 왜 DB 부담이 더 커질 수 있는지까지 설명한다.

이런 방식으로 각 문서는 **읽은 뒤 실제 Metric과 성능 결과를 스스로 해석할 수 있는 수준**을 목표로 한다.

## Study와 PawCycle Project 기록의 역할

이 디렉터리의 Study 문서는 특정 프로젝트를 몰라도 이해할 수 있는 일반 성능 개념을 다룬다.

~~~text
Study/Performance

성능 개념
원리
내부 동작
지표 해석
실험 방법
참고 사례
~~~

PawCycle에서 실제로 어떤 명령을 실행했고 어떤 장애와 수정이 있었는지는 별도 프로젝트 기록에서 다룬다.

~~~text
Project/pawCycle/Performance

실제 문제
실제 코드와 인프라
실제 Issue / PR
실제 측정값
실제 실패와 트러블슈팅
판정과 남은 한계
~~~

두 문서는 연결되지만 같은 내용을 복사하지 않는다. Study에서는 개념 자체를 충분히 설명하고, Project에서는 PawCycle의 실제 수치와 선택이 왜 그렇게 해석됐는지를 기록한다.

PawCycle 기록:
- [[../../Project/pawCycle/Performance/README|Project/pawCycle/Performance]]

## 문서를 읽는 순서

### 01. 성능 엔지니어링과 기준선

[[01. 성능 엔지니어링과 기준선]]

성능을 단순히 빠르게 만드는 작업이 아니라 측정 가능한 문제로 바꾸는 과정부터 시작한다. 처리량과 응답 시간이 왜 다른지, 기준선이 숫자 하나가 아닌 이유, 부하·스트레스·순간 폭증 테스트의 목적 차이, 준비 구간과 임계값을 설명한다.

### 02. 부하 테스트와 요청 흐름 모델링

[[02. 부하 테스트와 Workload Modeling]]

RPS, TPS, 동시 처리 수, 가상 사용자, 생각 시간, 열린 부하 모델과 닫힌 부하 모델, 누락된 반복 실행을 설명하고 실제 사용자 행동을 부하 모델로 옮기는 방법을 다룬다.

### 03. 관측 가능성과 계층별 병목 분리

[[03. Observability와 계층별 병목 분리]]

Metric, Log, Trace의 역할을 구분하고 Host → JVM → Tomcat → HikariCP → DB의 시간축을 이용해 “느리다”를 원인 후보로 분해한다.

### 04. Linux와 Container 성능 지표 읽기

[[04. Linux와 Container 성능 지표 읽기]]

CPU의 us/sy/id/wa, Load Average, Run Queue, MemAvailable, RSS, Swap, cgroup, OOMKilled, File Descriptor, Disk I/O와 Network를 설명한다.

### 05. JVM, GC, Thread와 Native Memory

[[05. JVM GC Thread Native Memory 성능]]

Heap, Allocation Rate, Live Set, GC Pause, Thread State, Direct Memory, Metaspace, Code Cache 등 Java Process 내부 성능 지표를 연결한다.

### 06. Tomcat, HikariCP와 DB 대기 구조

[[06. Tomcat HikariCP DB Queueing]]

HTTP 요청이 Tomcat Thread를 거쳐 HikariCP Connection을 빌리고 MySQL까지 내려가는 흐름을 다룬다. active, idle, pending, acquire, lease, Queueing과 Pool Size의 관계를 설명한다.

### 07. 응답 시간 백분위와 꼬리 지연

[[07. Latency Percentile과 Tail Latency]]

p50, p95, p99, Max와 Tail Latency를 설명하고 일부 느린 요청이 Thread와 Connection 점유를 통해 전체 Queueing을 증폭하는 과정을 연결한다.

### 08. 관측자 효과와 같은 서버 보정 실험

[[08. Observer Effect와 Same-host Calibration]]

Prometheus와 Grafana 같은 관측 도구도 workload라는 점에서 출발해 ON → OFF → ON 보정, 퍼센트와 퍼센트포인트, Headroom, Scrape Interval을 설명한다.

### 09. Before/After와 성능 실험의 인과관계

[[09. Before After와 성능 실험의 인과관계]]

가설, 독립 변수, 종속 변수, 통제 변수, 교란 변수, 반복 측정과 동일 조건 재검증을 설명한다. “변경 뒤 좋아졌다”와 “그 변경 때문에 좋아졌다”를 구분하는 문서다.

### 10. 대규모 데이터의 양·관계·고유도·분포·쏠림

[[10. 대규모 데이터 Volume Cardinality Distribution Skew]]

Row 수뿐 아니라 부모-자식 관계, Fan-out, Cardinality, Selectivity, Distribution, Skew, Hot Data, 시간 분포와 Null 비율이 Query Plan과 실제 성능에 어떤 영향을 주는지 설명한다.

### 11. 국내 기술 블로그 성능 사례 지도

[[11. 국내 기술 블로그 성능 사례 지도]]

LINE, 카카오, NAVER D2, 우아한형제들, 올리브영 등의 성능·장애 사례를 단순 링크 목록으로 모으지 않고, 어떤 지표와 사고방식으로 문제를 좁혔는지 앞선 개념과 연결한다.

### 12. 성능 문제 분석 플레이북

[[12. 성능 문제 분석 플레이북]]

실제 성능 문제가 발생했을 때 테스트 유효성, 사용자 결과, Restart/OOM, Host/Container, JVM, Tomcat/HikariCP, Database 순으로 범위를 줄이는 방법을 설명한다.

### 13. 재현 가능한 성능 실험과 안전한 격리

[[13. 재현 가능한 성능 실험과 안전한 격리]]

Commit SHA, 불변 Source, Checksum, Provenance, Image Digest, 데이터 격리와 자원 격리, Loopback, SSH Local Forward, Fail-closed와 TOCTOU를 설명한다.

### 14. 단계적 부하 증가와 처리 용량 경계 판정

[[14. 단계적 부하 증가와 처리 용량 경계 판정]]

작은 부하에서 시작해 단계적으로 요청률을 올리는 이유, 목표 RPS와 실제 처리량, dropped iteration, p50은 유지되는데 p95·p99만 무너지는 현상, stop-on-fail과 처리 용량 경계 판정을 설명한다.

### 15. MySQL 실행 계획과 카디널리티 추정, Page-first 조회

[[15. MySQL 실행 계획과 카디널리티 추정, Page-first 조회]]

`LIMIT 20`이 있어도 왜 DB가 수많은 Join row를 먼저 처리할 수 있는지에서 시작한다.

`EXPLAIN FORMAT=TREE/JSON`, `EXPLAIN ANALYZE`의 차이, 데이터 고유도와 실행 계획의 행 수 추정, 선택도와 Histogram, Join Fan-out, temporary table, dependent subquery를 설명한다. 이어서 부모 Entity의 page를 먼저 결정한 뒤 child Join/Aggregate를 수행하는 Page-first 조회가 언제 효과적이고, 가격·평점처럼 child 계산값으로 정렬하는 경우 왜 같은 최적화를 바로 적용하면 안 되는지 다룬다.

## 문서 작성 방식

이 디렉터리에서는 용어를 한 줄로 정의하고 넘어가지 않는다.

새 개념이 현재 주제를 이해하는 데 필요하다면 다음 흐름으로 설명한다.

~~~text
왜 이 개념이 필요한가
→ 쉬운 말로 무엇을 뜻하는가
→ 내부에서는 어떻게 동작하는가
→ 실제 숫자나 코드는 어떻게 읽는가
→ 어떤 오해를 하기 쉬운가
→ 다른 지표와 어떻게 연결되는가
→ 실제 사례에서는 어떻게 사용되는가
~~~

모든 문서를 똑같은 목차로 만들 필요는 없다. 중요한 것은 독자가 별도 검색 없이 현재 주제의 핵심 흐름을 이해할 수 있을 정도로 설명하는 것이다.

## 한글을 먼저 사용한다

자연스러운 한글 표현이 있으면 먼저 쓰고 공식 용어나 검색에 필요한 영어를 괄호로 보조한다.

~~~text
응답 시간(Latency)
처리량(Throughput)
동시 처리 수(Concurrency)
고유값 수·고유도(Cardinality)
선택도(Selectivity)
값의 분포(Distribution)
쏠림(Skew)
준비 구간(Warm-up)
누락된 반복 실행(dropped iteration)
~~~

JVM, JPA, MySQL, Redis, Kafka, k6, Prometheus, Grafana처럼 제품명이나 표준 기술명은 유지한다. 이름만 던지지 않고 현재 문맥에서 무엇을 하는지 설명한다.

## 코드 블록과 표는 설명을 대신하지 않는다

표, SQL, 실행 계획, 흐름도는 복잡한 관계를 빠르게 보는 보조 도구다. 숫자나 코드만 놓고 독자에게 해석을 맡기지 않는다.

예를 들어:

~~~text
p50  40ms
p95  100ms
p99  1,500ms
~~~

를 보여줬다면 왜 p50은 정상인데 p99만 크게 벌어지는지, 어떤 대기와 자원 점유가 연결될 수 있는지 문단으로 설명한다.

## 관련 자료는 현재 개념 가까이에 배치한다

문서 끝에 참고자료를 대량으로 몰아두기보다 해당 개념을 설명하는 위치에 연결한다.

우선순위는 다음과 같다.

~~~text
한국 기업 기술 블로그
→ 한글 공식 문서
→ 제품 공식 문서
→ 필요한 경우 해외 원문
~~~

자주 참고하는 출처:
- [LINE Engineering](https://engineering.linecorp.com/ko/)
- [카카오 Tech](https://tech.kakao.com/)
- [NAVER D2](https://d2.naver.com/)
- [우아한형제들 기술블로그](https://techblog.woowahan.com/)
- [올리브영 테크블로그](https://oliveyoung.tech/)
- [MySQL Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
- [Grafana k6 공식 문서](https://grafana.com/docs/k6/latest/)

다른 회사의 수치와 아키텍처를 PawCycle의 기준으로 그대로 가져오지 않는다. 가져올 것은 **문제를 어떤 지표로 좁히고 어떤 변경을 어떻게 재검증했는지에 대한 사고방식**이다.
