---
layout: post
title: 카테고리 별로 글을 나눠보았다!
category: example
image: /assets/img/blog/city.jpeg
accent_image: 
  background: url('/assets/img/blog/jj-ying.jpg') center/cover
  overlay: false
accent_color: '#ccc'
theme_color: '#ccc'
description: >
  header에서 description은 이 부분에서 나타난다. 
invert_sidebar: true
---

* this unordered seed list will be replaced by the toc
{:toc}


## jekyll에 대해 알아낸 사실들

markdown 파일로 글을 작성할 때, header에 `category: (게시되기를 원하는 카테고리)` 옵션을 넣어준다.

모든 포스트는 `_post/(각각의 카테고리)/...` 에서 `year-month-day-title.md` 형식으로 구성한다.

`image`는 포스트를 대표하는 이미지를 가져오는듯. 이미지 경로를 알아두고, 제목 짓는 방식을 획일화하자.

invert_sidebar : 해당 포스트에서 사이드바 글씨가 반전되는 옵션. true면 반전된다.
- 좀 느릿하게 변하는 감 있음  

accent_image : 포스트 들어오면 사이드바의 background image를 특정 이미지로 바꾼다.  
- `background : url('이미지 경로') css-option` 형태로 작성된다.  
  - css-option ex: center/cover     

## Adding notes

You can add a note by adding the `note` class to a paragraph.

Example:

노트하고 싶은 내용 위에 다 쓰고, 밑에 `{:.note}` 넣어준다. 
{:.note}

Markdown:
```markdown
노트하고 싶은 내용
{:.note}
```

Edit the `note` key in `_data/strings.yml` to change the wording of the default label.
To add a note with a specific label, add a `title` attribute:

```markdown
A custom label.
{:.note title="Attention"}
```

A custom label.
{:.note title="Attention"}


## toc 추가하는 법
toc는 아래 코드만 달면 되는듯!
레이아웃 적는 부분 밑에 함께 달아주자. 
항목은 포스트에서 `#~####` 까지 표현된 부분을 정하는듯.
`#`의 개수에 따라 하위 항목으로 내려간다.
```markdown
* toc
{:toc}
```

```markdown
순서 없는 toc
* this unordered seed list will be replaced by the toc
{:toc}

순서 있는 toc
1. this ordered seed list will be replaced by the toc
{:toc}
```