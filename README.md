# 🎨 PicBook - 아이를 위한 색칠공부 웹앱

3~4세 아이가 iPad와 Apple Pencil로 즐길 수 있는 색칠공부 웹앱입니다.
빌드 도구 없이 순수 HTML/CSS/JavaScript로 만들어져 GitHub Pages에 바로 올릴 수 있습니다.

## 특징

- 한 페이지에 자동차, 물고기, 강아지, 고양이, 코끼리, 나비, 해님, 집 그림을 하나씩 보여줍니다.
- 그림은 외곽선과 여러 면으로 나뉜 SVG로 그려져 있고, 아이가 원하는 면을 손가락이나 Apple
  Pencil로 톡 터치하면 선택한 색이 채워집니다(탭-채우기 방식이라 3~4세도 실패 없이 색칠할
  수 있어요).
- 화면 아래 12가지 크레용 색상 팔레트에서 색을 고를 수 있습니다.
- 모든 면을 다 칠하면 "🎉 잘했어요!" 축하 메시지가 나타납니다.
- 색칠한 내용은 기기의 localStorage에 자동 저장되어, 앱을 다시 열어도 이어서 볼 수 있습니다.
- ↺ 버튼으로 그림을 다시 하얗게 되돌릴 수 있고, ◀ ▶ 버튼으로 다음/이전 그림으로 이동합니다.
- iPad에서 홈 화면에 추가하면 Safari 주소창 없이 전체화면 앱처럼 실행됩니다.
- 실수로 확대/축소되거나 길게 눌러 메뉴가 뜨는 것을 막아 아이 혼자 조작해도 헤매지 않도록
  했습니다.

## 로컬에서 실행하기

빌드 과정이 필요 없습니다. 아무 정적 서버로 루트 폴더를 열면 됩니다.

```bash
npx serve .
# 또는
python3 -m http.server 8080
```

## 새 그림 추가하기

`js/pictures.js`에 그림 하나를 다음 형태로 추가하면 됩니다.

```js
{
  id: 'unique-id',
  name: '한글 이름',
  emoji: '🐣',
  svg: `
    <path class="region" data-name="부분1" d="..."/>
    <circle class="fixed" cx="0" cy="0" r="5" fill="#2b2b2b"/> <!-- 눈처럼 색칠 안 하는 장식 -->
  `
}
```

- `class="region"`: 아이가 탭해서 색칠할 수 있는 영역 (닫힌 도형이어야 합니다)
- `class="fixed"`: 눈, 수염처럼 색칠 대상이 아닌 고정 장식 (탭해도 반응하지 않음)
- 모든 도형은 `viewBox="0 0 500 400"` 좌표계를 기준으로 그립니다.

## GitHub Pages 배포

이 저장소에는 `main` 브랜치에 푸시할 때마다 자동으로 GitHub Pages에 배포하는 GitHub
Actions 워크플로가 포함되어 있습니다 (`.github/workflows/deploy-pages.yml`).

1. GitHub 저장소의 **Settings → Pages**로 이동합니다.
2. **Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
3. 이 브랜치를 `main`으로 머지(또는 푸시)하면 워크플로가 자동으로 실행되어 사이트를
   배포합니다.
4. 배포가 끝나면 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속할 수 있습니다.

빌드 단계가 없는 순수 정적 사이트이므로, Actions 없이 **Settings → Pages → Deploy from a
branch**로 설정해도 동일하게 동작합니다.
