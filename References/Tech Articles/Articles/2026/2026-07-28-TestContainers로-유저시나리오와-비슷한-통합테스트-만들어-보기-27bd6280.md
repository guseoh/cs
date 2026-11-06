---
type: tech-article
title: "TestContainers로 유저시나리오와 비슷한 통합테스트 만들어 보기"
aliases: []
summary: "서비스 간 계약과 실제 DB·메시지 브로커 동작은 Mock만으로 보호하기 어려우므로 핵심 사용자 흐름은 실제 의존성을 띄운 통합 테스트가 가치가 있습니다."
source: "helloworld.kurly.com"
published: 
collected: 2026-07-28
url: "https://helloworld.kurly.com/blog/delivery-testContainer-apply/"
topic: "테스트"
categories:
  - "테스트"
projects:
  - "DevPedia"
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/테스트"
migration_origin: notion
---

# TestContainers로 유저시나리오와 비슷한 통합테스트 만들어 보기

> [!abstract] 한 줄 정리
> 서비스 간 계약과 실제 DB·메시지 브로커 동작은 Mock만으로 보호하기 어려우므로 핵심 사용자 흐름은 실제 의존성을 띄운 통합 테스트가 가치가 있습니다.

> helloworld.kurly.com

## 핵심 내용

각 서비스 단위 Mock 테스트만으로는 서비스 사이 제약과 실제 인프라 동작을 잡지 못하는 문제에서 Testcontainers를 사용합니다. Kafka, consumer, PostgreSQL, API 등 네 개 컨테이너를 같은 내부 네트워크에 띄워 실제 사용자 시나리오와 비슷한 환경을 만들고 CI에서도 실행합니다.

서비스 단위 Mock 테스트에서는 Kafka Consumer가 실제 메시지를 정상 수신하는지, DB 스키마와 직렬화 계약이 맞는지까지 보장하기 어렵다. Kafka·Consumer·PostgreSQL·API 컨테이너를 같은 네트워크에서 실행하면 사용자의 실제 호출이 데이터 저장·이벤트 발행·후속 처리까지 이어지는 경로를 검증할 수 있다. 하지만 테스트 데이터 초기화와 각 컨테이너의 준비 완료 조건을 관리하지 않으면 CI에서만 실패하는 Flaky Test로 바뀔 수 있다.

```mermaid
flowchart LR
 A["테스트 API 요청"] --> B["서비스·DB"]
 B --> C["Kafka 이벤트"]
 C --> D["Consumer 처리"]
 D --> E["DB 결과 검증"]
```

*자체 재구성. 컨테이너 내부 네트워크에서 확인할 주요 연쇄 동작이다.*

실제 운영 인프라와 다르게 네트워크 지연·클러스터 장애까지 자동 재현되는 것은 아니므로 기능 통합 검증과 성능·장애 검증을 구분해야 한다.

## 왜 읽을까

통합 테스트를 많이 만들자는 이야기가 아니라 어떤 종류의 결함은 실제 인프라를 통과해야만 발견된다는 경계를 보여줍니다.

**프로젝트에 적용**

**DevPedia·PawCycle 공통** — 모든 테스트를 Testcontainers로 바꾸기보다 인증+DB 변경처럼 핵심 계약 1~2개를 실제 MySQL/Flyway 환경에서 보호하는 통합 테스트로 구성할 수 있습니다.

---

**원문:** [TestContainers로 유저시나리오와 비슷한 통합테스트 만들어 보기](https://helloworld.kurly.com/blog/delivery-testContainer-apply/)
