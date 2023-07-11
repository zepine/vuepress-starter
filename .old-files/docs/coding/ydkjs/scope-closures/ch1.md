---
date: 2022-01-01
description: 번역 - Chapter 1 - What's the Scope?
---

# Chapter 1: What's the Scope?

::: tip
- [You Don't Know JS - 2nd Edition](https://github.com/getify/You-Dont-Know-JS "영문") 깃허브 공개 버전(영문)을 개인의 학습 목적으로 번역합니다.
- 한글 번역을 끝내면 핵심만 정리해 요약본으로 교체할 예정입니다.
- 전문 번역서는 [한빛미디어](https://www.hanbit.co.kr/media/books/book_view.html?p_code=B8227329776)에서 구입할 수 있습니다.
:::

[[toc]]

## Compiling Code

컴파일은 아래 3단계로 구분할 수 있다. 실제로는 더 복잡한 과정을 거친다.

Tokeninzing과 Lexing: **토크나이징**은 소스 코드를 의미 있는 문자(토큰)로 구분하는 작업. 토크나이징으로 'a'라는 토큰이 구분됐다면 이 토큰이 독립적인지 아니면 토큰의 일부인지를 구분해야 하는데 이것을 **렉싱**이라 한다.

Parsing: 토큰들을 프로그램의 문법에 따라 트리 구조로 변환한다(의미론적인 매핑). 이것을 **추상 구문 트리**(AST; Abstract Syntax Tree)라고 한다. [위키백과](https://ko.wikipedia.org/wiki/%EC%B6%94%EC%83%81_%EA%B5%AC%EB%AC%B8_%ED%8A%B8%EB%A6%AC)

Code Generation: AST를 실행할 수 있는 코드로 변환한다. 언어에 따라 매우 다르게 작동한다.

### Required: Two Phases

JS 프로그램의 프로세싱은 최소 2단계로 이루어진다.(parsing/compilation, execution) JS 명세는 'compilation'을 명시적으로 요구하지 않지만 실제로는 그러한 프로세싱이 일어난다. 아래 예시에서 그것을 증명하는 **3가지 특징**(syntax errors, early errors, and hoisting)을 관찰할 수 있다.

#### Syntax Errors from the Start

``` js
    var greeting = "Hello";
    
    console.log(greeting);
    
    greeting = ."Hi";
    // SyntaxError: unexpected token .
```

위 코드는 SyntaxError가 발생한다.

만약 JS가 위에서 아래로 한줄 한줄 읽으면서 실행하면, `console.log(greeting);` 구문이 정상으로 작동할 것. 실제로는 JS 엔진은 코드를 실행하기 전에 이미 syntax error를 발견하여 알림. **JS 엔진은 코드 실행 전 전체 코드를 parsing 하는데 이 단계에서 오류가 검출됐음을 추측할 수 있음.**

#### Early Errors

``` js
console.log("Howdy");

saySomething("Hello","Hi");
// Uncaught SyntaxError: Duplicate parameter name not
// allowed in this context

function saySomething(greeting,greeting) {
  "use strict";
  console.log(greeting);
}
```

`"Howdy"` 메시지는 출력되지 않는다. 앞서 본 코드처럼 `SyntaxError`가 발생한다.

현 코드에서 strict-mode는 `saySomthing(..)` 함수의 중복된 매개변수를 금지한다. non-strict-mode에서는 허용된다.

strict-mode의 경우 실행전 'early error'로서 발생해야 한다고 명세에서 요구하지 않는다. 그러나 JS 엔진은 `greeting` 매개변수가 중복됐다는 것을 알고 실행 전 오류를 반환한다. 어떻게 알았을까?

위 예시와 마찬가지로, **모든 코드가 실행 전 먼저 parsing 된다면 가능할 것이다.** 이것이 합리적인 설명이다.

#### hoisting

``` js
function saySomething() {
  var greeting = "Hello";
    {
      greeting = "Howdy"; // error comes from here
      let greeting = "Hi";
      console.log(greeting);
    }
}

saySomething();
// ReferenceError: Cannot access 'greeting' before
// initialization
```

이 예시는 `ReferenceError`가 발생한다.

만약, `let greeting = "Hi";`를 주석으로 숨기면, `greeting = "Howdy";`는 앞서 선언된 변수에 새 값을 할당하고 `console.log(greeting);`은 재할당된 변수를 참조하여 정상 출력한다.

주석을 해제한 상태에서 `greeting = "Howdy";`는 `let greeting = "Hi";`를 참조하기 때문에 오류를 일으키는 것이다. 설명을 덧붙이면, `let`으로 선언된 변수는 hoisting 되기는 하지만 `var`로 선언된 변수처럼 `undefined`로 초기화되지 않기 때문에 참조할 수 없다. `let`은 uninitialization 상태이며, 이것으로 인해 코드를 실행하기 전까지는 일시적으로 접근할 수 없는 **일시적 데드존**(TDZ: Temporal Dead Zone)이 발생한다.

어떻게 `greeting = "Howdy";`가 뒤에 있는 코드를 인식할 수 있을까? 앞선 예제들처럼, **코드 실행 전 모든 코드가 parsing 되기 때문**이라고 보는 것이 합리적일 것이다.

## Compiler Speak

우리는 JS 프로그램의 두 단계 프로세싱(compile, then execute)을 확인할 수 있었다. 이제 **컴파일 과정 중 JS 엔진이 어떻게 변수들을 식별하고 프로그램의 스코프들을 결정하는지 알아 보자.**

``` js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);

console.log(nextStudent);
```

선언declaration 이외, 프로그램에서 모든 변수/식별자는 두 가지 역할 중 하나로서 제공된다. **할당으로서 target(LHS)이거나 값으로서 source(RHS).**

컴퓨터 사이언스에서 "LHS"(aka, target) and "RHS"(aka, source)를 가르치는데, LHS와 RHS는 `=` 할당 연산자를 기준으로 각각 "Left-Hand Side"와 "Right-Hand Side" 의미한다고 추측할 수 있다. 그러나 target과 source는 항상 문자 그대로 `=` 할당 연산자를 기준으로 좌측과 우측에 나타나지는 않는다. 따라서, left/right 대신 target/source라는 용어를 쓰는 것이 더 명확할 것이다.

어떻게 변수가 target인지 알수있나? 만약 변수에 할당된 값value이 있다면 그것은 target이고, 그렇지 않다면 source다.

### Targets

무엇이 변수를 target으로 만드는가?

``` js
// var students 는 컴파일 타임에 선언된다.(target).
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

// 함수 선언식은 target 참조의 특별한 케이스이다. 이것도 컴파일 타임에 선언된다(target). 자세한 내용은 Chapter 5에 다룬다.
function getStudentName(studentID) {
  // let student에 값이 할당된다(target).
  for (let student of students) {
    if (student.id == studentID) {
      return student.name;
    }
  }
}

// var nextStudent도 var students와 동일하다(target).
// studentID에 매개변수 73이 할당된다(target).
var nextStudent = getStudentName(73);

console.log(nextStudent);
```

### Sources

``` js
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
  // students는 source reference
  for (let student of students) {
    // student.id, studentID는 모두 source 참조
    if (student.id == studentID) {
      return student.name;
    }
  }
}

// getStudentName은 source 참조.
var nextStudent = getStudentName(73);

// console, nextStudent는 source 참조
console.log(nextStudent);

// id, name, log는 모두 프로퍼티이다. 변수 참조가 아니다.

```

## Cheating: Runtime Scope Modifications

스코프가 컴파일 타임에 결정되는 것은 명확하며, 일반적으로 런타임 과정에 영향 받지 않아야 한다. 그러나 non-stric-mode에서 런타임 중 프로그램 스코프를 수정하여 이 룰을 속이는 기술적인 2가지 방법이 있다.

이 두 가지 방법 중 어느 것이라도 사용할 수 있지만 코드 작성 시 위험과 혼란을 초래할 수 있기 때문에, 가능하면 stric-mode를 사용해야 한다. 그러나 어떤 프로그램에서는 이 케이스와 마주할 수 있으니 알고 있어야 한다.

`eval(..)` 함수는 컴파일을 위해 코드 문자열을 전달받고, 프로그램 런타임 중 실행한다. 만약 코드의 그 문자열이 `var` 또는 `function` 선언을 포함한다면, 그 선언들은 `eval(..)`이 실행되고 있는 현재 스코프를 수정할 것이다.

``` js
function badIdea() {
  eval("var oops = 'Ugh!';");
  console.log(oops);
}
badIdea(); // Ugh!
```

만약 그 `eval(..)`이 없다면, `console.log(oops)` 안의 `opps` 변수는 존재하지 않기 때문에 `ReferenceError`가 반환된다. 그러나 `eval(..)`은 런타임 중 `badIdea()` 함수의 스코프를 수정한다. 이것은, `badIdea()` 실행할 때마다 이미 컴파일과 최적화가 이루어진 스코프를 수정하는 행위는 여러 이유로 좋지 않다.

두 번째 치트는 `with` 키워드다. 이것은 필수적이고 동적으로 로컬 스코프에 있는 객체를 반환한다. 이 객체의 프로퍼티들은 새로운 스코프 블록 안의 식별자들로 간주된다.

``` js
var badIdea = { oops: "Ugh!" };

with (badIdea) {
console.log(oops); // Ugh!
}
```

## Lexical Scope

JS의 스코프는 컴파일 타임에 결정된다. 이와 같은 종류의 스코프를 위한 용어가 **lexical scope**다. "Lexical"은 이 챕터 초반에 말한 것처럼 컴파일의 "lexing" 분야와 연관이 있다.

"lexical scope"의 핵심은 함수, 블록, 그리고 변수가 선언된 위치에 의해 총체적으로 통제된다는 점이다.

만약 함수 안에서 변수를 선언한다면, 컴파일러는 함수를 파싱할 때 이 변수 선언도 함께 다룬다. 그리고 그 변수를 함수의 스코프에 연결짓는다. 만약 한 변수가 `let` 또는 `const`로 선언된 블록 스코프라면, 그 변수는 (`var`로 선언된 변수가 둘러쌓인 함수 스코프에 연관되는 것과 달리) 가장 가까운 곳에서 둘러싸고 있는 블록 `{..}`과 연관된다.

더욱이, 변수의 참조(target 또는 source의 역할)는 그것이 변수를 이용할 수 있는 렉시컬 스코프 환경에서 온다는 것을 확인해야 한다. 그렇지 않으면 일반적으로 그 변수는 선언되지 않았다undeclared는 오류를 반환한다. 만약 이 변수가 현 스코프에 선언되지 않았다면, 그 다음에는 이 변수를 탐색하기 위해 outer나 외부 스코프가 참조될 것이다. 이렇게 중첩 스코프에서 한 단계씩 거슬러 올라가는 프로세스는 매칭되는 변수를 찾거나, 전역 스코프global scope에 도달하거나, 더 참조할 데가 없을 때까지 계속 된다.

**사실 컴파일compilation은 스코프와 변수를 메모리에 저장하는 것과 관련하여 실제로 아무것도 하지 않는다는 점이 중요하다. (주: 런타임 과정에서 변수 등의 메모리 할당이 진행된다.)**

대신, **컴파일은 모든 렉시컬 스코프의 지도를 생성한다.** 여기에는 프로그램이 실행하는 동안 필요한 것들이 놓여 있다. 이를 테면, 모든 스코프들(aka, "lexical environments")이 정의되고 각 스코프 마다 모든 식별자들(변수들)이 등록된, 런타임 시 사용할 코드를 생각해 볼 수 있다.

즉, **스코프들은 컴파일 중 식별되지만 런타임까지는 실제로 생성되지는 않는다.**
