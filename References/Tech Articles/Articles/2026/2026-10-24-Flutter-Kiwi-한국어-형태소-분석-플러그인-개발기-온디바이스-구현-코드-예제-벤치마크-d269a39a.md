---
type: tech-article
title: "Flutter + Kiwi 한국어 형태소 분석 플러그인 개발기: 온디바이스 구현, 코드 예제, 벤치마크까지"
aliases: []
summary: "온디바이스 한국어 형태소 분석은 서버 호출을 줄이지만 네이티브 브리지, 모델 파일 배포, 초기화 비용이 생긴다. 선택은 단순 처리량보다 배포·운영·프라이버시까지 포함해 판단해야 한다."
source: "개인 Medium 블로그 · Dreamwalker(박제창)"
published: 2026-02-17
collected: 2026-10-24
url: "https://medium.com/@aristojeff/flutter-kiwi-%ED%95%9C%EA%B5%AD%EC%96%B4-%ED%98%95%ED%83%9C%EC%86%8C-%EB%B6%84%EC%84%9D-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EA%B0%9C%EB%B0%9C%EA%B8%B0-%EC%98%A8%EB%94%94%EB%B0%94%EC%9D%B4%EC%8A%A4-%EA%B5%AC%ED%98%84-%EC%BD%94%EB%93%9C-%EC%98%88%EC%A0%9C-%EB%B2%A4%EC%B9%98%EB%A7%88%ED%81%AC%EA%B9%8C%EC%A7%80-263399aa1965"
topic: "AI·개발도구"
categories:
  - "AI·개발도구"
  - "성능"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/AI-개발도구"
  - "tech/성능"
migration_origin: notion
---

# Flutter + Kiwi 한국어 형태소 분석 플러그인 개발기: 온디바이스 구현, 코드 예제, 벤치마크까지

> [!abstract] 한 줄 정리
> 온디바이스 한국어 형태소 분석은 서버 호출을 줄이지만 네이티브 브리지, 모델 파일 배포, 초기화 비용이 생긴다. 선택은 단순 처리량보다 배포·운영·프라이버시까지 포함해 판단해야 한다.

> 개인 Medium 블로그 · Dreamwalker(박제창) · 2026-02-17

## 핵심 내용

- **문제:** Flutter에서 Kiwi 형태소 분석을 플랫폼마다 따로 연결해야 했고, 모델 경로·초기화·배포 실패가 실제 사용을 막았어.
- **구조:** 네이티브에서는 FFI, 웹에서는 WASM을 사용하되 앱에는 동일한 `KiwiAnalyzer` API를 제공해. 모델은 명시 경로 → 번들 에셋 → 다운로드·캐시 순서로 찾는 fallback을 설계했어.
- **접근:** 분석기를 UI에서 직접 다루지 않고 서비스 계층에 격리해 초기화·종료·오류를 한곳에서 관리해. 런타임 사용자 사전과 플랫폼별 빌드 준비 스크립트도 제공해.
- **수치:** 2026-02-17 macOS arm64, release 모드, 40문장, warmup 3회·measure 15회·topN 1 조건에서 Flutter 플러그인은 초당 2,408.41회·평균 0.42ms, Python `kiwipiepy`는 3,666.54회·0.27ms였어.
- **트레이드오프:** Flutter 측은 FFI 경계와 직렬화·초기화 비용이 있고 토큰 수에도 9,660 대 9,645의 차이가 있었어. 더 느린 절대 수치에도 오프라인 동작, 공통 API, 개인정보 외부 전송 감소라는 이점을 선택 근거로 제시해.

## 왜 읽을까

직접 만든 도구의 한계까지 수치와 실행 조건으로 공개한 개인 개발 사례야. 벤치마크가 이긴 숫자를 고르는 행위가 아니라 동일한 조건을 정의하고 운영 제약을 함께 비교하는 과정이라는 점을 배울 수 있어.

**프로젝트에 적용 — PawCycle**

- [ ] 상품 검색의 한국어 검색 품질이 실제 문제인지 먼저 테스트 질의와 기대 검색 결과로 확인한다.
- [ ] 형태소 분석 도입을 검토할 때 서버 처리와 클라이언트 처리를 정확도·응답 지연·운영 비용·개인정보 관점에서 비교한다.
- [ ] 실험한다면 동일한 상품명 코퍼스와 워밍업·반복 횟수를 고정하고 측정 결과를 저장한다.

---

**원문:** [Flutter + Kiwi 한국어 형태소 분석 플러그인 개발기: 온디바이스 구현, 코드 예제, 벤치마크까지](https://medium.com/@aristojeff/flutter-kiwi-%ED%95%9C%EA%B5%AD%EC%96%B4-%ED%98%95%ED%83%9C%EC%86%8C-%EB%B6%84%EC%84%9D-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EA%B0%9C%EB%B0%9C%EA%B8%B0-%EC%98%A8%EB%94%94%EB%B0%94%EC%9D%B4%EC%8A%A4-%EA%B5%AC%ED%98%84-%EC%BD%94%EB%93%9C-%EC%98%88%EC%A0%9C-%EB%B2%A4%EC%B9%98%EB%A7%88%ED%81%AC%EA%B9%8C%EC%A7%80-263399aa1965)
