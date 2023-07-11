// Config Reference: https://v2.vuepress.vuejs.org/reference/config.html#config

module.exports = {
  // home: '/',
  lang: 'ko-KR',
  title: 'Coding Note', // for all of pages
  description: 'Learning about coding', // for all of pages
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.png' }]
  ],
  // theme: '@vuepress/theme-default',
  // locales: {
  //   '/': {
  //     lang: 'ko-KR',
  //     title: 'Coding Note',
  //     description: 'Learning about coding',
  //     head: [
  //       ['link', { rel: 'icon', href: '/images/favicon-16x16.png' }]
  //     ]
  //   }
  //   // ,
  // '/en/': {
  //   lang: 'en-US',
  //   title: '',
  //   description: '',
  //   head: [
  //     ['link', { rel: 'icon', href: '' }]
  //   ]
  // }
  // },
  // ################### Theme Configuration ##################
  themeConfig: {
    // logo: 'images/cat-ko.png', // under 'public' folder
    // logoDark: '', // Type: null | string
    // sidebar: 'auto' // default: 'auto'
    // sidebarDepth: 2, // default: 2
    navbar: [
      {
        text: 'Home',
        link: '/'
        // activeMatch: '/'
        // // 현재 위치(또는 문서)의 URL과 대조해서 activeMatch의 value(정규식)에 부합하면 자신이 포함된 객체를 하이라이트 한다. 단, permalink를 커스터마이징 하면 작동하지 않는다.
      },
      {
        text: 'Coding',
        children: [
          {
            text: 'Vue & Firebase 웹사이트',
            link: '/coding/vue-firebase/',
            activeMatch: '^/coding/',
            children: [
              {
                text: '환경설정',
                link: '/coding/vue-firebase/install-tools.md',
                activeMatch: '.*/vue-firebase/install-tools.*'
              },
              {
                text: '예정',
                link: '/coding/vue-firebase/next.md',
                activeMatch: '.*/vue-firebase/next.*'
              }
            ]
          },
          {
            text: 'JavaScript',
            link: '/coding/javascript/'
          },
          {
            text: 'Regular Expression',
            link: '/coding/regex/'
          }
        ]
      }
    //    navbar: [
    //   {
    //     text: '웹사이트 만들기',
    //     link: '/building-vf-website/'
    //     // activeMatch: '^/building-vf-website'
    //   },
    //   {
    //     text: '뷰프레스',
    //     link: '/vuepress/'
    //     // activeMatch: '^/vuepress'
    //   },
    //   {
    //     text: '코딩 일기',
    //     link: '/diary/'
    //     // activeMatch: '^/diary'
    //   }
    // ],
    ],
    // locales: {
    //   '/': {
    //     selectLanguageName: ''
    //     // selectLanguageAriaLabel: 'Select language' // default

    //   },
    //   '/ko/': {
    //     selectLanguageName: '한국어',
    //     selectLanguageAriaLabel: '언어 선택'
    //   }
    // },
    // darkMode: false, // default: true,
    // toggleDarkMode: '다크 모드 전환', // default: 'toggle dark mode'
    repo: 'https://github.com/zepine/coding-note',
    // repoLabel: '깃허브', // use as the default text of the repository link
    // searchMaxSuggestions: 10,
    // searchPlaceholder: 'search',
    // editLink: false, // default: true
    // editLinkText: '이 페이지 편집', // default: Edit this page
    editLinkPattern: ':repo/edit/:branch/:path',
    docsRepo: 'https://github.com/zepine/coding-note',
    docsBranch: 'master', // default: 'main'
    docsDir: 'docs'
    // lastUpdated: true, // default: true
    // lastUpdatedText: '마지막 수정일', // default: 'Last Updated'
    // contributors: false // default: true
    // contributorsText: '작성자', // default: 'Contributors'
    // tip: '팁', // default: 'TIP'
    // warning: '주의', // default: 'WARNING'
    // danger: '위험', // default: 'DANGER'
    // notFound: ['엇! 페이지가 어딨지?', '사이트 관리자에게 알려주세요'], // default: 'Not Found'
    // backToHome: '홈으로 돌아가기', // default: 'Back to home'
    // openInNewWindow: '새창에서 열기', // default: 'open in new window'
    // toggleSidebar: '사이드바 열기' // default: 'toggle sidebar'
  },
  // ,
  // markdownConfig: {
  //   markdownCodeLineNumbers: false,
  //   markdownToc: true
  // },
  // developmentConig: {
  //   port: 8080
  // },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            // placeholder: '검색'
          }
        },
        getExtraFields: (page) => page.frontmatter.tags ?? []
      }
    ]
  ]
  // pluginConfig: { }
}
