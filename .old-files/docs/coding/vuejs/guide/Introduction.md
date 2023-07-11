---
date: 2022-01-01
description: Vuejs 3 Introduction
tags:
  - vue3
  - vuejs
---

# Introduction

::: tip
Vue 공식 문서는 이미 한국어로 번역돼 있으나, 개인의 학습만을 목적으로 [Vue.js 3 레퍼런스](https://v3.vuejs.org/) 영문판을 번역합니다. 이해하기 어려운 내용은 한국어 번역본을 참조합니다.
:::

[Vue 3 입문 공식 동영상(영문)](https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3/)

## 선언적 렌더링(Declarative Rendering)

``` js
Vue.createApp(Counter).mount('#counter')
```

- `createApp(object)` : Vue 앱 생성, 데이터(object)를 매개변수로 전달
- `mount(string)` : Vue 데이터와 DOM(string으로 지정) 연결

### 택스트 보간(반응형)

``` js
const CounterApp = {
  data() {
    return {
      counter: 0
    }
  },
  mounted() {
    setInterval(() => {
      this.counter++
    }, 1000)
  }
}
```

- 데이터와 DOM은 반응형(reactive)으로 연결
- DOM 상의 counter가 1씩 증가 (택스트 보간/갱신: 반응형)

::: tip

Sugar Syntactic

``` js
data () {
}

// 아래와 동일
// data: function () {
// }
```

:::

### 앨리먼트 속성의 반응형 동작

``` html
<div id="bind-attribute">
  <span v-bind:title="message">
    여기에 마우스를 올려두고 잠시 기다리면 제목이 동적으로 바뀝니다!
  </span>
</div>

```

- `v-bind:` 속성은 **디렉티브**라고 함.
- `message`는 Vue 앱의 데이터를 받아 갱신됨(반응형).

``` js
const AttributeBinding = {
  data() {
    return {
      message: '이 페이지를 다음 시간에 열었습니다. ' + new Date().toLocaleString()
    }
  }
}

Vue.createApp(AttributeBinding).mount('#bind-attribute')

```

- 반환한 `message` 데이터는 `v-bind:` 속성으로 연결된(바인드된) title 속성으로 전달. 속성의 값을 갱신한다(반응형).

## 사용자 입력 핸들링

- 사용자와 앱의 상호 작용
- 사용자의 입력(eg. 클릭, 마우스오버 등)을 받아 특정 메소드 호출
- `v-on` 디렉티브 사용 **이벤트 리스너** 추가. `v-on:click="reverseMessage"`

``` html
<div id="event-handling">
  <p>{{ message }}</p>
  <button v-on:click="reverseMessage">Reverse Message</button>
</div>
```

``` js
const EventHandling = {
  data() {
    return {
      message: 'Hello Vue.js!'
    }
  },
  methods: {
    reverseMessage() {
      this.message = this.message
        .split('')
        .reverse()
        .join('')
    }
  }
}

Vue.createApp(EventHandling).mount('#event-handling')

```

- 모든 DOM 조작은 Vue에 의해 처리
- DOM을 직접 조작하지 않고 앱의 상태만을 업데이트(반응형을 의미하는 듯)

### 양방향 바인딩

- 사용자 입력과 앱 상태를 양방향으로 바인딩
- `v-model` 디렉티브 사용

``` html
<div id="two-way-binding">
  <p>{{ message }}</p>
  <input v-model="message" />
</div>

```

- 초기 `message`의 값는 "Hello Vue!"
- `v-model`은 사용자 입력을 받아 `message` 값을 변경

``` js
const TwoWayBinding = {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}

Vue.createApp(TwoWayBinding).mount('#two-way-binding')

```

## 조건문과 반복문

### `v-if`

``` html
<div id="conditional-rendering">
  <span v-if="onDisplay">이제 나를 볼수 있어요</span>
</div>
```

```js
const ConditionalRendering = {
  data() {
    return {
      onDisplay: true
    }
  }
}

Vue.createApp(ConditionalRendering).mount('#conditional-rendering')
```

- DOM의 **구조**에도 데이터를 바인딩 할 수 있음. 즉, 데이터에 따라 구조의 상태를 바꿀 수 있음. (**텍스트**와 **속성**은 앞서 살펴 봄).
- 전환 효과(transition effects)를 제공.

### `v-for`

- 배열에서 데이터를 가져와 목록을 표시하는 데 사용할 수 있음.

``` html
<div id="list-rendering">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
    </li>
  </ol>
</div>
```

``` js
const ListRendering = {
  data() {
    return {
      todos: [
        { text: 'Learn JavaScript' },
        { text: 'Learn Vue' },
        { text: 'Build something awesome' }
      ]
    }
  }
}

Vue.createApp(ListRendering).mount('#list-rendering')
```

## 컴포넌트 조립

- 컴포넌트는 Vue의 인스턴스
- 작고, 독립적이며, 재사용할 수 있는 컴포넌트로 대규모 애플리케이션을 구축할 수 있게 해주는 추상적 개념.

``` js
const app = Vue.createApp(...)

app.component('todo-item', {
  template: `<li>할일이 있어요</li>`
})

app.mount(...)
```

- 뷰 앱 생성
- 컴포넌트 선언
  - 컴포넌트 이름: 'todo-item'
  - 템플릿이 포함된 객체를 매개변수로 전달
- 뷰 앱 마운트

``` html
<todo-item></todo-item>
```

- HTML 코드 내에 `todo-item` 컴포넌트의 인스턴스를 삽입.
- 컴포넌트 인스턴스 삽입 위치에 템플릿 정보가 렌더링됨. `<li>할일이 있어요</li>`

``` js
app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})
```

- 부모 영역의 데이터를 자식 컴포넌트에 전달해보자.
- 부모 영역에서 정의한 `todo`의 값이 자식 컴포넌트로 전달된다(아래 코드 참조).

``` html
<todo-item
  v-for="item in groceryList"
  v-bind:todo="item"
  v-bind:key="item.id"
></todo-item>
```

- `groceryList` 배열에서 요소(`item`)를 하나씩 빼내 `todo-item` 컴포넌트 인스턴스를 렌더링 한다.
- `v-bind:todo`에 `item`이 할당
- `v-bind:key`에 `item.id` 할당
- 루프 적용 시 각 엘리먼트에 `key` 값을 부여해야 함.

``` js
const TodoList = {
  data() {
    return {
      groceryList: [
        { id: 0, text: '야채' },
        { id: 1, text: '치즈' },
        { id: 2, text: '사람이 먹을수 있는거라면 뭐든지' }
      ]
    }
  }
}

const app = Vue.createApp(TodoList)

app.component('todo-item', {
  props: ['todo'],
  template: `<li>{{ todo.text }}</li>`
})

app.mount('#todo-list-app')
```

- data 메서드: `groceryList` 배열를 반환. 배열의 각 요소는 `id`와 `text` key가 있음.
- component:
  - props 인터페이스: 부모 영역에서 지정한 데이터를 수신. `todo`는 부모 영역에서 지정된 데이터이며, `v-bind:`로 바인드됨.
