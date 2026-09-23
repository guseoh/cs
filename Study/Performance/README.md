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

예를 들어 p95라는 말을 만났을 때 “95%가 이 값 이하”라는 한 문장만 외우는 것으로 끝내지 않는다. 요청 시간을 왜 분포로 봐야 하는지, 평균과 무엇이 다른지, p95가 올라가면 어떤 대기 원인을 의심할 수 있는지, 오류율과 실제 처리량을 왜 함께 봐야 하는지까지 연결한다.

HikariCP pending도 “Connection을 기다리는 수”라는 정의만 적지 않는다. 어떤 상황에서 pending이 생기는지, Query가 느릴 때와 Pool이 작을 때가 어떻게 다른지, Pool을 늘리면 왜 DB 부담이 더 커질 수 있는지까지 설명한다.

이런 방식으로 각 문서는 **읽은 뒤 실제 Metric과 성능 결과를 스스로 해석할 수 있는 수준**을 목표로 한다.

## 이 디렉터리와 PawCycle 프로젝트 기록은 역할이 다르다

이 디렉터리의 Study 문서는 특정 프로젝트를 몰라도 이해할 수 있는 일반 성능 개념을 다룬다.

~~~text
Study/Performance

성능 개념
원리
내부 동작
지표 해석
실험 방법
국내 사례
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

두 문서가 연결될 수는 있지만 같은 내용을 복사하지 않는다.

예를 들어 Study에서는 p95 자체를 충분히 설명하고, Project에서는 PawCycle의 실제 p95 값이 왜 그렇게 해석되었는지를 기록한다.

PawCycle 기록:
- [[../../Project/pawCycle/Performance/README|Project/pawCycle/Performance]]

## 문서를 읽는 순서

### 01. 성능 엔지니어링과 기준선

[[01. 성능 엔지니어링과 기준선]]

성능을 단순히 빠르게 만드는 작업이 아니라 측정 가능한 문제로 바꾸는 과정부터 시작한다.

처리량과 응답 시간이 왜 다른지, 기준선이 숫자 하나가 아닌 이유, 부하·스트레스·순간 폭증 테스트의 목적 차이, 준비 구간과 임계값을 설명한다.

이 문서를 이해하면 “최대 몇 RPS인가?”보다 먼저 **무엇을 어떤 조건에서 측정했는가**를 묻게 된다.

### 02. 부하 테스트와 요청 흐름 모델링

[[02. 부하 테스트와 Workload Modeling]]

사용자 행동을 실제 요청으로 바꾸는 방법을 다룬다.

RPS, TPS, 동시 처리 수, 가상 사용자, 생각 시간, 열린 부하 모델과 닫힌 부하 모델, 누락된 반복 실행을 하나씩 설명한다.

성능 테스트에서 목표 RPS와 실제 RPS가 왜 다른지, 같은 RPS라도 요청 종류와 비율이 달라지면 왜 다른 workload가 되는지도 연결한다.

### 03. 관측 가능성과 계층별 병목 분리

[[03. Observability와 계층별 병목 분리]]

성능 테스트가 “느리다”는 결과를 발견한 뒤 실제 원인을 어떻게 좁히는지 다룬다.

Metric, Log, Trace의 역할을 구분하고 Prometheus Scrape, Target, Grafana, Metric Label과 Cardinality를 설명한다.

외부 결과와 내부 원인 지표를 나누고 시간축에서 사건 순서를 만들어 Root Cause 후보를 줄이는 방법을 설명한다.

### 04. Linux와 Container 성능 지표 읽기

[[04. Linux와 Container 성능 지표 읽기]]

Spring Boot가 결국 Linux Process라는 점에서 출발한다.

CPU의 us/sy/id/wa, Load Average, Run Queue, MemAvailable, Page Cache, RSS, Swap, cgroup, Container Limit, OOMKilled, RestartCount, File Descriptor, TIME_WAIT, Disk I/O와 Network를 설명한다.

이 문서를 읽은 뒤에는 “CPU 80%”, “free memory 100MiB” 같은 숫자를 단독으로 해석하지 않게 되는 것이 목표다.

### 05. JVM, GC, Thread와 Native Memory

[[05. JVM GC Thread Native Memory 성능]]

Heap만으로 Java Process Memory를 설명할 수 없는 이유를 다룬다.

Heap Used/Committed/Max, Allocation Rate, Live Set, GC Pause, Stop-The-World, Young/Old 영역, G1, ZGC, Thread State, Thread Dump, Direct Memory, Metaspace, Code Cache, Native Memory를 설명한다.

OOM이 발생했을 때 Heap만 보는 것이 왜 위험한지도 연결한다.

### 06. Tomcat, HikariCP와 DB 대기 구조

[[06. Tomcat HikariCP DB Queueing]]

HTTP 요청이 Tomcat Thread를 거쳐 HikariCP Connection을 빌리고 MySQL까지 내려가는 흐름을 다룬다.

active, idle, pending, maximumPoolSize, Connection 획득 시간, 사용 시간, Queueing, Little's Law, Backpressure를 설명한다.

Pool Size나 Thread 수를 무작정 늘렸을 때 왜 뒤쪽 DB 병목을 더 악화시킬 수 있는지도 살펴본다.

### 07. 응답 시간 백분위와 꼬리 지연

[[07. Latency Percentile과 Tail Latency]]

평균만으로 사용자 응답 시간을 설명하면 무엇을 놓치는지 다룬다.

p50, p95, p99, Max를 실제 요청 개수로 풀어서 설명하고, Tail Latency가 Thread와 Connection 점유를 통해 시스템 내부 문제로 다시 증폭될 수 있는 과정도 연결한다.

