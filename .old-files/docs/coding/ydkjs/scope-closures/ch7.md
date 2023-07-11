---
date: 2022-01-01
description: 번역 - Chapter 7 - Using Closures
---

# Chapter 7: Using Closures

::: tip
- [You Don't Know JS - 2nd Edition](https://github.com/getify/You-Dont-Know-JS "영문") 깃허브 공개 버전(영문)을 **개인의 학습 목적**으로 번역합니다.
- 한글 번역을 끝내면 라이선스에 저촉되지 않도록 핵심만 정리해 요약본으로 교체할 예정입니다.
- 전문 번역서는 [한빛미디어](https://www.hanbit.co.kr/media/books/book_view.html?p_code=B8227329776)에서 구입할 수 있습니다.
:::

[[toc]]

지금까지, 우리는 렉시컬 스코프의 안과 밖에 대해, 그리고 그것이 우리 프로그램 내부에서 변수의 조직과 사용에 영향을 미치는 방법에 대해 집중했다.

다시 우리의 관심은 역사적으로 다소 주늑들게 하는 클로저라는 주제로, 추상상에 있어 더 확장적으로 바뀐다. 걱정하지 말아라! 그것을 이해하는데 고급 컴퓨터 과학 수준이 필요하지 않다. 이 책에서 우리의 큰 목표는 단지 스코프를 이해하는 것 뿐 아니라, 프로그램 구조에서 스코프를 더욱 효과적으로 사용하는 것이다. 즉, 클로저가 그 노력의 중심이다.

챕터 6의 주요 결론을 상기하자. *최소 노출* 원칙 (POLE)은 변수의 스코프 노출을 제한하기 위해 블록(함수) 스코프의 사용을 장려했다. 이것은 이해하기 쉽고 지속 가능한 코드를 유지하고, 많은 스코핑 위험(이름 충돌 등)을 피할 수 있도록 도와준다.

클로저는 다음과 같은 접근법으로 만든다. (함수가 실행하는 정해진) 시간을 지나서 사용할 필요가 있는 변수를 위해, 그것을 더 큰 외부 스코프에 놓는 대신 (더 협소한 스코프로) 캡슐화할 수 있다. 하지만, 더 확장적으로 사용할 수 있도록 함수 내부에서 온 액세스를 유지할 수 있다. 함수는 클로저를 통해 이러한 참조된 스코프 내부의 변수를 *기억한다*.

클로저는 프로그래밍에서 지금껏 창안된, 가장 중요한 언어 특징들 중 하나다. 이것은 함수형 프로그래밍(FP), 모듈, 그리고 클래스 지향형 디자인의 일부까지 포함하는 주요 프로그래밍 패러다임의 기저를 이룬다. JS를 마스터하고, 당신의 코드 전체에 걸쳐 효과적으로 많은 s중요한 디자인 패턴들을 활용하려면 클로저에 익숙해질 필요가 있다.

클로저의 모든 측면을 다룰려면 이 챕터 전체에 걸쳐 주눅 들게 하는 산더미 같은 논의와 코드가 필요하다. 다음 단계로 이동하지 전, 시간을 내어 당신이 각 부분에 익숙해졌는지 확인하라.

## See the Closure

클로저는 원래 람다 미적분학에서 온 수학적 컨셉이다. 그러나 나는 클로저를 정의하기 위해 수학 공식을 제시하거나 많은 양의 주석과 전문 용어를 사용하지 않을 것이다.

대신, 나는 실용적인 관점에 집중할 것이다. 우리는, 클로저가 JS에 존재하지 않았을 경우와 달리(즉, 클로저가 존재하므로 그로인해 발생하는), 프로그램의 다른 동작으로부터 무엇을 관찰할 수 있는지에 대한 관점으로 클로저 정의하기를 시작할 것이다. 하지만, 이 챕터 후반부에 우리는 *대안적 관점*으로 바라보기 위해 클로저를 뒤집을 것이다.

클로저는 함수의 동작이고 함수일 뿐이다. 만약 당신이 함수를 다루고 있지 않다면, 클로저는 적용되지 않는다. 객체는 클로저를 가질 수 없고, 뿐만 아니라 클래스도 클로저를 가질 수 없다. (물론, 클래스의 함수/메서드는 가질 수 있다.) 오직 함수만 클로저를 가진다.

클로저를 관측하기 위해, 함수는 호출되어야 하고, 특히 함수가 본래 정의된 곳으로부터 스코프 체인의 다른 갈래에서 호출되어야 한다. 자신이 정의된 동일 스코프에서 실행하는 함수는 가능한 클로저를 동반하든 동반하지 않든 관측할 수 있는 어떤 다른 동작도 보이지 않을 것이다. 즉, 관측의 관점과 정의에 따라, 그것은 클로저가 아니다.

> For closure to be observed, a function must be invoked, and specifically it must be invoked in a different branch of the scope chain from where it was originally defined. A function executing in the same scope it was defined would not exhibit any observably different behavior with or without closure being possible; by the observational perspective and definition, that is not closure.

해당하는 관련 스코프 버블 컬러(챕터 2 참고)가 주석으로 삽입된 다음 코드를 보자.

```js
// outer/global scope: RED(1)

function lookupStudent(studentID) {
    // function scope: BLUE(2)

    var students = [
        { id: 14, name: "Kyle" },
        { id: 73, name: "Suzy" },
        { id: 112, name: "Frank" },
        { id: 6, name: "Sarah" }
    ];

    return function greetStudent(greeting){
        // function scope: GREEN(3)

        var student = students.find(
            student => student.id == studentID
        );

        return `${ greeting }, ${ student.name }!`;
    };
}

var chosenStudents = [
    lookupStudent(6),
    lookupStudent(112)
];

// accessing the function's name:
chosenStudents[0].name;
// greetStudent

chosenStudents[0]("Hello");
// Hello, Sarah!

chosenStudents[1]("Howdy");
// Howdy, Frank!
```

이 코드에서 가장 먼저 주목할 점은 `lookupStudent(..)` 외부 함수를 생성하고 `greetStudent(..)`라 불리는 내부 함수를 반환하는 것이다. `lookupStudent(..)`는 두 번 호출하는데, 해당하는 내부 `greetStudent(..)` 함수의 두 개별 인스턴스가 생성되면, 그 둘 모두 `chosenStudents` 배열에 저장된다.

우리는 `chosenStudent[0]`에 저장된 그 반환 함수의 `.name` 프로퍼티를 체크하여 해당 예시를 확인하고, 그것이 실제로 내부 `greetStudent(..)`의 인스턴스임을 확인한다.

`lookupStudent(..)`에 대한 각 호출이 끝난 후, 해당하는 모든 내부 변수들은 버려지거나 GC(가비지 수집)될 것처럼 보일 것이다. 반환되고 보존될 것처럼 보이는 것은 내부 함수가 유일하다. *(???)그러나 여기가, 우리가 관측 가능한 범위 안에서, 그 동작이 다른 부분이다.*

> But here's where the behavior differs in ways we can start to observe.

`greetStudent(..)`은 `greeting`으로 명명된 매개변수로서 단일 인자를 받으면서, 또한 `students`와 `studentID`(`lookupStudent(..)`의 둘러싼 스코프에서 온 식별자들) 둘 모두를 참조한다. 내부 함수에서 외부함수의 변수들까지 참조하는 그것들 각각(즉, `greetStudent(..)`의 각 인스턴스)을 *클로저*라고 부른다. 학술적 용어로, `greetStudent(..)`의 각 인스턴스는 외부 변수 `students`와 `studentID`를 *에워싼다*.

그렇다면, 구체적이고 관찰 가능한 의미에서, 여기서 말한 클로저가 무엇을 하는 것인가?

클로저는 `greetStudent(..)`가 외부 스코프의 종료(예를 들어, `lookupStudent(..)`에 대한 각각의 호출이 완성됐을 때) 이후라도 외부 변수들을 계속 액세스할 수 있도록 허용한다. 가비지 수집되는 `students`와 `studentID`의 인스턴스를 대신해, 이들은 메모리에서 사라지지 않는다. `greetStudent(..)` 함수의 각 인스턴스가 호출된 이후 시간에도, 그 변수들은 계속 그 자리에 있고 그들의 현재 값들을 가지고 있다.

만약 JS 함수가 클로저를 갖고 있지 않다면, 각 `lookupStudent(..)` 호출의 완성은 즉시 해당 스코프를 제거하고 `students`와 `studentID` 변수를 가비지 수집할 것이다. 이후 우리가 `greetStudent(..)` 함수의 인스턴스를 호출한다면 무슨일이 발생할까?

`greetStudent(..)`를 BLUE(2) 구슬이라고 생각했는데 그것을 액세스하려 한다면(그러나 그 구슬은 실제로 (더는) 존재하지 않는다), 우리는 `ReferenceError`를 볼 거라고 합리적으로 추측할 것이다.

그러나 (위 예제에서) 우리는 오류를 볼 수 없을 것이다. `chosenStudents[0]("Hello")의 실행이 작동하여 "Hello, Sarah!" 메시지를 우리에게 반환한다는 사실은 그 인스턴스가`students`와`studentID` 변수에 여전히 액세스할 수 있었다는 것을 의미한다. 이것은 클로저의 직접적 관측이다.

### Pointed Closure

사실, 많은 독자들이 놓쳤다고 생각하고 있는 앞선 논의의 작은 디테일에 대해서 그럴듯한 말로 얼버무렸다.

`=>` 화살표 함수의 구문이 매우 간결하기 때문에 (챕터 3의 "Arrow Functions"에서 주장한 것처럼) 그것도 스코프를 생성한다는 점을 잊어버리기 쉽다. `student => student.id == studentID` 화살표 함수는 `greetStudent(..)` 함수 스코프 안쪽에 다른 스코프 버블을 생성한다.

챕터 2에서 컬러 버킷과 버블의 메타포를 만드는 것처럼, 만약 우리가 이 코드(화살표 함수)의 컬러 다이어그램을 생성했다면, 이 가장 안쪽의 중첩 레벨에 4번째 스코프가 있고, 그래서 4번째 컬러가 필요할 것이다. 아마 우리는 그 스코프를 위해 ORANGE(4)를 선택했을 것 같다.

```js
var student = students.find(
    student =>
        // function scope: ORANGE(4)
        student.id == studentID
);
```

BLUE(2) `studentID` 참조는 실제로 `greetStudent(..)`의 GREEN(3) 스코프라기 보다 ORANGE(4) 스코프 안에 있다. 또한, 화살표 함수의 `student` 매개변수는 ORANGE(4)이고, GREEN(3) `student`를 그림자화하고 있다.

여기서 중요한 것은, (배열의 `find(..)` 메서드를 위한 콜백으로서 전달된) 이 화살표 함수가, 클로저를 가지고 있는 `greetStudent(..)`가 아니라 `studentID` 에 근거한 클로저를 가져야 한다는 것이다. 그것은, 예상처럼 모든 것들이 여전히 작동하기 때문에 다루기에 너무 어렵지 않다. 단지, 작은 화살표 함수도 클로저 파티에 들어갈 수 있다는 사실을 지나치지 않는 게 중요하다.

> The consequence here is that this arrow function passed as a callback to the array's `find(..)` method has to hold the closure over `studentID`, rather than `greetStudent(..)` holding that closure.

:::tip 옮긴이 주
- 이 부분이 잘 이해되지 않음. 어쨋든 풀어서 다시 해석해 보면 다음과 같다.
- 화살표 함수는 클로저 내부에 있다. 즉, 화살표 함수는 반드시 클로저의 스코프를 공유할 수 밖에 없다.
- 다만, 화살표 함수는 `studentID`를 참조하고 있다.
- 따라서, 화살표 함수는 `studentID`와의 참조 관계를 전제로 클로저와의 연결성을 유지해야 한다. 너무 당연한 말인데... 아니면 위 원문의 진정한 의미가 따로 있는 걸까?
- 아무튼, 여기서 중요한 것은 화살표 함수도 스코프를 가지고 있다는 점. 그리고 그 스코프에서 외부 스코프를 참조할 수 있다는 점을 인식하면 되겠다.
:::

### Adding Up Closures

자, 클로저를 위해 자주 인용되는 표준 사례 중 하나를 살펴보자.

```js
function adder(num1) {
    return function addTo(num2){
        return num1 + num2;
    };
}

var add10To = adder(10);
var add42To = adder(42);

add10To(15);    // 25
add42To(9);     // 51
```

내부 `addTo(..)` 함수의 각 인스턴스는 그것이 소유한 `num1` 변수(각각 값 `10`과 `42`)를 에워싸고 있다. 그래서 `num1` 변수들은 `adder(..)`가 종료할 때까지 사라지지 않는다. `add10To(15)`를 호출하는 것처럼, 나중에 우리는 내부 `addTo(..)` 인스턴스들 중 하나를 호출할 때, 해당하는 인스턴스가 둘러싸고 있는 `num1` 변수는 계속 존재하며, 본래의 `10` 값을 가지고 있다. 따라서, 이 동작은 `10 + 15`를 계산할 수 있고 결과값 `25`를 반환한다.

중요한 디테일은 그 이전 단락에서 얼버무리고 넘어가기 너무 쉬웠을지도 모른다. 그러니 그것을 보충해 보자. 클로저는 해당하는 단일 렉시컬 정의가 아닌 함수의 인스턴스와 관련돼 있다. 이전 스니펫에서, `adder(..)` 안에 단지 하나의 내부 `addTo(..)` 함수가 정의됐고, 이것은 단일 클로저를 암시하는 것처럼 보일지도 모르겠다.

그러나 실제로 외부 `adder(..)` 함수를 실행할 때마다, *새로운* 내부 `addTo(..)` 함수 인스턴스가 생성된다(새 인스턴스당 하나의 새 클로저). 그래서 각 내부 함수 인스턴스(`add10To(..)`와 `add42To(..)`으로 명명된)는 `adder(..)`의 실행으로 (생성된) 그 스코프 환경의 인스턴스를 통해 클로저를 가진다(할당받는다).

:::tip 옮긴이 주 1
- `adder(..)`를 실행하면 해당 스코프 환경을 공유하는 인스턴스를 생성.
- 그 인스턴스는 클로저와 동일.
- `var add10To`는 `adder(10)`으로 생성된 인스턴스(즉, 클로저)를 할당받는다.
:::

:::tip 옮긴이 주 2
- 내 생각이지만, 앞선 스니펫에서 `adder(..)` 함수가 인스턴스(즉, 클로저)를 생성하는 과정은 생성자 함수로 인스턴스를 만드는 과정과 닮았다.
- 생성자 함수의 경우 `new Func(..)`와 같은 방식으로 인스턴스를 생성하는데, 이 부분이 `adder(..)`의 기능과 유사하다.
- 생성자 함수는 매개변수의 추가를 제외한 자기 자신을 그대로 복제.
- 클로저는 `adder(..)` 함수를 복제하진 않지만 필요한 변수를 참조할 수 있음.(즉, 필요한 또는 참조하고 있는 변수에 한하여, `adder(..)`의 스코프 환경을 마치 복제한 것처럼 그대로 참조할 수 있음)
:::

클로저는 컴파일 타임에 처리되는 렉시컬 스코프를 기반할지라도, 클로저는 함수 인스턴스의 **런타임 특성**에 따라 관찰된다.

### Live Link, Not a Snapshot

이전 섹선의 두 예시에서, 클로저 안에서 참조되는 변수로부터 값을 읽었다. 그것은 클로저가 어떤 주어진 순간의 값의 스냅샷일지도 모를 것 같은 느낌을 준다. 정말로, 그것은 흔한 오해이다.

클로저는 실제로 전체 변수 자체에 액세스를 유지하고 있는 라이브 링크이다. 단순히 값을 읽는 것으로 제한되지 않는다. 즉, 닫힌closed-over 변수는 업데이트(재할당)도 될 수 있다. 함수 안 변수가 폐쇄됨closed over에 따라, 우리는 그 함수 참조가 프로그램 안에 존재하는 한, 그리고 그 함수를 호출하길 원하는 어느 곳으로부터든 그 변수(읽기와 쓰기)의 사용을 유지할 수 있다. 이것이, 클로저가 그처럼 강력한 테크닉을 매우 많은 프로그래밍 영역에 걸쳐 폭넓게 사용하는 이유이다.

:::tip 옮긴이 주
- closed-over의 적절한 번역 표현이 있을 듯함.
- 폐쇄된, 닫힌
- 클로저 함수의 외부 변수라는 의미에서 *자유 변수free varialbe*의 개념과 동일한 듯.
:::

> Closure is actually a live link, preserving access to the full variable itself. We're not limited to merely reading a value; the closed-over variable can be updated (re-assigned) as well! By closing over a variable in a function, we can keep using that variable (read and write) as long as that function reference exists in the program, and from anywhere we want to invoke that function. This is why closure is such a powerful technique used widely across so many areas of programming!

그림 4는 함수 인스턴스들과 스코프 링크들을 묘사한다.

![fiqure4](https://cdn.jsdelivr.net/gh/zepine/yanggiri-cdn@master/publichttps://raw.githubusercontent.com/getify/You-Dont-Know-JS/2nd-ed/scope-closures/images/fig4.png)

*Fig. 4: Visualizing Closures*

그림 4에서처럼, `adder(..)`에 대한 각 호출은 `num1` 변수를 포함하는 *새로운* BLUE(2) 스코프를 생성한다. 또한, GREEN(3) 스코프로서 `addTo(..)` 함수의 *새로운* 인스턴스 역시 생성된다. 그 함수 인스턴스들(`addTo10(..)`과 `addTo42(..)`)은 그 안에 존재하고 RED(1) 스코프로부터 호출된다는 것을 주목하자.

이제 닫힌closed-over 변수가 업데이트된 다음 예제를 알아 보자.

```js
function makeCounter() {
    var count = 0;

    return function getCurrent() {
        count = count + 1;
        return count;
    };
}

var hits = makeCounter();

// later

hits();     // 1

// later

hits();     // 2
hits();     // 3
```

`count` 변수는 내부 `getCurrent()` 함수에 의해 닫혀 있다(is closed over). 그 함수는 `count` 변수가 GC되는 대신 계속 사용할 수 있도록 유지된다. `hit()` 함수는 매 타임 증가하는 카운트를 반환하면서 그 변수를 엑세스하고 업데이트한다.

일반적으로 클로저의 외부 스코프를 함수가 생성하지만, 그것이 반드시 필요한 것은 아니다. 단지, 외부 스코프 안에 내부 함수가 존재하는 것이 필요할 뿐이다.

:::tip 옮긴이 주
외부 스코프가 반드시 함수일 필요는 없다. 다음 스니펫과 같이 그냥 블록으로 외부 스코프를 만들어도 괜찮다.
:::

```js
var hits;
{   // an outer scope (but not a function)
    let count = 0;
    hits = function getCurrent(){
        count = count + 1;
        return count;
    };
}
hits();     // 1
hits();     // 2
hits();     // 3
```

:::tip NOTE
나는 의도적으로 `getCurrent()`을 `function` 선언이 아닌 `function` 표현식으로 정의하였다. 이것은 클로저에 대한 것이 아니라 FiB의 위험한 단점에 대한 것이다(챕터 6 참고).
:::

클로저를 변수 지향적이 아닌 값 지향적으로 다루는 실수가 꽤 흔하기 때문에, 개발자들은 때때로 특정한 순간에 발생하는 값을 보존하기 위해 클로저를 사용하려는 실수를 저지르게 된다.

```js
var studentName = "Frank";

var greeting = function hello() {
    // we are closing over `studentName`,
    // not "Frank"
    console.log(
        `Hello, ${ studentName }!`
    );
}

// later

studentName = "Suzy";

// later

greeting();
// Hello, Suzy!
```

`studentname`이 (`"Suzy"`로 재할당되기 전) 값 `"Frank"`를 가지고 있을 때 `greeting()` (aka, `hello()`)을 정의함에 따라, 추정되는 실수는 종종 그 클로저는 `"Frank"`를 캡처할 것이라 생각한다는 것이다. 그러나 `greeting()`은 변수 `studentName`으로 닫혀진다. `greeting()`이 호출될 때면, 그 변수의 현재 값(여기서는 `"Suzy"`)이 반영된다.

이 실수의 오래된 묘사는 루프 안의 함수들을 정의하는 것이다:

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
    keeps[i] = function keepI(){
        // closure over `i`
        return i;
    };
}

keeps[0]();   // 3 -- WHY!?
keeps[1]();   // 3
keeps[2]();   // 3
```

:::tip NOTE
이런 종류의 클로저 묘사는 일반적으로 루프 안에서 `setTimeout(..)` 또는 이벤트 핸들러와 같은 다른 콜백을 사용한다. 나는 배열에 함수 참조들을 저장함으로써 이 예시를 단순화했는데, 그런 이유로 우리는 분석 과정 중 비동기 타이밍을 고려할 필요가 없다. 클로저 원칙은 그것과 상관없이 동일하다.
:::

당신은 `keeps[0]()` 호출이 `0`을 반환할 거라 예상했을지도 모르겠다. 왜냐하면 그 함수는 `i`가 `0`이었을 때 루프의 첫 번째 반복 중 생성되기 때문이다. 그러나 다시 말해 그 추정은 변수 지향적이 아닌 값 지향적으로 클로저를 생각했기 때문이다.

`for`-루프의 구조와 관련한 어떤 점은 각 반복은 그것이 소유한 새로운 `i` 변수를 갖는다고 우리를 속일 수도 있다. 실제로, 이 프로그램은 `i`가 `var`로 선언됐기 때문에 오직 하나의 `i`를 갖는다.

해당 루프가 끝날 때, 프로그램 안의 단일 `i` 변수는 `3`으로 할당됐기 때문에, 각각의 저장된 함수는 `3`을 반환한다. `keeps` 배열 안의 3개의 함수들 각각은 각자의 클로저들을 소유하고, 그러나 그들은 모두 동일하고 공유된 `i` 변수에 닫혀진다.

물론, 단일 변수는 어떤 주어진 순간의 한 값을 가지고 있을 수 있다. 그래서 당신이 여러 개의 값들을 유지하길 원한다면, 매 번 다른 변수가 필요하다.

어떻게 루프 스니펫 안에 그것을 실현할 수 있을까? 각 반복을 위한 새로운 변수를 생성하도록 하자.

```js
var keeps = [];

for (var i = 0; i < 3; i++) {
    // new `j` created each iteration, which gets
    // a copy of the value of `i` at this moment
    let j = i;

    // the `i` here isn't being closed over, so
    // it's fine to immediately use its current
    // value in each loop iteration
    keeps[i] = function keepEachJ(){
        // close over `j`, not `i`!
        return j;
    };
}
keeps[0]();   // 0
keeps[1]();   // 1
keeps[2]();   // 2
```

각 함수는 이제 각 반복에서 온 개별 (새로운) 변수에 의해 닫혀지는데, 다만 그 변수들은 모두 `j`로 명명된다. 그리고 각 `j`는 루프 반복 안의 해당 지점에서 `i` 값의 복사본을 소유한다. 그래서 모든 3개의 함수들은 이제 예상했던 값들(`0`, `1`, 그리고 `2`)을 반환한다.

다시 상기하면, 우리가 이 프로그램에서 비동기를 사용할지라도 (예를들어 `setTimeout(..)` 또는 어떤 이벤트 핸들러 서브스크립션 안으로 각 내부 `keepEachJ()` 함수를 전달하는 등) 이전 예시와 다름 없이 클로저 동작의 동일한 종류가 관찰될 것이다.

챕터 5의 "Loops" 섹션을 상기해보자면, 그것은 어떻게 `for` 루프 안의 `let` 선언이 그 루프를 위해 그냥 하나의 변수를 만드는 것이 아니라, 실제로 그 루프의 *각 반복*을 위해서 새로운 변수를 생성하는지를 묘사한다. 해당 트릭trick/쿼크quirk는 정확히 우리 루프 클로저들을 위해 필요하다.

```js
var keeps = [];

for (let i = 0; i < 3; i++) {
    // the `let i` gives us a new `i` for
    // each iteration, automatically!
    keeps[i] = function keepEachI(){
        return i;
    };
}
keeps[0]();   // 0
keeps[1]();   // 1
keeps[2]();   // 2
```

우리가 `let`을 사용하기 때문에, 각 루프당 하나씩 총 3개의 `i`들이 생성되고, 그래서 3개 클로저들 각각은 우리가 예상한대로 *잘 작동한다*.

### Common Closures: Ajax and Events

클로저는 매우 흔하게 콜백들과 마주치게 된다.

```js
function lookupStudentRecord(studentID) {
    ajax(
        `https://some.api/student/${ studentID }`,
        function onRecord(record) {
            console.log(
                `${ record.name } (${ studentID })`
            );
        }
    );
}

