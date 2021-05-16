# Notice: Unable to update due to Github pages build error. (2021-05-14)
1. 2021년 05월 13일자로 사지방에서 github pages가 빌드되지 않습니다. 또한 google SSO(single side-on) login access 오류로 인해 학교 계정 및 BOJ 접속에 오류를 겪고 있습니다.  
2. `Jekyll theme based blog` 는 수많은 우여곡절 속에 구축되었지만, 개발 환경이 정상화될 때까지는 당분간 유지보수가 어렵다고 판단하였습니다. 글감 혹은 정리해둘 내용은 Web-ide상에 작성해두었다가 문제를 해결한 후 업로드를 시도할 예정입니다.   

3. 아쉬운 마음을 안고 당분간 개발환경 개선에 힘쓰도록 하겠습니다. 화이팅,,,

### TESTING repository 

Loveysuby's first blog

Coming soon~

## 개발기록 (4월 28일 ~ 5월 2일)
- 컴퓨터 몇일 못 써서 독스 프린트해둔걸로 좀 읽어봤다. 해결한 궁금증은 아래와 같다.  
	- 왜 about.md가 인식이 안되는가?
	- markdown 파일을 어떻게 post로 인식하는가?
	
- 앞으로 해결해야 할 목표는 아래와 같다.
	- code block, KaTex, table 등 부가기능 사용법
	- SEO 등록
	- google 검색엔진 등록, 사이트 소유권 확인
	- 사이드바 메뉴 확정짓기, tag 만 있는 페이지 구현하기
	- `fonts` 설정하기, Google fonts 끌어다 써보기
	
### 해결한 궁금증에 대한 기록
- 두 질문은 post를 인식하는 방법을 알면 해결할 수 있는 같은 문제였다!

	- 우선 `_posts` 폴더에 카테고리 별로 폴더를 나누고, 그 안에 `md` 파일을 넣어놨다.  
	- 폴더만 쪼개논다고 되는게 아니라, md파일에서 layout을 작성할 때 `category: xxx` 형태로 어느 카테고리에 들어가야 하는지를 지정할 수 있음을 발견했다.  
	- `about.md`의 경우는 `/about/` 디렉토리로 접근했을 때 바로 띄워질 수 있도록 구현해야 하는 문제가 있었는데, 이는 테마 제공처인 hydejack의 `starter-kit`에서 답을 얻었다.   
	결론만 말하면, post 파일의 헤더 부분에서 특정 URL을 `permalink: /about/` 처럼 달아주면 바로 연결이 된다.
	
