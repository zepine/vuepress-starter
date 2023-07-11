---
date: 2022-01-01
description: 개발 서버 실행 전 cache와 temp 폴더 삭제하기
---

# [VuePress] temp 폴더 삭제

뭔가 이상한 오류가 발생한다. 그 원인을 찾아 검색한다. `.temp`, `.cache` 폴더를 지우라고 조언한다. 오래 전에 폐기한 파일도 `.temp`, `.cache` 폴더에 남아 있기 때문인데 이때 사용하는 명령어를 스크랩했다.

- 개발 서버 실행 전 temp 폴더 삭제

```sh
yarn dev --clean-temp

# dev 서버를 실행하는 명령어(yarn dev)는 개발자의 세팅에 따라 달라질 수 있다.
```

- 개발 서버 실행 전 cache 폴더 삭제

```sh
yarn dev --clean-cache
```

## 이외 옵션 (dev)

출처: <https://v2.vuepress.vuejs.org/reference/cli.html#dev>

```sh
Usage:
  $ vuepress dev [sourceDir]

Options:
  -c, --config <config>  Set path to config file 
  -p, --port <port>      Use specified port (default: 8080) 
  -t, --temp <temp>      Set the directory of the temporary files 
  --host <host>          Use specified host (default: 0.0.0.0) 
  --cache <cache>        Set the directory of the cache files 
  --clean-temp           Clean the temporary files before dev 
  --clean-cache          Clean the cache files before dev 
  --open                 Open browser when ready 
  --debug                Enable debug mode 
  --no-watch             Disable watching page and config files (default: true)
  -v, --version          Display version number 
  -h, --help             Display this message
```
