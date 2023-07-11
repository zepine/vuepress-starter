---
date: 2022-01-01
description: 
---

# Template Syntax

- Vue.js는 HTML 기반 템플릿 문법을 사용한다.
- Vue.js 문법은 렌더링 된 DOM과 컴포넌트 인스턴스의 데이터를 바인드하도록 허용한다.
- 내부적으로, Vue는 *Virtual DOM render functions*들 안에서 템플릿들을 컴파일한다.
- 반응형 시스템과 결합된, Vue는 앱 상태가 변할 때 지능적으로 리렌더링(re-rendering) 할 컴포넌트의 최소 개수를 분석할 수 있으며, DOM 처리의 최소량을 적용할 수 있다.
- Virtual DOM 컨셉에 익숙하고 JavaScript 본래 기능을 더 선호한다면, 템플릿 대신 직접 렌더링 함수를 작성할 수 있다. 선택사항으로 JSX를 지원한다.

## Interpolations

### Text

- 데이터 바인딩의 가장 기본적인 형태는 택스트 보간(법)이다. 이것은 "Mustache" 문법(double curly braces)을 사용한다.

```html
<span>Message: {{ msg }}</span>
```

- 머스태시 태그는 컴포넌트 인스턴스의 `msg` 프로퍼티 값으로 치환된다.
- `msg` 프로퍼티 값이 바뀌면 기존 출력값도 갱신된다.
- `v-once` 디렉티브를 사용해서 1회만 데이터 치환(보간)이 일어나도록 할 수도 있다.
- 다만, 같은 노드에 있는 다른 바인딩도 1회만 보간이 일어나므로 주의해야 한다. (하위 노드는 상관 없을려나...)

```html
<span v-once>This will never change: {{ msg }}</span>
```

### Raw HTML

- 이중 중괄호(double mustashes) 안의 데이터는 일반 텍스트(plain text)로 해석된다. 만약, HTML로 출력하려면 `v-html` 디렉티브를 사용한다.

```js {4}
const RenderHtmlApp = {
  data() {
    return {
      rawHtml: '<span style="color: red">This should be red.</span>'
    }
  }
}

Vue.createApp(RenderHtmlApp).mount('#example1')
```

```html
<p>Using mustaches: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

**Result**

```output
Using mustaches: <span style="color: red">This should be red.</span>
Using v-html directive: This should be red.
```

- 1행: 이중 중괄호는 string으로 출력
- 2행: `v-html` 디렉티브를 사용해 HTML로 출력

[공식문서 참고](https://v3.vuejs.org/guide/template-syntax.html#raw-html)

### Attributes

- 이중 중괄호는 HTML 속성 안에서 사용할 수 없다. 대신 `v-bind` 디렉티브를 써라.

```html
<div v-bind:id="dynamicId"></div>
```

- 바인드한 값이 `null`이나 `undefined`라면, 그 속성은 렌더링되지 않는다.
- 불린 속성의 경우, 그것은 기본적으로 `true`를 함의하고, `v-bind` 디렉티브는 조금 다르게 작동한다. 예를 들어,

```html
<button v-bind:disabled="isButtonDisabled">Button</button>
```

- `disabled` 속성은 `isButtonDisabled`가 `true`라면 렌더링 된다. 또한, `isButtonDisabled`가 empty string이어도 렌더링 된다. 그러나, `false` 값이라면 그 속성은 렌더링 시 생략된다.

### Using JavaScript Expressions

- Vue.js는 데이터 바인딩 시 모든 JavaScript 표현식을 지원한다.

``` html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

- 이 표현식들은 활성 인스턴스의 데이터 범위 안에서 JavaScript로서 간주한다. 한 가지 제한 사항은, 각 바인딩은 오직 **one single expression**만을 포함할 수 있다. 아래 사례들은 작동하지 않는다.

```html
<!-- this is a statement, not an expression: -->
{{ var a = 1 }}

<!-- flow control won't work either, use ternary expressions -->
{{ if (ok) { return message } }}
```

## Directives

