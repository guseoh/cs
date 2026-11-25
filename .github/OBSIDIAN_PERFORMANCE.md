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


## 사용자 제공 실측 기준선 (2026-11-25)

**측정 환경:** Obsidian 1.15.1 / Windows 11 Home 10.0.26300 / Vault 1,286개 파일 / Workspace 11 tabs(9 deferred) / 커뮤니티 플러그인 23개. 사용자가 Obsidian의 Start-up time breakdown 화면에서 제공한 단일 측정값이다. 반복 측정 중앙값이나 cold/warm 구분은 아직 없다.

| 영역 | 시간 | 전체 비중 |
| --- | ---: | ---: |
| Community plugins | 3,202ms | 41.8% |
| Initialization | 2,699ms | 35.3% |
| Workspace | 803ms | 10.5% |
| Vault | 799ms | 10.4% |
| Core plugins | 152ms | 2.0% |
| **Total** | **7,655ms** | **100%** |

Boot 내부에서는 Workspace snapshot 1,086ms, DOM parse 788ms, Script evaluation 441ms, Response 115ms였다. Workspace의 Layout load는 544ms다. Vault에서는 Reading files 574ms, Loading file metadata 188ms가 대부분이다. 따라서 플러그인뿐 아니라 저장된 Workspace 복원과 Obsidian/Electron 초기 부팅도 측정 우선순위에 포함한다. Workspace snapshot의 높은 시간이 11개 탭 때문에 발생했다고 단정할 수는 없다. 9개가 deferred라는 사실도 실제 원인 분석을 대신하지 않는다.

### 플러그인별 측정값

| 플러그인 | 시간 | 커뮤니티 플러그인 내 비중 |
| --- | ---: | ---: |
| Editing Toolbar 4.1.12 | 789ms | 24.6% |
| Excalidraw 2.29.2 | 495ms | 15.5% |
| Hover Reveal 1.0.11 | 290ms | 9.1% |
| PDF++ 0.40.31 | 230ms | 7.2% |
| Dataview 0.5.68 | 198ms | 6.2% |
| Git 2.43.0 | 198ms | 6.2% |
| Linter 1.35.0 | 178ms | 5.6% |
| HTML Reader 1.0.20 | 127ms | 4.0% |
| Templater 2.27.0 | 117ms | 3.7% |
| Mermaid Lens 0.2.3 | 73ms | 2.3% |
| 나머지 플러그인 및 Other | 507ms | 15.8% |

상위 3개(Editing Toolbar, Excalidraw, Hover Reveal)는 1,574ms로 커뮤니티 플러그인 시간의 49.2%다. 상위 5개까지는 2,002ms(62.5%)다. 번들 파일 크기와 초기화 시간은 다른 지표이며, 용량만으로 플러그인 제거 여부를 판단하지 않는다.

### 코드에서 확인한 구체적인 후보

- Editing Toolbar의 추적 설정에서 `ai.enabled=false`다. 그러나 추적된 4.1.12 번들의 `onload()`는 AI Manager를 항상 생성하고 `aiManager.onload()` 및 AI Editor Extension 등록을 실행한다. AI Manager 초기화는 Secret Storage 조회, 로그인 상태 동기화, API 키 마이그레이션, 프로토콜 핸들러와 Vault/Metadata 이벤트 등록을 포함한다. 로그인 토큰이 있고 사용자 정보가 없으면 `syncLoginState()`가 인증 확인 요청을 수행할 수 있으나, 로컬 Secret Storage를 확인할 수 없으므로 실제 네트워크 요청 여부는 미확인이다. 이 코드 경로는 최적화 후보이지, 789ms 전체의 원인으로 입증된 것은 아니다.
- Editing Toolbar에는 읽기·쓰기 코드 색상 일치 기능과 툴바 초기화 교정도 포함되어 있다. 이를 제거하거나 전체 플러그인을 교체하지 않는다. AI 기능이 비활성인 경우에만 AI 초기화를 지연하는 방안은 활성화·인증·에디터 확장 재등록 수명주기를 함께 검증해야 한다.
- Hover Reveal은 `onload()`에서 Markdown Post Processor, Editor Extension, 설정 탭 및 명령을 등록한다. 290ms 중 어느 작업이 지배적인지는 별도 계측 전에는 알 수 없다.
- Excalidraw는 기능을 유지한다. `aiEnabled=true` 설정은 확인했으나 해당 기능의 사용 여부를 확인하지 않았으므로 설정을 변경하지 않는다.
- Dataview의 갱신 간격을 2.5초에서 5초로 바꾼 것은 런타임 화면 갱신 빈도를 낮추기 위한 조치다. 198ms로 측정된 플러그인 초기화 시간을 직접 줄이는 변경은 아니다.
- Git의 198ms는 플러그인 초기화 시간이다. 시작 자동 Pull의 네트워크 작업 완료까지 걸린 시간과 동일하지 않으므로 Pull 완료 시각과 오류 여부를 별도로 확인한다.

### 다음 검증 순서

1. 현재 설정을 기준으로 완전 종료 후 재실행 3회, 각 시작 시간과 플러그인별 시간을 기록해 중앙값을 구한다.
2. Editing Toolbar만 Obsidian UI에서 임시 비활성화하고 재실행 3회 측정한 다음 즉시 다시 활성화한다. 툴바·Prism 코드 색상 기능이 사라지는 테스트 상태를 영구 설정으로 남기지 않는다.
3. 필요하면 Excalidraw, Hover Reveal, PDF++를 각각 하나씩 같은 방식으로 시험한다. 여러 플러그인을 한 번에 비활성화하지 않는다.
4. Workspace 11 tabs/9 deferred 기준선과, 사용하지 않는 탭을 닫은 임시 기준을 비교한다. Workspace snapshot과 Layout load가 실제로 줄어드는지 확인하고, 작업 공간 변경을 영구 적용하기 전에 사용자 확인을 받는다.
5. Editing Toolbar 단독 비활성화 차이가 유의미할 때만 AI 비활성 상태의 AI Manager 지연 초기화를 별도 변경으로 구현한다. 기존 툴바, 코드 색상, AI를 나중에 켜는 경로 및 인증 처리를 회귀 테스트한다.

**판정 한계:** 현재 수치는 사용자 제공 단일 실행 결과다. 플러그인 비활성화 A/B, 세 번 이상 반복 측정, 자동 Pull 완료 시간, RAM/CPU, 실제 UI 회귀 및 두 번째 PC 측정은 미수행이다. 따라서 아직 최종 병목 원인이나 최적화 후 개선량을 확정하지 않는다.
