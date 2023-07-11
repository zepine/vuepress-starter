---
date: 2022-01-01
description: VuePress는 Webpack과 Vite 중 원하는 번들러를 설치할 수 있다.
tags:
  - bundler
  - 번들러
  - vite
  - webpack
---
# [VuePress] Webpack과 Vite 번들러 사용하기

VuePress v2 사용자는 Webpack과 Vite bundler(번들러) 중 하나를 선택할 수 있다. 미리 번들러가 포함된 VuePress를 설치해도 되고, 추후 원하는 번들러를 설치한 뒤 `config.js`에서 번들러를 변경할 수도 있다. 아래 세 가지 설치 방법이 있다.

1. [Webpack을 탑재한 VuePress 설치](#webpack%E1%84%8B%E1%85%B5-%E1%84%91%E1%85%A9%E1%84%92%E1%85%A1%E1%86%B7%E1%84%83%E1%85%AC%E1%86%AB-vuepress-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5)
2. [Vite을 탑재한 VuePress 설치](#vite%E1%84%80%E1%85%A1-%E1%84%91%E1%85%A9%E1%84%92%E1%85%A1%E1%86%B7%E1%84%83%E1%85%AC%E1%86%AB-vuepress-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5)
3. [VuePress 설치 후 번들러 추가 설치](#%E1%84%87%E1%85%A5%E1%86%AB%E1%84%83%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A5-bundlers-%E1%84%89%E1%85%A5%E1%86%AF%E1%84%8E%E1%85%B5%E1%84%92%E1%85%A1%E1%84%80%E1%85%B5)

::: tip
VuePress에서 bundler는 웹사이트 구성에 필요한 모든 자료와 기능을 모아 제 역할을 할 수 있도록 핸들링한다. 오케스트라에서 VuePress는 기획자, bundler는 지휘자로 비유할 수 있다.
[VuePress's Architecture](<https://v2.vuepress.vuejs.org/advanced/architecture.html#architecture>)
:::

## VuePress 설치하기

VuePress는 아래 두 가지 중 하나를 선택해 설치할 수 있다.

[참고: VuePress를 설치하는 기본 과정](https://v2.vuepress.vuejs.org/guide/getting-started.html#getting-started)

### 1. Webpack을 탑재한 VuePress 설치

:::: code-group
::: code-group-item YARN

``` sh
# 이전에 설치한 VuePress는 삭제
# yarn remove vuepress
yarn add -D vuepress@next
```

:::
::: code-group-item NPM

``` sh
# 이전에 설치한 VuePress는 삭제
# npm uninstall vuepress
npm install -D vuepress@next
```

:::
::::

### 2. Vite를 탑재한 VuePress 설치

공식 홈페이지에서는 Webpack이 포함된 VuePress의 설치를 권유하는 듯 보이지만, Vite가 기본으로 포함된 VuePress 패키지도 공식적으로 제공한다. (또한, Vite 번들러를 기본으로 탑재한 VuePress의 동생 뻘인 [VitePress](https://v2.vuepress.vuejs.org/guide/#vitepress)도 개발 중에 있다.)

:::: code-group
::: code-group-item YARN

```sh
# 이전에 설치한 VuePress는 삭제
# yarn remove vuepress
yarn add -D vuepress-vite@next
```

:::
::: code-group-item NPM

```sh
# 이전에 설치한 VuePress는 삭제
# npm uninstall vuepress
npm install -D vuepress-vite@next
```

:::
::::

::: tip 두 번들러의 차이점
Vite는 빌드 속도가 굉장히 빠르고, Webpack은 웹브라우저 호환성이 좋다고 한다. 그래서 현업 개발자들은 시간 단축을 위해 개발 시에는 Vite를 쓰고, 최종 빌드할 때는 Webpack을 쓴다고 한다.
:::

## 번들러(bundlers) 추가 설치

VuePress를 이미 설치했다면 윈하는 번들러를 추가해 사용해도 된다. 다만, 번들러를 빠꿀 때는 `Config.js`를 조금 수정해야 한다.

### Webpack

- 설치

:::: code-group
::: code-group-item YARN

```sh
  yarn add -D @vuepress/bundler-webpack@next
```

:::
::: code-group-item NPM

```sh
  npm i -D @vuepress/bundler-webpack@next
```

:::

::::

- `config.js` 수정

:::: code-group
::: code-group-item JS

```js
module.exports = {
  // when using vuepress package, you can omit this field
  // because webpack is the default bundler
  bundler: '@vuepress/bundler-webpack',
  // options for webpack bundler
  bundlerConfig: {
    // see below
  },
}
```

:::
::: code-group-item TS

```ts
import type { WebpackBundlerOptions } from '@vuepress/bundler-webpack'
import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'

export default defineUserConfig<DefaultThemeOptions, WebpackBundlerOptions>({
  // when using vuepress package, you can omit this field
  // because webpack is the default bundler
  bundler: '@vuepress/bundler-webpack',
  // options for webpack bundler
  bundlerConfig: {
    // see below
  },
})
```

:::
::::

### Vite

- 설치
:::: code-group
::: code-group-item YARN

```sh
yarn add -D @vuepress/bundler-vite@next
```

:::
::: code-group-item NPM

```sh
npm i -D @vuepress/bundler-vite@next
```

:::

::::

- `cofing.js` 수정
:::: code-group
::: code-group-item JS

``` js
module.exports = {
  // when using vuepress-vite package, you can omit this field
  // because vite is the default bundler
  bundler: '@vuepress/bundler-vite',
  // bundler options
  bundlerConfig: {
    // see below
  },
}
```

:::
::: code-group-item TS

``` ts
import type { ViteBundlerOptions } from '@vuepress/bundler-vite'
import { defineUserConfig } from '@vuepress/cli'
import type { DefaultThemeOptions } from '@vuepress/theme-default'

export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  // when using vuepress-vite package, you can omit this field
  // because vite is the default bundler
  bundler: '@vuepress/bundler-vite',
  // options for vite bundler
  bundlerConfig: {
    // see below
  },
})
```

:::
::::