[출처: 공식문서](https://v3.vuejs.org/guide/template-syntax.html#directives)

- 디렉티브는 `v-` 접두어와 붙여 쓰는 특별한 속성이다.
- 디렉티브 속성값은 **단일 자바스크립트 표현식(?)**을 사용할 수 있다. (`v-for`와 `v-on`은 예외)
- 디렉티브의 역할은 표현식의 값이 변경될 때 발생하는 부수 효과(side effects)들을 반응적으로 DOM에 적용하는 것이다.

::: details 원문
A directive's job is to reactively apply side effects to the DOM when the value of its expression changes. Let's review the example we saw in the introduction:
:::

::: tip
출처: [위키백과](https://ko.wikipedia.org/wiki/%EB%B6%80%EC%9E%91%EC%9A%A9_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99))

- 컴퓨터 사이언스에서, 함수가 결과값 이외에 다른 상태를 변경시킬 때 'side effect'가 있다고 한다. 예를 들어, 함수가 전역변수나 정적변수를 수정하거나, 인자로 넘어온 것들 중 하나를 변경하거나, 다른 side effect가 있는 함수에서 데이터를 읽어오는 경우 등이 있다.

출처: [위키백과(영문)](https://en.wikipedia.org/wiki/Side_effect_(computer_science))

- 컴퓨터 사이언스에서, 만약 함수가 있는 지역 환경 밖에서 변수값의 어떤 상태를 수정한다면, 오퍼레이션(함수, 표현식)은 사이드 이펙트(side effect)가 있다고 말한다.
- 그리고 호출한 함수에게 (의도된 효과로 발생한) 값을 반환하는 것은 관찰할 수 있는 효과(observable effect)가 있다고 말한다.
:::

```html
<p v-if="seen">Now you see me</p>
```

- `v-if` 디렉티브는 `seen`의 표현식 값의 `true`/`false` 여부에 따라 `<p>` 엘리먼트를 제거하거나 삽입할 것이다.

### Arguments

- 몇몇 디렉티브는 이름 뒤에 콜론(:)으로 표현하는 매개변수(argument)를 가진다.
- 예를 들어, `v-bind` 디렉티브는 HTML 속성을 반응형으로 업데이트하기 위해 사용된다.

```html
<a v-bind:href="url"> ... </a>
```

- 위에서 `href`는 매개변수에 해당한다. 이것은 `v-bind` 디렉티브가 엘리먼트의 `href` 속성을 표현식 값 `url`과 바인드함을 말한다.

```html
<a v-on:click="doSomething"> ... </a>
```

- `v-on` 디렉티브는 DOM 이벤트를 리스닝(청취)한다. 여기서 매개변수는 리스닝 이벤트 이름이다.

### Dynamic Arguments

- 디렉티브 매개변수(또는 전달인자)에 중괄호로 둘러싼 자바스크립트 표현식(JavaScript expression)을 사용할 수 있다.

```html
<a v-bind:[attributeName]="url"> ... </a>
```

- `attributeName`은 자바스크립트 표현식으로서 동적으로 계산되며, 계산된 값의 최종값은 매개변수로 사용된다.
- 예를 들어, 컴포넌트 인스턴스가 데이터 프로퍼티가 있고, 값이 `href`인 `attributeName`를 가지고 있다면, 이 바인딩은 `v-bind:href`와 동일하게 작동할 것이다.
- 유사하게, 동적인 이벤트 이름을 가진 핸들러와 바인딩하기 위해 동적 매개변수를 사용할 수 있다.

```html
<a v-on:[eventName]="doSomething"> ... </a>
```

- `eventName`의 값이 `"focus"`이면, `v-on:[eventName]`은 `v-on:focus`와 동일하다

### Modifiers

- 수식어는 점으로 표현되는 특별한 접미사이다. 수식어는 디렉티브가 조금 특별한 방법으로 바인드될 것임을 가리킨다.
- 예를 들어, `.prevent` 수식어는 트리거된 이벤트상에서 `event.preventDefault()`를 호출하는 `v-on` 디렉티브를 말한다.

::: details Event.preventDefault()

Event.preventDefault()는 이벤트를 취소할 수 있는 경우, 그 이벤트의 전파를 막지 않고(?) 그 이벤트를 취소한다.

[출처](https://developer.mozilla.org/ko/docs/Web/API/Event/preventDefault)
:::

``` html
<form v-on:submit.prevent="onSubmit">...</form>
```

## Shorthands

- `v-` 접두어는 템플릿에서 Vue 속성들을 구분하기 위한 시각적 표시이다. 이것은 마크업에 동적 변화를 적용하는 Vue.js를 사용할 때 유용하다.
- 그러나 다소 빈번하게 사용되는 디렉티브는 군더더기처럼 느껴질 수 있다. 동시에, Vue가 모든 템플릿을 관리하는 SPA를 만들 때는 `v-` 접두어의 필요성이 떨어진다.
- 따라서, Vue는 가장 많이 사용하는 두 디렉티브(`v-bind`, `v-on`)를 위해 특별한 약어들을 제공한다.

### `v-bind` 약어(shorthand)

```html
<!-- full syntax -->
<a v-bind:href="url"> ... </a>

<!-- shorthand -->
<a :href="url"> ... </a>

<!-- shorthand with dynamic argument -->
<a :[key]="url"> ... </a>
```

### `v-on` 약어

```html
<!-- full syntax -->
<a v-on:click="doSomething"> ... </a>

<!-- shorthand -->
<a @click="doSomething"> ... </a>

<!-- shorthand with dynamic argument -->
<a @[event]="doSomething"> ... </a>
```

### Caveats (주의사항)

#### Dynamic Argument Value Constraints (동적 전달인자 값의 제약)

- 동적 매개변수(전달인자)는 `null`을 제외하고 문자열로 계산한다.
- `null`은 명시적으로 바인딩을 제거하기 위한 용도로 사용할 수 있다.
- 비문자열 값은 경고를 출력할 것이다.

#### Dynamic Argument Expression Constraints

- 동적 매개변수 표현식은 빈공간(spaces), 따옴표(quotes)와 같은 특수 문자들 때문에 얼마간의 문법적 제약을 가진다.

```html
<!-- This will trigger a compiler warning. -->
<a v-bind:['foo' + bar]="value"> ... </a>
```

- 복잡한 표현식은 `computed` 프로퍼티로 바꾸는 것이 좋다.
- in-DOM templates (HTML 파일에 직접 쓰인 템플릿)을 사용할 때, 대문자로 keys 이름을 작성하는 것을 피해야 한다. 브라우저는 속성 이름을 소문자로 강제할 것이다.

```html
<!--
This will be converted to v-bind:[someattr] in in-DOM templates.
Unless you have a "someattr" property in your instance, your code won't work.
-->
<a v-bind:[someAttr]="value"> ... </a>
```

- 브라우저에서 `someAttr`는 `someattr`로 인식한다. 만약 `someattr` 프로퍼티가 없다면 오류가 발생할 것이다.

#### JavaScript Expressions

- 템플릿 표현식은 샌드박스 되어 있기 때문에, 오직 `Math` `Data`와 같은 제한된 전역 리스트([restricted list of globals](https://github.com/vuejs/vue-next/blob/master/packages/shared/src/globalsWhitelist.ts#L3))만 사용할 수 있다.
- 또한, 템플릿 표현식에서 사용자 정의 전역에 접근하지 말아야 한다.

**restricted list of globals**

```js
const GLOBALS_WHITE_LISTED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'
```
