---
date: 2022-01-01
description: Computed Properties and Watchers
---

# Computed Properties and Watchers

## Computed Properties

- 템플릿의 표현식들은 편리하지만, 간단한 동작을 의미한다.
- 템플릿에 너무 많은 로직을 포함하면 템플릿을 비대하게 하고 유지를 어렵게 한다.
- 예를 들어, 중첩 배열을 포함한 (데이터) 객체가 있고, `author`의 책 소유 여부에 따라 다른 메시지를 출력한다면,

```js
Vue.createApp({
  data() {
    return {
      // 중첩 배열을 포함한 객체
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  }
}).mount('#computed-basics')
```

```html
<div id="computed-basics">
  <p>Has published books:</p>
  <!-- 책 소유 여부에 따라 다른 메시지를 출력 -->
  <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
</div>
```

- 이 지점에서 템플릿은 더는 심플하고 명확하지 않게 된다. `author.books`에 따라 계산이 이루어진다는 걸 깨달으려면 얼마간 코드를 해석해야 하는데, 이러한 계산을 여러 번 추가해야 한다면 코드의 명확성은 더욱 나빠진다.
- 이럴 때는 `computed` 프로퍼티를 사용해라. 이것은 반응형 데이터를 포함한 복잡한 로직를 위한 방법이다.

### Basic Example

```html
<div id="computed-basics">
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</div>
```

```js
Vue.createApp({
  data() {
    return {
      author: {
        name: 'John Doe',
        books: [
          'Vue 2 - Advanced Guide',
          'Vue 3 - Basic Guide',
          'Vue 4 - The Mystery'
        ]
      }
    }
  },
  computed: {
    // a computed getter
    publishedBooksMessage() {
      // `this` points to the vm instance
      return this.author.books.length > 0 ? 'Yes' : 'No'
    }
  }
}).mount('#computed-basics')
```

- `publishedBooksMessage` computed 프로퍼티가 선언됐다. `data` 프로퍼티에서 `books` 배열의 값을 변경하면, `publishedBooksMessage`가 어떻게 변하는지 확인할 수 있다.
- 일반 프로퍼티처럼 computed 프로퍼티에 데이터 바인딩을 할 수 있다.
- Vue는 `vm.publishedBooksMessage`가 `vm.author.books`에 의존하고 있음을 알고 있기 때문에 `vm.author.books`가 변하면 `vm.publishedBooksMessage`에 의존하는 어떤 바인딩도 따라 업데이트 될 것이다.
- 가장 좋은 점은 의존성 관계를 명확히 한다는 부분이다. 즉, computed getter 함수는 사이드 이펙트(?)가 없는데, 이런 이유 때문에 코드를 이해하고 테스트하기 더 쉽다.

### Computed Caching vs Methods

- 메서드 프로퍼티를 사용해도 동일한 결과를 얻을 수 있다.

```html
<p>{{ calculateBooksMessage() }}</p>
```

```js
// in component
methods: {
  calculateBooksMessage() {
    return this.author.books.length > 0 ? 'Yes' : 'No'
  }
}
```

- computed 프로퍼티 대신, 메서드에 동일한 함수를 정의할 수 있다. 최종 결과물은 두 접근법이 정확히 같다.
- 하지만 **computed 프로퍼티는 반응형 종속성(reactive dependency)에 기반하여 캐시된다**는 점이 다르다. computed 프로퍼티는 반응형 종속성이 변경될 때 다시 계산한다.
- `publishedBooksMessage` computed 프로퍼티에 다중 접속 시, `author.books` 데이터가 바뀌지 않는다면 함수를 재실행하지 않고 이전에 계산한 결과를 반환한다.
- 또한, 아래 예시(코드)에서 `Data.now()`는 reactive dependency가 아니기 때문에 computed 프로퍼티 값이 업데이트되지 않는다.
- 비교해서, 메서드 호출은 (다중 접속으로) 리렌더링이 일어날 때면 항상 함수를 재실행한다.

```js
computed: {
  now() {
    return Date.now()
  }
}
```

::: tip [보충] computed, 동일 퍼포먼스 극소 연산

