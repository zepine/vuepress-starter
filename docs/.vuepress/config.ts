import { defineUserConfig } from 'vuepress'
import { getDirname, path } from '@vuepress/utils'

// bundler & theme
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from 'vuepress'

// plug-ins
// import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'
import { usePagesPlugin } from 'vuepress-plugin-use-pages'
// import { sitemapPlugin } from 'vuepress-plugin-sitemap2'
// import { searchPlugin } from '@vuepress/plugin-search'

// dir
const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  base: '/',
  lang: 'ko-KR',
  title: 'Vuepress Starter',
  description: 'Vuepress Starter',
  head: [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "robots",
        "content": "noindex, nofollow"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "initial-scale=1.0,user-scalable=yes,width=device-width"
      }
    ],
    [
      "meta",
      {
        "name": "apple-mobile-web-app-capable",
        "content": "yes"
      }
    ],
    [
      "link",
      {
        "rel": "apple-touch-icon",
        "sizes": "180x180",
        "href": "/assets/apple-touch-icon.png"
      }
    ],
    [
      "link",
      {
        "rel": "icon",
        "type": "image/png",
        "sizes": "32x32",
        "href": "/assets/favicon-32x32.png"
      }
    ],
    [
      "link",
      {
        "rel": "icon",
        "type": "image/png",
        "sizes": "16x16",
        "href": "/assets/favicon-16x16.png"
      }
    ],
    [
      "link",
      {
        "rel": "manifest",
        "href": "/site.webmanifest"
      }
    ],
    [
      "link",
      {
        "rel": "mask-icon",
        "href": "/assets/safari-pinned-tab.svg",
        "color": "#00aba9"
      }
    ],
    [
      "meta",
      {
        "name": "msapplication-TileColor",
        "content": "#00aba9"
      }
    ],
    [
      "meta",
      {
        "name": "theme-color",
        "content": "#3eaf7c"
      }
    ]
  ],
  bundler: viteBundler({
  }),
  shouldPrefetch: true,
  shouldPreload: false,
  theme: defaultTheme({
    logo: 'assets/logo.png',
    logoDark: 'assets/logo-dark.png',

    // ##    ##    ###    ##     ## 
    // ###   ##   ## ##   ##     ## 
    // ####  ##  ##   ##  ##     ## 
    // ## ## ## ##     ## ##     ## 
    // ##  #### #########  ##   ##  
    // ##   ### ##     ##   ## ##   
    // ##    ## ##     ##    ###    

    navbar: [
      {
        text: '양기리',
        children: [
          {
            text: '소개',
            link: '/yanggiri/about/intro.md',
            activeMatch: '^/yanggiri/about/'
          },
          // {
          //   text: '역사',
          //   link: '/yanggiri/about/history.md',
          //   activeMatch: '^/yanggiri/about/',
          // },
        ]
      },
    ],


    //  ######  #### ########  ######## 
    // ##    ##  ##  ##     ## ##
    // ##        ##  ##     ## ##
    //  ######   ##  ##     ## ######
    //       ##  ##  ##     ## ##
    // ##    ##  ##  ##     ## ##
    //  ######  #### ########  ######## 

    sidebar: {
      '/yanggiri/about/': [{
        text: '양기리',
        children: [
          // '/yanggiri/about/README.md',
          '/yanggiri/about/intro.md',
          '/yanggiri/about/meaning.md',
          '/yanggiri/about/history.md',
          '/yanggiri/about/old-maps.md',
        ]
      }],
      '/': [{
        text: '태그리스트',
        children: [

        ]
      }]
    },

    //  #######  ########  ######## ####  #######  ##    ## 
    // ##     ## ##     ##    ##     ##  ##     ## ###   ## 
    // ##     ## ##     ##    ##     ##  ##     ## ####  ## 
    // ##     ## ########     ##     ##  ##     ## ## ## ## 
    // ##     ## ##           ##     ##  ##     ## ##  #### 
    // ##     ## ##           ##     ##  ##     ## ##   ### 
    //  #######  ##           ##    ####  #######  ##    ## 


    colorMode: 'auto',
    colorModeSwitch: true,
    editLink: false,
    tip: '참고',
    warning: '중요',
    danger: '주의',
  }),


  // ########  ##       ##     ##  ######   #### ##    ## 
  // ##     ## ##       ##     ## ##    ##   ##  ###   ## 
  // ##     ## ##       ##     ## ##         ##  ####  ## 
  // ########  ##       ##     ## ##   ####  ##  ## ## ## 
  // ##        ##       ##     ## ##    ##   ##  ##  #### 
  // ##        ##       ##     ## ##    ##   ##  ##   ### 
  // ##        ########  #######   ######   #### ##    ## 

  plugins: [
    // googleAnalyticsPlugin({
    //   id: ''
    // }),
    // searchPlugin({
    //   locales: {
    //     '/': {
    //       placeholder: '검색',
    //     },
    //   },
    //   hotKeys: ['/'],
    //   maxSuggestions: 15,
    //   // getExtraFields: (page) => page.frontmatter.tags ?? [],
    //   isSearchable: (page) => page.path !== '/'
    // }),
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, './components')
    }),
    usePagesPlugin({
      startsWith: '/', file: 'pages.js'
    })
    // sitemapPlugin({
    //   hostname: '',
    // })
  ]
})
