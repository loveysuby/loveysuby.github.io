# TESTING repository 

Loveysuby`s first blog

Coming soon~

## 개발기록 (4월 26일)
잘 진행되고 있는데, about.md 파일이 블로그 빌드 과정에서 실종된다.

메인 URL로 접속하면 이 파일이 최우선순위로 올라감
markdown 파일과 root 디렉토리에서 겹칠 시 (ex. about.md)
build 과정에서 오류 띄우고 html 먼저 띄움 (index.html이 default 값인듯.)

#### ide 상에서 테스트 하기 
  `bundle exec jekyll serve --host 0.0.0.0`  
  + 이거 켜놓고 프로젝트-실행 포트-4000번 포트 URL 접속
  + 빌드된 상태에서 실시간으로 파일 변경될 때마다 재빌드함.
  
#### TODO : about 메뉴 누를 때 /about/ 디렉토리로 접속하면
1. IDE root의 about.md 띄우기  +  글 쓰는 방법 알아보고 써보기
2. 카테고리, 태그 별로 쓰는 법 다 다른듯. 코드 창 구현 등 알아보기


## 개발기록 (4월 25일)

- 0425일자로 호스팅 완료! https://loveysuby.github.io

### Todo
1. 하지만 뭔가 이상하다... 내맘대로 커스텀이 안 되는 한계가 존재  
(ex.footer 라던가, post,list,plain,page,about 등의 레이아웃이 안 불러와진다던가)

2. 그래서 9.1.4 버전이나 advance 는 지금 호스팅된거에 없는 파일들이 있다. 둘 다 같은 정적 사이트를 제공하는데, 파일 구조가 다른 걸 보면 두 가지 이유로 추측할 수 있다.
 1. 내가 잘못 받았음 (start 가이드용을 받아서 근본적으로 수정이 안되는 파일)
 2. 두개를 짬뽕?(이게 기본 설치법이라고?)
 3. 다른 사람들이 어케 했는지 보고 따라서 재구현
 4. 잘 받았고, 여기서 수정만 잘 하면 됨(그렇기엔 index.html 부터 난관..)
 
 
https://close-up.tistory.com/entry/jeckyll-Hydejack-%ED%85%8C%EB%A7%88-%EA%B4%80%EB%A6%AC  
https://kimss1502.github.io/%EB%B8%94%EB%A1%9C%EA%B9%85/2.-GitHub-pages-%EB%A1%9C-%EB%B8%94%EB%A1%9C%EA%B7%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0/

https://min9nim.github.io/2018/07/jekyll-theme/

https://github.com/mmistakes/minimal-mistakes/issues/1394

https://devinlife.com/howto%20github%20pages/new-blog-from-template/

https://lazyren.github.io/devlog/hydejack-post-writing-tips-tricks.html  

잘만들어논사람(프로버전)  
https://github.com/junha1125/junha1125.github.io  
jekyll 구조  
https://suhwan.dev/2017/06/23/jekyll-project-structure/


마크다운 문법(이제 구글링 하지 말고 익혀두자)  
https://heropy.blog/2017/09/30/markdown/  
https://theorydb.github.io/envops/2019/05/22/envops-blog-how-to-use-md/
