---
date: 2022-01-01
description: SEO에 도움이 되는 메타 태그(meta tags)를 알아 봅니다. Title, Description, Canonical Tag, Alt tag, Robots, Open Graph, Header Tags, 반응형 디자인 Meta Tag 등
tags:
  - SEO
  - 메타태그
  - metatag
  - 오픈그래프
  - opengraph
  - 캐노니컬태그
  - canonicaltag
  - robots
---

# 웹사이트 SEO를 위한 메타 태그

## Title

- 타이틀은 브라우저 창(탭)에 표시된다.
- 60 characters 이하
- 4 단어 이상
- 문장은 주요 단어로 시작하는 게 좋다.

```html
<head>
  <title>타이틀을 적는 자리</title>
</head>
```

## Description

디스크립션은 콘텐츠를 검색했을 때 타이틀 아래 요약글로 표시된다.

> ![구글 검색 결과 스크린샷](/coding/image/google-search-result.png "구글 검색 결과 스크린샷")

- 구글의 글자수 제한
  - 160 characters (desktop)
  - 130 characters (mobile)

```html
<head>
  <meta name="description" content="디스크립션을 삽입하는 자리">
</head>
```

## Canonical Tag

캐노니컬 태그는 검색엔진에게 메인 페이지가 무엇인지 알려준다. 예를 들어, 처음 페이지를 하나 생성했더라도, 추후 상황에 따라 URL을 달리하는 여러 버전의 페이지가 생성 및 사용될 수가 있다. 파생된 여러 버전의 페이지에 캐노니컬 태그를 삽입하면 메인 페이지가 무엇인지 검색엔진에게 알려줄 수 있고, 이는 검색 노출에 도움이 된다.

```html
<link rel="canonical" href="http://main_page_url/" />
```

## Alternative Text (alt tag)

알트 태그는 이미지, 동영상 등 미디어 파일에 설명을 덧붙여 검색엔진이 파일의 내용을 인지 알 수 있도록 한다.

```html
<img src="http://site.com/green_fog.png" alt="this is green frog" />
```

## Robots

검색로봇 태그는 검색로봇(크롤러)이 웹사이트에 접근하도록 허용할지 허용하지 않을지를 정한다.

- FOLLOW: 검색로봇이 웹사이트의 하이퍼링크를 사용하도록 허용한다. 검색로봇은 웹사이트의 하이퍼링크가 어느 웹사이트를 링크하고 있는지를 조사하여 검색 결과에 반영할 수 있다.
- NOFOLLOW: 검색로봇의 하이퍼링크 사용을 허용하지 않는다.
- INDEX: 검색로봇이 웹사이트의 페이지들을 색인하도록 허용한다.
- NOINDEX: 검색로봇의 색인을 허용하지 않는다.

```html
<!-- 웹사이트의 색인과 팔로우를 허용한다  -->
<meta name="robots" content="index, follow">
```

## Open Graph

오픈그래프는 웹사이트가 소셜미디어에 노출될 때 미리보기 카드를 생성하는 데 사용된다.

- [The Open Graph protocol](https://ogp.me/)

## Header Tags

- 헤더를 잘 활용하여 콘텐츠를 제작한다.
- 검색로봇은 H1 헤더를 콘텐츠의 주요 텍스트로 인식한다.

```html
<body>
  <h1>이것은 H1 태그</h1>
  <h2>이것은 H2 태그</h2>
  <h3>이것은 H3 태그</h3>
  <h4>이것은 H4 태그</h4>
  <h5>이것은 H5 태그</h5>
  <h6>이것은 H6 태그</h6>
</body>
```

## Responsive Design Meta Tag

- 반응형 디자인을 채택한 웹사이트에서 사용한다.
- 브라우저가 웹페이지를 어떻게 콘트롤할지 정보를 준다.
- `<meta>` viewport element
  - `width=device-width`: 웹사이트의 가로 사이즈를 디바이스의 가로 사이즈에 맞춘다.
  - `initial-scale=1.0`: 브라우저의 zoom level을 초기화(1배)한다.

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

## 참고

- [8 Meta Tags That Improve SEO](https://clutch.co/seo-firms/resources/meta-tags-that-improve-seo "8 Meta Tags That Improve SEO")
