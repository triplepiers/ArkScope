# ARKSCOPE: 昨日圆车预制组件

- 预制组件目前<u>只提供了 Vue 版本</u>

- 项目本身基于 Vue3 + Vite，通过 pnpm 管理依赖

- 提供组件一览：

    - `EndfieldSidebar`：[终末地](https://endfield.hypergryph.com/) 导航栏（悬停展开、支持移动端）

    - `ScrambleTitle`：[塞壬唱片](https://monster-siren.hypergryph.com/music#album) 的文字解码组件

    - `IsometricWave`：「[莱茵生命 · 访问](https://www.bilibili.com/list/161775300?oid=768610733&bvid=BV1rr4y1b7sz)」PV 里的类亚克力质感 Hover 交互（实际上完全不亚克力呢）

        > 💡 请务必来看 [LBEILC 老师](https://github.com/LBEILC) 的 [项目](https://github.com/LBEILC/RhineLabUI)

    - （类）轮播图

        - `GameplayAlbum`：[终末地](https://endfield.hypergryph.com/#gameplay) 的轮播图组件（附带 Reveal & Blink）
        
        - `NoticeCarousel`：[终末地](https://endfield.hypergryph.com/#notice) 的版本公告轮播图组件（附带 Reveal & Blink）

        - `OperatorCarousel`：[终末地](https://endfield.hypergryph.com/#operator) 的干员轮播图组件（附带干员列表翻页、Blink 切换）

        - `ArknightsOperatorCarousel`：[明日方舟](https://ak.hypergryph.com/#operator) 干员轮播图（去除了 topBar 和右侧的 section 显示）

        - `FullScreenNavigator`：[明日方舟](https://ak.hypergryph.com) 的全屏滚动 Section 切换（附带 Section + 标题 的 Reveal 动画，滚动方向敏感）
    
    - 粒子效果

        - `Particle2D`：[明日方舟](https://ak.hypergryph.com/#world) 的 2D 点云（斥力 / 切换）

        - `Particle3D`：[终末地](https://endfield.hypergryph.com/#lore) 的 3D 点云（旋转 / 切换）

    - 排版类组件

        - `NewsList`：[终末地](https://endfield.hypergryph.com/news) 的公告概览列表

            > "公告详情" 还没做（官方实现是 Page 不是 Card，有点怪？）
        
        - `OperatorList`：[终末地](https://endfield.hypergryph.com/operator) 的干员概览

            > 没有实现点击后反向跳转至首页的 `OperatorCarousel` 联动


## 第三方素材声明

- 本项目包含第三方素材，存储鱼：`src/assets`（除 `notice_placesholder.svg` 外的内容）

    - 来自 [明日方舟 · 终末地](https://endfield.hypergryph.com) 的素材，涉及组件

        `GameplayAlbum`、`NoticeCarousel`、`OperatorCarousel`、`NewsList`、`EndfieldSidebar`、`OperatorList`

    - 来自 [明日方舟](https://ak.hypergryph.com) 的素材，涉及组件

        `ArknightsOperatorCarousel`

- 版权归属：© [2017-2026] [上海鹰角网络科技有限公司]

上述素材不属于本项目开源许可证的范围。所有商标、Logo 和品牌名称均归其原始权利人所有。