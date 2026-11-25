# Obsidian 성능 측정 및 최적화 (2026-11-25)

## 원칙

자동 동기화와 검증을 통과한 학습 UI를 유지한다. 플러그인 번들 크기는 초기 로딩 시간의 측정값이 아니며, 개별 플러그인을 삭제하거나 일괄 지연 로딩하지 않는다. 노트, 첨부, Git 이력을 변경하지 않는다.

## 적용한 1단계

- Obsidian Git 2.43.0: 시작 자동 Pull을 복원한다. 설치된 코드의 `onLayoutReady` → `init` → `promiseQueue.addTask` 경로를 사용하며 번들을 수정하지 않는다. 상태 갱신 디바운스 30초, 15분 백업, Push 전 Pull 및 오류 알림을 유지한다. 별도 주기 Pull을 추가하지 않는다. 두 기기 모두 Pull 완료 후 편집한다.
- Dataview: 화면 재갱신 디바운스 2.5초 → 5초. 자동 갱신, 인덱싱 및 기존 질의는 유지한다. 초기 인덱싱을 빠르게 한다는 뜻은 아니다.
- Linter: 저장/파일 변경 자동 검사 비활성 상태 유지.
- Excalidraw: 캐시 사용 유지. PDF Plus, Templater, HTML, Mermaid 도구, 카드 링크, 편집기 도구 및 자동 SVG 첨부를 유지한다. 기존 코드 팔레트/툴바 패치는 건드리지 않는다.

## 2단계: 각 Windows PC에서 비교 측정

1. Obsidian 설정 → 일반 → 고급 → 시작 시간(스톱워치)에서 시작 시간 정보를 확인한다. 앱 버전/언어에 따라 표기는 달라질 수 있다. 완전히 종료한 뒤 재실행한 3회 결과에서 전체 시간, 커뮤니티 플러그인별 시간, Git Pull 완료 시점, 편집 가능 시점을 구분해 기록한다.
2. 아래 명령을 Vault 루트에서 실행한다. Git 상태 조회 3회와 플러그인 번들 크기를 출력한다. 원격 요청이나 설정 변경은 하지 않는다.

```powershell
.\scripts\Measure-ObsidianVault.ps1
```

3. 실제 병목 상위 플러그인만 단일 변수 A/B 테스트 대상으로 선정한다. Excalidraw, Dataview, PDF Plus, HTML 플러그인 등은 기능 사용 여부와 실측을 함께 확인한다. Git, Editing Toolbar, Style Settings 및 자동 SVG 첨부는 우선 유지한다.
4. Windows Git 상태 조회가 병목이면, 로컬 디스크에서 `git update-index --test-untracked-cache` 지원 여부 확인 후 `git config --local core.untrackedCache true`를 별도 적용할 수 있다. 기존 설정을 먼저 기록하고 상태 결과/시간을 비교한다. 기존 값이 없었던 경우 롤백은 `git config --local --unset core.untrackedCache`이며, 기존 값이 있으면 복원한다. FSMonitor는 Git 버전 및 파일시스템 호환성 확인 후 별도 검토한다. 전역 설정, 저장소 정리, 파일 삭제를 자동 수행하지 않는다.

## 완료 기준

- 시작 자동 Pull 및 기존 15분 백업/Push 전 Pull 정상 동작.
- 시작 시간과 Git 상태 조회 시간이 실측되어 비교 가능.
- 기존 H6, 콜아웃, 표, 카드 링크, SVG, 코드 색상, 툴바 QA 회귀 없음.
- Dataview 자동 갱신 정상 동작.
- 네트워크 오류 및 로컬 변경/충돌 시 기존 안전 절차 유지.

공식 자료: [Obsidian 시작 시간 측정](https://docs.obsidian.md/plugins/guides/load-time), [Git status 성능](https://git-scm.com/docs/git-status), [Dataview 갱신 로직](https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/main.ts). 실제 로컬 시간 및 Windows 스크립트 실행은 미검증이다.