lookupStudentRecord(114);
// Frank (114)
```

`onRecord(..)` 콜백은 Ajax 호출에 대한 반응이 오면 그때 특정 지점에서 호출될 것이다. 이 콜백 호출은 `ajax(..)` 유틸리티의 내부에서 발생할 것이다. 더불어, 그것이 일어났다면, `lookupStudentRecord(..)` 호출은 완료된 지 오래일 것이다.

그때 `studentID`가 콜백을 위해 여전히 존재하고 액세스할 수 있는 이유가 뭘까? 그것은 클로저이기 때문이다.

이벤트 핸들러는 클로저의 또 다른 흔한 사용법이다.

```js
function listenForClicks(btn,label) {
    btn.addEventListener("click",function onClick(){
        console.log(
            `The ${ label } button was clicked!`
        );
    });
}

var submitBtn = document.getElementById("submit-btn");

listenForClicks(submitBtn,"Checkout");
```

`label` 매개변수는 `onClick(..)` 이벤트 핸들러 콜백에 의해 닫혀 있다. 그 버튼을 클릭했을 때, `label`은 사용될 수 있도록 여전히 존재한다. 이것이 클로저다.

### What If I Can't See It?

아마 다음의 흔한 격언을 들어 본적이 있을 것이다:

> If a tree falls in the forest but nobody is around to hear it, does it make a sound?
> 숲에서 나무가 쓰러지는데 그 소리를 듣는 사람이 없다면, 과연 그 나무는 소리를 낸 것일까?

이것은 바보 같은 철학적 상상이다. 물론 과학적인 관점에서, 음파는 생성된다. 그러나 실제 핵심은 다음과 같다. 소리가 발생한다해도 *아무 상관없는 것일까?*

기억을 되새기면, 클로저 정의에서 주안점은 관찰할 수 있다는 점이다. 만약 한 클로저가 (기술적, 실행적, 또는 학술적인 관점에서) 존재한다면 그러나 그것을 우리 프로그램에서 관찰할 수 없다면, *그것은 상관 없을까?* 아니다.

이 관점을 강화하기 위해, 관찰적으로 클로저에 기반하지 *않은* 몇몇 사례들을 살펴 보자:

```js
function say(myName) {
    var greeting = "Hello";
    output();

    function output() {
        console.log(
            `${ greeting }, ${ myName }!`
        );
    }
}

