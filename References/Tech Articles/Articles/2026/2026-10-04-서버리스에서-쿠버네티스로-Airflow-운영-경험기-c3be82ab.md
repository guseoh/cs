---
type: tech-article
title: "서버리스에서 쿠버네티스로 - Airflow 운영 경험기"
aliases: []
summary: "관리형 Airflow를 Kubernetes로 옮기면 비용·제어권을 얻는 대신 Scheduler CPU, Worker OOM, 로그와 자원 격리까지 직접 책임져야 한다. 이전 성공보다 운영 안정화가 더 큰 엔지니어링 과제임을 보여준다."
source: "컬리 기술 블로그"
published: 2024-07-09
collected: 2026-10-04
url: "https://helloworld.kurly.com/blog/airflow-1/"
topic: "인프라·DevOps"
categories:
  - "인프라·DevOps"
  - "장애·운영"
projects:
  - "PawCycle"
status: inbox
tags:
  - "tech-article"
  - "tech/인프라-DevOps"
  - "tech/장애-운영"
migration_origin: notion
---

# 서버리스에서 쿠버네티스로 - Airflow 운영 경험기

> [!abstract] 한 줄 정리
> 관리형 Airflow를 Kubernetes로 옮기면 비용·제어권을 얻는 대신 Scheduler CPU, Worker OOM, 로그와 자원 격리까지 직접 책임져야 한다. 이전 성공보다 운영 안정화가 더 큰 엔지니어링 과제임을 보여준다.

> 컬리 기술 블로그 · 2024-07-09

## 핵심 내용

- **문제:** DAG를 이관한 뒤 Scheduler CPU가 신규 환경에서 0.25→0.45 core, 개발 환경에서 0.4→2.7 core로 급증했다.
- **접근:** DAG 변경 빈도가 낮다는 특성을 이용해 `min_file_process_interval`을 늘려 파일 파싱·I/O 빈도를 낮추고 CPU 사용량을 줄였다.
- **문제:** Celery Worker의 순간 메모리 사용 증가와 노드 자원 경합이 Container·Kubelet·OS 수준 OOM으로 이어져 Pod뿐 아니라 같은 노드의 다른 워크로드까지 영향을 받을 수 있었다.
- **구조:** request/limit으로 조기 OOM 경계를 만들고, 일정한 자원 패턴의 애플리케이션은 Taint/Toleration으로 노드를 분리해 장애 영향 범위를 축소했다.
- **트레이드오프:** 관리형 서비스에서 K8S로 이동하면 성능·비용 최적화와 제어권을 얻지만 스케줄러, 자원 정책, 로그, 노드 장애까지 팀이 직접 이해하고 운영해야 한다.

## 왜 읽을까

Kubernetes 이전을 ‘배포 방식 변경’으로 보지 않고, 애플리케이션과 Kubelet·OS까지 이어지는 자원 경계를 추적하는 사례다. CPU와 달리 메모리는 압축 불가능한 자원이라 포화 시 장애 형태가 달라진다는 점도 운영 관점에서 유용하다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 컨테이너 메모리 제한뿐 아니라 노드 수준 자원 경합과 OOM 영향을 구분해 기록한다.
- [ ] Worker·배치가 생기면 일반 API와 자원 경합이 가능한지 확인하고 필요하면 실행 자원을 격리한다.
- [ ] 설정값을 바꿀 때 얻는 효과와 함께 DAG 반영 지연처럼 새로 생기는 비용도 Evidence에 남긴다.

---

**원문:** [서버리스에서 쿠버네티스로 - Airflow 운영 경험기](https://helloworld.kurly.com/blog/airflow-1/)
