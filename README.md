# text-editor.bio ✏️  
Tiptap + Next.js 기반 커스텀 리치 텍스트 에디터

`text-editor.bio` 는 블로그 포스트처럼 **“텍스트 구조를 보존하면서 스타일링”** 하기 좋은 웹 에디터입니다.  
Tiptap + Next.js 16 + Tailwind CSS 를 기반으로, 실제 서비스에 쓸 수 있는 수준의 툴바와 저장 로직을 구현했습니다.

> 배포 도메인: **https://text-editor.bio**

---

## ✨ 주요 기능

### 🧰 커스텀 툴바

- **폰트 패밀리 선택**
  - `Pretendard / Noto Sans KR / Nanum Gothic` 를 토글
  - `font-pretendard`, `font-noto-sans-kr`, `font-nanum-gothic` 클래스를 Tiptap 마크로 관리
- **폰트 사이즈 선택**
  - `10, 15, 16, 19, 24, 28, 30, 34, 38px` 등 프리셋 드롭다운
- **텍스트 스타일**
  - 굵게 / 이텔릭 / 밑줄 / 취소선
  - Tiptap의 `TextStyle` + 커스텀 `FontSize`, `FontFamilyClass` 확장 사용
- **텍스트 정렬**
  - 왼쪽 / 가운데 / 오른쪽 / 양쪽 정렬 (`TextAlign` extension)

### 🖼 이미지 업로드 & 드래그

- 상단 툴바의 **이미지 아이콘 클릭 → 로컬 파일 선택 → 에디터에 삽입**
  - 에디터 위로 이미지 파일을 드래그 & 드롭하면 `FileReader` 로 `data URL` 변환 후 `insertImage` 실행
  - 이미 삽입된 이미지를 에디터 내에서 드래그해 위치만 옮길 수 있음  
    (`application/x-prosemirror-node` 타입 체크로 내부 드래그와 외부 파일 드롭을 구분)
- 이미지 수 **최대 10개** 제한

### 🏷 해시태그 편집기

- `#해시태그를 추가해 보세요!` 버튼으로 첫 태그 생성
- 태그 클릭 시 인라인 편집
  - 입력 길이에 맞게 input width 자동 조절 (숨겨진 `<span>` 으로 width 계산)
- 포커스 아웃 시:
  - 내용이 비어 있으면 → 해당 태그 삭제
  - 기존 태그와 중복이면 → 중복 태그 정리
- `+ 해시태그 추가` 버튼으로 계속 추가 가능

### 📱 반응형 툴바

- **모바일**
  - 툴바 전체 가로 스크롤

### 💾 저장 로직 (예시)

- 에디터의 ProseMirror 문서를 **`EditorContentBlock[]` 구조로 변환**
  - `text / image / link` 블럭으로 나누어 직렬화
  - 텍스트 블럭은 `tags(strong, em, u, s)` 와 `styles(fontSize, fontFamily, color)` 를 보존
- 이미지:
  - 에디터에서는 우선 **base64 data URL** 로 관리
  - 저장 시, base64 → 파일 변환 → (예: S3) 업로드 → 반환된 URL로 교체
- `ContentRequest` 형태로 서버에 저장 API 호출

---

## 🧱 기술 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: `next/font/local` 로 Pretendard, Noto Sans KR, Nanum Gothic 로컬 호스팅
