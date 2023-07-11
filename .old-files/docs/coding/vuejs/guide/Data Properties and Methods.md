---
date: 2022-01-01
description: Data Properties and Methods
---

# Data Properties and Methods

## Data Properties

- 컴포넌트의 `data` 옵션은 함수(function)다. Vue는 새 컴포넌트 인스턴스를 생성할 때 이 함수를 호출한다.
- 이때 함수는 객체를 반환한다. Vue는 객체를 반응형 시스템으로 래핑(wraping)하며, `$data`로서 컴포넌트 인스턴스에 저장한다.
- 편의상, 객체의 어떤 상위 프로퍼티(top-level properties)도 컴포넌트 인스턴스를 통해 바로 접근할 수 있다. 예를 들어, `vm.count`는 `vm.$data.count`와 동일하다. (아래 참조)

```js {9-10}
const app = Vue.createApp({
  data() {
    return { count: 4 }
  }
})

const vm = app.mount('#app')

console.log(vm.$data.count) // => 4
console.log(vm.count)       // => 4

// Assigning a value to vm.count will also update $data.count
vm.count = 5
console.log(vm.$data.count) // => 5

// ... and vice-versa
vm.$data.count = 6
console.log(vm.count) // => 6
```

- 인스턴스의 프로퍼티들은 인스턴스가 처음 생성되었을 때에만 추가된다. 이런 이유로 인스턴스 프로퍼티들이 (`data` 함수에 의해 생성되는) 객체에 모두 존재하는지 확인해야 한다.
- 원하는 데이터를 아직 이용할 수 없는 프로퍼티에는 `null`, `undefined` 또는 placeholder value를 사용한다.
- `data`에 포함하지 않고 컴포넌트 인스턴스에 바로 새 프로퍼티를 추가할 수 있지만, 이 프로퍼티는 반응형 `$data` 객체의 지원을 받을 수 없다. 따라서, 이것은 Vue 반응형 시스템에 의해 자동으로 추적되지 않는다.
- Vue는 컴포넌트 인스턴스에서 내장 API에 접근할 때 `$` 접두사를 사용한다. 또한, internal 프로퍼티는 `_` 접두사를 사용한다. 따라서, 프로퍼티 명명 시 이러한 문자로 시작하지 않도록 유의해야 한다.

## Methods

- 컴포넌트 인스턴스에 메서드를 추가하려면 `methods` 옵션을 사용한다. 이 옵션은 필요한 메서드를 포함하는 객체여야 한다.

```js
const app = Vue.createApp({
  data() {
    return { count: 4 }
  },
  methods: {
    increment() {
      // `this` will refer to the component instance
      this.count++
    }
  }
})

const vm = app.mount('#app')

console.log(vm.count) // => 4

vm.increment()

console.log(vm.count) // => 5
```

- Vue는 자동으로 `methods`에서 `this`를 바인드하며, 이것은 항상 컴포넌트 인스턴스를 참조한다. 메서드가 이벤트 리스너 또는 콜백으로 사용된다면, 반드시 올바른 `this` 값을 유지해야 한다.
- `methods`를 정의할 때, Vue가 적절한 `this` 값을 바인딩하도록 하기 위해 화살표 함수는 사용하지 않는다. [more](https://v3.vuejs.org/guide/instance.html#lifecycle-hooks "화살표 함수를 쓰지 말아야 하는 이유")
- 컴포넌트 인스턴스의 다른 프로퍼티와 같이, 컴포넌트 템플릿 안에서 `methods`에 접근할 수 있다. 템플릿에서 `methods`는 흔히 이벤트 리스너로 사용한다.

```html
<button @click="increment">Up vote</button>
```

- 상기 예시에서, `<button>`을 클릭하면 `increment` 메서드가 호출된다.
- 템플릿에서 바로 메서드를 호출할 수도 있지만, `computed` 프로퍼티를 사용하는 방법이 더 일반적이다.
- 그러나, computed 속성을 실행할 수 없는 상황에서는 메서드를 사용하는 것이 유용하다.
- 자바스크립트 표현식을 지원하는, 템플릿 어디에서든 메서드를 호출할 수 있다.

```html
<span :title="toTitleDate(date)">
  {{ formatDate(date) }}
</span>
```

- 만약 `toTitleDate` 또는 `formatDate` 메서드가 어떤 반응형 데이터에 접속한다면, 마치 메서드가 템플릿에서 직접 사용된 것처럼 렌더링 종속성(redering dependency)으로 추적될 것이다.

::: details 해석
- "메서드가 반응형 데이터에 접속한다": 메서드 표현식에 반응형 데이터가 포함돼 있다.
- "메서드가 템플릿에서 직접 사용된 것처럼": 메서드 표현식이 템플릿에 그대로 사용된 것처럼 (메서드 호출이 아님)
- "렌더링 종속성(의존성)": 메서드의 계산(렌더링) 결과는 반응형 테이터의 값에 좌우됨을 의미.
- "추적될 것이다": 메서드 표현식은 반응형이 아니지만, 반응형처럼 작동될 것이라는 의미.
:::

- 템플릿에서 호출된 메서드는 데이터가 바뀌거나 비동기 프로세스가 트리거하는 것과 같은 어떤 사이드 이펙트도 없어야 한다. 만약, 이러한 사이드 이펙트를 원한다면, 대신 라이프사이클 훅을 사용해야 할 것이다.

### Debouncing and Throttling

- Vue는 디바운싱이나 쓰로틀링을 자체적으로 지원하지 않는다. 그러나 [Lodash](https://lodash.com/)와 같은 라이브러리를 사용해 적용할 수 있다.

::: tip
디바운싱과 쓰로틀링 이해하기

[Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
:::

- 컴포넌트가 한 번만 사용된 경우, 디바운싱은 `methods` 안에 직접 적용될 수 있다.

```html
<script src="https://unpkg.com/lodash@4.17.20/lodash.min.js"></script>
<script>
  Vue.createApp({
    methods: {
      // Debouncing with Lodash
      click: _.debounce(function() {
        // ... respond to click ...
      }, 500)
    }
  }).mount('#app')
</script>
```

- 그러나, 이와 같은 방식은 잠재적으로 문제가 있다. 컴포넌트를 재사용할 경우 동일한 디바운스 함수를 공유하기 때문이다. 컴포넌트 인스턴스들이 서로 독립성을 유지하기 위해, `created` 라이프사이클 훅에 디바운스 함수를 추가할 수 있다.

```js
app.component('save-button', {
  created() {
    // Debouncing with Lodash
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // Cancel the timer when the component is removed
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... respond to click ...
    }
  },
  template: `
    <button @click="debouncedClick">
      Save
    </button>
  `
})
```
