---
date: 2022-01-01
description: 이미지 변환을 편하게 실행하기 위해 짧은 스크립트를 작성했다. 처음에는 그랬다. 그랬으나 비동기 함수라는 장벽에 부딪혀 삽질을 반복했다. 비동기 대신 동기식으로 작동하는 함수가 있으나 이미 얼마간 진행한 삽질이 아쉬워 오기가 생겼고 어떻게든 해결해 보자고 매달렸다.
tags:
  - 이미지 변환
  - sharp
  - nodejs
  - fs.statSync
  - fs.readdirSync
  - fs.unlinkSync
  - fs.isDirectory
---
# [Node.js] 디렉터리 검증 스크립트 작성기

이미지 변환을 편하게 실행하기 위해 짧은 스크립트를 작성했다. 처음에는 그랬다. 그랬으나 비동기 함수라는 장벽에 부딪혀 삽질을 반복했다. 비동기 대신 동기식으로 작동하는 함수가 있으나 이미 얼마간 진행한 삽질이 아쉬워 오기가 생겼고 어떻게든 해결해 보자고 매달렸다.

## Sharp 이미지 변환 모듈

[Sharp](https://sharp.pixelplumbing.com/ "Node.js image processing")은 Node.js에서 이미지를 작은 용량으로 압축해주는 모듈이다. 이외 이미지 포맷을 JPEG, PNG, AVIF, WebP 등으로 변환할 수 있으며, 크기 변경, 컬러와 채널 조절 등 꽤 다양한 기능을 지원한다. GUI 설치 파일은 지원하지 않고 Node.js 기반 CLI에서 사용할 수 있다.

- 이미지 압축하기 샘플 코드

```js
// convert.js
sharp('input.png') // input 파일 경로(string)
  .png( { // 변환 포맷 및 옵션
          palette: true,
          compressionLevel: 9,
          colours: 16
  })
  .toFile('output.png') // output 파일 경로(string)
  .then(info => { ... }) // 변환 성공 시 info 객체 반환
  .catch(err => { ... }); // 변환 실패 시 err 객체 반환
```

```sh
node convert.js // 스크립트 실행
```

Sharp을 발견하고 무척 좋았다. 검색하면 이와 비슷한 기능의 Node.js 기반 모듈이 여럿 나온다. 그러나 검색 페이지 상위에 올라오는 모듈들은 대부분 설치해도 제대로 작동하지 않거나 추가 모듈을 설치해야 하거나 개발이 중단되는 등 마음에 들지 않았다.

다행히 Sharp을 설치한 뒤 체증은 사라졌다. 일단 제대로 작동했고, 추가 인코딩과 디코딩 모듈을 설치할 필요가 없었고, 유지개발이 잘 되는 듯 보였다. 무엇보다 사용법을 체계적으로 정리한 공식 홈페이지가 제공되어 마음에 들었다.

## 스크립트 작성

앞서 설치했던 모듈들을 깨끗이 지우고, Sharp 하나만 설치한 뒤 좀 더 편히 쓰기 위해 스크립트를 작성했다. 이 스크립트는 대량의 파일도 디렉터리 경로만 입력하면 쉽게 변환할 수 있도록 `list.json` 파일을 기반으로 동작하도록 했다.

```json
// list.json
[
  {
    "input": [
      "../_src/logo-line",
      "../_src/logo-solid"
    ]
  },
  {
    "output": [
      "../_webp/logo-line",
      "../_webp/logo-solid"
    ]
  }
]
```

```js
// png.js
const list = require('./list.json');
```

### 이미지 변환

먼저 디렉터리 기반으로 이미지 변환 스크립트를 작성했다. `sharp()` 메서드에 디렉터리 주소를 입력하면 `png` 포맷으로 변경하는 함수이다. 디렉터리 안의 파일이 복수일 수가 있으므로 `fs.readdirSync().forEach()`로 `sharp()`를 반복 실행한다. 이미지 변환 중 콘솔에서 작업 성공과 실패 결과를 알고 싶어 `then()`과 `catch()` 메서드에서 로그를 출력한다. 성공과 실패 시 전달해주는 `info`와 `err` 객체는 쓰지 않고 `console.log()`로 관련 파일 경로를 출력한다.

```js {13,15,20,23,29}
// 모듈 불러오기
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const list = require('./list.json');
// 경로
const input = list[0].input;
const output = list[1].output;

// 파일 포맷 변환
const convert = function (input, output) {
  for (let i = 0; i < input.length; i++) {
    fs.readdirSync(input[i]).forEach(__filename => {
      sharp(`${input[i]}/${__filename}`)
        .png({
          palette: true,
          compressionLevel: 9, // 0 to 9 (smallest)
          colours: 16 // max: 256
        })
        .toFile(
          `${output[i]}/${path.basename(__filename, path.extname(__filename))}.png`
        )
        .then(
          info => {
            console.log(`[변환 완료] ${output[i]}/${path.basename(__filename, path.extname(__filename))}.png`);
            // console.log(info); 
          }
        )
        .catch(
          err => {
            console.log(`[변환 중 오류] ${output[i]}/${path.basename(__filename)}`);
            // console.log(err);
          }
        );
    });
  }
};
```

### 경로(디렉터리) 검증

큰 문제 없이 스크립트를 작성할 수 있었으나, 다양한 변수를 가정해 테스트하다 보니 보완할 점이 있음을 깨달았다.

일단 변환을 실행하려면 최소 두 개의 디렉터리를 지정해 줘야 한다. 소스 파일이 든 input 디렉터리와 변환된 파일을 저장할 output 디렉터리이다. 각 디렉터리는 `list.json` 파일의 `input`과 `output` 배열에 저장한다.

::: details list.json 예시

``` json
[
  {
    "input": [
      "../_src/logo-line", 
      "../_src/logo-solid"
    ]
  },
  {
    "output": [
      "../_webp/logo-line",
      "../_webp/logo-solid"
    ]
  }
]
```

:::

여기서 문제가 발생할 수 있다. 각 배열에 경로를 입력해야 하는데 대부분 붙여넣기를 하므로 문제없겠지만 간혹 실수로 오탈자가 입력될 수 있다. 경로 입력 후 해당 디렉터리가 삭제될 수도 있다. 그리고 경로 자체는 정상이라도 디렉터리가 아닌 파일과 연결된 경로일 수도 있다. 또한, 편의를 위한 검증으로 `input` 경로(디렉터리) 안에 실수로 소스 파일을 누락할 수 있고, `output` 디렉터리 안에 변환과 관계없는 파일이 있어 불편을 초래할 수도 있다.

이미지 변환 전, `list.json`을 미리 검증하면 오류가 발생해도 원인을 파악하고 수정할 수 있을 것 같아 추가 스크립트를 작성하기로 했다.

#### 검증할 항목

- 실수로 경로 입력 시 오탈자 발생
- 입력된 경로에 디렉터리가 없음
- 경로는 정상이나 디렉터리가 아님
- `input` 경로(디렉터리) 안에 소스 파일이 없음
- `output` 경로 안에 불필요한 파일이 있음

### 비동기 메서드와 함께한 삽질

경로 검증에는 몇 가지 Node.js의 파일시스템(`fs`) 메서드를 사용했다. 검색과 Node.js API Document를 번갈아 참고하며 알아보니 `fs.statSync()`, `stats.isDirectory()`,`fs.readdirSync()`,`fs.unlinkSync()`의 메서드로 파일을 핸들링하면 원하는 대로 검증할 수 있었다.

그러나 여기서 가장 큰 산을 만나 허우적 됐다. 위에 열거한 메서드는 동기식 메서드로 문제될 것이 없지만, 처음에는 비동기 메서드를 사용해 스크립트를 작성했다. 예를 들면, `fs.statSync()`는 `fs.stat()`를 쓰고, `fs.unlinkSync()`는 `fs.unlink()`를 사용했다.

그 결과, 스크립트는 내 뜻과 달리 작동했다. 검증을 모두 끝낸 후 오류가 없을 때만 포맷 변환을 추가 진행하는 게 내 의도였으나 비동기 메서드를 이용하니 검증이 모두 끝나기도 전에 포맷 변환이 진행됐다. 모든 조건이 완벽할 경우에는 문제 될 게 없지만, 오류가 하나라도 있으면 포맷 변환 중 오류가 발생했다.

이 문제를 해결하는 가장 간단한 방법은 모든 비동기 메서드를 동기 메서드로 바꾸는 것이다. 그러나 해결을 해보려고 이미 몇 시간 삽질했기에 오기가 생겨 쉬운 방법을 미루고 계속 도전을 이어 나갔다.

결론만 말하면, 비동기 메서드로 바꾼 뒤에야 깔끔하게 해결했다. 비동기 메서드를 바꾸지 않고 해결해 보려는 도전은 과감했으나 그 무모함만큼 내 실력이 뒤따라 주질 않았다. 구멍 난 물그릇을 손가락으로 막으면 계속 다른 데서 물이 새어 나오는 것처럼 처음 작성한 코드는 점점 없던 오류를 뿜어댔다. 그 오류를 막고, 막고, 또 막다 지쳐 결국 백기투항 했다.

그래도 한 가지 건진 게 있다면, 오랜 시간 코드를 수정하면서 내가 알았던 내용에 의심을 하고 다시 공부했다는 점이다. 이는 JavaScript를 더 정확히 이해하고 더불어 코딩에 자신감을 키우는 데 도움이 됐다.

### 검증 스크립트 완성

앞서 말했듯, 동기 메서드로 바꾸고서 원하는 스크립트를 완성했다. 아래 스크립트는 `console.log()`가 길어 어수선해 보이는데, 배열로 된 경로값을 받아 `for 문`으로 반복 실행하고, `if 문`과 `try... catch`로 예외를 처리하며, 적절한 디렉터리와 파일을 핸들링하기 위해 Node.js의 `fs` 메서드를 활용하는 간단한 구조이다.

#### 주요 메서드

- [`fs.statSync('경로')`](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_statsync_path_options)
  - 인수로 전달된 경로를 분석해 정상이면 `fs.Stats` 객체를 반환하고, 오류가 있으면 에러 객체를 반환한다. `fs.Stats`에는 디렉터리나 파일에 대한 각종 데이터(사이즈, 생성 시각 등)가 담겨 있다.
  - 아래 스크립트에서는 에러 객체가 반환되면 경로가 잘못된(존재하지 않는) 걸로 판단했다.
  - 동일한 기능의 비동기 메서드 [`fs.stat`](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_stat_path_options_callback)

- [stats.isDirectory()](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_stats_isdirectory)
  - 디렉터리 여부를 확인한다. `fs.Stats` 오브젝트(`stats`)가 디렉터리라면 `true`를 반환한다. `fs.statSync()` 등의 메서드가 `fs.Stats` 객체를 반환한다.

- [fs.readdirSync('경로')](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_readdirsync_path_options)
  - 인수로 전달된 경로를 분석해 디렉토리 내 파일을 읽어 배열 객체를 만들어 준다.
  - 아래 스크립트에서는 `input`과 `output` 디렉터리 내 파일이 있는지를 확인하는데 사용했다.
  - 비동기 메서드 [`fs.readdir()`](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_readdir_path_options_callback)

- [fs.unlinkSync('경로')](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_unlinksync_path)
  - 인수로 전달된 경로(파일)를 삭제한다.
  - 아래 스크립트에서는 이미지 변환 전, `output` 디렉터리에 불필요한 파일이 있을 경우 삭제할 때 사용했다.
  - 파일이 많을 경우 비동기 메서드 [`fs.unlink()`](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_fs_unlink_path_callback)를 사용하자.

#### 다시 정리한 검증 항목

- 경로에 디렉터리가 없으면(not exist) 예외 처리
- 경로가 디렉터리가 아니면 예외 처리
- 디렉터리 내, 파일 유무 체크
    1. `input` 디렉터리 안에 소스 파일이 없으면 예외 처리
    2. `output` 디렉터리 안에 불필요한 파일이 있으면 삭제

```js {14,17,23-24,32-33}
const fs = require('fs');
const path = require('path');
const list = require('./list.json');
// pathes
const input = list[0].input;
const output = list[1].output;
const pathes = [input, output];

const pathesToCheck = function (pathes) {
  for (let i = 0; i < pathes.length; i++) {
    for (let k = 0; k < pathes[i].length; k++) {
      try {
        // 경로에 디렉터리가 없으면 예외 처리
        const stats = fs.statSync(pathes[i][k]);
        try {
          // 경로가 디렉터리가 아니면 예외 처리
          if (!stats.isDirectory()) {
            throw `[오류] ${pathes[i][k]} 은 디렉터리가 아닙니다. [${i}-${k}]`;
          }
          switch (i) {
            case 0:
              // input 디렉터리 안에 소스 파일이 없으면 예외 처리
              const inputDir = fs.readdirSync(pathes[i][k]);
              if (inputDir.length === 0) {
                console.log(`[오류] ${pathes[i][k]} 에 변환할 파일이 없습니다. [${i}-${k}]`);
              } else {
                console.log(`[정상] ${pathes[i][k]} [${i}-${k}]`);
              }
              break;
            case 1:
              // output 디렉터리 안에 불필요한 파일이 있으면 삭제
              const outputDir = fs.readdirSync(pathes[i][k]);
              if (outputDir.length !== 0) {
                for (const file of outputDir) {
                  try {
                    fs.unlinkSync(`${pathes[i][k]}/${file}`);
                  } catch (error) {
                    console.log(`[오류] ${pathes[i][k]} 삭제 중 오류가 발생했습니다. [${i}-${k}]`);
                  } finally {
                    console.log(`[정상] ${pathes[i][k]}/${file} 파일 삭제 완료 [${i}-${k}]`);
                  }
                }
              } else {
                console.log(`[정상] ${pathes[i][k]} [${i}-${k}]`);
              }
              break;
          }
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.log(`[오류] ${pathes[i][k]} 에 디렉터리가 없습니다. 오탈자가 있는지 확인하세요. [${i}-${k}]`);
      }
    }
  }
};
```

## 마무리

아는 사람은 이미 다 쓰고 있겠지만, 혹시 모른다면 Sharp 이미지 변환 모듈을 추천하고 싶다. 공식 홈페이지에는 다른 모듈과 비교한 벤치마크 결과를 올려놓을 정도로 자신감이 뿜뿜인 것 같다.

비동기 함수에서 조금 절망했다. 그냥 비동기 함수에 대한 개념 공부를 할 때와 직접 코드를 짜서 특정 상황에 대처하는 일은 많이 다른 것 같다. 실전으로 익히지 않았다면 개발 일은 꿈도 꿔선 안될 것 같다.

언제나 같은 생각이지만, 삽질은 나름 의미가 있다. 특히, 독학 시에는 검색과 삽질 밖에는 지름길이란 게 없다.

코드를 깔끔하게 작성하고 싶었다. 그러나 오류를 고치고 고치다 보니 그런 건 어느새 잊게 된다.

내 의도를 반영한 코드를 중간에 포기하지 않고 최종 완성했다는 데 의의를 두고 싶다. 언젠가는 삽질도 내게 좋은 영양가였다고 말할 날이 오길 기대한다.  

## 참조

- [Node.js API Document](https://nodejs.org/dist/latest-v14.x/docs/api/all.html "Node.js v14.18.1 documentation")
- [sharp](https://sharp.pixelplumbing.com/ "High performance Node.js image processing")