- 일반적으로 computed/methods 프로퍼티의 함수 구성 요소 값이 갱신되면 최종 리턴값도 바뀐다. 다만, computed 프로퍼티는 최종값이 동일할 경우 캐시된 값을 리턴한다.
- 먼저, methods 프로퍼티는 참조가 일어날 때마다 함수를 재실행하고 계산한 값을 반환한다. JS의 일반 함수와 같다. 포괄적으로 다방면에서 사용할 수 있다.
- 그러나 성능을 고려한다면, 최종값이 바뀌지 않았을 경우 캐시해 둔 기존 값을 바로 반환하는 게 여러 모로 효율적이다. 커다란 코드 안에서 methods 프로퍼티를 수백수천 참조한다면 값의 변화와 관계없이 참조할 때마다 함수를 재계산할 것이다. 수백수천배의 CPU 연산력이 소모될 것이다.
- 캐시를 지원하고 값이 변경될 때만 캐시 값을 바꿔준다면, CPU 연산에 대한 부담은 이론적으로 1/수백수천까지 줄어들 수 있다. 이 캐시를 지원하는 프로퍼티가 바로 computed다.
- computed 프로퍼티는 수만 번이 참조되어도 프로퍼티의 최종값이 바뀌지 않는다면 함수를 재계산하지 않고 캐시된 값을 즉시 반환한다. computed 프로퍼티를 잘 활용하면 동일한 퍼포먼스를 극히 적은 연산으로 해결할 수 있다.

:::

### Computed Setter

Computed 프로퍼티는 getter-only가 디폴트이다. 그러나 필요하다면 setter를 제공한다.

``` js
// ...
computed: {
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

`vm.fullName = 'John Doe'`를 실행하면, setter가 호출되고 `vm.firstName`과 `vm.lastName`이 업데이트 될 것이다.

## Watchers

대부분의 경우 computed 프로퍼티가 더 적절하지만, 종종 커스텀 wathcer가 필요하다. 그 이유는, Vue는 `watch` 옵션을 통해 데이터의 변화에 반응하는 더 포괄적인 방법을 제공한다. 데이터 변화에 반응하는 고비용 오퍼레이션이나 비동기 동작이 필요할 때 가장 유용하다.

```html
<div id="watch-example">
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</div>
```

```html
<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to use what you're familiar with.      -->
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
  const watchExampleVM = Vue.createApp({
    data() {
      return {
        question: '',
        answer: 'Questions usually contain a question mark. ;-)'
      }
    },
    watch: {
      // whenever question changes, this function will run
      question(newQuestion, oldQuestion) {
        if (newQuestion.indexOf('?') > -1) {
          this.getAnswer()
        }
      }
    },
    methods: {
      getAnswer() {
        this.answer = 'Thinking...'
        axios
          .get('https://yesno.wtf/api')
          .then(response => {
            this.answer = response.data.answer
          })
          .catch(error => {
            this.answer = 'Error! Could not reach the API. ' + error
          })
      }
    }
  }).mount('#watch-example')
</script>
```

- 위 코드에서, `watch` 옵션을 사용하면 비동기 작업(API 접속)을 수행할 수 있도록하고, 이러한 수행에 필요한 조건을 설정한다. 이와 같은 일을 computed 프로퍼티로 할 순 없다.
- 추가로 `watch`는 명령형(imperative) `vm.$watch` [API](https://v3.vuejs.org/api/instance-methods.html#watch)를 사용할 수 있다.

### Computed vs Watched Property

- Vue는 현 활성 인스턴스(watch properties)에서 데이터 변화를 관찰하고 반응하기 위해 더 일반적인(포괄적인) 방법을 제공한다.
- 어떤 데이터에 종속돼 바뀔 가능성 있는 데이터가 있다면, `watch`를 과용할 유혹이 있다. 특히, AngularJS 백그라운드에서 오는 데이터라면(?).
- 하지만, 명령형 `watch` 콜백 보다는 차라리 computed 프로퍼티를 사용하는 게 더 좋을 수도 있다.

```html
<div id="demo">{{ fullName }}</div>
```

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar',
      fullName: 'Foo Bar'
    }
  },
  watch: {
    firstName(val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName(val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}).mount('#demo')
```

- 위 코드는 명령형이고 반복형이다.

```js
const vm = Vue.createApp({
  data() {
    return {
      firstName: 'Foo',
      lastName: 'Bar'
    }
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    }
  }
}).mount('#demo')
```

- computed 프로퍼티를 사용하는 게 더 훨씬 낫다.
