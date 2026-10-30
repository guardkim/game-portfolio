# 김경호 게임 개발 포트폴리오

게임회사에 소개하기 위한 한국어 포트폴리오 사이트입니다. 프로젝트를 선택하면 실제 게임 화면, 담당 업무와 문제 해결 과정을 한 화면에서 읽을 수 있습니다. HTML, CSS, JavaScript로 구성되어 별도 빌드 없이 GitHub Pages에서 서비스할 수 있습니다.

프로젝트 목차는 각 프로젝트의 주소(`#gunpowder`, `#cravant`, `#cyberfunk`, `#swordlord`)로 연결됩니다. JavaScript를 사용할 때는 선택한 프로젝트를 표시하고, 사용할 수 없을 때는 네 프로젝트를 모두 읽을 수 있습니다. 포트폴리오 PDF 다운로드와 이메일·GitHub 링크를 제공합니다.

## 로컬 미리보기

프로젝트 폴더에서 다음 명령을 실행한 뒤 <http://localhost:4173>을 엽니다.

```sh
python -m http.server 4173 --directory dist
```

정적 파일과 링크를 검사하려면 다음 명령을 실행합니다.

```sh
python scripts/check_site.py
node scripts/check_navigation.js
```

검사는 네 프로젝트의 제목·목차 연결, 이미지 설명·크기, 내부 링크, 포트폴리오 PDF만 배포되는지와 주소 변경에 따른 프로젝트 선택을 확인합니다. 실제 화면 전환과 반응형 배치는 브라우저에서 확인하세요.

## 수정 위치

| 파일 | 내용 |
| --- | --- |
| `dist/index.html` | 소개, 경력, 프로젝트 설명, 연락처, 다운로드 링크 |
| `dist/styles.css` | 레이아웃, 색상, 글꼴, 반응형 화면, CSS 모션 |
| `dist/script.js` | 프로젝트 선택과 주소 연결 |
| `DESIGN.md` | 디자인 방향, 색상·타이포그래피·레이아웃 원칙 |
| `dist/assets/images/` | 사용자 포트폴리오에서 추출한 프로젝트 이미지 |
| `dist/assets/documents/kim-kyoungho-portfolio.pdf` | 전화번호를 삭제한 공개용 포트폴리오 |
| `.github/workflows/deploy.yml` | `main` 변경 시 검사와 GitHub Pages 배포 |

문서와 이미지는 파일명을 유지한 채 교체하면 링크를 그대로 사용할 수 있습니다. 파일명을 바꾸면 `index.html`의 연결 경로도 함께 수정하세요. PDF 문서의 작성 시점 이후 경력과 프로젝트 진행 상황은 직접 갱신해야 합니다.

모든 사이트 내부 경로는 상대 경로를 사용합니다. `https://사용자명.github.io/` 사용자 페이지와 `https://사용자명.github.io/저장소명/` 프로젝트 페이지에서 같은 파일을 사용할 수 있습니다. 수정할 때 `/assets/...`처럼 도메인 루트를 기준으로 하는 경로를 넣지 마세요.

## 새 저장소에 배포

1. GitHub에 새 공개 저장소를 만듭니다. 기존 개인 사이트를 유지하려면 `game-portfolio` 같은 별도 저장소명을 사용합니다.
2. 이 프로젝트 전체를 저장소의 `main` 브랜치에 올립니다. `dist` 폴더와 `.github/workflows/deploy.yml`이 모두 포함되어야 합니다.
3. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
4. **Actions → Deploy to GitHub Pages → Run workflow**를 실행하거나 `main`에 변경을 푸시합니다.
5. 배포가 완료되면 Actions 실행 결과 또는 Settings → Pages에 표시되는 주소를 엽니다.

워크플로는 사이트와 프로젝트 선택 검사를 통과한 뒤 `dist/`만 배포합니다. 새 저장소의 기본 브랜치가 `main`이 아니라면 워크플로의 `branches`도 맞춰야 합니다.

배포 설정은 [GitHub 공식 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)를 참고하세요.

## 자료 출처와 공개 범위

내용과 프로젝트 이미지는 사용자가 제공한 `김경호 이력서 .pdf`와 `김경호_포트폴리오.pdf`를 바탕으로 작성했습니다. 페이지 번호는 PDF 파일의 첫 페이지를 1쪽으로 센 번호입니다.

| 내용 | 출처 |
| --- | --- |
| 프로필, 경력, 학력, 기술 | 이력서, 기술 상세 3–4쪽 |
| GunPowder | 포트폴리오 8–19쪽 |
| CRAVANT | 포트폴리오 20–30쪽 |
| Cyberfunk Rider | 포트폴리오 31–42쪽 |
| 검물주 키우기 | 포트폴리오 43–50쪽 |

프로젝트 이미지를 교체하거나 설명을 보완할 때 위 원본 페이지와 대조하세요. 제공 문서 기준으로 검물주 키우기는 개발 중단 상태이며, 진행 중 과제는 완료 성과로 바꾸어 표현하지 않습니다.

이력서 PDF는 사이트에서 제공하지 않습니다. 다운로드용 포트폴리오는 전화번호를 실제 PDF 내용에서 삭제한 공개용 사본입니다. 이메일과 GitHub 링크, 나머지 경력·프로젝트 내용은 유지합니다. 원본 문서는 사용자 로컬 폴더에 보존되어 있습니다. PDF를 교체할 때는 공개용 파일을 사용하고, 다운로드 링크의 `?v=` 값과 표시된 파일 크기도 갱신하세요. 이전에 내려받은 파일이나 외부 캐시는 자동으로 갱신되지 않습니다.
