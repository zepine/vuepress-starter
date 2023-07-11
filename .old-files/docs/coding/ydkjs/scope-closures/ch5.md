---
date: 2022-01-01
description: 번역 - Chapter 5 - The (Not So) Secret Lifecycle of Variables
---

# Chapter 5: The (Not So) Secret Lifecycle of Variables

::: tip
- [You Don't Know JS - 2nd Edition](https://github.com/getify/You-Dont-Know-JS "영문") 깃허브 공개 버전(영문)을 개인의 학습 목적으로 번역합니다.
- 한글 번역을 끝내면 핵심만 정리해 요약본으로 교체할 예정입니다.
- 전문 번역서는 [한빛미디어](https://www.hanbit.co.kr/media/books/book_view.html?p_code=B8227329776)에서 구입할 수 있습니다.
:::

[[toc]]

이제는, 프로그램의 스코프 체인이라 불리는, 전역 스코프에서 아래쪽 중첩 스코프에 대한 적절한 이해가 있어야 할 것이다.

그러나 단지 변수가 어느 스코프에서 오는지 아는 것은 전체 스토리의 일부이다. 만약 변수 선언이 한 스코프의 첫 번째 문the first statement of a scope 이후 나타난다면, 어떻게 변수 선언 *전* 그 식별자(변수)에 대한 참조들이 동작할 것인가?

렉시컬 스코프에 대한 JS의 특별한 맛은 미묘한 차이가 풍부하다. 언제 어떻게 변수들이 존재하고 프로그램을 이용할 수 있게 되는지에 관하여.

## When Can I Use a Variable?

어떤 지점에서 변수는 그것이 위치한 스코프 안에서 사용할 수 있게 되는가? 분명한 답이 있는 것 같다. 그 변수가 선언되거나 생성된 *뒤에*. 그치? 사실 꼭 그렇지는 않다.

다음을 보자.

```js
greeting();
// Hello!

function greeting() {
    console.log("Hello!");
}
```

이 코드는 잘 작동한다. 앞서 이런 코드를 본 적이 있을 것이다. 그러나 어떻게 왜 이 코드가 작동하는지 궁금하지 않는가? 특히, 어떻게 라인 1에서 식별자 `greeting`을 액세스할 수 있는가? 심지어 `greeting()` 함수 선언은 라인 4 이전까지 일어나지 않았는데.

챕터 1에서 지적하는 다음을 상기해보자. 모든 식별자는 컴파일 타임에 그들의 스코프에 등록된다. 게다가, 모든 식별자는 **해당 스코프에 들어갈 때마다** 그것이 속한 스코프의 초기에 생성된다.

:::tip
옮긴이 주: "해당 스코프에 들어갈 때마다(every time that scope is entered)"는 런타임 시 해당 스코프의 코드를 실행할 때를 뜻하는 것 같음.
:::

변수의 선언이 스코프의 아래 쪽에 있음에도 불구하고, 둘러싸는 스코프의 상위에 나타나는 변수를 설명하기 위해 가장 흔히 사용되는 용어는 **호이스팅hoisting**이라고 불린다.

물론, 호이스팅은 그 질문에 대한 완벽한 답이 아니다. 해당 스코프의 초기에 `greeting`이라 불리는 식별자를 볼 수 있지만, 어떻게 선언되기 전 `greeting()` 함수를 호출할 수 있는 것일까?

다시 말해, 스코프가 실행을 시작하는 순간에, 어떻게 변수 `greeting`은 그곳에 할당된 값을 가지고 있을까? 그 답은 *함수 호이스팅*으로 불리는 형식적 `function` 선언의 독특한 특징이다. `function` 선언의 이름 식별자가 해당 스코프의 최상위에 등록됐을 때, 추가적으로 그 선언은 함수의 참조를 위해 자동으로 초기화된다. 이것이 함수가 전체 스코프에 걸쳐 호출될 수 있는 이유이다.

한 가지 핵심 상세사항은 *함수 호이스팅*과 `var`를 포함한 *변수 호이스팅* 양쪽 모두 그들의 이름 식별자들을 블록 스코프가 아닌 가장 근접한 둘러싸고 있는 **함수 스코프**(함수 스코프가 없다면 전역 스코프)에 덧붙인다는 것이다.

:::tip NOTE
`let`과 `const` 선언들도 호이스팅한다(이 챕터 뒤에 이어지는 TDZ를 참고). 그러나 두 선언 형식은 `var`와 `function` 선언처럼 둘러싸는 함수가 아니라 그들 이름 식별자들을 둘러싸는 블록에 덧붙인다. 더 많은 정보는 챕터 6의 "Scoping with Blocks"를 참고하라.
:::

### Hoisting: Declaration vs. Expression

*함수 호이스팅*은 `function` 표현식 할당이 아닌, 정식 `function` 선언에만 적용한다. (특히 블록들 바깥에 노출된 것 - 챕터 6의 "FiB" 참고)

```js
greeting();
// TypeError

var greeting = function greeting() {
    console.log("Hello!");
};
```

라인1(`greeting();`)은 오류를 반환한다. 그러나 반환된 오류의 *종류*에 주목하는 것이 매우 중요하다.`TypeError`는 허용되지 않는 값으로 무엇인가를 하려고 시도한다는 의미다. JS 환경에 따라서, 이 오류 메시지는 "'undefined' is not a function," 또는 더 친절하게, "'greeting' is not a function"과 같은 것을 말할 것이다.

그 오류가 `ReferenceError`가 아닌 것을 주목하자. JS는 스코프에서 식별자 `greeting`을 찾지 못했다고 말하는 것이 아니다. 그것은 `greeting`을 찾았지만 그 순간 함수 참조a function reference는 갖고 있지 않다고 말하는 것이다. 오직 함수들만 호출될 수 있기 때문에 함수가 아닌 어떤 값을 호출하려는 시도는 오류를 반환한다.

그런데 함수 참조가 아니라면 `greeting`는 무엇을 갖고 있는 것일까?

호이스팅과 더불어, `var`로 선언된 변수들은 스코프 시작부에서(즉, 가장 근접하는 둘러싸고 있는 함수나 전역 스코프) 자동으로 `undefined`로 초기화된다. 한번 초기화되면, 그 스코프의 전역에서 (불러오기, 할당하기 등으로) 사용될 수 있다.

따라서, 첫 번째 라인의 `greeting`은 존재는 하지만 기본값으로 `undefined` 값이 할당돼 있을 뿐이다. `greeting`은 라인 4까지 함수 참조가 할당되지 않을 것이다.

다음의 차이점에 더 집중하길 바란다. `function` 선언은 호이스팅되면서 **해당 함수값이 초기화된다**(즉, *함수 호이스팅*이라 불린다). `var` 변수 또한 호이스팅되면서 `undefined`로 자동 초기화된다. 그 다음(line 4) `function` 표현식의 할당은 런타임 실행으로 그 부분이 프로세스될 때까지 일어나지 않는다.

두 경우에서, 식별자의 이름은 호이스팅된다. 그러나 함수 참조 연결은 그 식별자가 정식 `function` 선언으로 생성될 때까지 (스코프가 시작되는) 초기화 타임에 처리되지 않는다.

### Variable Hoisting

*변수 호이스팅*의 다른 사례를 보자.

```js
greeting = "Hello!";
console.log(greeting);
// Hello!

var greeting = "Howdy!";
```

라인 5에 도달할 때까지 `greeting`이 선언되지 않았음에도, 라인 1과 같은 초기에 할당이 이루어질 수 있다. 어떻게?

설명에 필요한 두 가지 기본적인 답이 있다.
- 식별자는 호이스팅된다.
- **그리고** 스코프의 최상위에서 식별자는 `undefined` 값으로 자동 초기화된다.

:::tip NOTE
이러한 종류의 *변수 호이스팅*을 사용하는 것은 부자연스럽게 느껴질 것이고, 많은 독자들은 프로그램에서 그것에 의존하고 싶지 않을지도 모르겠다. 그러나 *함수 호이스팅*을 포함해 모든 호이스팅을 피해야만 할까? 부록 A에서 더욱 자세히 호이스팅의 다른 관점들에 대해 알아 보도록 하자.
:::

## Hoisting: Yet Another Metaphor

챕터 2는 스코프를 묘사하기 위한 은유metaphor의 향연이었다. 그러나 지금은 호이스팅이란 전혀 다른 것과 마주하고 있다. JS 엔진이 수행하는 구체적인 실행 단계로서 호이스팅이라기 보다, **실행 전** 프로그램 설정 시 JS가 수행하는 다양한 활동들의 시각화로서 호이스팅 개념이 더 유용하다.

호이스팅이 무엇을 의미하는지에 대한 일반적인 주장은 (무거운 것을 위로 올리는 것처럼) 스코프의 상단으로 식별자들을 *리프팅lifting*하는 것이다. 종종 제기되는 설명은 실제로 JS 엔진은 실행 전 프로그램을 *다시쓰기rewrite*한다는 것이고, 그래서 이전 예시는 다음처럼 보일 것이다.

```js {1,4}
var greeting;           // hoisted declaration
greeting = "Hello!";    // the original line 1
console.log(greeting);  // Hello!
greeting = "Howdy!";    // `var` is gone!
```

호이스팅 메타포metaphor은, JS는 오리지널 프로그램을 전처리하고 조금은 그것을 재배열한다. 그래서 모든 선언들은 실행 전 그들 각자의 스코프들의 상단으로 이동되어진다,는 것을 약속한다. 더불어, 호이스팅 메타포는 `function` 선언들이 전체적으로 각 스코프의 상단으로 호이스팅됨을 주장한다.

다음을 보자.

```js
studentName = "Suzy";
greeting();
// Hello Suzy!

function greeting() {
    console.log(`Hello ${ studentName }!`);
}
var studentName;
```

호이스팅 메타포의 "규칙rule"은 함수 선언들이 우선 호이스팅되고, 그 다음 모든 함수들이 호이스팅되는 즉시 변수들이 호이스팅된다. 따라서, 호이스팅 스토리는 프로그램이 다음에 보는 것처럼 JS 엔진에의해 재배열됨을 제안한다.

```js
function greeting() {
    console.log(`Hello ${ studentName }!`);
}
var studentName;

studentName = "Suzy";
greeting();
// Hello Suzy!
```

호이스팅 메타포는 편리하다. 그 이점은 스코프들 내부 깊이 묻혀있는 모든 선언들을 찾고 위로 이동(호이스팅)시키는데 필요한 마법같은 전처리를 넘겨주도록 허용하고 있다; 프로그램이 JS 엔진에 의해 하향식 **단일 패스single pass**로 실행되는 것처럼 생각할 수 있다.

단일 패스는 명확히 챕터 1의 두 단계 처리보다 더 간단하게 보인다.

코드의 순서를 재배치하는 메커니즘으로서 호이스팅은 매력적인 단순함이 있지만 그것은 정확하지 않다. JS 엔진은 실제로 코드를 재배열하지 않는다. 마법같이 선언들을 미리 보고 찾을 수 없다; 프로그램 안 모든 스코프 경계와 선언들을 정확히 찾기 위한 유일한 방법은 코드를 완전히 파싱하는 것이다.

파싱이 무엇인지 생각해 보았는가? 두 단계 프로세스 중 첫 번째 단계다! 이 사실을 피하기 위한 마법같은 정신적 체조는 없다.

만약 호이스팅 메타포가 (기껏해야) 정확하지 않다면, 그 용어를 어떻게 해야 할까? 그것은 여전히 유용하고 생각한다.--진짜로, TC39의 멤버들조차 일반적으로 호이스팅을 사용한다.--그럼에도 호이스팅은 소스 코드의 실제 재배열이라고 주장해서는 안된다고 생각한다.

:::warning
부정확하거나 불완전한 정신적 모델들은 가끔 우연히 옳은 답을 유도할 수 있다는 점 때문에 종종 충분한 것처럼 보인다. 그러나 JS 엔진이 작동하는 방법에 맞춰 생각하지 않는다면 결국에는 결과를 예측하거나 정확히 분석하기가 더 어렵다.
:::

호이스팅은 스코프에 들어갈 때마다, 해당 스코프의 초반에 변수의 자동 등록을 위한 런타임 명령들을 만드는 **컴파일 타임 오퍼레이션compile-time operation**을 참조해 사용돼야 *한다.*

그것은 '런타임 동작으로서 호이스팅을 실행하는 것'에서 '컴파일 타임 작업 중 그것(변수나 함수 선언들)을 적절한 자리로 이동하는 것'으로 미묘하지만 중요한 변화다.

## Re-declaration?

변수가 동일한 스코프에서 한 번 이상 선언됐을 때 무슨 일이 일어날지 생각해 봤는가? 다음을 보자:

```js
var studentName = "Frank";
console.log(studentName);
// Frank

var studentName;
console.log(studentName);   // ???
```

두 번째 출력되는 메시지가 무엇일까? 많은 사람들은 `var studentName`이 변수를 재선언한다고 믿는다. (따라서 그 변수는 "리셋"된다.) 그래서 `undefined`가 출력될 것이라고 예상한다.

그러나 동일한 스코프에서 "재선언"된 변수에 위와 같은 일이 일어날까? 그렇지 않다.

만약 이 프로그램을 호이스팅 메타포 관점에서 생각한다면, 다음처럼 실행 목적들을 위해 재배열될 것이다.

```js
var studentName;
var studentName;    // clearly a pointless no-op!

studentName = "Frank";
console.log(studentName);
// Frank

console.log(studentName);
// Frank
```

사실 호이스팅은 스코프 시작의 변수 등록에 대한 것이기 때문에, 본 프로그램에서 두 번째 `var studentName` 문이 위치한 프로그램 스코프 중간에서 처리될 것이 아무 것도 없다.

:::tip
챕터 2에서 서술한 내러티브 스타일로 말하자면, *컴파일러*는 두 번째 `var` 선언 문을 찾으려고 *스코프 매니저*에게 `studentName` 식별자를 이미 보았는지 물어볼 것이다; 그런 이유로, 더는 할 것이 없을 것이다.
:::

또한, 대게 그렇게 생각하는 것처럼 `var studentName;`이 `var studentName = undefined;`을 의미하지 않다는 점을 지적하는 것이 중요하다. 프로그램의 다음 변수를 참고하여 그 차이점을 증명해보자.

```js
var studentName = "Frank";
console.log(studentName);   // Frank

var studentName;
console.log(studentName);   // Frank <--- still!

// let's add the initialization explicitly
var studentName = undefined;
console.log(studentName);   // undefined <--- see!?
```

명확히 `=undefined`으로 초기화하는 것이 그것을 생략했을 때 암묵적으로 일어난다고 가정하는 것에 비해 어떻게 다른 결과를 산출하는지 보이나요? 다음 섹션에서, 선언 시 변수 초기화에 대한 이와 같은 주제를 다시 알아볼 것이다.

하나의 스코프에서 동일 식별자 이름의 반복적인 `var` 선언은 실제로 무의미한 동작이다. 다음은 같은 이름의 함수에 대한 또 다른 예시가 있다:

```js{10,14}
var greeting;

function greeting() {
    console.log("Hello!");
}

// basically, a no-op
var greeting;

typeof greeting;        // "function"

var greeting = "Hello!";

typeof greeting;        // "string"
```

첫 번째 `greeting` 선언은 스코프에 식별자를 등록하고, 그것은 `var`의 자동 초기화로 `undefined`가 될 것이다. `function` 선언은 식별자 재등록이 필요하지 않지만, *함수 호이스팅* 때문에 식별자는 함수 참조를 사용하는 자동 초기화로 덮어쓰기한다. 두 번째 `var greeting`은 스스로 아무것도 하지 않는다. `greeting`은 이미 식별자이고 *함수 호이스팅*도 이미 자동 초기화를 위한 절차를 진행했기 때문이다.

실제로 `greeting`에 `"Hello!"`를 할당하는 것은 초기 함수 `greeting()`에서 문자열로 `greeting`의 값을 변경한다; `var` 자체는 어떤 영향도 미치지 않는다.

`let` 또는 `const`를 사용하여 하나의 스코프 안에서 선언을 반복하는 것은 어떻게 생각하는가?

```js
let studentName = "Frank";

console.log(studentName);

let studentName = "Suzy";
```

이 프로그램은 실행되지 않겠지만, 그 대신 즉시 `SyntaxError`를 반환할 것이다. 당신의 JS 환경에 따라서, 그 오류 메시지는 "studentName has already been declared."와 같은 것을 나타낼 것이다. 다르게 표현하면, 시도된 "재선언re-declaration"은 명백히 허용되지 않는다!

두 선언들이 `let`으로 되어야만 이러한 오류가 발생하는 것은 아니다. 만약 둘 중 한 선언이 `let`을 사용한다면, 다른 선언은 `let` 또는 `var` 둘 중 하나이다, 다음 예시와 같이 오류가 여전히 발생할 것이다:

```js
var studentName = "Frank";

let studentName = "Suzy";
```

그리고

```js
let studentName = "Frank";

var studentName = "Suzy";
```

두 경우에서, `SyntaxError`가 *두 번째* 선언에서 발생한다. 다른 말로, 변수를 "재선언re-declare"할 유일한 방법은 이 선언들 모두 `var`를 사용하는 것이다.

근데 왜 허용되지 않을까? `var`의 "재선언"이 항상 허용돼왔던 것에 비추어 보면, 이 오류의 원인은 기술적인 것이 아니다; 분명히 그와 같은 권한은 `let`에게 부여됐어야 할 텐데 그렇지 못했다.

사실 이것은 "사회 공학social engineering" 이슈에 가깝다. TC39 핵심 구성원 중 다수를 포함하는 어떤 사람들에 의해 변수의 "재선언re-declaration"은 프로그램 버그를 유발할 수 있는 나쁜 습관으로 보였다. 그래서 ES6가 `let`을 제공할 때, 오류를 유발하는 "재선언"을 금지하기로 결정했다.

:::tip NOTE
물론 이것은 스타일에 관한 의견이지 기술적 논의가 아니다. 많은 개발자들은 그 입장에 동의하며, 이것이 TC39가 그 오류(또한, `let`은 `const`를 따라한다)를 포함한 한 이유일 것이다. 그러나 `var`의 전례처럼 일관성을 유지하는 것이 더 신중했으며, 그와 같은 옵션 강제는 린터같은 선택적 도구에게 맡기는 것이 더 좋았다는 합리적 대안이 만들어질 수도 있었을 텐데 그렇지 못했다. 부록 A에서, `var`(그리고 "재선언"과 같은 관련된 동작)가 모던 JS에서도 여전히 유용한지에 대해 알아볼 것이다.
:::

*컴파일러*가 *스코프 매니저*에게 어떤 선언에 대해 물었을 때, 만약 해당 식별자가 이미 선언됐으며 둘 중 하나 또는 둘 모두 `let`으로 선언됐다면, 오류가 발생한다. 개발자에게 보내는 의도된 신호는 "허술한 재선언에 의존하지 마세요!"이다.

### Constants?

`const` 키워드는 `let`보다 더 강요된다. `let`과 같이 `const`는 같은 스코프 안에서 동일한 식별자가 반복될 수 없다. 그러나 실제로 이러한 종류의 "재선언"이 불허되는 원인는 오버라이딩이라는 기술적 이유 때문이다. `let`이 스타일상의 이유로 "재선언"을 거의 불허하는 것과는 다르다.

`const` 키워드는 초기화된 변수를 요구하므로, 선언에서 할당을 생략하면 `SyntaxError`가 발생한다:

```js
const empty;   // SyntaxError
```

`const` 선언은 재할당할 수 없는 변수를 생성한다.

```js
const studentName = "Frank";
console.log(studentName);
// Frank

studentName = "Suzy";   // TypeError
```

`studentName` 변수는 재할당할 수 없다. 왜냐하면 그 변수가 `const`와 함께 선언됐기 때문이다.

:::warning
`studentName`에 재할당 시 발생하는 오류는 `TypeError`다. `SyntaxError`가 아니다. 이 미묘한 차이는 사실 꽤 중요하지만 유감스럽게도 너무 쉬워서 놓치는 부분이다. 구문 오류syntax error는 (프로그램) 실행의 시작조차 막는 프로그램 내부의 문제들을 나타낸다. 타입 오류type error는 프로그램 실행 중 일어나는 문제들을 나타낸다. 앞선 스니펫에서, `studentName`의 재할당을 프로세싱하기 전 `"Frank"`가 출력되고, 그 후에 오류가 반환된다.
:::

그래서 만약 `const` 선언은 반드시 할당돼야 하며, `const` 선언이 재할당될 수 없으면, `const`가 어떤 "재선언"도 불허해야 하는 분명한 기술적 이유를 가진다: 즉, 어떤 `const` "재선언"은 반드시 허용될 수 없는 `const` 재할당이 될 것이다!

```js
const studentName = "Frank";

// obviously this must be an error
const studentName = "Suzy";
```

`const` "재선언"이 (기술적 영역에서) 허용되면 안 되기 때문에, TC39는 일관성 때문에 기본적으로 `let` "재선언" 역시 허용되서는 안된다고 생각했다. 이것이 최선의 선택인지 논해볼 수 있지만, 최소한 우리는 결론의 이면에 있는 근거를 알고 있다.

### Loops

JS가 동일 스코프 내 변수 "재선언"을 허용하지 않는다는 점이 이전 논의로 명확해졌다. 루프 안 선언문의 실행 반복이 의미하는 것을 고려하기 전까지, 그것은 간단한 충고처럼 보였다. 다음을 보자:

```js
var keepGoing = true;
while (keepGoing) {
    let value = Math.random();
    if (value > 0.5) {
        keepGoing = false;
    }
}
```

`value`는 이 프로그램에서 반복적으로 "재선언"되고, 오류가 발생할까? 아니다.

모든 스코프 규칙들(`let`으로 생성된 변수의 "재선언"을 포함)은 *스코프 인스턴스마다* 적용된다. 즉, 실행 중 스코프에 들어가질 때마다 모든 것을 리셋한다.

각 루프의 반복은 그것이 소유한 새로운 스코프 인스턴트가 있다. 그리고 각 스코프 인스턴스 안에서 `value`는 오직 한 번만 선언된다. 그래서 "재선언"이 시도되지 않고 따라서 오류도 없다. 우리가 다른 루프 형태들을 고려하기 전, 이전 스니펫 내 `value` 선언이 `var`로 변경된다면 어떻게 될까?

```js
var keepGoing = true;
while (keepGoing) {
    var value = Math.random();
    if (value > 0.5) {
        keepGoing = false;
    }
}
```

우리는 특별히 `var`가 재선언을 허용한다는 것을 아는데, 그 이유로 `value`는 여기서 "재선언"이 될까? 아니다. 왜냐하면, `var`는 블록 범위의 선언으로 처리되지 않기 때문에(챕터 6 참조), 그것은 전역 범위에 포함된다. 그래서 `value` 변수는 `keepGoing`(전역 스코프)과 같은 스코프 내에서 오직 하나만 존재한다. 이 역시 "재선언"이 아니다.

:::tip
옮긴이 주: 루프 안의 `var value`가 "재선언"이 아니라는 말은 다음 루프가 시작될 때(새 스코프 인스턴스에 들어갈 때) 이전 루프에서 생성된 변수들이 리셋된다는 뜻인 것 같다.
:::

이 모든 것을 올바로 유지하는 한 가지 방법은 `var`, `let`, 그리고 `const` 키워드들은 실행 시작 시 실제로 코드에서 제거된다는 점을 기억하는 것이다. 그들은 전적으로 컴파일러에 의해 처리된다.

:::tip
옮긴이 주: 앞서 런타임 시 `var`, `let`, `const`는 이미 제거된 상태다, 라는 뜻은 다음이 아닐까 생각한다. 각 변수 키워드 종류에 따라, 컴파일 타임에 모든 변수의 선언, 할당, 재선언, 재할당 등에 대한 처리가 완료되기 때문에 런타임 시 변수 키워드는 더는 고려 대상이 아니다(변수 키워드가 제거된 상태이다).
:::

만약 마음으로 선언자 키워드들을 삭제하고 코드를 실행한다면, (재)선언들의 발생 여부와 시기를 결정하는데 도움이 될 것이다.

`for` 루프와 같은 다른 형태의 루프에서 "재선언"하는 것은 어떨까?

```js
for (let i = 0; i < 3; i++) {
    let value = i * 10;
    console.log(`${ i }: ${ value }`);
}
// 0: 0
// 1: 10
// 2: 20
```

스코프 인스턴스당 한 개의 `value`만 선언되는 것은 명백할 것이다. 근데 `i`는 어떨까? 재선언될까?

질문에 답하기 위해 `i`가 어떤 스코프 안에 있을지 생각해보자. 그것은 바깥 스코프(이 경우, 전역)에 있는 것처럼 보일 수 있지만 그렇지 않다. 그것은 `value`처럼 `for` 루프의 스코프 안에 있다. 즉, 다음의 장황하고 동등한 형태로 해당 루프에 대한 개념을 풀어볼 수 있다:

```js
{
    // a fictional variable for illustration
    let $$i = 0;

    for ( /* nothing */; $$i < 3; $$i++) {
        // here's our actual loop `i`!
        let i = $$i;

        let value = i * 10;
        console.log(`${ i }: ${ value }`);
    }
    // 0: 0
    // 1: 10
    // 2: 20
}
```

이제 그것은 명확해질 것이다: `i`와 `value` 변수들은 스코프 인스턴스당 정확히 한 번씩 양쪽에 선언됐다.

다른 `for` 루프 형태들은 어떨까?

```js
for (let index in students) {
    // this is fine
}

for (let student of students) {
    // so is this
}
```

`for..in`와 `for..of` 루프들은 같은 것이다: 선언된 변수는 루프 바디 *안에서* 처리되고 반복할 때마다(스코프 인스턴스마다) 다루어진다. "재선언"이 아니다.

이 지점이 깨진 레코드처럼 들릴지도 모르겠다. 그러면 `const`가 이러한 루프 구조들에 어떤 영향을 미치는지 알아보도록 하자. 다음을 보자:

```js
var keepGoing = true;
while (keepGoing) {
    // ooo, a shiny constant!
    const value = Math.random();
    if (value > 0.5) {
        keepGoing = false;
    }
}
```

앞서 본 이 프로그램의 `let` 변수처럼, `const`는 각 루프 반복 안에서 정확히 한번 실행되고 있다, 그래서 이것은 "재선언" 문제점들에서 안전하다. 그러나 `for` 루프에 대해 말할 때 더 복잡한 부분이 있다.

`for..in`와 `for..of`는 `const`와 함께 사용해도 괜찮다:

```js
for (const index in students) {
    // this is fine
}

for (const student of students) {
    // this is also fine
}
```

그러나 일반적인 `for` 루프는 그렇지 않다:

```js
for (const i = 0; i < 3; i++) {
    // oops, this is going to fail with
    // a Type Error after the first iteration
}
```

여기서 무엇이 잘못됐나? 이 구성 안에서 `let`을 사용할 수 있었고 각 루프의 반복 스코프를 위해 새로운 `i`를 생성한다고 주장할 수 있었다. 그래서 그것은 "재선언"인 것처럼 보이지 않는다.

우리가 앞서 했던 것처럼 마음으로 해당 루프를 "확장"해보자:

```js
{
    // a fictional variable for illustration
    const $$i = 0;

    for ( ; $$i < 3; $$i++) {
        // here's our actual loop `i`!
        const i = $$i;
        // ..
    }
}
```

문제를 찾았는가? `i`는 루프 안에서 단 한 번 생성됐다. 이것이 문제는 아니다. 문제는 개념적 `$$i`인데 이것은 `$$i++` 표현식으로 매번 증가돼야 한다. 그것은 상수에서 허용되지 않는 **재할당**("재선언"이 아니다)이다.

기억하자, 이 "확장된" 형태는 문제의 원인을 직관하도록 돕기 위한 개념적 모델일 뿐이다. 당신은 JS가 `let $$i = 0` 대신 `const $$i = 0`을 효과적으로 생성할 수 있을 지 궁금할 것이다. 그렇다면 `const`가 우리의 고전적인 `for` 루프와 함께 작동하도록 허용할 수 있을까? 가능한 말이지만, 그러면 `for` 루프 의미체계에 잠재적으로 놀라운 예외들이 발생할 수 있다.

예를 들어, `const` 할당의 엄격함을 피하기 위해 `for` 루프 헤더 안에서 `i++`를 허용하는 것은 오히려 임의적이고 (그리고 혼동스러울 수 있는) 미묘한 예외일 수 있다. 그러나 때때로 (예외를 두지 않는 것이) 유용하기 때문에 루프 반복 안에서 `i`의 다른 재할당들을 허용하지 않는다.

간단히 답하면 다음과 같다: `const`는 필수적으로 요구되는 재할당 때문에 고전적인 `for` 루프 형태와 함께 사용될 수 없다.

흥미롭게도, 만약 재할당하지 않는다면 그것은 유효하다:

```js
var keepGoing = true;

for (const i = 0; keepGoing; /* nothing here */ ) {
    keepGoing = (Math.random() > 0.5);
    // ..
}
```

이것은 작동하지만 본질을 벗어났다. 해당 위치에서 `const`와 함께 `i`를 선언할 이유가 없다. 왜냐하면, 해당 위치에서 그와 같은 변수가 갖는 본질은 **반복을 세기위해 사용되어지는 것**이기 때문이다.

## Uninitialized Variables (aka, TDZ)

`var` 선언들과 함께, 변수는 해당 스코프의 상단으로 "호이스팅"된다. 또한, 그것은 자동으로 `undefined` 값과 함께 초기화된다. 그래서 그 변수는 해당 스코프의 전체에 걸쳐 사용될 수 있다.

하지만, `let`과 `const` 선언들은 이러한 관점에서 완전히 같지 않다.

다음을 보자:

```js
console.log(studentName);
// ReferenceError

let studentName = "Suzy";
```

이 프로그램의 결과는 첫째 줄에서 `ReferenceError`가 반환되는 것이다. 당신의 JS 환경에 의존할 때, 오류 메시지는 다음과 같을 수도 있다: "Cannot access studentName before initialization."

:::tip NOTE
상기와 같은 오류 메시지는 더욱 더 모호하거나 오해를 유발하곤 한다. 고맙게도, 이 커뮤니티의 우리 중 몇몇은 JS 엔진들이 이러한 오류 메시지를 개선하고 그래서 더 정확하게 무엇이 잘못됐는지 알려주도록 (이러한 개선 사항을) 성공적으로 요청할 수 있었다.
:::

그 오류 메시지는 무엇이 잘못됐는지에 대해 매우 직관적이다: `studentName`은 라인 1에 있다. 그런데 그것은 초기화되지 않았기 때문에 아직 사용될 수 없다. 다음을 보자:

```js
studentName = "Suzy";   // let's try to initialize it!
// ReferenceError

console.log(studentName);

let studentName;
```

Oops. 여전히 `ReferenceError`가 발생한다. 그런데 오류는 소위 "초기화되지 않은" 변수 `studentName`에 할당 시도가 첫 번째 라인에 있다. 무슨 일일까?

현실적인 질문은 초기화되지 않은 변수를 어떻게 초기화하느냐다. `let`/`const`에 관하여, 그렇게 하기 위한 **유일한 방법**은 할당에 선언문을 연결하는 것이다. 할당만으로는 충분하지 않다! 다음을 보자:

```js
let studentName = "Suzy";
console.log(studentName);   // Suzy
```

여기서, 우리는 `studentName`을 (이 경우, `undefined` 대신 `"Suzy"`로) 할당이 동반된 `let` 선언문 형태의 방법으로 초기화하고 있다.

대안으로:

```js
// ..

let studentName;
// or:
// let studentName = undefined;

// ..

studentName = "Suzy";

console.log(studentName);
// Suzy
```

:::tip NOTE
흥미롭다! 앞선 사례를 떠올려 보면, **우리는 `var studentName;`은 `var studentname = undefined;`와 같지 *않다고* 말했다, 그러나 `let`과 함께 있을 때는, 그들은 동일하게 작동한다.** 그 차이는 `var studentName;`은 스코프의 상위에서 자동으로 초기화된다는 사실에서 연유한다. `let studentname`은 상위에서 자동으로 초기화되지 않는다.
:::

:::warning NOTE의 볼드체 부분에 대해
원문을 번역하면 NOTE와 같이 해석되지만, 실제로는 `let`과 `var`가 바뀐 게 아닐까 싶다. 볼드체 이후 문장처럼, `var studentName;`이 호이스팅 직후 `undefined`로 자동 초기화되고, 결과적으로 `var studentName = undefined;`와 같아지기 때문이다. 반면, `let studentName;`은 호이스팅 직후 자동 초기화하지 않기 때문에(TDZ 발생)에 `let studentName = undefined;`와 같지 않다. 따라서, 볼드체 부분은 `let`과 `var`가 뒤바뀐 오타가 아닐까 싶다.
:::

앞서, 우리는 *컴파일러*가 `var`/`let`/`const` 선언자들을 제거하고, 그 대신 스코프의 상위에서 그 선언자들을 (런타임) 명령으로 교체할 때 적절한 식별자를 등록한다고 말했다.

그래서 무슨 일이 일어나고 있는지에 대해 분석하면, 우리는 *컴파일러* 또한 프로그램 중간(변수 `studnetName`이 선언된 지점)에 해당 선언의 자동 초기화를 다루는 한 명령을 추가하고 있다는 부가적인 미묘한 차이점을 목격한다. 그 자동 초기화가 이루어지기 전 해당 변수를 사용할 수 없는데, `let`이 그런 것처럼 `const`도 똑같이 그렇다.

스코프 진입부터 변수의 자동 초기화가 이루어지는 순간까지의 *기간period of time*에 TC39는 **일시적 데드 존 Temporal Dead Zone (TDZ)**라는 용어를 붙였다.

TDZ은 변수가 존재하지만 아직 초기화되지 않아서 어떤 방법으로도 접근할 수 없는 시간의 창문이다. 오직 그 명령들의 실행만이 *컴파일러*에 의해 오리지널 선언을 초기화할 수 있는 지점에 남는다. 그 순간 이후, 즉 TDZ 시간이 끝나면, 그 변수는 스코프에서 자유롭게 사용될 수 있다.

`var` 역시 기술적으로는 TDZ가 있다. 그러나 그 길이가 zero이고, 따라서 우리 프로그램에서 관찰할 수 없다. 오직 `let`과 `const`만 TDZ를 관찰할 수 있다.

그런데, TDZ 안에서 "일시적temporal"이란 실제로 *코드의 위치position in code*가 아닌 *시간time*을 의미한다. 다음을 보자:

:::tip
옮긴이 주: `let`(또는 `const`) 변수는 호이스팅은 하지만 자동 초기화하지는 않는다. 따라서 `let` 변수의 (런타임) 실행 전까지는 참조될 수 없다("Temporal"). 이 상태를 TDZ 즉, Temporal Dead Zone이라고 하는데 여기서 "Temporal"이란 `let` 변수가 실행되기 전까지 걸리기 전까지의 "시간"을 의미한다.
:::

```js
askQuestion();
// ReferenceError

let studentName = "Suzy";

function askQuestion() {
    console.log(`${ studentName }, do you know?`);
}
```

`console.log(..)`가 `let studentName` 선언 아래 위치하더라도, `studentName`이 TDZ 안에 있는 동안 `askQuestion()` 함수가 호출된다! 그런 이유로 이것은 오류다.

TDZ의 의미가 `let`과 `const`는 호이스팅하지 않는다라는 것은 흔히 하는 오해에 속한다. 이것은 부정확한, 최소한 약간의 오해가 담긴, 주장이다. 정확히 그것들도 호이스팅한다.

실질적인 차이는 `let`/`const` 선언들은 `var`와 달리 스코프 초기에 자동으로 초기화하지 않는다는 점이다. 여기서 논점은 자동 초기화가 호이스팅의 일부인지 아닌지 여부다. 스코프 상단에서 **변수의 자동 등록("호이스팅"이라 부르는 것)**과 스코프의 상단에서 **변수의 자동 초기화(`undefined` 할당)**은 구별되는 동작들이며, "호이스팅"이란 한 단어로 뭉뚱그려서는 안된다.

우리는 이미 스코프 상단에서 `let`과 `const`는 자동 초기화하지 않는다는 것을 보았다. 그러면 그림자화shadowing를 통해 `let`과 `const`가 호이스팅*한다*는 것을 증명해보자.

```js
var studentName = "Kyle";

{
    console.log(studentName);
    // ???

    // ..

    let studentName = "Suzy";

    console.log(studentName);
    // Suzy
}
```

첫 번째 `console.log(..)` 문에서 무슨 일이 일어날까? `let studentName`이 스코프 상단으로 호이스팅하지 않는다면, 그때 첫 번째 `console.log(..)`는 `"kyle"`을 출력*할 수 있어야 한다.* 그렇죠? 그 순간에는, 외부 `studentName`이 존재하는 것처럼 보일 것이다. 그래서 그 변수 `console.log(..)`는 액세스하고 출력할 것이다.

그러나, 사실 내부 스코프의 `studentName`은 호이스트(스코프 상위에 자동으로 등록)되기 때문에 첫 번째 `console.log(..)`은 TDZ 오류를 반환한다. (아직) 발생하지 않은 것은 해당하는 내부 `studentName`의 자동 초기화였다; 그것은 그 순간에 아직 초기화되지 않았기 때문에 TDZ 위반이다!

요약하면, TDZ 오류는 `let`/`const` 선언들은 그들의 스코프 상위에 그 선언들을 호이스팅 *하기* 때문에 발생한다. 그러나 `var`와 달리, 그들은 기존 선언이 나타나는 코드 순서의 순간까지 변수들의 자동 초기화를 연기한다. 이 시간의 창문(hint: temporal)은, 그 길이length가 어떻든간에, TDZ이다.

어떻게 TDZ 오류를 피할 수 있을까?

조언: 항상 스코프의 상위에 당신의 `let`과 `const` 선언들을 두어라. TDZ 창문을 제로(또는 제로에 가까운) 길이로 단축시키면 TDZ는 고려할 가치가 사라질 것이다.

그러나 왜 TDZ는 여전히 존재하는가? 왜 TC39는 `var`가 그런 것처럼 `let`/`const`의 자동 초기화를 귀담아 듣지 않았나? 인내심을 갖길 바란다, 부록 A에서 TDZ의 *이유*를 알아볼 것이다.

## Finally Initialized

변수들과 함께 하는 작업은 첫 인상보다 더욱 더 미묘한 차이가 있다. *호이스팅*, *(재)선언*, 그리고 *TDZ*는 개발자들(특히, JS로 오기 전 다른 언어들을 사용했던 사람들)을 혼란스럽게 하는 공통된 요인들이다. JS로 이동하기 전, 당신의 심적 모델이 JS 스코프와 변수들의 그러한 관점들에 완전히 기반하고 있음을 확실히 하자.

호이스팅은 일반적으로 JS 엔진의 명백한 메커니즘으로서 인용되지만, 실제로는 JS가 컴파일 중 변수 선언들을 다루는 다양한 방법들을 묘사하기 위한 메타포에 어울린다. 그러나 메타포일지라도, 호이스팅은 변수 라이프사이클(생성될 때, 사용될 수 있을 때, 사라질 때)에 대한 사고(생각)를 위해 유용한 구조를 제공한다.

변수들의 선언과 재선언은 런타임 동작으로 생각했을 때 혼란을 유발하는 경향이 있다. 그러나 이 동작을 위해 컴파일 타임으로 생각을 바꾸면 기이한 일과 그림자화가 줄어든다.

TDZ(temporal dead zone) 오류와 우연히 마주치면 이상하고 좌절스럽니다. 운좋게도, TDZ는 `let`/`const` 선언들을 항상 스코프 상단에 두도록 신중을 기한다면 상대적으로 피하기가 수월하다.

당신이 성공적으로 변수 스코프의 변화와 꼬임을 이해할 때, 다음 챕터는 변수 스코프들(특히, 중첩 블록들) 안에 선언 배치를 위한 우리의 결정을 도와주는 요소들을 제시할 것이다.
