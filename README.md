# 작은정원 — 폴라로이드 정원 🌱

사진 속에 문장이 살고 있는, 밀착 폴라로이드 형식의 사이트입니다.
가로든 세로든 정방형이든 — 찍은 비율 그대로 폴라로이드 프레임에 담깁니다.

## 구조

```
├── index.html      ← 메인 (폴라로이드 월)
├── admin.html      ← 가드너의 방 (사진 올리는 어드민)
├── photos.json     ← 사진 목록 (이 파일이 정원의 장부)
├── photos/         ← 사진 파일이 쌓이는 폴더
├── css/style.css   ← 디자인 (맨 위 :root 변수만 바꾸면 톤 전체가 바뀜)
└── js/main.js      ← photos.json을 읽어 월을 그리는 스크립트
```

## 처음 올리기 (GitHub Pages)

1. 새 저장소를 만들고 이 폴더 전체를 업로드 (또는 `git push`)
2. 저장소 → **Settings → Pages** → Branch를 `main`, 폴더 `/ (root)`로 저장
3. 1–2분 뒤 `https://아이디.github.io/저장소명/` 에서 확인
4. 커스텀 도메인(pretty-garden.co.kr)은 Pages 설정의 Custom domain에 입력 +
   DNS에서 CNAME을 `아이디.github.io`로 연결

## 사진 올리는 법 (admin.html)

사이트 주소 뒤에 `/admin.html` 을 붙여 접속합니다.

**방법 A — 깃허브로 바로 발행 (추천)**
1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens**
2. 이 저장소만 선택하고 Permissions에서 **Contents: Read and write** 부여
3. admin에서 사진을 놓고, 캡션 쓰고, 저장소/토큰 입력 후 "정원에 심기"
   - 토큰은 화면에서만 쓰이고 저장되지 않습니다 (새로고침하면 사라짐)

**방법 B — 토큰 없이**
1. admin에서 사진을 놓고 "파일로 내려받아 직접 올리기"
2. 내려받은 사진 → 저장소 `photos/` 폴더에 업로드
3. 내려받은 `photos.json` → 저장소 루트에 덮어쓰기

## photos.json 형식

```json
{
  "photos": [
    { "src": "photos/no001.jpg", "no": "001", "cap": "창가의 아침", "date": "2026-07" }
  ]
}
```

- 목록의 **뒤에 추가된 사진이 정원의 맨 위**에 걸립니다 (최신순)
- `cap`(캡션)은 비워도 됩니다 — 글은 사진 안에 있으니까
- 사진이 하나도 없으면 "사진이 놓일 자리" 빈 프레임이 열립니다

## 톤 바꾸기

`css/style.css` 맨 위 `:root`의 변수 여섯 개가 전부입니다.

```css
--board : 보드(배경)    --paper : 폴라로이드 종이
--ink   : 먹색(글자)    --moss  : 포인트 초록
```

— PRETTY GARDEN, 2026