작은 표본에서 p99를 조심해야 하는 이유, Histogram과 Quantile 근사, Timeout과 오류 요청이 백분위 해석에 미치는 영향도 다룬다.

### 08. 관측자 효과와 같은 서버 보정 실험

[[08. Observer Effect와 Same-host Calibration]]

Prometheus와 Grafana 같은 관측 도구도 CPU, Memory, Disk를 사용하는 workload라는 점을 다룬다.

관측 도구를 같은 Host에 둘 때 왜 ON → OFF → ON 같은 보정 실험을 할 수 있는지, 퍼센트와 퍼센트포인트, Headroom, Scrape Interval, APM과 Debug Log의 Overhead를 설명한다.

### 09. Before/After와 성능 실험의 인과관계

[[09. Before After와 성능 실험의 인과관계]]

변경 뒤 숫자가 좋아졌다는 사실과 변경 때문에 좋아졌다는 주장을 구분한다.

가설, 독립 변수, 종속 변수, 통제 변수, 교란 변수, 반복 측정, 실행 순서, 상관관계와 인과관계, 개입과 효과 크기를 설명한다.

한 번에 여러 기술을 바꾸지 않고 가장 작은 변경부터 검증하는 이유도 이 문서에서 다룬다.

### 10. 대규모 데이터의 양·관계·고유도·분포·쏠림

[[10. 대규모 데이터 Volume Cardinality Distribution Skew]]

대규모 데이터를 단순 Row 수로만 보면 왜 부족한지 다룬다.

데이터 양, 부모-자식 관계, Fan-out, Cardinality, Selectivity, Distribution, Skew, Hot Data, 시간 분포, Null 비율을 설명한다.

Synthetic Data와 Production Data의 차이, 고정 Seed, Dataset 검증, Query Plan과 통계 변화까지 연결한다.

### 11. 국내 기술 블로그 성능 사례 지도

[[11. 국내 기술 블로그 성능 사례 지도]]

국내 기업의 성능·장애 사례를 단순 링크 목록으로 모으지 않는다.

각 글에서 어떤 문제 해결 사고방식을 배울 수 있는지 설명한다.

LINE의 성능 테스트 자동화와 Thread 장애, 카카오의 스트레스 테스트와 MySQL Hotspot, NAVER D2의 GC와 SQL, 우아한형제들의 HikariCP와 포인트 시스템, 올리브영의 대규모 트래픽 사례를 앞선 개념과 연결한다.

### 12. 성능 문제 분석 플레이북

[[12. 성능 문제 분석 플레이북]]

실제 성능 문제가 발생했을 때 어디부터 조사할지 설명한다.

테스트 유효성 확인에서 시작해 사용자 결과, Restart/OOM, Host/Container, JVM, Tomcat/HikariCP, Database 순으로 범위를 줄여간다.

이 순서는 외우는 체크리스트가 아니라 **강한 실패 신호와 넓은 계층부터 확인하면서 원인 후보를 줄이는 사고방식**으로 읽는다.

### 13. 재현 가능한 성능 실험과 안전한 격리

[[13. 재현 가능한 성능 실험과 안전한 격리]]

성능 숫자가 어느 Source와 Dataset에서 만들어졌는지 다시 복원할 수 있어야 하는 이유를 다룬다.

Commit SHA, 불변 Source, Linux Permission, Checksum, Provenance, Image Digest, 데이터 격리와 자원 격리, Loopback, SSH Local Forward, Fail-closed, TOCTOU, Symbolic Link, Cleanup을 설명한다.

실제 Production에 가까운 성능 실험일수록 재현성과 안전 경계를 같이 설계해야 한다는 관점으로 마무리한다.

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

모든 항목을 형식적으로 동일한 목차로 만들 필요는 없다.

중요한 것은 독자가 추가 검색을 하지 않아도 현재 주제의 핵심 흐름을 이해할 수 있을 정도로 설명하는 것이다.

## 한글을 먼저 사용한다

영어 용어를 그대로 나열하면 기술 문서가 짧아 보이지만 이해는 더 어려워질 수 있다.

가능하면 한글 표현을 먼저 쓰고 공식 용어나 검색에 필요한 영어를 괄호로 보조한다.

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

JVM, JPA, MySQL, Redis, Kafka, k6, Prometheus, Grafana처럼 제품명이나 표준 기술명은 유지한다.

하지만 이름만 던지지 않고 현재 문맥에서 무엇을 하는지 설명한다.

## 코드 블록과 표는 설명을 대신하지 않는다

표와 흐름도는 복잡한 관계를 빠르게 보는 데 도움이 된다.

하지만 다음처럼 표만 두고 끝내지 않는다.

~~~text
p50  40ms
p95  100ms
p99  1,500ms
~~~

앞뒤 문단에서 이 값이 무엇을 의미하고 왜 p99만 크게 벌어졌을 때 일부 요청의 대기를 의심하는지 설명한다.

코드와 SQL도 같은 방식이다.

코드 자체보다 **왜 이 코드를 보는지, 결과가 어떤 의미인지**가 본문에 있어야 한다.

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
- [Grafana k6 공식 문서](https://grafana.com/docs/k6/latest/)

자료의 숫자와 아키텍처를 자신의 시스템에 그대로 가져오지 않는다.

다른 회사의 서버 사양, 데이터, 요청 특성이 다르기 때문이다.

가져올 것은 **어떤 문제를 어떤 지표로 좁히고 어떤 변경을 어떻게 재검증했는지에 대한 사고방식**이다.