say("Kyle");
// Hello, Kyle!
```

내부 함수 `output()`은 해당 변수를 감싸고 있는 스코프에서 유래하는 변수 `greeting`와 `myName`에 액세스한다. 그러나 `output()`의 호출은 해당하는 동일 스코프에서 일어난다. 그 스코프는 당연히 `greeting`과 `myName`을 이용할 수 있는 곳이다. 즉, 그것은 클로저가 아니라 단지 렉시컬 스코프이다.

함수가 클로저를 지원하지 않는 어떤 어휘적으로 범주화된 언어lexically scoped language는 위와 같은 방식으로 동작할 것이다.

사실, 전역 스코프 변수는 항상 어디에서든 액세스할 수 있기 때문에 그것은 본질적으로 (관찰할 수 있게) 닫혀질closed over 수 없다. *함수는 전역 스코프의 자손이 아닌 스코프 체인의 어떤 부분에서도 호출될 수 없다.(정확히 이해할 것)*

```js
var students = [
    { id: 14, name: "Kyle" },
    { id: 73, name: "Suzy" },
    { id: 112, name: "Frank" },
    { id: 6, name: "Sarah" }
];

function getFirstStudent() {
    return function firstStudent(){
        return students[0].name;
    };
}

var student = getFirstStudent();

student();
// Kyle
```

내부 `firstStudent()` 함수는 자기가 소유한 스코프의 외부 변수인 `students`를 참조한다. 그러나 `students`는 전역 스코프로부터 발생하기 때문에 그 함수가 프로그램의 어디에서 호출되는지는 중요하지 않고, `students`에 액세스하는 해당 능력은 일반 렉시컬 스코프와 다르지 않다.

모든 함수 호출들은 전역 변수들을 액세스할 수 있고, 클로저가 언어에서 지원되는지 여부와는 상관없다. 전역 변수들은 닫혀지는closed over 게 필요하지 않다.

단순히 존재할 뿐 결코 액세스될 수 없는 변수들은 클로저에서 발생하지 않는다:

```js
function lookupStudent(studentID) {
    return function nobody(){
        var msg = "Nobody's here yet.";
        console.log(msg);
    };
}

var student = lookupStudent(112);

student();
// Nobody's here yet.
```

내부 함수 `nobody()`는 어떤 외부 변수들에 닫혀 있지 않다

### Observable Definition

## The Closure Lifecycle and Garbage Collection (GC)

### Per Variable or Per Scope?

## An Alternative Perspective

## Why Closure?

## Closer to Closure
