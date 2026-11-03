# DevPedia — V1 전체 API 명세서

> V1 보완본 · 공통 경계 정책: [09 확정 정책](09_확정정책_경계조건.md) · 구현 순서: [08 Slice 계획](08_구현_순서_완료조건.md)

- [1. 공통 계약](#1-공통-계약)
- [2. 목록·검색 계약](#2-목록검색-계약)
- [3. 전체 목록](#3-전체-목록)
- [4. API별 상세](#4-api별-상세)

## 1. 공통 계약

Base path는 `/api/v1`이다. 전체 목록 표의 경로는 이 경로에 이어 붙인다. JSON은 camelCase이며 성공 응답은 DTO를 직접 반환한다. 204는 본문과 Content-Type이 없다. 오류는 application/problem+json이며 06의 코드·구조를 따른다.

JSON 요청은 Content-Type: application/json, 로그인만 application/x-www-form-urlencoded다. V1에 정의한 POST/PUT/PATCH/DELETE는 세션 쿠키와 X-CSRF-TOKEN을 사용한다. 인증 전에도 csrf API로 세션·토큰을 받는다. 회원 API의 미인증은 401, 다른 작성자의 리소스는 403이다. 단, 본인 지원서 조회·철회는 본인 조건으로 조회하여 타인 지원서에 404를 반환한다. CSRF가 없거나 잘못되면 인증 검사보다 먼저 403이 날 수 있다.

모든 경로 ID는 양수 Long이다. 필터와 DTO의 ID도 같은 범위를 따른다. 형식 오류는 INVALID_QUERY(400), 정의되지 않은 JSON 필드·파싱 실패는 INVALID_JSON(400), DTO 필드 오류는 VALIDATION_FAILED(400), 지원 역할·참조·날짜 등 의미 오류는 각 422 코드다. GET은 본문을 받지 않는다. 표에 없는 공통 실패도 06을 적용한다.

201은 표에 지정한 Location을 반환한다. 댓글 생성 응답의 Location은 댓글 목록 URI다. 생성된 commentId는 응답 본문에서 얻는다. 단일 댓글 GET API는 없다. 회원가입은 가입 후 자동 로그인하지 않는다. 작성자·지원자 ID는 서버 principal에서 얻으며 요청 본문에 넣지 않는다.

## 2. 목록·검색 계약

| 파라미터 | 허용값·기본값 | 적용 |
|---|---|---|
| page | 0 이상, 기본 0 | 모든 페이지 목록 |
| size | 1..100, 기본 20 | 모든 페이지 목록 |
| q | trim 후 1..100자, 빈 값은 400 | 공개 모집 목록 |
| type | PROJECT/STUDY | 공개 모집 목록 |
| status | OPEN/CLOSED | 공개 모집 목록 |
| roleId | 양수 Long | 해당 역할이 있는 모집글 |
| techStackIds | 쉼표로 구분한 양수 ID, 최대 50개·중복 불가 | 기술 중 하나 이상 포함 |
| workMode | ONLINE/OFFLINE/HYBRID | 공개 모집 목록 |
| sort | CREATED_DESC 기본, DEADLINE_ASC | 공개 모집 목록 |
| status | UNDER_REVIEW/APPROVED/REJECTED/WITHDRAWN/AUTO_CLOSED | 내 지원·모집자 지원 목록 |
| slotId | 해당 글의 양수 모집 역할 ID | 모집자 지원 목록 |

서로 다른 모집 필터는 AND, 기술 배열 안에서는 OR다. 검색은 제목 OR 본문의 부분 문자열이며 `%`, `_`는 와일드카드가 아닌 입력 문자로 escape한다. 기준 ID 필터에 실제 데이터가 없으면 빈 목록이다. 모집자 지원 목록의 slotId는 잘못된 소속이면 SLOT_NOT_FOUND다.

CREATED_DESC는 createdAt DESC,id DESC다. DEADLINE_ASC는 applicationDeadlineDate ASC NULL LAST,id DESC다. 지원 목록은 submittedAt DESC,applicationId DESC, 댓글은 createdAt ASC,commentId ASC, 북마크는 createdAt DESC,postId DESC다. 같은 쿼리 조건으로 totalElements를 계산하고 범위 밖 페이지도 200·빈 items를 반환한다. 허용하지 않는 쿼리 키와 같은 단일 키의 중복 전달은 INVALID_QUERY다.

## 3. 전체 목록

| 번호 | 기능 | Method | 경로 | 성공 |
|---|---|---|---|---|
| [A01](#a01) | CSRF 토큰 | GET | `/auth/csrf` | 200 |
| [A02](#a02) | 회원가입 | POST | `/auth/signup` | 201 |
| [A03](#a03) | 로그인 | POST | `/auth/login` | 200 |
| [A04](#a04) | 로그아웃 | POST | `/auth/logout` | 204 |
| [A05](#a05) | 내 계정 | GET | `/auth/me` | 200 |
| [P01](#p01) | 공개 프로필 | GET | `/members/{memberId}` | 200 |
| [P02](#p02) | 내 프로필 | GET | `/me/profile` | 200 |
| [P03](#p03) | 프로필 교체 | PUT | `/me/profile` | 200 |
| [R01](#r01) | 역할 목록 | GET | `/roles` | 200 |
| [R02](#r02) | 기술 목록 | GET | `/tech-stacks` | 200 |
| [B01](#b01) | 모집글 목록 | GET | `/recruitment-posts` | 200 |
| [B02](#b02) | 모집글 상세 | GET | `/recruitment-posts/{postId}` | 200 |
| [B03](#b03) | 모집글 생성 | POST | `/recruitment-posts` | 201 |
| [B04](#b04) | 모집글 수정 | PATCH | `/recruitment-posts/{postId}` | 200 |
| [B05](#b05) | 직접 마감 | PUT | `/recruitment-posts/{postId}/closure` | 204 |
| [B06](#b06) | 모집글 공개 제거 | DELETE | `/recruitment-posts/{postId}` | 204 |
| [B07](#b07) | 내 모집글 | GET | `/me/recruitment-posts` | 200 |
| [S01](#s01) | 지원서 제출 | POST | `/recruitment-posts/{postId}/slots/{slotId}/applications` | 201 |
| [S02](#s02) | 내 지원 목록 | GET | `/me/applications` | 200 |
| [S03](#s03) | 내 지원 상세 | GET | `/me/applications/{applicationId}` | 200 |
| [S04](#s04) | 지원 철회 | PUT | `/me/applications/{applicationId}/withdrawal` | 204 |
| [S05](#s05) | 모집자 지원 목록 | GET | `/recruitment-posts/{postId}/applications` | 200 |
| [S06](#s06) | 모집자 지원 상세 | GET | `/recruitment-posts/{postId}/applications/{applicationId}` | 200 |
| [S07](#s07) | 지원 승인 | PUT | `/recruitment-posts/{postId}/applications/{applicationId}/approval` | 200 |
| [S08](#s08) | 지원 거절 | PUT | `/recruitment-posts/{postId}/applications/{applicationId}/rejection` | 200 |
| [C01](#c01) | 댓글 목록 | GET | `/recruitment-posts/{postId}/comments` | 200 |
| [C02](#c02) | 댓글 작성 | POST | `/recruitment-posts/{postId}/comments` | 201 |
| [C03](#c03) | 댓글 수정 | PATCH | `/comments/{commentId}` | 200 |
| [C04](#c04) | 댓글 삭제 | DELETE | `/comments/{commentId}` | 204 |
| [K01](#k01) | 내 북마크 목록 | GET | `/me/bookmarks` | 200 |
| [K02](#k02) | 북마크 추가 | PUT | `/me/bookmarks/{postId}` | 204 |
| [K03](#k03) | 북마크 해제 | DELETE | `/me/bookmarks/{postId}` | 204 |

## 4. API별 상세

<a id="a01"></a>
### A01 · CSRF 토큰

`GET /api/v1/auth/csrf`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | 없음 |
| 성공 | 200 · CsrfResponse |
| Location | `—` |
| 업무 오류 | — |

현재 세션의 요청용 토큰을 반환한다. 필요한 경우 세션을 생성한다. 응답 Cache-Control: no-store.


<a id="a02"></a>
### A02 · 회원가입

`POST /api/v1/auth/signup`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | SignupRequest |
| 성공 | 201 · MyAccountResponse |
| Location | `/api/v1/members/{memberId}` |
| 업무 오류 | VALIDATION_FAILED, DUPLICATE_EMAIL, DUPLICATE_NICKNAME |

입력 정규화 → 이메일·닉네임 중복 확인 → BCrypt 인코딩 → 회원 저장. 자동 로그인하지 않는다.


<a id="a03"></a>
### A03 · 로그인

`POST /api/v1/auth/login`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | form: email, password |
| 성공 | 200 · MyAccountResponse |
| Location | `—` |
| 업무 오류 | BAD_CREDENTIALS |

formLogin 필터가 인증한다. 성공 시 세션 ID를 교체하고 JSON을 반환한다. 로그인된 세션에서 재로그인은 인증된 계정으로 세션 인증을 갱신한다.


<a id="a04"></a>
### A04 · 로그아웃

`POST /api/v1/auth/logout`

| 항목 | 계약 |
|---|---|
| 권한 | 세션 종료 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | — |

세션과 SecurityContext를 제거하고 JSESSIONID 쿠키를 만료시킨다. 인증 정보가 없는 경우에도 유효 CSRF 요청이면 204.


<a id="a05"></a>
### A05 · 내 계정

`GET /api/v1/auth/me`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | 없음 |
| 성공 | 200 · MyAccountResponse |
| Location | `—` |
| 업무 오류 | MEMBER_NOT_FOUND |

principal의 memberId로 현재 회원을 조회한다. 닉네임은 현재 DB 값을 반환한다.


<a id="p01"></a>
### P01 · 공개 프로필

`GET /api/v1/members/{memberId}`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | memberId: 양수 Long |
| 성공 | 200 · PublicProfileResponse |
| Location | `—` |
| 업무 오류 | MEMBER_NOT_FOUND |

공개 필드와 관심 역할·기술만 반환한다. email과 passwordHash를 포함하지 않는다.


<a id="p02"></a>
### P02 · 내 프로필

`GET /api/v1/me/profile`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | 없음 |
| 성공 | 200 · MyProfileResponse |
| Location | `—` |
| 업무 오류 | MEMBER_NOT_FOUND |

현재 회원의 공개 필드와 본인 email을 반환한다.


<a id="p03"></a>
### P03 · 프로필 교체

`PUT /api/v1/me/profile`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | ProfileReplaceRequest |
| 성공 | 200 · MyProfileResponse |
| Location | `—` |
| 업무 오류 | VALIDATION_FAILED, DUPLICATE_NICKNAME, REFERENCE_NOT_FOUND, INVALID_REFERENCE_SELECTION |

본인 조회 → 닉네임 중복·참조 ID 검증 → 필드와 관심 역할·기술 연결 전체 교체. 실패하면 전체 변경을 취소한다.


<a id="r01"></a>
### R01 · 역할 목록

`GET /api/v1/roles`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | 없음 |
| 성공 | 200 · ReferenceListResponse |
| Location | `—` |
| 업무 오류 | — |

displayOrder ASC, id ASC로 전체 기준 목록을 반환한다. 페이징하지 않는다.


<a id="r02"></a>
### R02 · 기술 목록

`GET /api/v1/tech-stacks`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | 없음 |
| 성공 | 200 · ReferenceListResponse |
| Location | `—` |
| 업무 오류 | — |

displayOrder ASC, id ASC로 전체 기준 목록을 반환한다. 페이징하지 않는다.


<a id="b01"></a>
### B01 · 모집글 목록

`GET /api/v1/recruitment-posts`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | q,type,status,roleId,techStackIds,workMode,sort,page,size |
| 성공 | 200 · Page<RecruitmentPostSummary> |
| Location | `—` |
| 업무 오류 | INVALID_QUERY |

정의된 검색 필터를 AND로 결합한다. 기술 ID 간은 OR다. 제목·본문의 부분 문자열을 검색한다. REMOVED는 제외한다.


<a id="b02"></a>
### B02 · 모집글 상세

`GET /api/v1/recruitment-posts/{postId}`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | postId: 양수 Long |
| 성공 | 200 · RecruitmentPostDetail |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND |

공개 글과 작성자·모집 역할·기술·역할별 승인 수를 반환한다. 댓글은 별도 API로 조회한다.


<a id="b03"></a>
### B03 · 모집글 생성

`POST /api/v1/recruitment-posts`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | RecruitmentPostCreateRequest |
| 성공 | 201 · RecruitmentPostDetail |
| Location | `/api/v1/recruitment-posts/{postId}` |
| 업무 오류 | VALIDATION_FAILED, INVALID_POST_DATES, INVALID_POST_SLOTS, REFERENCE_NOT_FOUND, INVALID_REFERENCE_SELECTION |

회원 ID를 작성자로 사용한다. 날짜·기준정보·역할 정원을 검사하고 글·역할·기술을 함께 저장한다. 초기 상태 OPEN.


<a id="b04"></a>
### B04 · 모집글 수정

`PATCH /api/v1/recruitment-posts/{postId}`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | RecruitmentPostPatchRequest |
| 성공 | 200 · RecruitmentPostDetail |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, POST_ALREADY_CLOSED, POST_HAS_APPLICATIONS, EMPTY_PATCH, INVALID_POST_DATES, INVALID_POST_SLOTS, REFERENCE_NOT_FOUND, INVALID_REFERENCE_SELECTION |

소유권 → OPEN → 변경 필드 확인. 지원 이력 이후 날짜·slots 변경은 금지한다. nullable 값 제거와 필드 생략을 구분한다.


<a id="b05"></a>
### B05 · 직접 마감

`PUT /api/v1/recruitment-posts/{postId}/closure`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND |

OPEN을 CLOSED/OWNER로 변경하고 남은 UNDER_REVIEW를 AUTO_CLOSED/POST_CLOSED로 종료한다. 이미 CLOSED면 204.


<a id="b06"></a>
### B06 · 모집글 공개 제거

`DELETE /api/v1/recruitment-posts/{postId}`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND |

작성자의 글을 REMOVED로 변경한다. 이미 REMOVED면 204다. 같은 트랜잭션에서 검토 중 지원을 AUTO_CLOSED/POST_REMOVED로 종료한다. 연결 데이터의 조회 정책은 09를 적용한다.


<a id="b07"></a>
### B07 · 내 모집글

`GET /api/v1/me/recruitment-posts`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | page,size |
| 성공 | 200 · Page<RecruitmentPostSummary> |
| Location | `—` |
| 업무 오류 | INVALID_QUERY |

현재 회원이 작성한 OPEN/CLOSED 글만 최신순으로 조회한다.


<a id="s01"></a>
### S01 · 지원서 제출

`POST /api/v1/recruitment-posts/{postId}/slots/{slotId}/applications`

| 항목 | 계약 |
|---|---|
| 권한 | 회원·자기 글 제외 |
| 입력 | ApplicationCreateRequest |
| 성공 | 201 · MyApplicationDetail |
| Location | `/api/v1/me/applications/{applicationId}` |
| 업무 오류 | POST_NOT_FOUND, SLOT_NOT_FOUND, POST_ALREADY_CLOSED, APPLICATION_PERIOD_ENDED, SELF_APPLICATION_FORBIDDEN, ACTIVE_APPLICATION_EXISTS, ALREADY_APPROVED_FOR_POST, REAPPLY_REJECTED_SLOT, SLOT_FILLED |

글·역할 소속 → OPEN → 접수 날짜 → 자기 글 금지 → 기존 지원 이력 → 역할 여유 → 동기·링크 snapshot 저장.


<a id="s02"></a>
### S02 · 내 지원 목록

`GET /api/v1/me/applications`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | page,size,status |
| 성공 | 200 · Page<MyApplicationSummary> |
| Location | `—` |
| 업무 오류 | INVALID_QUERY |

현재 회원의 지원서를 submittedAt DESC, applicationId DESC로 반환한다. status 생략 시 전체 지원 상태.


<a id="s03"></a>
### S03 · 내 지원 상세

`GET /api/v1/me/applications/{applicationId}`

| 항목 | 계약 |
|---|---|
| 권한 | 지원자 본인 |
| 입력 | applicationId: 양수 Long |
| 성공 | 200 · MyApplicationDetail |
| Location | `—` |
| 업무 오류 | APPLICATION_NOT_FOUND |

applicationId와 본인 memberId를 함께 조건으로 조회한다. 타인의 지원은 존재해도 404.


<a id="s04"></a>
### S04 · 지원 철회

`PUT /api/v1/me/applications/{applicationId}/withdrawal`

| 항목 | 계약 |
|---|---|
| 권한 | 지원자 본인 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | APPLICATION_NOT_FOUND, APPLICATION_STATE_CONFLICT |

본인의 UNDER_REVIEW 지원을 WITHDRAWN으로 변경한다. 결정 시각·지원자 ID를 기록한다.


<a id="s05"></a>
### S05 · 모집자 지원 목록

`GET /api/v1/recruitment-posts/{postId}/applications`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | page,size,slotId,status |
| 성공 | 200 · Page<OwnerApplicationSummary> |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, SLOT_NOT_FOUND, INVALID_QUERY |

글 작성자 확인 후 해당 글의 지원서를 조회한다. 선택 slotId는 해당 글 소속이어야 한다. 최신 지원순.


<a id="s06"></a>
### S06 · 모집자 지원 상세

`GET /api/v1/recruitment-posts/{postId}/applications/{applicationId}`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | postId,applicationId: 양수 Long |
| 성공 | 200 · OwnerApplicationDetail |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, APPLICATION_NOT_FOUND |

글 소유권 확인 후 applicationId와 postId로 조회한다. 다른 글의 지원은 404.


<a id="s07"></a>
### S07 · 지원 승인

`PUT /api/v1/recruitment-posts/{postId}/applications/{applicationId}/approval`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | 없음 |
| 성공 | 200 · OwnerApplicationDetail |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, APPLICATION_NOT_FOUND, APPLICATION_STATE_CONFLICT, POST_ALREADY_CLOSED, SLOT_FILLED |

글·소유권·지원 소속 → UNDER_REVIEW → OPEN → 정원 검사 후 APPROVED로 변경한다. 역할 충족·전체 모집 완료는 02 규칙을 적용한다.


<a id="s08"></a>
### S08 · 지원 거절

`PUT /api/v1/recruitment-posts/{postId}/applications/{applicationId}/rejection`

| 항목 | 계약 |
|---|---|
| 권한 | 글 작성자 |
| 입력 | 없음 |
| 성공 | 200 · OwnerApplicationDetail |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, APPLICATION_NOT_FOUND, APPLICATION_STATE_CONFLICT, POST_ALREADY_CLOSED |

글·소유권·지원 소속 → UNDER_REVIEW → OPEN 확인 후 REJECTED로 변경한다. 거절 사유 입력 필드는 없다.


<a id="c01"></a>
### C01 · 댓글 목록

`GET /api/v1/recruitment-posts/{postId}/comments`

| 항목 | 계약 |
|---|---|
| 권한 | 공개 |
| 입력 | page,size |
| 성공 | 200 · Page<CommentResponse> |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND, INVALID_QUERY |

공개 글 확인 후 루트·답글을 flat items로 반환한다. createdAt ASC, commentId ASC 정렬.


<a id="c02"></a>
### C02 · 댓글 작성

`POST /api/v1/recruitment-posts/{postId}/comments`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | CommentCreateRequest |
| 성공 | 201 · CommentResponse |
| Location | `/api/v1/recruitment-posts/{postId}/comments` |
| 업무 오류 | POST_NOT_FOUND, COMMENT_CREATION_CLOSED, COMMENT_NOT_FOUND, INVALID_COMMENT_PARENT, COMMENT_ALREADY_REMOVED |

글 OPEN 확인. parentCommentId가 있으면 같은 글의 내용이 남은 루트인지 확인한다.


<a id="c03"></a>
### C03 · 댓글 수정

`PATCH /api/v1/comments/{commentId}`

| 항목 | 계약 |
|---|---|
| 권한 | 댓글 작성자 |
| 입력 | CommentUpdateRequest |
| 성공 | 200 · CommentResponse |
| Location | `—` |
| 업무 오류 | COMMENT_NOT_FOUND, COMMENT_ALREADY_REMOVED |

내용이 남은 본인 댓글만 수정한다. parentCommentId는 변경할 수 없다. editedAt을 기록한다.


<a id="c04"></a>
### C04 · 댓글 삭제

`DELETE /api/v1/comments/{commentId}`

| 항목 | 계약 |
|---|---|
| 권한 | 댓글 작성자 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | COMMENT_NOT_FOUND |

답글 없는 루트·답글은 삭제한다. 답글 있는 루트는 내용만 제거한다. 이미 내용 제거된 본인 루트는 204.


<a id="k01"></a>
### K01 · 내 북마크 목록

`GET /api/v1/me/bookmarks`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | page,size |
| 성공 | 200 · Page<BookmarkResponse> |
| Location | `—` |
| 업무 오류 | INVALID_QUERY |

본인 저장 항목을 createdAt DESC, postId DESC로 조회한다.


<a id="k02"></a>
### K02 · 북마크 추가

`PUT /api/v1/me/bookmarks/{postId}`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | POST_NOT_FOUND |

공개 글을 확인하고 본인·글 조합을 저장한다. 이미 저장되어 있으면 그대로 204.


<a id="k03"></a>
### K03 · 북마크 해제

`DELETE /api/v1/me/bookmarks/{postId}`

| 항목 | 계약 |
|---|---|
| 권한 | 회원 |
| 입력 | 없음 |
| 성공 | 204 · 없음 |
| Location | `—` |
| 업무 오류 | — |

본인·글 매핑만 제거한다. 매핑이 없어도 204.

