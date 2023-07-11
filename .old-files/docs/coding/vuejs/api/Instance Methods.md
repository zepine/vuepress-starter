---
date: 2022-01-01
description: Vue 3 인스턴스 메서드
tags:
  - emit
  - $emit
  - watch
  - $watch
  - event listener
  - 이벤트 리스너
---

# Instance Methods

::: tip
Vue 공식 문서는 이미 한국어로 번역돼 있으나, 개인의 학습만을 목적으로 [Vue.js 3 레퍼런스](https://v3.vuejs.org/) 영문판을 번역합니다. 이해하기 어려운 내용은 한국어 번역본을 참조합니다.
:::

## $watch

컴포넌트 인스턴스에서 **변경되는** 반응형 프로퍼티나 computed 함수를 감시한다. 프로퍼티에서 콜백은 새로운 값과 기존 값으로 호출된다. 최상위의 `data`, `props` 또는 `computed` 프로퍼티 이름만 **문자열**로 전달할 수 있다. 더 복잡한 표현식이나 중첩 프로퍼티는 **함수**를 사용한다. (아래 코드를 참조)

```js
const app = createApp({
  data() {
    return {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4
      }
    }
  },
  created() {
    // top-level property name as string
    this.$watch('a', (newVal, oldVal) => {
      // do something
    })

    // function for watching a single nested property
    this.$watch(
      () => this.c.d,
      (newVal, oldVal) => {
        // do something
      }
    )

    // function for watching a complex expression
    this.$watch(
      // every time the expression `this.a + this.b` yields a different result,
      // the handler will be called. It's as if we were watching a computed
      // property without defining the computed property itself
      () => this.a + this.b,
      (newVal, oldVal) => {
        // do something
      }
    )
  }
})
```

감시하는 값이 객체나 배열이라면 그것의 프로퍼티나 엘리먼트가 바뀌더라도 watcher를 트리거하지 않는다. 그들은 동일한 객체/배열을 참조하기 때문이다.

::: tip
객체/배열의 내부 요소(프로퍼티)가 변경되는 것을 감지할 수 없다는 의미. 비유하자면, 수박을 통째로 바꾸면 바뀐지 알겠지만 수박의 속은 잘 익었는지 알기 어려운 것과 같은듯.

아래 코드에서, `changeWholeArticle`, `clearComments` 함수가 객체와 배열을 통째로 바꿀 때는 watcher를 트리거한다고 함.
:::

```js
const app = createApp({
  data() {
    return {
      article: {
        text: 'Vue is awesome!'
      },
      comments: ['Indeed!', 'I agree']
    }
  },
  created() {
    this.$watch('article', () => {
      console.log('Article changed!')
    })

    this.$watch('comments', () => {
      console.log('Comments changed!')
    })
  },
  methods: {
    // These methods won't trigger a watcher because we changed only a property of object/array,
    // not the object/array itself
    changeArticleText() {
      this.article.text = 'Vue 3 is awesome'
    },
    addComment() {
      this.comments.push('New comment')
    },

    // These methods will trigger a watcher because we replaced object/array completely
    changeWholeArticle() {
      this.article = { text: 'Vue 3 is awesome' }
    },
    clearComments() {
      this.comments = []
    }
  }
})
```

`$watch`는 콜백 호출을 멈추는 unwatch 함수를 반환한다. (이건 무슨 뜻이지???)

## $emit

[원문](https://v3.ko.vuejs.org/api/instance-methods.html#emit)

- 이벤트 리스너를 트리거한다.
- 원격 이벤트 리스너 트리거?
- 자식 영역에 사용하여, 부모 영역의 이벤트 리스너를 트리거한다.
- 추가 전달인자(옵션)는 이벤트 리스너의 매개변수로 전달된다.

``` js
$emit('eventName', additionalArg)
```

- `eventName`은 부모 인스턴스의 이벤트 리스너 이름.
- `additionalArg`는 해당 이벤트 리스너의 매개변수로 전달.
