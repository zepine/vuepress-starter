---
date: 2022-01-01
description: 번역 - Chapter 2 - Illustrating Lexical Scope
---
# Chapter 2: Illustrating Lexical Scope

::: tip
- [You Don't Know JS - 2nd Edition](https://github.com/getify/You-Dont-Know-JS "영문") 깃허브 공개 버전(영문)을 개인의 학습 목적으로 번역합니다.
- 한글 번역을 끝내면 핵심만 정리해 요약본으로 교체할 예정입니다.
- 전문 번역서는 [한빛미디어](https://www.hanbit.co.kr/media/books/book_view.html?p_code=B8227329776)에서 구입할 수 있습니다.
:::

[[toc]]

이 챕터에서는 몇 가지 메타포로 스코프를 묘사할 예정이다.

## Marbles, and Buckets, and Bubbles... Oh My

첫 번째 메타포는 컬러 구슬들을 동일 색상의 버킷들에 분류하는 것이다. 이후, 만약 빨간 구슬을 찾고 싶다면 빨간 버킷으로 가면 얻을 수 있다.

**여기서 구슬은 변수로, 버킷은 스코프(functions and blocks)로 비유할 수 있다.**

``` js
// outer/global scope: RED
var students = [
  { id: 14, name: "Kyle" },
  { id: 73, name: "Suzy" },
  { id: 112, name: "Frank" },
  { id: 6, name: "Sarah" }
];

function getStudentName(studentID) {
// function scope: BLUE
  
  for (let student of students) {
  // loop scope: GREEN
  
    if (student.id == studentID) {
      return student.name;
    }
  }
}

var nextStudent = getStudentName(73);
console.log(nextStudent); // Suzy
```

![color scopes](https://cdn.jsdelivr.net/gh/zepine/yanggiri-cdn@master/publichttps://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/images/fig2.png?raw=true) *Fig. 2: Colored Scope Bubbles*

1. Bubble 1 (RED)은 전역 스코프를 둘러싸고 있다. 이 전역 스코프는 식별자/변수 3개를 갖는다. `students`, `getStudentName`, `nextStudent`
2. Bubble 2 (BLUE)는 함수 `getStudentName(..)`의 스코프를 감싸고 있다. 이 함수는 식별자/변수 1개를 갖는다: 매개변수 `studentID`.
3. Bubble 3 (GREEN)은 `for`-loop의 스코프를 감싸고 있다. 이 루프는 식별자/변수 1개를 갖는다: `student`.

기술적으로, 매개변수 `studentID`는 정확히 BLUE scope가 아니다. 부록 A에서 암묵적 스코프Implied Scopes를 다룰 것이며, 지금은 BLUE scope라고 이해해도 충분하다.

스코프 버블은 스코프의 함수/블록이 쓰여진 곳, 상호 중첩, 기타 등등에 기반하여 컴파일 중 결정된다. 각 스코프 버블은 전체적으로 부모 스코프 버블 안에 포함된다. 하나의 스코프는 절대로 두 개의 다른 outer scope에 부분적으로 존재하지 않는다.

각 구슬(변수/식별자)은 그것이 **선언된 버블(버킷)에 근거**하여 색상지어진다. `students`(line 9), `studentID`(line 10)은 접근되어질 수 있는(현재 위치한) 버블의 컬러가 아니라 선언된 버블에 근거한다.

Chapter 1에서 언급한 것처럼, `id`, `name`, 그리고 `log`는 모두 프로퍼티들이며 변수가 아님을 기억하자. 다르게 말하면, 프로퍼티들은 버킷 안의 구슬이 아니며, 그래서 그것들은 이 책에서 논의하는 어떤 룰에 기반하여 색상지어지지 않는다. 어떻게 프로퍼티 접속들이 다루어지는지는 이 책의 3번째 시리즈인 Objects & Classes에 볼 수 있다.

컴파일 중 JS 엔진이 프로그램을 처리하고 선언된 변수를 탐색하는 것처럼, 변수는 항상 "나는 어느 컬러 스코프(bubble or bucket)에 있지?"라고 확인한다. 그 변수는 bucket/bubble과 동일한 색상의 컬러로 지정된다.

GREEN 버킷은 전체적으로 BLUE 버킷 내부에 있다. 그리고 유사하게 BLUE 버킷은 전체적으로 RED 버킷 안에 있다. 그림에서처럼 스코프들은 서로 필요한 만큼 중첩할 수 있다.

RED 버킷 안의 표현식은 오직 RED 구슬에 엑세스 할 수 있다. 다시 말해, BLUE와 GREEN에는 접속할 수 없다. BLUE 버킷 안의 표현식은 BLUE 또는 RED 구슬 중 어느 하나를 참조할 수 있다. 그리고 GREEN 버킷의 표현식은 RED, BLUE, 그리고 GREEN 구슬에 엑세스할 수 있다.

우리는, 알아본 바와 같이 탐색으로서 런타임 중 선언하지 않은non-declaration 구슬 색상들의 프로세스를 개념화할 수 있다. `for`-loop 문 안 있는 `students` 변수의 참조는 선언되지 않았기 때문에 컬러가 없다. 그래서 우리는 BLUE 스코프 버킷에 `students` 변수 이름과 매치하는 구슬을 가지고 있는지 물어볼 수 있다. 만약 그러한 구슬이 없다면, 다음 outer 또는 포함하고 있는 스코프(RED)를 계속 탐색한다. RED 버킷은 `students` 이름의 구슬을 가지고 있다. 그래서 loop문의 `students` 변수 참조는 RED 구슬로 결정된다.

`if (student.id == studentID)`문도 유사하게 GREEN 구슬의 `student`와 BLUE 구슬의 `studentID`를 참조한다.

JS 엔진 일반적으로 런타임 중 구슬 컬러를 결정하지 않는다. 탐색lookup은 이 개념을 이해하기 위한 수사적인 장치다. 컴파일 중, 대부분의 참조 또는 모든 변수의 참조는 이미 알려진 스코프 버킷에 매치될 것이다. 즉, 그 색상은 이미 결정되었고, 프로그램 실행 시 불필요한 탐색을 피하기 위해 각 구슬 참조가 저장되었다. 더 자세한 내용은 Chapter 3을 보아라.

구슬, 버킷, 그리고 버블에서 알 수 있는 핵심.

변수들은 특정 스코프들 안에 선언된다. 그 스코프는 같은 색상의 버킷에 들어있는 구슬처럼 생각할 수 있다.

변수가 선언된 스코프에 있거나 중첩 스코프의 내부 스코프에 있는, 어떤 변수 참조(선언된 변수를 참조하고 있는 변수)는 같은 컬러의 구슬로 라벨링될 것이다. 끼어드는 스코프("shadows") 변수 선언은 제외한다. "Shadowing"은 Chapter 3를 보아라.

컬러 버킷과 그 버킷이 포함하는 구슬들에 대한 결정은 컴파일 중 일어난다. 이 정보는 코드 실행 중 변수(구슬 컬러) 탐색에 사용된다.

## A Conversation Among Friends

변수나 변수가 유래한 스코프를, 분석하는 과정을 비유적으로 이해하는 다른 메타포가 있다. 이것은, 엔진 안에서 코드가 프로세스되고 실행되면서 일어나는 다양한 상호작용conversation를 추측해 보는 것이다.

우리는 어떻게 스코프들이 작동하는지에 대한 더 나은 개념을 알아내기 위해 이 상호작용을 청취할 수 있다.

이제, 우리 프로그램을 처리할 때 상호작용하는 JS 엔진의 멤버들을 만나보자.

**Engine**: 컴파일의 시작부터 끝까지, 그리고 자바스크립트 프로그램의 실행을 책임진다.

**Compiler**: 엔진의 친구 중 하나이다. 이것은 파싱과 코드 생성code-generation의 모든 작업을 다룬다.

**Scope Manager**: 엔진의 또 다른 친구이다. 모든 선언된 변수/식별자의 탐색 리스트lookup list를 수집하고 유지한다. 이 식별자들이 어떻게 현재 실행하는 코드에 접근하는지에 관한 규칙 세트를 관리한다.

자바스크립트가 어떻게 작동하는지 완전히 이해하기 위해서는, 엔진(과 친구들)처럼 생각하고 그들이 묻는 것처럼 질문하고, 똑같이 그들의 질문들에 답할 필요가 있다.

아래 예시를 다시 보자.

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
// Suzy
```

JS가 어떻게 위 프로그램을 처리할 것인지 알아보자. 배열과 배열의 내용들은 단지 기본 JS 값의 리터럴들이다(따라서 어떤 스코프에도 영향받지 않는다). 여기서 우리의 관심은 `var students = [ .. ]` 선언문과 초기화 할당initialization-assignment 파트가 될 것이다.

우리는 전형적으로 이 선언문을 단문single statement으로 생각한다. 그러나 그것은 엔진이 보는 방식이 아니다. 사실, JS는 이것을 구별되는 두 가지 오퍼레이션으로 간주한다. 하나는 컴파일 시 **Compiler**가 다루며, 다른 하나는 실행 중 **Engine**이 다룬다.

**Compiler**가 이 프로그램과 할 첫 번째 일은 구문을 렉싱lexing하여 토큰으로 나누고, 이것을 트리AST로 파싱하는 것이다.

일단 **Compiler**가 코드 생성code generation을 하면, 명백해 보이는 것 이외 더 고려해야 할 디테일이 있다. 합리적인 추론은, **Compiler**는 다음과 같은 일 처리를 위해 첫 번째 선언문(line 1)을 위한 코드를 생성할 것이라는 점이다. "변수를 메모리에 할당하고, 그 변수를 `students`로 이름짓고, 그 후 변수가 배열을 참조하도록 한다." 물론, 이것이 전부는 아니다.

옮긴이 주: 컴파일러가 다음 작업(위 단락의 밑줄)을 직접한다는 뜻이 아니라, 엔진에게 다음 작업을 시키기 위한 코드를 만든다는 뜻이다. 정리하면, 컴파일러는 스코프 메니저와 소통하며 청사진을 만들고, 이것에 따라 엔진은 실제로 메모리에 변수를 할당하고 변수 이름을 명명하고 변수에 참조를 할당한다. Chapter 1의 Lexical scope에도 나왔듯이, 컴파일 중 메모리 할당은 일어나지 않는다.

여기 **Compiler**가 그 선언문을 처리하는 단계가 있다.

1. `var students`와 만나면, **Compiler**는 `students` 이름의 변수가 특정 스코프 버킷에 이미 존재하는지 **Scope Manager**에게 물어볼 것이다. 만약 있다면, **Compiler**는 이 선언문을 무시하고 다음으로 이동할 것이다. 존재하지 않는다면, **Compiler**는 한 명령 코드를 만들 것인데, 이 코드는 (실행 타임에) **Scope Manager**가 그 스코프 버킷에 `students`라는 새 변수를 생성하라고 요청한다.  

::: tip
옮긴이 주: 상기 단락은 변수 선언에 대한 것. **Compiler**는 스코프 내 앞서 선언된 변수가 있는지 확인한다. 만약 그 변수가 선언된 적이 없다면, 향후 **Engine**이 해당 변수를 생성하도록 지침(코드)을 만들어 놓는다.
:::

2. 이때 **Compiler**는 차후 실행될 **Engine**을 위해 코드를 만드는데, 이것은 `students = []`를 할당할 것이다. **Engine**이 실행하는 이 코드는, 먼저 **Scope Manager**에게 현 스코프 버킷에서 접근할 수 있는 `students`라는 변수가 있는지 물어 볼 것이다. 만약 없다면, **Engine**은 다른 곳을 탐색한다. 만약 있다면, **Engine**은 찾은 변수에 그 배열의 참조를 할당한다.

::: tip
옮긴이 주: 상기 단락은 변수에 값을 할당하는 작업.
:::

(...중략...)

`var students = [ .. ]`와 같은 선언문이 처리되는 방법은, 아래 두 가지 단계로 요약할 수 있다.

1. **Compiler**는 스코프 변수를 선언한다. (스코프 변수는 현 스코프에 선언된 적이 없다.)
2. **Engine**이 실행되는 동안, 그 선언문의 할당 파트를 처리하기 위해, **Engine**은 **Scope Manager**에게 그 변수를 찾아 `undefined`로 초기화하라고 요청하는데 그러면 변수는 사용할 준비가 된다. 그리고 그때 변수에는 배열 값이 할당된다.

## Nested Scope

(...전략...)

렉시컬 스코프lexical scope의 주요 양상 중 하나는 언제든 식별자 참조가 현 스코프에서 발견되지 않으면, 중첩된 다음 외부 스코프가 탐색된다는 것이다. 이 프로세스는 응답이 있거나 탐색할 스코프가 더 없을 때까지 반복된다.

## Lookup Failures

**Engine**이 (바깥 방향으로 이동하면서) 모든 **lexically available**
스코프들을 탐색했음에도 여전히 식별자를 찾지 못하면, 그때 오류 조건이 형성된다. 하지만, 프로그램 모드(stric-mode or not), 변수의 역할(이를 테면, target vs. source)과 관련되면 앞선 오류 조건은 다르게 다루어진다.

### Undefined Mess

만약 변수가 **source**라면, 확정되지 않은 식별자 탐색은 선언되지 않은(unknown, missing) 변수로 간주된다. 이것은 항상 `ReferenceError`를 동반한다. 또한, 변수가 **target**이고, 코드가 엄격 모드에서 실행하는 순간이라면, 그 변수는 선언되지 않은 것으로 간주되고 비슷하게 `ReferenceError`를 반환한다.

대부분의 JS 환경에서, 선언되지 않은 변수 상태를 위한 오류 메시지는 **"Reference Error: XYZ is not defined."**와 같이 출력될 것이다. **"not defined"*
구문은 **"undefined"** 단어와 거의 동일하게 보인다. 그러나 JS에서 이 둘은 매우 다르다. 불행히 이 오류 메시지는 끊임없이 혼란을 부추긴다.

사실 **"Not defined"**는 ("undeclared"라기 보다는) **"not declared"**를 의미한다. 또는, **lexically available** 스코프에서 형식 선언과 일치하지 않는 변수의 경우와 같이 **undeclared**를 의미한다. 대조적으로, **"undefined"**는 변수가 탐색됐다(선언됐다)는 의미다. 그러나 일시적으로 그 변수는 값이 없고, 그래서 변수는 **undefined** 값으로 디폴트된다.

JS의 `typeof` 연산자는 각 변수 참조에 대해 `"undefined"` 문자열을 반환한다.

``` js
var studentName;
console.log(typeof studentName); // "undefined"

console.log(typeof doesntExist); // "undefined"
```

이 두 변수 참조들은 매우 다른 조건에 있지만 확실히 JS는 구분되지 않는 모호한 결과를 보여준다. 용어의 복잡함은 혼란스럽게 하고 끔찍한 불운이다. 불행히도, JS 개발자들은 "undefined" 등에 혼동하지 않도록 더욱 더 집중해야 한다.

### Global... What!?

변수가 **target**이고 엄격 모드strict-mode가 아니라면, 혼란스럽고 놀라운 레거시 동작의 효과가 나타나기 시작할 것이다. 전역 스코프의 **Scope Manager**가 target에 할당을 하기 위해 **우연한 전역 변수accidental global variable**를 생성할 것이다.

``` js
function getStudentName() {
  // assignment to an undeclared variable :(
  nextStudent = "Suzy";
}

getStudentName();

console.log(nextStudent);
// "Suzy" -- oops, an accidental-global variable!
```

이런 우연적인 일accidental global variable은 엄격 모드가 제공하는 유익한 방어의 대단히 좋은 사례이고, 그것은 엄격 모드를 사용하지 않는 것이 나쁜 생각인 이유이다. 엄격 모드에서 **전역 스코프 매니저Global Scope Manager**는 우연한 전역 변수를 생성하는 대신 `ReferenceError`를 발생한다.

우연한 전역 변수에 절대 의존하지 말아라. 항상 엄격 모드를 사용하고, 항상 형식적으로 변수들을 선언하라. 만약 당신이 선언되지 않은 변수에 할당하는 실수를 저질러도 `ReferenceError`의 도움을 받을 수 있을 것이다.

### Building On Metaphors

(... 중략 ...)

## Continue the Conversation

요약하면, 당신은 스코프가 무엇이고, JS 엔진이 당신의 코드에서 스코프를 어떻게 결정하고 사용하는지에 대해 충분히 이해하고 있어야 한다.

다음 챕터를 계속 진행하기 전, 당신의 프로젝트의 코드 일부를 찾아 위에서 논의한 것들을 적용해 보라. 만약, 혼동이 되거나 어렵다면 상기 내용을 이해할 수 있도록 더 많은 시간을 써라.
