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

Airflow를 관리형 서버리스 환경에서 자체 Kubernetes 클러스터로 옮기면 노드 자원과 배포를 직접 제어할 수 있지만 스케줄러와 워커의 자원 경계를 스스로 책임져야 한다. 컬리는 DAG 파일 변경이 많지 않아도 주기적인 DAG 재파싱으로 Scheduler CPU가 크게 증가하는 현상을 발견했다.

운영 환경에서 Scheduler CPU 0.25→0.45 core, 개발 환경에서는 0.4→2.7 core로 증가했다. `min_file_process_interval`은 DAG 파일을 다시 파싱하기 전에 기다리는 최소 시간을 의미하므로 자주 바뀌지 않는 정의에는 간격을 늘려 반복 I/O와 CPU 사용을 줄일 수 있다. 그러나 변경을 반영하는 속도는 그만큼 느려지는 트레이드오프가 생긴다.

```ini
# Airflow 동작 원리를 설명하는 설정 예시
[scheduler]
min_file_process_interval = 120
```

*120초는 학습용 예시일 뿐 원문에서 채택한 정확한 최종 설정값은 아니다. 반영 지연과 CPU 사용량을 함께 검증해야 한다.*

| 문제 | 조정 방법 | 감수할 비용 |
| --- | --- | --- |
| DAG 재파싱 과다 | min_file_process_interval 증가 | 새 DAG 반영 지연 |
| Celery 순간 메모리 | Request/Limit 조정 | Pod 단위 OOM 경계 |
| 노드 리소스 경합 | Taint·Toleration 분리 | 전용 자원 유휴 가능 |
| 관리형→K8s | 배포·리소스 제어권 확보 | 운영·장애 책임 확대 |

Celery Worker의 순간 메모리 사용이 Kubernetes의 Request/Limit을 넘으면 컨테이너 단독 OOM뿐 아니라 노드 메모리 압박과 Kubelet 수준 장애로 전파될 수 있다. 안정적인 자원 패턴의 워크로드는 Taint/Toleration으로 노드를 분리해 장애 전파 범위를 좁혔다. 관리형 서비스를 떠날 때에는 라이선스·단가뿐 아니라 운영 인력과 로그·재시도·노드 장애 대응 비용도 비교해야 한다.

## 왜 읽을까

Kubernetes 이전을 ‘배포 방식 변경’으로 보지 않고, 애플리케이션과 Kubelet·OS까지 이어지는 자원 경계를 추적하는 사례다. CPU와 달리 메모리는 압축 불가능한 자원이라 포화 시 장애 형태가 달라진다는 점도 운영 관점에서 유용하다.

**프로젝트에 적용 — PawCycle**

- [ ] 부하 테스트에서 컨테이너 메모리 제한뿐 아니라 노드 수준 자원 경합과 OOM 영향을 구분해 기록한다.
- [ ] Worker·배치가 생기면 일반 API와 자원 경합이 가능한지 확인하고 필요하면 실행 자원을 격리한다.
- [ ] 설정값을 바꿀 때 얻는 효과와 함께 DAG 반영 지연처럼 새로 생기는 비용도 Evidence에 남긴다.

---

**원문:** [서버리스에서 쿠버네티스로 - Airflow 운영 경험기](https://helloworld.kurly.com/blog/airflow-1/)
