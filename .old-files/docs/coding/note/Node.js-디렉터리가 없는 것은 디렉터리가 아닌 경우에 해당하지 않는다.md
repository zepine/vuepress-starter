---
date: 2022-01-01
description: 디렉터리인지 아닌지를 판별할 때 디렉터리가 없다면 이것은 디렉터리가 아닌 것에 해당할까? 
tags:
  - 코딩일기
  - isDirectory()
  - Nodejs
  - 노드js
  - 디렉토리유무판별
---

# [Node.js] 디렉터리가 없는 것은 디렉터리가 아닌 경우에 해당하지 않는다

"어?"

오류가 발생한다. 코딩에 서툰 나는 그 이유를 도무지 알 수가 없다. 오류의 원인을 알아내지 못한 채 오랜 시간을 의자에서 허비한다. 허리가 아파져 오자 엉덩이를 들썩거린다.

애초 내 계획의 일부는 임의로 주어진 디렉터리 `path`가 정상적인(실제로 존재하는) 디렉터리를 가리키는지 아닌지를 확인하는 것이었다. 그 판단을 위해 [isDirectory()](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_stats_isdirectory) 메서드를 사용했다. 이 녀석은 `path`가 디렉터리를 가리키면 `true`를, 디렉터리가 아닌 파일을 가리키면 `false`를 반환한다.

```js
fs.stat(path, (err, stats) => {
  console.log(stats.isDirectory());
});
```

또한, 오탈자 등으로 인해 실제로 존재하지 않는 디렉터리 경로가 주어지더라도 `false`를 반환한다.

아니다. 이것은 내 희망일 뿐, 실제로는 아래와 같은 오류를 토해냈다.

```sh
[Error: ENOENT: no such file or directory, stat 'C:\dir\...']
```

위 오류는 경로에 해당하는 파일이나 디렉터리가 없다는 뜻이다. 이게 정확히 무슨 뜻일까?

[Nodejs 공식 문서](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_stats_isdirectory)를 다시 읽어 보았다.

> **stats.isDirectory()**
> Returns true if the <fs.Stats> object describes a file system directory.
> If the <fs.Stats> object was obtained from fs.lstat(), this method will always return false. This is because fs.lstat() returns information about a symbolic link itself and not the path it resolves to.

깊이 이해한 것은 아니지만, 핵심만 간추리면 이렇다. `isDirectory()` 메서드가 속한 `<fs.Stats>` 오브젝트가 파일 시스템의 디렉터리와 (직접) 연결됐을 경우 `true`를 반환한다. 반면, (윈도의 바로가기와 같은) 심볼릭 링크로 연결됐을 경우엔 `false`를 반환한다.

덧붙이면, `fs.stat()`와 `fs.lstat()` 메서드는 `<fs.Stats>` 오브젝트를 반환하는데, 전자를 통할 경우 오브젝트는 디렉터리와 (직접) 연결되고, 후자를 통할 경우 심볼릭 링크로 연결된다. 나는 전자를 활용해 오브젝트를 반환했다.

어쨌든 내가 알고 싶은 내용은 담겨 있지 않다. 절망적이다. 아마도 내가 의아해하는 부분은 너무 당연하거나 쉬운 것이어서 공식 문서에도 나오지 않는 듯하다.

하는 수 없다. 디렉터리가 없는 것과 디렉터리가 아니라는 것은 `undefined`와 `null` 만큼의 차이로 이해하고 넘어가야겠다.

## 참고

- [Node.js v14.18.1 documentation](https://nodejs.org/dist/latest-v14.x/docs/api/all.html#fs_stats_isdirectory)
