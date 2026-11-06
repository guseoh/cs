---
type: tech-article
title: "Hive는 잊으려 했지만, Spark는 기억하고 있었다: 사라진 get_table RPC 복원기"
aliases: []
summary: "Hive Metastore 4.2 업그레이드에서 사라진 레거시 RPC 때문에 Spark 3.5.5 잡이 깨진 사례다. 최신 서버로 옮길 때는 서버 자체의 호환성뿐 아니라 오래된 클라이언트가 의존하는 프로토콜 계약까지 전환 범위로 봐야 한다."
source: "NAVER D2"
published: 2026-09-21
collected: 2026-10-07
url: "https://d2.naver.com/helloworld/7314597"
topic: "리팩터링"
categories:
  - "리팩터링"
  - "설계·아키텍처"
projects:
  - "DevPedia"
status: inbox
tags:
  - "tech-article"
  - "tech/리팩터링"
  - "tech/설계-아키텍처"
migration_origin: notion
---

# Hive는 잊으려 했지만, Spark는 기억하고 있었다: 사라진 get\_table RPC 복원기

> [!abstract] 한 줄 정리
> Hive Metastore 4.2 업그레이드에서 사라진 레거시 RPC 때문에 Spark 3.5.5 잡이 깨진 사례다. 최신 서버로 옮길 때는 서버 자체의 호환성뿐 아니라 오래된 클라이언트가 의존하는 프로토콜 계약까지 전환 범위로 봐야 한다.

> NAVER D2 · 2026-09-21

## 핵심 내용

Hive Metastore 서버만 새 버전으로 교체해도 Spark가 내부에 오래된 Hive 클라이언트를 포함한다면 기존 API 메서드의 존재 여부가 런타임 호환성을 결정한다. NAVER는 Hive Metastore 4.2로 갱신한 뒤 Spark 3.5.5에서 `TApplicationException UNKNOWN_METHOD: get_table` 오류를 겪었다.

Hive 4 계열 클라이언트는 요청 객체를 받는 `get_table_req` 중심으로 이동했지만 Spark가 사용하는 Hive 2.3.9 계열 `HiveMetaStoreClient`는 레거시 `get_table` Thrift RPC 이름과 시그니처를 호출했다. 서버 코드에서 새 RPC가 정상으로 동작하더라도 이름이 없는 이전 메서드는 프로토콜 단계에서 거부된다. 팀은 Spark 전체 업그레이드나 프록시를 추가하는 대신 HMS Thrift IDL에 기존 RPC 시그니처를 복원하고 서버 구현은 이미 검증된 내부 테이블 조회 로직에 위임하는 접근을 택했다.

```text
# RPC 호환성 경계의 개념도 (실제 Thrift IDL 인용 아님)
Spark 3.5.5 HiveMetaStoreClient -> get_table(old_args)
Hive Metastore 4.2              -> get_table_req(request)
하위 호환 서버 래퍼             -> get_table -> 내부 검증된 조회
```

지원 API를 바꾸는 마이그레이션에서 클라이언트가 어떤 RPC 이름을 실제로 호출하는지 추적해야 한다.

| 경로 | 클라이언트 기대 | 서버의 실제 지원 |
| --- | --- | --- |
| 구 Spark 클라이언트 | `get_table` | 업그레이드 후 메서드 없음 → 오류 |
| 신 Hive 클라이언트 | `get_table_req` | 정상 지원 |
| 하위 호환 패치 | 이전 메서드도 수용 | 내부 새 구현으로 위임 |

*IDL 호환성의 성공은 클라이언트 전체 동작과 예외·권한 계약까지 검증할 때 확정된다.*

RPC 호환성은 함수 이름만 다시 넣는 것으로 끝나지 않는다. 인자 순서·필드 번호·타입·반환값·예외 정의가 IDL의 계약이며 생성된 Java/C++/Python 스텁이 같은 직렬화와 디스패치를 수행하는지 테스트해야 한다. 원문에 따르면 코드 패치 자체는 작은 변경이지만 실제 생산 환경에 적용하기 전에 구버전 Spark와 신버전 Hive 클라이언트를 동시에 시험해야 한다.

## 왜 읽을까

라이브러리나 서버를 최신 버전으로 올릴 때 “새 서버가 정상 동작한다”와 “기존 소비자가 계속 정상 동작한다”가 다른 문제라는 걸 선명하게 보여준다. 변경 범위를 작게 유지하면서 하위 호환 계약을 복원하는 판단 과정도 좋다.

**프로젝트에 적용 — DevPedia**

- [ ] API DTO나 인증 계약을 바꿀 때 기존 클라이언트/테스트가 의존하는 필드·상태 코드까지 호환성 범위로 본다.
- [ ] 메이저 의존성 업그레이드에서는 컴파일 성공 외에 실제 요청/응답 계약 회귀 테스트를 둔다.
- [ ] 호환 레이어를 추가할 때 새 로직을 복제하기보다 기존 검증된 구현에 위임해 분기 수를 최소화한다.

---

**원문:** [Hive는 잊으려 했지만, Spark는 기억하고 있었다: 사라진 get\_table RPC 복원기](https://d2.naver.com/helloworld/7314597)
