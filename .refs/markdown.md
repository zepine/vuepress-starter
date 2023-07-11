
It was built VuePress <Badge type="tip" text="next />

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: danger STOP
The title was changed
:::

```bash:no-line-numbers
yarn docs:dev
yarn docs:dev
yarn docs:dev
```

```bash
yarn docs:dev
yarn docs:dev
yarn docs:dev
```

<CodeGroup>
  <CodeGroupItem title="YARN" active>
  <!-- must add an empty line between the tag of <CodeGroupItem> and code fence -->
  
```bash
yarn install // 'CodeGroupItem' HTML 태그 사용
```

  </CodeGroupItem>
  <CodeGroupItem title="NPM">

```bash
npm install // 'CodeGroupItem' HTML 태그 사용
```

  </CodeGroupItem>  
</CodeGroup>

:::: code-group
::: code-group-item FOO

```js
const foo = 'foo'
```

:::
::: code-group-item BAR

```js:no-line-numbers
const bar = 'bar'
```

:::
::::

::: details
This is a details block
:::

::: details 코드를 보려면 여기를 누르세요

```js
console.log('Hello, VuePress!')
```

:::

## Import Code Blocks

@[code](../foo.js)
<https://v2.vuepress.vuejs.org/guide/markdown.html#import-code-blocks>
