---
date: 2022-01-01
description: Node.js의 fs.stat은 비동기 함수이다. 이 함수는 메인 코드 흐름을 방해하지 않는다. 실행을 완료하면 그때 결과를 출력한다.
tags:
  Nodejs
  노드js
  fs.stat
  isDirectory
---

# [Node.js] 비동기 함수(fs.stat) 테스트

Node.js의 `fs.stat`은 비동기 함수이다. 이 함수는 메인 코드 흐름을 방해하지 않는다. 실행을 완료하면 그때 결과를 출력한다.

따라서, `fs.stat`를 원하는 대로 이용하기 위해서는 비동기 처리에 대한 개념 이해는 물론이고 조금 복잡한 코드를 작성하면서 실제로 이용해 봐야 한다.

## 예제

`fs.stat`을 이용해 주소가 디렉터리와 연결돼 있는지 아닌지를 확인하는 코드를 작성했다. `src` 배열에 검증할 주소를 임의로 할당했다.

1. 가짜(없는) 주소
2. 실제하는 파일 주소
3. 실제하는 디렉터리 주소

1과 2는 디렉터리가 아니므로 오류가 유발될 것이며, 3은 정상으로 확인될 것이다.

- 예시

```js
const fs = require('fs');
const src = [
  '../_src/empty',
  '../_src/logo-solid/logo.png',
  '../_src/logo-line'
];

function pathesToCheck (pathes) {
  for (let i = 0; i < pathes.length; i++) {
    fs.stat(pathes[i], (err, stats) => { // Asynchronous
      // 오류가 있는지 체크
      if (err) {
        console.log(`[오류] ${pathes[i]}에 연결된 파일이나 디렉터리가 없습니다. [${i}]`);
        // 오류가 없으면, 디렉터리가 맞는지 체크
      } else if (!stats.isDirectory()) {
        console.log(`[오류] ${pathes[i]} 은 디렉터리가 아닙니다. [${i}]`);
        // 정상으로 판단
      } else {
        console.log(`[정상] ${pathes[i]} 은 디렉터리가 맞습니다. [${i}]`);
      }
    });
    console.log(`for 문 실행 완료 [${i}]`);
  }
  console.log(`function 실행 완료`);
}

pathesToCheck(src);
```

- 실행 결과

```sh
for 문 실행 완료 [0]
for 문 실행 완료 [1]
for 문 실행 완료 [2]
function 실행 완료
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
[정상] ../_src/logo-line 은 디렉터리가 맞습니다. [2]
```

결과를 보면, `fs.stat` 실행 결과는 비동기식으로 처리됨에 따라 후반부에 출력돼 있다.

그러나 동기적으로 처리됐다면 `fs.stat`의 실행 이후 `for 문`의 가장 마지막 줄의 코드(`console.log('for 문 실행 완료 [${i}]')`)가 실행되므로 각각의 출력값은 아래처럼 번갈아 나타났을 것이다.

```sh
for 문 실행 완료 [0]
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
for 문 실행 완료 [1]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
for 문 실행 완료 [2]
[정상] ../_src/logo-line 은 디렉터리가 맞습니다. [2]
function 실행 완료
```

위와 같이 출력되지 않는 이유는 당연히 비동기 함수(`fs.stat`) 때문이다. `pathesToCheck` 함수를 호출하면 코드를 처리하는 메인 스트림(코드가 실행되는 주 흐름)이 생긴다. 메인 스트림은 절차적, 동기적으로 실행되므로 비동기 함수인 `fs.stat`을 건너뛰어 나머지 코드를 처리한다. 물론, `fs.stat`은 새로 생성된 서브 스트림이 맡아 처리한다.

- 메인 스트림

```js
for (let i = 0; i < pathes.length; i++) {
  // fs.stat(...) 생략
  console.log(`for 문 실행 완료 [${i}]`);
}
```

- 서브 스트림 (비동기)

```js
fs.stat(pathes[i], (err, stats) => { // Asynchronous
      // 오류가 있는지 체크
  if (err) {
    console.log(`[오류] ${pathes[i]}에 연결된 파일이나 디렉터리가 없습니다. [${i}]`);
    // 오류가 없으면, 디렉터리가 맞는지 체크
  } else if (!stats.isDirectory()) {
    console.log(`[오류] ${pathes[i]} 은 디렉터리가 아닙니다. [${i}]`);
    // 정상으로 판단
  } else {
    console.log(`[정상] ${pathes[i]} 은 디렉터리가 맞습니다. [${i}]`);
  }
});
```

메인 스트림과 서브 스트림을 따로 나눠놓고 보니 메인 스트림의 코드 수가 월등히 적다. 그래서 `fs.stat`이 1회 처리되는 시간보다 `for 문`을 3번 반복하는 시간이 짧을 수 밖에 없다. 아래 실행 결과를 보면 `for 문`이 모두 실행되고, 심지어 마지막 코드가 모두 실행된 후 `fs.stat`의 실행 값이 순서대로 출력됐음을 알 수 있다.

