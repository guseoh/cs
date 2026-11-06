---
type: tech-article
title: "We Can Do Better: 개발자 플랫폼 효율화 이야기"
aliases: []
summary: "개발자 플랫폼의 가치는 자동화 기능 수가 아니라 반복 업무를 하나의 흐름으로 연결하고 실제 사용자가 쓰는지에 달려 있습니다."
source: "tech.kakaopay.com"
published: 
collected: 2026-08-12
url: "https://tech.kakaopay.com/post/kakaopaysec-wecan/"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
projects: []
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
migration_origin: notion
---

# We Can Do Better: 개발자 플랫폼 효율화 이야기

> [!abstract] 한 줄 정리
> 개발자 플랫폼의 가치는 자동화 기능 수가 아니라 반복 업무를 하나의 흐름으로 연결하고 실제 사용자가 쓰는지에 달려 있습니다.

> tech.kakaopay.com

## 핵심 내용

금융 서비스의 규제·권한·배포 절차 때문에 개발자가 여러 내부 시스템과 요청 방식을 배우는 데 드는 시간을 줄이기 위해 계정·권한 관리, 배포 플랫폼, 서비스 Catalog, 인프라 요청을 WECAN으로 연결했습니다. 수동 배포 요청을 CI/CD와 연결하고 변경 사유·테스트 증빙·배포 상태·오류 복구까지 포함했으며 Kubernetes 사용량으로 CPU·메모리 설정을 추천하는 기능도 연계했습니다. 반면 Jira·GitHub 데이터를 이용한 생산성 차트는 사용자가 실제 업무에서 어떻게 써야 하는지 불명확해 활성화되지 못했습니다.

개발자 플랫폼의 통합이 성공했는지는 메뉴 수보다 개발자가 실제로 수행해야 할 수동 승인·배포·권한 신청 절차가 줄었는지로 판단해야 한다. WECAN은 계정과 서비스 Catalog, CI/CD와 배포 증빙을 이어 운영상 제약을 일상 업무 경로로 내재화했다. 반면 생산성 차트는 이용자가 어떤 후속 결정을 내려야 하는지가 불명확해 사용되지 못했다는 점이 중요하다.

| 기능 | 성공 조건 |
| --- | --- |
| 권한·계정 관리 | 신청·승인의 이력과 정책 준수 |
| 배포 자동화 | 테스트 증빙·변경 사유·복구 추적 |
| 자원 추천 | 사용량 근거와 권고의 검증 |
| 개발 생산성 차트 | 실제 의사결정·행동과 연결 |

개발자 경험 개선은 대시보드의 시각적 통합만이 아니라 조직 절차와 작업 흐름의 마찰을 줄이는 설계 문제다.

## 왜 읽을까

자동화는 많을수록 좋다는 사고를 경계하고 실제 사용자 가치와 재사용 가능한 운영 흐름을 보게 합니다.

---

**원문:** [We Can Do Better: 개발자 플랫폼 효율화 이야기](https://tech.kakaopay.com/post/kakaopaysec-wecan/)
