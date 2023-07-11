---
date: 2022-01-01
description: 왜 콜백 함수는 피드백 함수가 될 수 없었을까? call은 사람과 사람 간의 수평 관계를 내재하고 있고, feed는 사람과 동물 또는 하위자 간의 수직 관계를 내포하고 있다.
tags:
  - 코딩일기
  - 자바스크립트
  - javascript
  - 콜백함수
  - callback
---
# [JS] 콜백 함수는 왜 피드백 함수가 아닐까

콜백(callback)의 사전적 의미는 답신 전화 또는 회신이다.

예를 들어 A가 B에게 이메일을 보낸 후 B로부터 답신을 받았다면, A는 콜백(회신)을 받은 것이다. 보통 업무에서는 회신받았다를 피드백(feedback) 받았다고 말하곤 한다.

## call과 feed의 유래

그럼 왜 콜백 함수는 피드백 함수가 될 수 없었을까?

먼저 call과 feed 의미의 기원을 찾아 보자.

[call의 기원](https://en.wiktionary.org/wiki/call#Etymology)은 '부르다', '소리치다', '말하다', '명명하다' 등에서, [feed의 기원](https://en.wiktionary.org/wiki/feed#Etymology_1)은 '먹이다', '먹다' '음식을 주다', '방목하다' 등에서 유래한다. (위키피디아 참고)

## call과 feed의 개인적 해석

여기서부터는 나의 개인적인 해석 또는 추측이다.

call은 사람이 다른 사람을 부르는 데서 연유하고 feed는 주로 동물이나 급식자에게 음식을 주는 데서 발의한다.

다시 말하면, call은 사람과 사람 간의 수평 관계를 내재하고 있고, feed는 사람과 동물 또는 하위자 간의 수직 관계를 내포하고 있다. 현대 영어에도 그런 관계가 그대로 전이되어 쓰이고 있으며 컴퓨터 언어에도 그런 의미가 함축돼 있지 않을까 싶다.

## 수평적인 함수와 콜백 함수의 관계

즉, 콜백 함수에서 '콜백'은 함수 간의 수평 관계를 함의하고 있지 않을까.

자바스크립트에서 함수는 일급 객체이다. 일급 객체는 위키피디아에서 ["다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체"](<https://ko.wikipedia.org/wiki/%EC%9D%BC%EA%B8%89_%EA%B0%9D%EC%B2%B4>)라고 설명한다. 함수를 포함한 모든 요소는 함수의 실제 매개변수가 될 수 있음은 물론이다(로빈 포플스톤).

일급 객체로서, 한 함수는 다른 함수를 매개변수로 이용할 수 있다. 여기서 이용되는 함수가 콜백 함수이다. 이는 한 주방장이 다른 주방장을 보조로 이용하는 것과 같고, 보조 주방장이 콜백 함수와 대응한다.

즉, 함수와 함수 간의 부름과 회신은 사람과 사람 간의 부름과 회신처럼 수평적이다. 콜백 함수(callback function)를 피드백(feedback function)으로 명명하지 않은 이유이다.

## 참고

- [MDN Web Docs - callback function](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
- [위키피디아 - 일급객체](https://ko.wikipedia.org/wiki/%EC%9D%BC%EA%B8%89_%EA%B0%9D%EC%B2%B4)
- [위키피디아 - call의 기원](https://en.wiktionary.org/wiki/call#Etymology)
- [위키피디아 - feed의 기원](https://en.wiktionary.org/wiki/feed#Etymology_1)
