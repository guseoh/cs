# Obsidian Vault 백업·복구 (Windows PowerShell 5.1)

> GitHub 동기화는 **기기 간 변경 반영·버전 관리**다. 독립적인 **전체 파일 백업**을 대체하지 않는다. 데스크탑 상태는 나중에 별도 점검한다.

## 백업 실행 (노트북)

1. Obsidian에서 노트를 저장하고 앱을 종료한다.
2. Vault 루트 폴더에서 PowerShell을 실행한다.
3. 아래 명령으로 **Vault 밖에** 전체 ZIP 백업을 만든다.

~~~powershell
# 예시: 사용자 홈 폴더에 백업(같은 드라이브이므로 최종 백업은 별도 보관 필요)
.\scripts\Backup-ObsidianVault.ps1 -DestinationDirectory (Join-Path $env:USERPROFILE 'ObsidianVaultBackups')
~~~

- 스크립트는 소스 Vault를 **수정하지 않는다**. Git 명령, reset, clean, 강제 push 등을 수행하지 않는다.
- 숨김 폴더인 \`.obsidian\`과 \`.git\`, 노트, 첨부파일, Git에 추적되지 않은 파일도 백업한다.
- \`/Resources/PDF/\`처럼 **Git에서 제외한 파일도 로컬에 존재하면 백업**된다.
- 백업 결과는 \`<vault-name>-yyyyMMdd-HHmmssfff.zip\`과 같은 이름의 \`.sha256\` 파일로 생성된다.
- 파일 수와 \`.obsidian/app.json\` 포함 여부를 검증하며, 실패하면 부분 ZIP을 삭제한다.
- 위 예시는 같은 디스크에 만드는 **로컬 사본**이다. 디스크 장애에도 대비하려면 ZIP과 체크섬 파일을 외장 드라이브나 별도 저장 위치로 복사한다.
- ZIP에는 플러그인 설정 및 민감한 정보가 포함될 수 있으므로 공유 저장소에 공개하지 않는다.
- 백업 경로는 Vault 아래로 지정할 수 없다. 중첩 백업·Git 추적을 방지하기 위함이다.

## Windows ZIP 내부 경로 검증 문제

Windows PowerShell 5.1/.NET 환경에서는 ZIP 내부 항목의 경로가 `obsidian-vault\.obsidian\app.json`처럼 백슬래시(`\`)로 기록될 수 있다. 백업 스크립트는 ZIP 검증 시 `\`와 `/`를 동일하게 처리한다.

백업 명령이 `Backup validation failed`로 실패하면 **백업 성공으로 간주하지 않는다**. 실패한 ZIP과 체크섬은 스크립트가 정리하며, Vault 파일은 수정하지 않는다. 스크립트를 갱신한 뒤 재실행하고 성공 메시지의 `Backup:`, `SHA256:`, `Files:` 항목을 확인한다. 여전히 실패한다면 표시된 `Matching candidates`를 함께 전달한다.

## 백업 검증

다음 예시는 위 기본 백업 폴더에 만들어진 **가장 최근 ZIP**을 검증한다.

~~~powershell
$backupDir = Join-Path $env:USERPROFILE 'ObsidianVaultBackups'
$zip = Get-ChildItem -LiteralPath $backupDir -Filter '*.zip' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if ($null -eq $zip) { throw 'ZIP backup not found' }

$checksumPath = $zip.FullName + '.sha256'
$expected = (Get-Content -LiteralPath $checksumPath -TotalCount 1).Split(' ')[0]
$actual = (Get-FileHash -LiteralPath $zip.FullName -Algorithm SHA256).Hash
if ($expected -ne $actual) { throw 'SHA256 mismatch: backup may be damaged' }

Write-Host 'Checksum OK:' $zip.FullName
~~~

체크섬은 ZIP 파일이 생성 시점과 동일한지 확인할 뿐, **실제 복구가 가능한지 보장하지 않는다**. 아래 복구 연습도 진행한다.

## 복구 연습 (실제 Vault를 덮어쓰지 않음)

~~~powershell
$restoreTo = Join-Path $env:TEMP ('obsidian-restore-test-' + (Get-Date -Format 'yyyyMMdd-HHmmssfff'))
Expand-Archive -LiteralPath $zip.FullName -DestinationPath $restoreTo
Get-ChildItem -LiteralPath $restoreTo -Force
~~~

- 압축을 풀면 ZIP을 만들 때 사용한 Vault 폴더가 안에 포함된다.
- 복원한 폴더에서 \`.obsidian/app.json\`, \`Study/\`, \`Attachments/\` 및 \`.git/\`이 있는지 확인한다.
- 우선 파일 탐색기와 텍스트 편집기로 주요 노트·이미지·CSS 파일이 존재하는지 확인한다.
- **주의:** 복원본에는 `.git`과 `Obsidian Git`의 자동 Pull/Push 설정도 들어 있다. 검증용 복원본을 곧바로 Obsidian에서 열면 자동 동기화가 실행될 위험이 있다. 별도 Vault로 열어 렌더링을 검사하려면 먼저 **복원본에서만** Obsidian Git 플러그인을 비활성화하고 Git 작업이 실행되지 않는 상태를 만들어야 한다. 실제 Vault나 GitHub의 설정은 변경하지 않는다.
- 복구 연습이 끝나면 검증에 사용한 임시 Vault를 닫고, 필요할 때 직접 삭제한다. 스크립트는 임시 폴더도 자동 삭제하지 않는다.

## 실수로 지웠거나 깨졌을 때

1. **추가 자동 동기화부터 멈추고**, 현재 상태의 Vault를 별도 백업한다. 문제가 다른 기기로 퍼지지 않도록 한다.
2. 단일 파일/노트 복원은 Git 이력에서 변경 내용을 확인하고 파일 단위로 복구한다. 전체 저장소를 초기화하지 않는다.
3. 대규모 손상은 마지막 정상 ZIP을 임시 디렉터리에 복원해 내용을 확인하고, 필요 파일만 옮긴다.
4. 다른 기기에서 오프라인 변경이 있었다면 원격 최신 기록과 해당 기기의 로컬 변경을 대조한 뒤 병합한다.
5. \`git reset --hard\`, \`git clean -fd\`, 강제 push는 보호할 로컬 파일을 삭제할 수 있으므로 복구 수단으로 사용하지 않는다.

## 백업 운영 권장

- **주 1회** 또는 큰 CSS/플러그인 업데이트 전에 수동 전체 백업
- **월 1회** ZIP 해시 검증과 임시 폴더 복구 테스트
- 다른 기기로 이동하기 전 수동 Commit-and-sync 성공 확인
- 백업 파일 보관 주기·위치·저장공간은 직접 결정한다. 이 스크립트는 오래된 백업을 **자동 삭제하지 않는다**.
- 데스크탑에서 같은 백업 절차를 적용할 때는 먼저 \`.github/OBSIDIAN_SYNC.md\`의 데스크탑 점검 체크리스트를 따른다.

