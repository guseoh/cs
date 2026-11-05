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

- **문제:** Hive Metastore를 4.2로 올린 뒤 Spark 잡의 테이블 메타데이터 조회에서 `UNKNOWN_METHOD: get_table` 오류가 발생했다. Hive 4.2 클라이언트는 정상인데 Hive 2.3.9 계열 클라이언트를 내장한 Spark 3.5.5에서만 실패했다.
- **구조:** Hive 4 계열은 요청 객체 기반 `get_table_req` 중심으로 이동하면서 레거시 `get_table` RPC가 사라졌고, Spark 쪽 구버전 `HiveMetaStoreClient`는 여전히 기존 RPC 이름과 시그니처에 의존했다.
- **접근:** Spark 전체 업그레이드나 별도 프록시를 두는 대신 HMS Thrift IDL에 기존 시그니처의 `get_table`을 하위 호환용으로 복원하고, 서버 구현은 검증된 내부 조회 로직에 위임했다.
- **주의점:** RPC 호환성은 메서드 이름만 맞춘다고 끝나지 않는다. 인자 필드 번호·타입, 반환 타입, 예외 정의와 Java/C++/Python 생성 스텁의 직렬화·디스패치까지 계약으로 검증해야 한다.

## 왜 읽을까

라이브러리나 서버를 최신 버전으로 올릴 때 “새 서버가 정상 동작한다”와 “기존 소비자가 계속 정상 동작한다”가 다른 문제라는 걸 선명하게 보여준다. 변경 범위를 작게 유지하면서 하위 호환 계약을 복원하는 판단 과정도 좋다.

**프로젝트에 적용 — DevPedia**

- [ ] API DTO나 인증 계약을 바꿀 때 기존 클라이언트/테스트가 의존하는 필드·상태 코드까지 호환성 범위로 본다.
- [ ] 메이저 의존성 업그레이드에서는 컴파일 성공 외에 실제 요청/응답 계약 회귀 테스트를 둔다.
- [ ] 호환 레이어를 추가할 때 새 로직을 복제하기보다 기존 검증된 구현에 위임해 분기 수를 최소화한다.

---

**원문:** [Hive는 잊으려 했지만, Spark는 기억하고 있었다: 사라진 get\_table RPC 복원기](https://d2.naver.com/helloworld/7314597)
