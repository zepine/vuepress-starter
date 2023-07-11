---
date: 2022-01-01
permalinkPattern: coding/note/[VuePress] 오픈그래프 태그 자동 삽입 스크립트 작성기.html
description: 뷰프레스(VuePress v2 beta)의 SEO 최적화 작업을 진행한다. 대부분을 잘 마쳤으나 오픈그래프(Open Graph)는 의도대로 적용되지 않아 삽질을 시작하게 되는데...
tags:
  - OpenGraph
  - metatags
  - Layout
  - frontmatter
---

# [VuePress] 오픈그래프 태그 자동 삽입 스크립트 작성기

뷰프레스(VuePress v2 beta)의 SEO 최적화 작업을 진행했다. 대부분을 잘 마쳤으나 [오픈그래프(Open Graph)](https://ogp.me/)는 의도 대로 적용되지 않아 꽤나 삽질해야 했다.

뷰프레스에서 `config.js` 파일에 메타 태그를 삽입하면 모든 페이지에 공통으로 적용된다. 각 페이지마다 따로 적용하려면 각 페이지의 frontmatter 영역에 양식대로 메타 태그를 넣어주면 된다.

Open Graph 태그 역시 각 페이지마다 다른 타이틀(title), 디스크립션(description), 작성자(contributors), URL 등을 적용해야 하기에 `config.js` 파일의 수정은 의미가 없고 frontmatter를 활용해야 한다. 다만, 매번 글을 작성할 때마다 일일이 추가하기에는 너무 귀찮은 작업 같아 자동으로 적용해주는 스크립트를 추가하기로 했다.

## 레퍼런스 검색

먼저 [VuePress 공식 레퍼런스](https://v2.vuepress.vuejs.org/ "뷰프레스 공식 레퍼런스 문서")에는 메타 태그 추가와 관련된 직접적인 내용은 앞서 얘기한 `config.js`와 frontmatter 밖에 없었다. 검색을 해보았으나 별 소득은 없었다. 관련 플러그인은 2.0 버전을 지원하지 않았고 다른 방법들은 자동화라고 볼 수 없는 차선책을 제시하는 수준에 불과했다. 현재 2.0이 베타 중이어서 이용자나 커뮤니티가 활성화되지 않은 것 같았다.

## Vuejs를 기반으로 하는 VuePress

마지막 수단으로 직접 스크립트를 작성해 적용하기로 했다. VuePress는 Vuejs를 기반으로 하는 만큼 자바스크립트(JavaScript)와 노드js(Nodejs) 그리고 Vuejs에 대한 이해가 있어야 한다. 아직 Vuejs에 대한 이해가 거의 없어 고생길이 휜해 보였지만 그래도 하나하나 공부하는 재미가 있을 거라 느꼈다.

## 확장 테마와 컴포넌트 활용

앞서 디스커스(Disqus)/어터런시스(Utterances) 댓글 시스템을 적용하면서 확장 테마와 `Layout.vue` 파일을 만들었던 적이 있었다. 새 컴포넌트(`component`)를 생성한 뒤 이것을 통해 Open Graph를 삽입하는 스크립트를 돌리면 가장 빠르게 작업을 마칠 수 있겠다 생각했다.

참고로 확장 테마는 워드프레스의 자식 테마처럼 기본 테마를 복제(참조)한 테마이고, `Layout.vue`는 확장 테마의 layout 부분만 새로 작성(override)할 때 쓰이는 파일이다. 그리고 `component`는 HTML과 JS 코드를 섞은 하나의 파일로 구성하며 한 단위의 기능을 캡슐화하여 재사용할 수 있다.

## 절반의 성공

VuePress를 커스텀 하려면 아직 공부해야 할 것이 많다고 느꼈다. 확장 테마와 `Layout.vue`을 좀 더 정확히 이해하기 위해 레퍼런스를 더욱 꼼꼼히 읽는 과정을 반복했다. 확실히 레퍼런스 문서들은 군더더기 없이 간단하지만, 그 짧은 문장에 많은 내용이 담겨 있다는 걸 다시 한번 느꼈다.

Open Graph 생성 스크립트를 작성해 새로운 `component`에 담았다. 여러 번의 시도와 수정을 반복한 끝에 `component`는 제대로 작동했고, `<head></head>` 태그 안에 Open Graph 태그를 남기는 데 성공했다.

우선 Open Graph 태그의 `attribute`로 구성된 배열을 준비한 후, `for` 반복문으로 `<meta>` 태그 생성과 `attribute` 추가를 배열의 `length` 만큼 반복했다.

```js
for (let i = 0; i < attributes.length; i++) {
  const d = document
  const meta = d.createElement('meta')
  meta.setAttribute('prefix', 'og: http://ogp.me/ns#')
  meta.setAttribute('property', properties[i])
  meta.setAttribute('content', contents[i])
  d.head.appendChild(meta)
}
```

삽질은 `appendChild()` 실행에 있었다. 처음에는 `appendChild()`를 실행할 `<head>` 객체를 가져오기 위해 `getElementsByTagName()`을 사용했으나 오류만 뿜어 댔다.

```js
for (let i = 0; i < attributes.length; i++) {
  const d = document
  const headTag = d.getElementsByTagName('head') // <head> 객체 가져오기
  // 중간 생략
  headTag.appendChild(meta) // 오류
}
```

![Error : headTag.appendChild is not a function](/coding/image/error-appendchild.png "오류 장면 스크린샷")

_`headTag.appendChild is not a function`_ 오류는 무슨 뜻일까. 이게 함수가 아니라니 의아했다. 혹시나 하는 마음에 `headTag`를 `console.log()`로 확인해 보니 `HTMLCollection`이 반환돼 나왔다.

![Error : HTMLCollection](/coding/image/error-appendchild-htmlcollection.png "오류 장면 스크린샷")

컬렉션(Collection)도 객체이긴 하지만 배열의 일종이라 `appendChild()` 메서드가 실행되지 않는 것 같았다. 고민을 하다가 `head`에 직접 접근해 보니 문제가 해결됐다. _관련 내용을 찾아 보고 명확한 이해를 구해야 할 것 같다._

```js
for (let i = 0; i < attributes.length; i++) {
  const d = document
  const meta = d.createElement('meta')
  // 중간 생략
  d.head.appendChild(meta)
}
```

이렇게 스크립트 작성은 마무리되는 것 같았다. 특별히 Vuejs를 공부하거나 Modules을 분석하지 않아도 괜찮았다. [배포 사이트](https://www.netlify.com/ "네틀리파이 홈페이지")에 새 스크립트를 반영하기 전 마지막 테스트를 했다. 터미널을 열어 `yarn dev`를 실행하고 웹사이트의 여러 페이지를 돌아다녔다. 그런데 "어?"하고 의문에 휩싸인 한마디가 입에서 튀어나왔다.

분명히 Open Graph 태그는 `<head>` 태그 안에 잘 생성됐지만, 웹사이트에서 페이지를 로딩할 때마다 Open Graph 태그는 새로 추가됐고 누적됐다. 예를 들어, 3페이지를 돌아다니면 Open Graph의 태그가 3배로 늘어나게 된다.

아무래도 현 스크립트는 버리고 새로운 방법을 찾아야 할 것 같았다.

## Vue의 반응형 데이터와 SPA

폭풍 검색을 다시 시작했다. 스택오버플로나 깃허브 이슈 등에서 비슷한 문제로 고민하는 사람들이 눈에 띄었다. 그 이슈들은 모두 확실한 답을 내놓지 못한 채 방치되거나 오픈 상태로 논의가 진행 중이었다. 원하는 답을 얻을 수는 없었지만 그런 이슈들에서 **Vuejs의 반응형 데이터**란 것을 알 수 있었고 이는 Nodejs를 기반으로 하는 [SPA(Single Page Application)](https://ko.wikipedia.org/wiki/%EC%8B%B1%EA%B8%80_%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98 "위키백과 - 싱글 페이지 애플리케이션")에 필수적임을 깨달았다. 동시에 Vuejs와 SPA에 대한 공부가 너무 부족하다는 생각이 들었다(어서 ***웹사이트 만들기*** 섹션을 계속 진행해야겠다).

Vuejs의 레퍼런스 사이트에 가서 반응형 데이터, `provide`와 `inject` 등 필요할 것 같은 내용을 읽어 보았다. Vuejs 레퍼런스는 한국어로도 번역이 잘 돼 있어 이해가 쉬웠다, 가 아니라 그냥 읽기가 쉬웠을 뿐이었다. 반복해 읽으며 내용을 어느 정도 이해한 뒤 기존 스크립트를 바탕으로 개선을 시도했으나 결국 그만두기로 했다.

계속 삽질을 반복하면서 얻은 게 있다면 VuePress에 대한 이해도가 높아졌다는 점이다. 확장 테마에서 `component`를 이용해 기능을 추가하거나 수정하는 것은 명확한 제약이 있었다. `<head>`태그 안에 메타 태그를 추가하기 위해 `Layout.vue`를 이용하는 것은 서두에 말했듯 분명 꼼수이고 세련된 방법은 아니다. 이런 틀 안에서 아무리 Vuejs의 반응형 데이터를 사용한들 더 나아질 것 같지 않았다.

## 기존 스크립트 개선

세련된 스크립트의 구현은 후일로 미루고 기존 스크립트를 개선하기로 방향을 바꿨다. 다시 문제를 돌이켜 봤다. 현 스크립트는 태그를 생성하기만 해서 이전 태그가 계속 쌓인다. 그럼 스크립트를 실행하기 전 앞서 생성된 스크립트를 지우도록 하면 되지 않을까.

Open Graph 태그를 지우려면 이 태그들만 구별할 수 있어야 하니, 각 태그 생성 시 `class='ogTag'` attribute를 붙여 둔다. `getElementsByClassName('ogTag')` 메서드를 이용해 Open Graph 태그만 골라낸다. 골라낸 태그를 삭제한다.

```js
const d = document
const openGraphTags = d.getElementsByClassName('ogTag')
if (openGraphTags[0]) {
  while (openGraphTags[0]) {
    d.head.removeChild(openGraphTags[0])
  }
}
```

:::danger
배열에 포함된 모든 요소를 삭제해야 할 때 **for 반복문**의 사용은 주의해야 한다. 예를 들어, A 배열에 포함된 모든 요소를 삭제하기 위해 `for(let i = 0; i < A.length; i++)`와 같은 반복문을 쓴다면 예상과 다르게 `A.length` 만큼 반복하지 않고 그 절반만 반복하게 된다. 왜냐하면 A 배열의 요소가 1 감소할 때마다 A 배열의 `length` 값도 1 감소하기 때문이다. 결과적으로 for 반복문에서  `i = 3`일 때 `A.length = 4`가 되므로 그 이상은 실행되지 않는다.

```js:no-line-numbers
const d = document
const openGraphTags = d.getElementsByClassName('ogTag')
// openGraphTags.length 의 절반만 반복한다
if (let i = 0; i < openGraphTags.length; i++) {
    d.head.removeChild(openGraphTags[i])
  }
}
```

:::

이런 시행착오를 거쳐 개선된 Open Graph 태그 생성 스크립트가 완성됐다. 이 스크립트가 좀 더 정교하게 기능하려면 한 가지 분기점을 추가하고 그때는 삭제만 수행하도록 해야 한다. 나중에 추가할지는 모르겠지만 지금은 여기서 마무리 짓는 게 나을 것 같다.

VuePress에는 [Client App Enhance](https://v2.vuepress.vuejs.org/advanced/cookbook/usage-of-client-app-enhance.html#usage-of-client-app-enhance "클라이언트 앱 인핸드 사용하기")라는 기능 강화 방법이 있다. 이 녀석을 이용하면 Open Graph 생성 스크립트를 더 만족스럽게 개선하거나 이외 여러 커스텀 시 더욱 나은 결과를 기대해 볼 수 있을 것 같다.
