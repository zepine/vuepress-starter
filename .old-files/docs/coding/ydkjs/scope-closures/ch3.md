---
date: 2022-01-01
description: 번역 - Chapter 3 - the Scope Chain
---
# Chapter 3: The Scope Chain

::: tip
- [You Don't Know JS - 2nd Edition](https://github.com/getify/You-Dont-Know-JS "영문") 깃허브 공개 버전(영문)을 개인의 학습 목적으로 번역합니다.
- 한글 번역을 끝내면 핵심만 정리해 요약본으로 교체할 예정입니다.
- 전문 번역서는 [한빛미디어](https://www.hanbit.co.kr/media/books/book_view.html?p_code=B8227329776)에서 구입할 수 있습니다.
:::

[[toc]]

챕터 1과 2는 **lexical Scope**을 구체적으로 정의했고 그것의 개념적 기초를 돕는 매타포를 묘사했다. 이번 챕터를 진행하기 전, 렉시컬 스코프가 무엇이고 왜 그것을 이해하는 것이 유용한지에 대해 직접 설명해 줄 다른 누군가를 찾자.

당신은 아마 이 시간을 건너뛰고 싶겠지만, 렉시컬 스코프에 대해 다른 사람들에게 설명하며 당신의 생각을 재정리할 시간을 갖는 것은 매우 도움이 된다.

지금은 너트와 볼트를 파헤칠 시간이다. 더 많은 상세한 것이 있을 것이다. 그럼으로 집중하라. 이 논의들은 우리가 스코프에 대해 얼마나 모르는지 뚜까팰 것이다(hammer home). 제공되는 모든 텍스트와 코드 스니핏에 시간을 할애 하라.

챕터 2에서 봤던 이미지를 다시 보자.

![color scopes](https://cdn.jsdelivr.net/gh/zepine/yanggiri-cdn@master/publichttps://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/images/fig2.png?raw=true)
*Fig. 2(Ch. 2): Colored Scope Bubbles*

다른 스코프 안에 중첩된 스코프들 사이의 연결connections을 스코프 체인이라 부른다. 이 체인은 접근할 수 있는 변수들을 따라 길을 연결한다.

## "Lookup" Is (Mostly) Conceptual

Figure 2에서, `for`-루프에 있는 `students` 변수 참조의 컬러를 주묵하자. 어떻게 우리는 `students`가 정확히 RED 구슬이라고 단정할 수 있는가?

챕터 2에서, 우리는 탐색("lookup") 시 변수의 런타임 액세스을 묘사했다. **Engine**은 식별자/변수에 대해 알고 있는지 현 스코프의 **Scope Manager**에 물어보는 것에서 시작하고, 설사 찾는 식별자/변수가 없다해도 찾을 때까지 (전역 스코프쪽으로) 중첩 스코프들의 체인을 타고 위쪽/바깥쪽로 탐색을 진행한다. 이 탐색은 일치하는 이름의 선언을 발견하면 멈춘다.

따라서, 이 탐색 프로세스는, 가장 마지막에 있는 RED 전역 스코프에 도달할 때까지, 스코프 체인을 지나는 중 일치하는 변수 이름을 발견하지 못했기 때문에 `students`를 RED 구슬로 최종 결정한다.

유사하게, `if`-문에서 `studentID`는 BLUE 구슬이라 결정한다.

런타임 탐색 프로세스의 이 제안은 개념적으로 이해하기 좋다. 그러나, 사실 그것은 실제에서 작동하는 일반적인 방식은 아니다.

구슬 버킷의 컬러(변수가 어떤 스코프에 속하는지에 대한 메타 정보)는 일반적으로 초기 컴파일 프로세스 중에 결정된다. 렉시컬 스코프는 컴파일 시점에 대부분 완성되기 때문에, 구슬 컬러는 런타임 중 일어나는 일로 인해 변경되지 않을 것이다.

구슬의 컬러는 컴파일 시 정해지고 변하지 않는다. 이 정보는 AST의 각 변수 엔트리에 저장되는데, 프로그램 런타임을 구성하는 실행 지침에 의해 명백히 사용된다.

다른 말로, `Engine`(챕터 2에서)은 변수가 유래하는 스코프 버킷을 찾기 위해 스코프들의 다발을 관통하는 탐색(lookup)이 필요없다. 그 정보는 이미 알고 있으니까! 런타임 탐색의 필요성을 제거하는 것은 렉시컬 스코프의 이점을 최대화 하기 위한 핵심이다.

근데 나는(저자)는 방금 전에 컴파일 중 구슬 컬러를 알아내려는 것에 대해 "...일반적으로 ... 결정된다..."라고 말했다. 그럼 컴파일 중 결정되지 않는 것은 어떤 경우일까?

현재 파일에서 접근할 수 있는 렉시컬 스코프에 선언되지 않는 변수에 대한 참조에 관해(Get Started, Chapter 1 참조), 그 파일은, JS 컴파일의 시각에서 각 파일은 그것이 소유하는 개별 프로그램이라고 주장한다. 선언을 발견하지 못한다 해도 그것은 반드시 에러가 아니다. 런타임 시 다른 파일(프로그램)은 공유하는 전역 스코프에 변수를 선언할지도 모른다. (아래 원문 참조)

> Consider a reference to a variable that isn't declared in any lexically available scopes in the current file—see Get Started, Chapter 1, which asserts that each file is its own separate program from the perspective of JS compilation. If no declaration is found, that's not necessarily an error. Another file (program) in the runtime may indeed declare that variable in the shared global scope.

따라서, 변수가 어떤 접근할 수 있는 버킷에서 적절히 선언된 적이 있는지에 대한 최종 결정은 런타임까지 지연될 수 있다.

초기에 **선언되지 않은undeclared** 변수에 대한 참조는 파일의 컴파일 중 컬러가 없는 구슬로 남아 있는다; 이 컬러는 다른 관련된 파일들이 컴파일되고 애플리케이션 런타임이 시작할 때까지 결정되지 않을 수 있다. 이 지연된 탐색은 그 변수가 발견되는 스코프에 따라 마침내 색상이 결정될 것이다.

하지만, 런타임 중 나중에 구슬의 컬러를 바꿀 수 없기 때문에, 이 탐색은 거의 변수 당 한번씩만 필요할 것이다.

위 내용을 다시 정리하면, 일반적으로 변수 참조(fig. `students`, `studentID`와 같은)의 스코프(컬러)는 대부분 컴파일 과정 중 결정된다. 일부는 런타임까지 스코프 결정이 지연될 수 있다.

컴파일 중 선언되지 않은 변수 참조는 그 자체로 오류를 발생시키지 않는다. 일단 변수 참조에 대한 스코프 결정이 런타임까지 지연되며 런타임 시에도 변수 참조에 대한 선언이 발견되지 않으면 `ReferrenceError`를 반환한다. 이 오류는 런타임 시 발생한다는 점을 유념하라.

다시 말하지만, 변수 참조의 스코프는 런타임 시 최종 결정된다. JS 컴파일의 관점에서 각 JS의 파일들(*.js)은 독립적인 하나의 프로그램들으로 간주되는데, 이런 점 때문에 파일의 일부에 오류가 있어도 모든 파일의 컴파일을 방해하진 않는다.(참고: [Get Started](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/get-started/ch2.md#each-file-is-a-program))

물론, 런타임 시에는 모든 파일들이 하나의 프로그램처럼 합쳐지고, **전역 변수를 공유**한다. 아직 스코프가 결정되지 않은 변수 참조는 전역 변수가 공유될 때 탐색을 진행한다. 해당하는 선언이 있다면 그 참조 변수는 미정이었던 스코프를 최종 확정한다.  

이렇게 스코프는 컴파일 시 대부분은 확정되지만 미정인 변수 참조는 런타임에 최종 결정된다.

## Shadowing

"Shadowing"은 미스테리하게 들릴지 모른다. 그러나 걱정 마시라. 이것은 완벽히 법칙적이다.

이번 챕터의 예제는 스코프 경계들에 구애 받지 않고 서로 다른 이름들의 변수를 사용한다. 구슬(변수)들은 모두 고유한 이름들을 가지고 있기 때문에, 어떤 면에서 모든 구슬들이 하나의 버킷 안에 있는지 아닌지는 중요하지 않을 것이다.

다른 렉시컬 스코프 버킷들의 존재가 중요한 경우는 2개 또는 그 이상의 변수들이 있고, 그 변수들은 각각 다른 스코프에 있고, 어휘적으로 각 변수의 이름이 동일할 때다. 단일 스코프에는 같은 이름로 된 2개 이상의 변수가 있을 수 없다. 이와 같은 다중 참조들은 하나의 변수를 참조하는 것으로 간주될 것이다.

``` js
function printStudent(studentName) {
  studentName = studentName.toUpperCase();
  console.log(studentName);
}

printStudent("Frank");
// FRANK

printStudent(studentName);
// SUZY

console.log(studentName);
// Suzy
```

첫 줄에 있는 `studentName` 변수는 RED 구슬, 3 번째 줄에 선언된 같은 이름의 변수는 BLUE 구슬. 이 매개 변수는 `printStudent(..)` 함수 안에 있다.

그럼 `studentName = studentName.toUpperCase()` 할당 선언문과 `console.log(studentName)` 문의 구슬 컬러는 무엇일까? 모든 3개의 `studentName` 참조들은 BLUE일까?

탐색("lookup")의 개념에 근거해, 우리는 탐색은 현재 스코프에서 시작하고, 바깥/위쪽 방향으로 작동하며, 일치하는 변수를 찾을 때 탐색을 중지할 것이라고 말할 수 있다. BLUE `studentName`은 바로 발견되고, RED `studentName`은 결코 고려되지 않는다.

이것은 **shadowing**이라고 불리는 렉시컬 스코프 동작의 주요 사항이다. BLUE `studentName` 변수(매개 변수)는 RED `studentName`에 그림자를 드리운다. 매개 변수는 전역 변수를 그림자로 가린다.

즉, 전역 스코프는 매개 변수의 그림자에 가려 탐색이 불가능한 Shadowing 영역이 되므로, 함수 안에서 전역 스코프에 접근하려거나 그곳의 변수에 재할당하려는 시도는 실패할 것이다.

이것이 `studentName` 재할당이 안쪽(매개 변수) 변수 즉, BLUE `studentName`에만 영향을 미치는 이유이다. 전역 변수인 RED `studentName`에는 영향을 미치지 않는다.

외부 스코프에 있는 변수를 그림자로 가린다면, 한 가지 직접적인 영향은 그 스코프에서 그림자로 가려진 변수(위 예제에서는 RED)와 같은 어떤 구슬도 색상 짓는 것은 불가능하다. 다르게 말하면, `printStudent(..)` 함수 안에서 `studentName` 식별자 참조는 매개 변수에 일치할 것이고, 결코 전역 `studentName` 변수에는 일치하지 않는다. 그것은 어휘적으로 중첩 스코프로에서 또는 `printStudent(..)`의 안쪽 어디에서도 전역 `studentName`를 참조하는 것은 불가능하다.

## Global Unshadowing Trick

주의: 지금 묘사하려는 테크닉은 좋은 실례가 아니다. 그것은 이용의 제한이 있고, 코드를 독해하는 데 혼란을 주고, 그리고 버그를 발생시키기 쉽다. 나는 기존 프로그램들에서 이 테크닉을 실행해야 할지도 모르고, 무슨 일이 발생하고 있는지 이해하는 것이 크리티컬한 실수를 예방하는 일이므로 이 테크닉을 다루고 있는 것이다.

이 테크닉은 *그림자에 가려져 있는 변수가 위치하고 있는 스코프에서* 전역 변수에 접근하도록 한다. 그러나 전형적인 렉시컬 식별자 참조를 통해서는 접근할 수 없다.

> It is possible to access a global variable from a scope where that variable has been shadowed, but not through a typical lexical identifier reference.

전역 스코프에서, `var` 선언문과 `function` 선언문은 전역 객체(특히, 전역 스코프의 객체 대표)의 (식별자로서 같은 이름의) 프로퍼티들로서 그들 자신을 노출한다. 만약, 브라우저 환경을 위해 JS를 작성했다면, 당신은 아마 `window`와 같은 전역 객체를 알고 있을 것이다. 사실 이것은 완벽히 정확한 내용은 아니지만 우리의 논의에 있어서는 충분하다. 다음 챕터에서, 우리는 전역 스코프/객체 주제에 대해 더 알아볼 것이다.

이 프로그램에 관하여, 특별히 브라우저 환경에서 단일 .js 파일로 실행됐다.

``` js
var studentName = "Suzy";

function printStudent(studentName) {
  console.log(studentName);
  console.log(window.studentName);
}

printStudent("Frank");
// "Frank"
// "Suzy"
```

`window.studentName` 참조를 주시했는가? 이 표현식은 (현재로서는 전역 객체와 동일하다고 생각하는) `window`의 프로퍼티이자 전역 변수인 `studentName`에 접속하고 있다. 이것은, 가리고 있는 변수가 존재하는 스코프 안에서 가려진 변수에 접속하는 유일한 방법이다.

`window.studentName`은 개별의 스냅샷 복사본이 아니라 전역 `studentName` 변수의 미러다. 어느 쪽에서든, 한쪽의 변화들은 여전히 다른쪽에서 보여진다. `window.studentName`을 실제 `studentName` 변수에 접속하는 getter/setter처럼 생각할 수 있다. 사실, 전역 객체에 프로퍼티를 생성하거나 세팅함으로써 전역 스코프에 변수를 추가할 수 있다.

WARNING:  
Remember: 단지 당신이 할 수 있으니 해야 한다고 생각하지 마시라. 구체적으로, 접근이 필요한 전역 변수를 그림자화 하지 말고, 그림자화된 전역변수에 접근하는 트릭(window.~)을 편의에 따라 사용하지 마시라. `window` 프로퍼티를 이용해 전역 변수들을 생성한다면 당신의 코드를 리뷰하는 데 혼동을 가중할 것이다. 일반적인 변수 선언 방식을 이용하라.

이 작은 "트릭"은 오직 전역 변수에 접근하기 위한 용도로 사용할 수 있다. 중첩 스코프에서 그림자화된 변수는 해당하지 않는다. 또한, 그것은 오직 `var`나 `function`으로 선언된 것에 한정 된다.

전역 스코프의 선언들 중 (`var` 또는 `function`이 아닌 ) 다른 형태는 그 선언을 반영하는 전역 객체의 프로퍼티mirrored global object들을 생성하지 않는다.

``` js
var one = 1;
let notOne = 2;
const notTwo = 3;
class notThree {}

console.log(window.one); // 1
console.log(window.notOne); // undefined
console.log(window.notTwo); // undefined
console.log(window.notThree); // undefined
```

전역 스코프가 아닌 어떤 다른 스코프에 존재하는 변수들(그들이 어떻게 선언됐는지는 중요하지 않다!)은 그들을 그림자화 한 스코프에서 절대 접근할 수 없다.

``` js
var special = 42;

function lookingFor(special) {
// 이 스코프의 special 파라미터 식별자는
// keepLooking() 함수에 그림자화 되었다.
// 따라서 이 함수 스코프에서 접근할 수 없다.

function keepLooking() {
  var special = 3.141592;
  console.log(special);
  console.log(window.special);
}

keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 42
```

전역 RED(1) `special`은 BLUE(2) `special`(파라미터)에 의해 그림자화 돼 있다. BLUE(2) `special`은 `keepLooking()` 안의 GREEN(3) `special`에 의해 그림자화 돼 있다. 우리는 `window.special`을 이용해 RED(1) `special`을 간접 참조할 수 있다. 그러나 `112358132134` 숫자를 얻기 위해 BLUE(2) `special`에 접속할 방법이 없다.

## Copying Is Not Accessing

나는 수차례 "그런데...?"라는 질문을 받았다.

``` js
var special = 42;

function lookingFor(special) {
  var another = {
    special: special
  };

  function keepLooking() {
    var special = 3.141592;
    console.log(special);
    console.log(another.special); // Ooo, tricky!
    console.log(window.special);
  }

  keepLooking();
}

lookingFor(112358132134);
// 3.141592
// 112358132134
// 42
```

위 `another` 객체가 이전 나의 주장을 반박한다고 말할 수 있지 않을까? `keepLooking()` 안에서 `special` 파라미터에 절대로 접근할 수 없다는 주장을. 아니다, 그 주장은 여전히 유효하다.

`special: special`은 다른 컨테이너(같은 이름의 프로퍼티) 안에 `special` 파라미터 변수의 값을 복사하고 있다. 그 컨테이너 안으로 값을 입력하면 더는 그림자화가 적용되지 않는다(`another` 객체가 그림자화되지 않았다 해도). 그러나, 이것은 우리가 `special` 파라미터에 접속하고 있음을 의미하지 않는다. 이것은 우리가 `special` 파라미터가 일시적으로 가지고 있는 값의 복사본에 접속하고 있는 것을 의미한다. 우리는 `keepLooking()` 안에서 BLUE(2) `special` 파라미터에 다른 값을 재할당할 수 없다.

또 다른 의문이 막 들지도 모르겠다. 숫자(`112358132134`) 대신 값으로서 배열 또는 객체를 사용한다면 어떨까? 우리는 원시값의 복사본 대신 객체들의 참조들을 가지면 '접근할 수 없음'을 수정할 수 있을까?

그렇게 할 수 없다. 참조 카피를 통해 객체 값의 내용들을 변화하는 것은 어휘적으로 그 변수 자신에 접근하는 것과 동일하지 않다. 우리는 여전히 BLUE(2) `special` 파라미터를 재할당 할 수 없다.

## Illegal Shadowing

그림자화 하는 선언의 모든 조합들이 허용되지 않는다. `let`은 `var`를 그림자화 할 수 있으나, `var`는 `let`을 그림자화 할 수 없다.

``` js
function something() {
  var special = "JavaScript";

  {
    let special = 42; // totally fine shadowing

    // ..
  }
}

function another() {
// ..

  {
    let special = "JavaScript";

    {
      var special = "JavaScript";
      // ^^^ Syntax Error

      // ..
    }
  }
}
```

`another` 함수에 주목하자. 내부 선언 `var special`은 함수 범위의 `special`을 선언하려 시도하고 있다. `something()` 함수에 보여지는 것처럼 `special` 스스로와 그 안에서는 괜찮아 보인다.

이 케이스의 구문 오류 주석은 `special`은 이미 정의되어 있음을 말한다. 그러나 오류 메시지는 약간의 오해의 소지가 있다. 일반적으로 그림자화가 허용될 때 `something()`에서 그와 같은 오류는 발생하지 않는다.

`SyntaxError`가 발생하는 실제 이유는 `var`는 기본적으로 같은 이름의 `let` 선언의 경계 가로지르기cross the boundary를 시도하기 때문이다. 그것은 허용되지 않는다.

경계 가로지르기 금지boundary-crossing prohibition의 효능은 각 함수의 경계에서 사라진다. 그래서 아래 변수 `var special`은 구문 오류가 발생하지 않는다.

``` js
function another() {
  // ..

  {
    let special = "JavaScript";

    ajax("https://some.url",function callback(){
      // totally fine shadowing
      var special = "JavaScript";

      // ..
    });
  }
}
```

Summary: (내부 스코프에서) `let`은 외부 스코프의 `var`를 언제든 그림자화 할 수 있다. (내부 스코프에서) `var`도 외부 스코프의 `let`을 그림자화 할 수는 있지만, 두 변수 사이에 함수 경계function boundary가 있을 때로 제한된다.

## Function Name Scope

당신이 보는데로, `function` 선언은 아래와 같와 같다.

``` js
function askQuestion() {
  // ..
}
```

챕터 1과 2에서 논의한 것처럼, `function` 선언은 `askQuestion`으로 명명된 둘러싸인 스코프 안(위 예시의 경우, 전역 스코프)에서 식별자를 생성할 것이다.

아래 프로그램의 경우는 어떨까?

``` js
var askQuestion = function(){
  // ..
};
```

변수 `askQuestion`이 생성되는 점은 동일하다. 그러나 이것은 `function` 표현식(단독 선언standalone declaration 대신 값처럼 사용되는 함수 정의)이기 때문에 함수 스스로 "호이스팅hoist"하지 않을 것이다.

`function` 선언식과 표현식의 한 가지 주요 차이점은 무엇이 함수의 이름 식별자로 생성되었느냐다. 명명된 `function` 표현식을 생각해보자.

``` js
var askQuestion = function ofTheTeacher(){
  // ..
};
```

우리는 `askQuestion`은 외부 스코프에 있다는 것을 안다. 그러나 `ofTheTeacher` 식별자는 어떨까? 일반적인 `function` 선언식들의 경우, 그 이름 식별자는 외부/둘러싸고 있는 스코프에 놓여 있다. 즉, 이 사례를 추정하는 것은 합리적이다. 그러나 `ofTheTeacher`는 **함수 자신 안에** 있는 식별자로서 선언된다.

:::tip 옮긴이 주
"함수 자신 안에 있는 식별자"라는 말의 뜻을 정확히 모르겠다. 다만, 다음 내용을 계속 보면 이 식별자는 함수 내부에서의 접근이 허용되나 외부 스코프에서는 불가능하다. 함수 관련 내용을 더 알아 보자. (부록 A 등에서)
:::

``` js
var askQuestion = function ofTheTeacher() {
  console.log(ofTheTeacher);
};

askQuestion();
// function ofTheTeacher()...

console.log(ofTheTeacher);
// ReferenceError: ofTheTeacher is not defined
```

:::tip NOTE
실제로, `ofTheTeacher`는 정확히 그 함수 스코프에 있지 않다. 부록 A, "암묵적 스코프Implied Scopes" 섹션에서 더 설명할 것이다.
:::

`ofTheTeacher`는 외부가 아닌 함수 안에 선언될 뿐 아니라 읽기전용read-only으로 정의된다.

``` js
var askQuestion = function ofTheTeacher() {
  "use strict";
  ofTheTeacher = 42; // TypeError

  //..
};

askQuestion();
// TypeError
```

우리는 엄격 모드strict-mode를 사용했기 때문에, 할당 실패는 `TypeError`로 리포트 된다. 비엄격모드non-strict-mode에서는 그와 같은 할당은 오류 없이 조용히 실패한다.

`function` 표현식이 이름 식별자를 가지고 있지 않을 때는 어떻게 될까?

``` js
var askQuestion = function(){
  // ..
};
```

이름 식별자가 있는 `function` 표현식은 "기명 함수 표현식named function expression"으로 참조된다. 그러나 이름 식별자가 없는 것은 "익명 함수 표현식anonymouse function expression"으로서 참조된다. 익명 함수 표현식들은 명확히 다른 스코프에 영향을 주는 기명 식별자가 없다.

우리는 부록 A에서, 각 표현식을 사용할 때 영향을 주는 요소들을 포함해 기명 vs. 익명 `function` 표현식을 더 자세히 논할 것이다.

## Arrow Functions

ES6는 "화살표 함수"라 불리는 추가적 `function` 표현식 형태를 언어에 포함했다.

``` js
var askQuestion = () => {
  // ..
};
```

`=>` 화살표 함수는 정의하기 위해 `function` 단어를 요구하지 않는다. 또한, 파라미터 리스트 주위 `( .. )`는 선택적이다. 마찬가지로, 함수 바디 주위 `{ .. }`도 선택적이다. 그리고 `{ .. }`가 생략된다면 `return` 키워드를 사용하지 않아도 반환값이 내보내질 것이다.

`=>` 화살표 함수의 매력은 종종 "단축 구문"으로 풀이된다. 그리고 그것은 객관적으로 더 가독성이 좋은 코드를 추구하는 것과 동일시된다. 이 주장은 좋게 봐줘야 의심스러운 정도이고 내 생각에는 완전히 잘못 이해한 주장이라 생각한다. 우리는 부록 A에서 다양한 함수 형태의 면면을 알아볼 것이다.

화살표 함수들은 함수를 참조하는 식별자와 직접 관련되지 않았음을 의미하는데 어휘적으로lexically 익명anonymous이다. `askQuestion`의 할당은 "askQuestion"을 암시하는 이름을 생성한다. 그러나 그것은 **기명화 하는 것과 동일하지 않다.**

``` js
var askQuestion = () => {
  // ..
};

askQuestion.name; // askQuestion
```

화살표 함수들은 다른 형태/조건에 관한 다양한 변형들을 정신적으로 최적화해야 하는 비용을 그들의 구문적 간결함으로 달성한다. 몇 가지 예를 들어보면,

``` js
() => 42;

id => id.toUpperCase();

(id,name) => ({ id, name });

(...args) => {
  return args[args.length - 1];
};
```

내가 화살표 함수를 소개하는 진짜 이유는, 어쨌든 화살표 함수는 일반 `function` 함수들의 어휘적 스코프 관점과 다르게 행동한다는 주장은 흔하게 거론되지만 부정확하기 때문이다.

이것은 정확하지 않다.

익명 또는 선언적인 형태를 가지고 있지 않은 것과 다르게, `=>` 화살표 함수들은 `function` 함수과 같은 어휘적 스코프 규칙들을 가지고 있다. 함수 바디 주위에 `{ .. }`가 있거나 없는 화살표 함수는 스코프의 개별적인 내부 중첩 버킷을 생성한다. 중첩된 스코프 버킷 안의 변수 선언들은 `function` 스코프 안에서처럼과 동일하게 행동한다.

## Backing Out

한 함수(선언식이든 표현식이든)가 정의될 때, 하나의 새로운 스코프가 생성된다. 다른 스코프 안에 중첩된 스코프들의 포지션은 스코프 체인이라 불리는 프로그램을 관통하는 자연스러운 스코프 계층을 생성한다. 이 스코프 체인은 위쪽이나 바깥쪽으로 향하는 변수 접근을 제어한다.

각각의 새로운 스코프는 그것이 소유한 변수들의 집합을 홀드하기 위해 깨끗한 슬레이트와 공간을 제공한다. 한 변수 이름이 스코프 체인의 다른 레벨들에 반복적으로 나타날 때, 그림자화가 일어난다. 이 그림자화는 그 변수가 있는 내부에서 바깥 변수에 접근하는 것을 막는다.

우리는 이러한 세부 사항에서 한발짝 뒤로 물러나면서, 다음 장은 모든 JS 프로그램들이 포함하는 최초 스코프 즉, 전역 스코프로 초점을 이동한다.

``` js
console.log( (id, name) => ({ id, name }) )
```
