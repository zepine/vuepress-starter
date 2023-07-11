---
date: 2022-01-01
description: 웹사이트 개발에 필요한 기본 프로그램 및 도구를 설치하고 간단히 테스트합니다. Node.js, Git, VS Code, Vue, Vuetify, Firebase 등
tags:
  - Nodejs
  - Git
  - Visual Studio Code
  - VS Code
  - Vue
  - Vuetify
  - Firebase
---
# VF 개발 환경 준비

::: tip

메미데브(memi.dev)님이 진행하는 동영상 강의를 보고 따라서 웹사이트를 만들어 봅니다.

> 〈Vue와 Firebase로 나만의 사이트 만들기〉
>
> [홈페이지](https://memi.dev/board/lecture?category=vf), [유튜브](https://www.youtube.com/playlist?list=PLjpTKic1SLZsWckh_DZ6tYH17MM6hBAc7)
:::

개발에 필요한 아래 프로그램 및 도구들을 설치하고 간단히 테스트해 봅니다.

- Node.js
- Git
- Visual Studio Code
- Vue
- Vuetify
- Firebase

## 기본 프로그램 설치

각 홈페이지에서 다운로드 한 프로그램을 설치한다.

- **Node.js**: <https://nodejs.org/>
- **Git**: <https://Git-scm.com/>
- **Visual Studio Code**: <https://code.visualstudio.com/>

### Windows 실행정책 변경

실행정책(Execution Policies)에 따라 스크립트 실행 시 오류가 발생할 수 있다. 현재 사용자(CurrentUser)의 실행정책을 **RemoteSigned**으로 변경하여 스크립트 실행 제한을 예방한다.

> RemoteSigned : 로컬 스크립트 및 원격 서명된 스크립트 허용

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

::: tip

실행정책 확인

```powershell
Get-ExecutionPolicy -List
```

실행정책 초기화

```powershell
Set-ExecutionPolicy -ExecutionPolicy undefined -Scope Currentuser

```

출처: [about_Execution_Policies](https://docs.microsoft.com/ko-kr/powershell/module/microsoft.powershell.core/about/about_execution_policies)

:::

## Node.js 프로젝트 생성

1. 프로젝트 폴더 생성

    ```sh
    mkdir <name> 
    ```

2. 패키지 파일 `package.json` 생성

    ```sh
    cd <name>
    npm init
    ```

    ::: tip
    **npm(Node Package Manager)**
    - 홈페이지: <https://www.npmjs.com/>
    - vue, vuetify 등 다양한 모듈을 다운로드 할 수 있다.
    - 모듈을 다운로드 하기 전 `npm init`은 필수이다.
    :::

3. `index.js` 파일 실행

    ```sh
    node index.js
    # or
    node .
    ```
  
## Vue CLI 설치

1. Vue CLI 설치

    ```sh
    npm install -g @vue/cli
    ```

    ::: warning
    Vuetify2는 Vue3를 지원하지 않음. 출시 예정인 Vuetify3는 Vue3를 지원한다고 함.
    :::

2. 프로젝트 폴더 생성

    ```sh
    npm create <folder name>
    cd <folder name>
    ```

3. Vue 실행

    ```sh
    npm run serve
    ```

> CLI: Command-Line Interface

## Git에 Remote Repository 추가(연결)

1. Git 설치
2. [github.com](https://github.com/) 계정 및 repository 생성
3. Git 초기화

    ```sh
    git init
    ```

4. Git에 remote repository 추가(연동)

    ```sh
    git remote add origin <repository https>
    ```

5. 추가 여부 확인

    ```sh
    Git remote -v
    ```

    **Quick Setup**

    ```powershell
    echo "## <title>" >> README.md
    git init
    git add README.md
    git commit -m "first commit"
    git branch -M main
    git remote add origin <repository address>
    git push -u origin main
    ```

    ::: warning
    Git 사용자 이메일과 주소가 미입력 상태라면 commit 오류가 발생한다.

    ```powershell
    git config --global user.email "you@example.com"
    git config --global user.name "Your Name"
    ```

    :::

### Repository 동기화

컴퓨터 OS를 새로 설치하거나, 다른 컴퓨터에서도 작업을 유지하려면 ropository를 클론하면 된다.

1. remote repository 클론하기

    ```sh
    git clone <repository address>
    ```

2. 모든 modules 재설치하기

    ```sh
    npm i
    ```

3. 서버 실행(정상 작동 테스트)

    ```sh
    npm run server
    ```

## VS Code 확장

개발에 도움이 되는 Extensions

- **ESLint**: 코드 형식 일관성 유지
- **Git History**: 모든 커밋 내역의 쉬운 확인
- **Auto Close Tag, Auto Rename Tag**: 보다 간편한 코드 입력

::: tip
SPA란

SPA(Single Page Application)는 웹페이지에 업데이트가 있을 때 그 페이지가 통째로 변경되는 것이 아니라 변경된 일부 요소만 바뀔 수 있도록 지원한다.

참고: [SPA 개념](https://eastflag.co.kr/fullstack-spa_definition/)

:::

## Vuetify 설치

- [Vuetify 홈페이지](https://vuetifyjs.com/en/getting-started/installation/)
- Bootstrap과 같은 기능을 하는 UI Library
- 설치하기

```sh
vue add vuetify
```

::: warning
Vuetify 설치 시 중간에 오류가 발생했다. Vuetify 2는 Vue 3를 지원하지 않기 때문인데, 나중에 Vue 2를 설치하고 오류를 해결할 수 있었다.
:::

### Vuetify 써보기

아래 요소를 적용해 본다.

1. [App bars](https://vuetifyjs.com/en/components/app-bars/)
2. [Footer](https://vuetifyjs.com/en/components/footer/)
3. [Navigation Drawers](https://vuetifyjs.com/en/components/navigation-drawers/)

### Components 활용

사이드 메뉴의 실제 코드는 `menu.vue`에 저장하고, `App.vue`에서 이 외부 문서를 컴포너트로 지정해 사용한다.

1. `menu.vue`

    - 실제 코드가 담긴 외부 문서

2. 외부 문서 import

    `App.vue`에서 외부문서 `menu.vue`를 import 한다

    ```vue
    <!-- App.vue -->
    <script>
    import MenuBar from "./components/menu.vue"
    </script>
    ```

3. component 등록

    components에 MenuBar를 등록한다

    ```vue {4}
    <!-- App.vue -->
    <script>
    export default {
      components: { MenuBar }
    }
    </script>
    ```

4. component 사용

    등록된 component는 **Kebab Case** 스타일로 이름을 바꿔 아래처럼 태그로 만든 후 원하는 위치에 사용한다.

    ```vue
    <!-- App.vue -->
    <menu-bar></menu-bar>
    ```

    ::: tip

    Vue의 components는 `<script></script>` 태그 안에서 캐멀 케이스로, `<template></template>` 태그에서는 케밥 케이스로 사용한다.
    - 케밥 케이스(Kebab Case): 단어가 하이픈(-)으로 연결된 형태. (예: menu-bar)
    - 캐멀 케이스(Pascal Case or Camel Case): 단어의 첫 글자를 대문자로 한 형태. (예: MenuBar)

    :::

### `v-bind:` 활용

`App.vue`에서 생성한 데이터를 component에 삽입할 때 사용할 수 있다.

1. 데이터 생성 및 component 지정

    ```vue
    <!-- App.vue -->
    <script>
    import siteTitle from './views/site/title.vue'
    export default {
        components: { siteTitle },
        data: () => ({
            title: '나의 타이틀',
        }),
    }
    </script>
    ```

2. component 태그에 `v-bind:` 삽입

    ```vue
    <!-- App.vue -->
    <template>
      <v-app>
        <v-app-bar>
          <site-title v-bind:ttl="title"></site-title>
        </v-app>
      </v-app-bar>
    </template>
    ```

3. 외부 문서와 연결

    `title.vue`의 데이터 삽입 위치와 props에 `v-bind:` 변수 추가

    ```vue {4,10}
    <!-- title.vue -->
    <template>
      <v-toolbar-title>
        {{ ttl }}
      </v-toolbar-title>
    </template>

    <script>
    export default {
      props: ['ttl']
    }
    </script>
    ```

### 확장 메뉴 구현

[Expansion Lists](https://vuetifyjs.com/en/components/lists/#expansion-lists) 코드 활용

## Firebase 시작

1. [Google Firebase 계정 만들기](https://firebase.google.com/)
   1. 프로젝트 만들기
   2. 웹 앱 추가 (프로젝트 설정)

2. Firebase 설치하고 테스트

    1. [Firebase CLI 설치](https://firebase.google.com/docs/cli?authuser=2#install_the_firebase_cli)

        ```sh
        npm install -g firebase-tools
        ```

    2. Firebase 로그인

        ```sh
        firebase login
        ```

    3. Firebase 프로젝트 리스트 불러오기

        ```sh
        firebase projects:list
        ```

   참고: [Firebase CLI 테스트](https://firebase.google.com/docs/cli?authuser=2#sign-in-test-cli)

3. [Firebase 프로젝트 초기화](https://firebase.google.com/docs/cli?authuser=2#initialize_a_firebase_project)

    1. 프로젝트 폴더 생성

        ```sh
        mkdir <프로젝트 폴더명>
        ```

    2. 프로젝트 초기화

        `firebase.json` 구성 파일 생성

        ```sh
        firebase init
        ```

## Firebase SDK 추가

출처: [Firebase SDK 추가하기](https://firebase.google.com/docs/web/setup?authuser=2#add-sdks-initialize)

1. Firebase SDK 추가

    ```sh
    npm install firbase
    ```

2. 필요한 Firebase 모듈 import

    ```js
    // plugins/firebase.js
    import Vue from 'vue'
    import * as firebase from 'firebase/app'
    import 'firbase/auth'
    import 'firebase/firebase-database' 
    ```

3. 앱에서 Firebase 초기화

    ```js
    firebase.initializeApp(firebaseConfig)
    ```

4. `firebaseConfig.js` 만들기

    ```js
    // firebaseConfig.js
    export default {
    apiKey: '#####',
    authDomain: '#####',
    databaseURL: 'https://#####',
    projectId: '#####',
    storageBucket: '#####.appspot.com',
    messagingSenderId: '#####',
    appId: '#####'
    }
    ```

5. `firebase.js`에서 import 하기

    ```js
    import firebaseConfig from '../../firebaseConfig'
    ```

6. `main.js`에서 firebase, import 하기

    ```js
    import './plugins/firebase'
      ```

::: warning
Firebase의 버전이 올라가면서 변경된 코드로 바꿔야 오류 없이 정상 작동한다.
:::

## Firebase 테스트 해보기

   1. 전역객체 `$firebase`가 잘 출력되는지 확인

      ```js
      // App.vue
      export default {
        mounted () {
        console.log(this.$firebase)
        }
      }
      ```

   2. 버튼 눌렀을 때 `console.log()` 출력 여부 확인

      ```vue
      <!-- App.vue -->
      <!-- 버튼 UI 추가 -->
      <v-btn icon @click="save">
        <v-icon>
         mdi-check
        </v-icon>
      </v-btn>

      <!-- methods 추가 -->
      <script>
      export default {

        methods: {
            save () {
            console.log('아이콘을 눌렀습니다')
            }
        }
      }
      </script>
      ```

## Realtime Database 쓰고 읽기

::: warning
강의를 따라 해도 Realtime Database로 쓰고 읽기 시 오류 발생. Firebase 설치 버전의 차이 때문으로 추측. 공식 개발 문서를 참고해 코드 재작성 후 오류 해결.
:::
