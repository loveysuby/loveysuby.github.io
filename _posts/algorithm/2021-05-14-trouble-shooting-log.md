---
layout: post
title: Trouble shooting log
category: algorithm
description: >
  배포 전에 발생한 문제를 정리해본다.
sitemap: false
hide_last_modified: false
---

### 5월 14일 
이전 포스팅에서 이런 부분이 있었다.
	> 결론만 말하면, post 파일의 헤더 부분에서 특정 URL을 `permalink: /about/` 처럼 달아주면 바로 연결이 된다.  

이를 해결하기 위해 `_posts/about/about.md` 식으로 파일을 넣어 놨는데, 인식이 안 되었다.

현재까지 파악한 바에 따르면 `permalink` 옵션은 `markdown` 파일이 `root directory`에 있어야 인식되는 것 같다.
