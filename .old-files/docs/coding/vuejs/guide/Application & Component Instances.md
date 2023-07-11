---
date: 2022-01-01
description: 애플리케이션과 컴포넌트 인스턴스
tags:
  - vue3
  - vuejs
---

# Application & Component Instances

[참고 페이지](https://v3.ko.vuejs.org/guide/instance.html#%E1%84%8B%E1%85%A5%E1%84%91%E1%85%B3%E1%86%AF%E1%84%85%E1%85%B5%E1%84%8F%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%89%E1%85%A7%E1%86%AB-%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%89%E1%85%B3%E1%84%90%E1%85%A5%E1%86%AB%E1%84%89%E1%85%B3-%E1%84%89%E1%85%A2%E1%86%BC%E1%84%89%E1%85%A5%E1%86%BC%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5)

## Creating an Application Instance

```js
const app = Vue.createApp({ /* options */ })
```

- Vue 애플리케이션 인스턴스는 `createApp` 함수로 생성한다.

```js
const app = Vue.createApp({})
app.mount('#app')
```

- Vue 애플리케이션 인스턴스 마운트
- `mount` 메소드에 HTML 컨테이너(의 id)를 전달.
- 컨테이너: HTML 최상위(root?) 태그

```js
const app = Vue.createApp({})
app.component('SearchInput', SearchInputComponent)
app.directive('focus', FocusDirective)
app.use(LocalePlugin)

```

- Vue 애플리케이션 인스턴스는 전역('gloabls') 등록에 사용할 수 있다.
- 전역 등록 시, 애플리케이션 내의 모든 컴포넌트가 사용할 수 있다.
- 자세한 내용은 추후 설명.

```js
Vue.createApp({})
  .component('SearchInput', SearchInputComponent)
  .directive('focus', FocusDirective)
  .use(LocalePlugin)
```

- Vue 애플리케이션 인스턴스에 의해 체이닝된 메소드들은 동일한 인스턴스를 반환한다.
:::details 원문
Most of the methods exposed by the application instance return that same instance, allowing for chaining:
:::

## Root Component

Vue 애플리케이션 인스턴스(Vue 앱)를 구성

```js
const RootComponent = { /* options */ }
const app = Vue.createApp(RootComponent)
const vm = app.mount('#app')
```

**`mount`**
- 대부분의 애플리케이션 메서드와 달리 애플리케이션을 반환하지 않음.
- 대신 루트 컴포넌트 인스턴스를 반환.

## Component Instance Properties

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4
```

- `data`에 정의한 프로퍼티는 컴포넌트를 통해 사용한다
- 컴포넌트 인스턴스에 아래와 같은 다양한 사용자 정의 프로퍼티를 추가할 수 있다
- `methods`, `props`, `computed`, `inject`, `setup`
- 모든 컴포넌트 인스턴스의 프로퍼티는 그 컴포넌트의 템플릿에서 접근할 수 있다.
- 빌트인 프로퍼티(`$attrs`, `$emit`)는 사용자 정의 프로퍼티와 구분하기 위해 접두어 `$`를 사용한다

## Lifecycle Hooks

- 각 컴포넌트 인스턴스는 생성될 때 초기화 과정을 거친다.
- 예를 들어, 컴포넌트는 데이터 추적(observation), 템플릿 컴파일, DOM 인스턴스 마운트, 그리고 데이터 변경에 따른 DOM 업데이트를 구성해야 한다.
- 그 구성에 따라서, 컴포넌트는 라이프사이클 훅(lifecycle hook) 함수들을 실행한다.
- 그 라이프사이클 훅은 사용자의 코드를 지정한 코드 실행 단계(stages)에 추가할 수 있도록 한다.
- 예를 들어, `created` 훅은 인스턴스 생성 후의 코드 실행을 위해 사용할 수 있다.

```js
Vue.createApp({
  data() {
    return { count: 1 }
  },
  created() {
    // `this` points to the vm instance
    console.log('count is: ' + this.count) // => "count is: 1"
  }
})
```

- 또한, `mounted`, `updated`, `unmounted`와 같은 라이프사이클 훅들도 있다.
- 이 훅들은 인스턴트 라이프사이클의 다른 단계에서 호출된다.
- 모든 라이프사이클 훅들은 `this` 컨텍스트로 호출된다.
- 이 컨텍스트는 그 훅들을 호출하는 현재 활성화된 인스턴스를 가리킨다.

## Lifecycle Diagram

[공식 웹사이트에서 다이어그램 보기](https://v3.vuejs.org/guide/instance.html#lifecycle-hooks)