- 실행 결과

```sh {5-7}
for 문 실행 완료 [0] 
for 문 실행 완료 [1]
for 문 실행 완료 [2]  # for 문 3회 반복 완료
function 실행 완료
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
[정상] ../_src/logo-line 은 디렉터리가 맞습니다. [2]
```

## 추가 테스트

사람은 의심의 동물이라고 생각한다. 위에 서술된 내용이 너무 당연해서 볼 필요가 없는 사람도 있겠지만, 반대로 비동기 처리에 계속 의심을 가지는 사람도 있으리라 본다.

앞서 `for 문`을 3번 실행하는 것보다 비동기 함수인 `fs.stat`을 1번 실행하는 시간이 더 걸린다고 했다. 정말 그럴까 하고 의심이 들 수 있으니 테스트를 해보았다.

`for 문`의 마지막 코드인 `console.log()` 실행 값의 출력이 1초 지연되도록 `setTimeout`을 이용했다. 그 결과, 예상대로 `for 문` 실행 값은 `fs.stat`의 실행값이 모두 출력된 후 가장 마지막에 나타났다.

- 추가 테스트

```js
for (let i = 0; i < pathes.length; i++) {
  // fs.stat(...) 생략
  setTimeout(() => {
    console.log(`for 문 실행 완료 [${i}]`);
  }, 1000);
}
```

- 실행 결과

```sh {5-7}
function 실행 완료
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
[정상] ../_src/logo-line 은 디렉터리가 맞습니다. [2]
for 문 실행 완료 [0] # 1초 지연
for 문 실행 완료 [1]
for 문 실행 완료 [2]
```

## 주의할 점

비동기 함수를 사용할 때 명심해야 할 점이다.

앞서 테스트한 바와 같이 비동기 함수는 코드 순서대로 실행되지 않기 때문에 실행이 언제 끝나고 그 실행 값이 언제 나오는지 알기가 어렵다. 비동기 함수에서 나오는 결과 값을 이용하려면 그 실행이 모두 끝난 시점에 이용해야 함을 명심해야 한다.

이전 코드를 조금 수정해 디렉터리가 정상이면 외부 변수 `result`에 `true`를 할당하도록 했다. `for 문`의 마지막 줄에서 그 값을 받아 출력할 것이다.

- 수정 코드

```js {3,13,16}
function pathesToCheck (pathes) {
  for (let i = 0; i < pathes.length; i++) {
    let result;
    fs.stat(pathes[i], (err, stats) => { // Asynchronous
      // 오류가 있는지 체크
      if (err) {
        console.log(`[오류] ${pathes[i]}에 연결된 파일이나 디렉터리가 없습니다. [${i}]`);
        // 오류가 없으면, 디렉터리가 맞는지 체크
      } else if (!stats.isDirectory()) {
        console.log(`[오류] ${pathes[i]} 은 디렉터리가 아닙니다. [${i}]`);
        // 정상으로 판단
      } else {
        result = true;
      }
    });
    console.log(result);
  }
  console.log(`function 실행 완료`);
}
```

- 실행 결과

```sh {3}
undefined 
undefined 
undefined # `true`를 예상
function 실행 완료
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
```

결과는 의도와 달리 `undefinded`가 출력됐다. 이는 3번째 `console.log(result)` 실행 시 `result`의 값이 아직 할당되기 전, 즉 `undefinded` 상태임을 뜻한다. `true`가 출력되려면 비동기 함수 `fs.stat`을 먼저 실행해 `true`가 할당돼 있어야 한다.

코드에서 비동기 함수는 가장 늦게 실행 결과가 나오므로, `console.log(result)`의 실행을 1초 지연해 비동기 함수 실행 이후로 하면 해결될 것이다.

- 1초 지연 실행

```js {7-9}
function pathesToCheck (pathes) {
  for (let i = 0; i < pathes.length; i++) {
    let result;
    fs.stat(pathes[i], (err, stats) => {
      // 중간 생략
    });
    setTimeout(() => {
      console.log(result);
    }, 1000);
  }
  console.log(`function 실행 완료`);
}
```

- 실행 결과

```sh {6}
function 실행 완료
[오류] ../_src/empty에 연결된 파일이나 디렉터리가 없습니다. [0]
[오류] ../_src/logo-solid/logo.png 은 디렉터리가 아닙니다. [1]
undefined
undefined
true
```

`fs.stat`이 3번째 실행할 때 외부 변수 `result`에 `true`가 할당됐고, 1초 지연 후 실행된 `console.log(result)`는 예상대로 그 할당된 값`true`를 출력했다.

## 결론

`fs.stat`은 비동기 함수이다. 비동기 함수는 주 코드 실행(메인 스트림)을 방해하지 않는다. 비동기 함수는 실행이 완료되면 결과를 반환한다. 그러나 언제 실행이 끝나는지는 알수가 없으므로 비동기 함수로 코딩 시 주의해야 한다.

## 참조

- [Node.js API Document](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_stat_path_options_callback)
