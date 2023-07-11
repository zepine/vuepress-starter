---
date: 2022-01-01
description: Promise를 쉽게 이해하기 위해 가상의 사례를 만들어 비유해 봅니다. 짝꿍의 역할은 Promise 객체가 하는 일과 같습니다.
tags:
  - 코딩일기
  - 자바스크립트
  - javascript
  - Promise
  - 프라미스
  - 비동기
---
# [JS] Promise 쉽게 이해하기

Promise를 쉽게 이해하기 위해 가상의 사례를 만들어 비유해 봅니다.

## 가상의 사례

학교에서 부모님 얼굴 그리기 수업을 합니다. 수업 시간은 1시간이지만 발달장애인 학생 A에게는 많이 부족합니다. 선생님은 학생 A가 부모님 얼굴을 끝까지 그릴 수 있도록 배려를 해줍니다. 학생 A에게는 1시간이 넘어도 그림을 계속 그리도록 해주고, 옆 짝꿍에게는 선생님의 지시가 있었으니 다른 사람에게는 학생 A의 그림 그리기를 방해하지 말 것과 그것을 완료했을 때 그림을 받아서 선생님에게 제출하는 일을 맡깁니다.

시간이 흐르고 학생 A는 부모님 얼굴을 모두 그립니다. 학생 A는 다른 학생처럼 그림을 완성할 수 있어 매우 기쁩니다. 또한, 짝꿍은 학생 A의 그림을 받아 선생님에게 제출합니다. 이로써 선생님은 그림 그리기 수업을 완료합니다.

## Promise 역할

여기서 짝꿍의 역할은 Promise 객체가 하는 일과 같습니다. 어떤 함수(함수 A)는 실행을 완료하는 데 시간이 오래 걸리고 그 실행이 완료됐을 때 결과를 받고자 한다면, 위 사례처럼 함수 A를 도와줄 무엇인가가 필요합니다. 그것이 Promise 객체입니다.

함수 A를 Promise 객체로 감싸서 실행하면 함수 A의 실행이 오래 걸려도 Promise 객체가 그것을 감시하고 있다가 함수 A의 실행이 끝나면 그 결과를 혹은 오류를 알려주는 역할을 합니다.

한 가지 더, 짝꿍은 학생 A가 방해받지 않도록 지켜주는 역할도 했습니다. Promise 객체도 같은 일을 합니다. 자바스크립트의 코드는 일반적으로 동기적으로 진행되지만, 함수 A의 경우처럼 실행 시간이 오래 걸리는 경우 (다음 코드 실행을 방해하므로) 비동기적 실행을 해야 합니다. Promise 객체로 감싸면 함수 A는 다음 코드 실행에 영향을 주지 않고 비동기적 실행을 하며 실행이 끝났을 때 그 결과를 알려줍니다.

## Promise 활용 예시

```js

// 학생 A의 그림 그리기 = 시간이 오래 걸리는 작업
const studentA = function (resolve, reject) {
  setTimeout(() => { 
    resolve('pictureOfParent!');
  }, 3000);
};

// 짝꿍(studentB)의 역할 = Promise의 역할
const studentB = new Promise(studentA);

// 완성된 그림 제출 = 시간이 오래 걸리는 작업 완료 
studentB.then(result) => {
  console.log(result);
});

// 3초 후 출력: pictureOfParent!

```

## 참고

- [모던 JavaScript 튜토리얼 - 프라미스](https://ko.javascript.info/promise-basics)
- [MDN Web Docs - Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
