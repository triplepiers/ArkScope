# NewsList

> [终末地官网公告页](https://endfield.hypergryph.com/news) 

## 使用

- 常规使用示例：

  ```js
  import NewsList from '@/components/NewsList/index.vue'

  const records = [
    { 
      id: '1', 
      tab: 'notices',      // 分类标签
      title: '版本更新说明', 
      date: '2026.09.09' 
      // [Optional] image、href
    },
  ```

  ```html
  <NewsList 
    title="公告" title-en="News" 
    :records="records"
  />
  ```

- 服务端异步分页示例：

  ```js
  import NewsList from '@/components/NewsList/index.vue'
  import { fetchBulletins } from '@/components/NewsList/newsData.js'
  ```
  ```html
  <NewsList :load-page="fetchBulletins" />
  ```

  后端只需实现（页码从 1 开始，total 是**当前分类**的总条数）:
  ```js
  loadPage({ tab, page, pageSize, signal }) => Promise<{ records, total }>
  ```

## 组件结构

| 文件 | 职责 |
| --- | --- |
| `index.vue` | 容器布局、分类/页码状态、数据加载和响应式切换 |
| `NewsHeader.vue` | SVG + PNG + 可配置中文/英文标题 |
| `NewsTabs.vue` | 四分类、选中/hover 动画、方向键/Home/End |
| `NewsBlock.vue` | 当前页卡片网格、图片占位/失败回退、详情链接 |
| `NewsPagination.vue` | 前后页、4 格滑动页码、窄屏当前页/总页数 |
| `newsData.js` | 分类常量、页码窗口、官方 API 适配器 |

组件事件：

- `change({ tab, page, pageSize, total })` 加载成功后触发
- `open(record)` 图片被点击时触发；
- `error(Error)` 加载失败时触发。

## 分类标签

- `tags` 是分类选项数组，**顺序即显示顺序**

  - `value` 必须是非空、唯一且稳定的字符串
  - `label` 是显示文案。

  ```js
  const tags = ref([
    { label: '最新', value: 'latest' },
    { label: '公告', value: 'notices' },
    { label: '活动', value: 'events' },
    { label: '新闻', value: 'news' },
  ])

  // 增加自定义分类
  tags.value.push({ label: '维护', value: 'maintenance' })
  // 删除分类；不会从 records 中删除公告本身
  tags.value = tags.value.filter((tag) => tag.value !== 'events')
  ```

- 通过 `:tags` 与组件绑定
  ```html
  <NewsList :tags="tags" :records="records" title="公告" />
  ```

## 公告详情数组（卡片数据）

“详情”指列表中每张公告卡片的数据，**不包含公告正文**。

- 本地模式传入完整 `records` 数组，组件负责筛选与分页
- 异步模式返回当前页数组和当前分类总条数

  ```js
  // loadPage({ tab, page, pageSize, signal }) 的返回值
  return {
    records: [
      {
        id: 'notice-001',
        tab: 'notices',
        title: '版本更新维护说明',
        date: '2026.09.09',
        // image: '/images/notice-001.jpg', // 可选；不传或加载失败显示占位
        // href: '/news/notice-001',       // 可选；不传时仅触发 open 事件
      },
    ],
    total: 75, // 当前分类全部记录数，不是这一页的数组长度
  }
  ```

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| records | Array<NoticeRecord> | 当前页卡片数组；无内容返回 [] |
| total | 非负整数 | 当前分类总条数；决定总页数 |
| record.id | string / number | 稳定唯一标识，作为渲染 key |
| record.tab | string | 对应 tags[].value；未知值按原字符串显示 |
| record.title | string | 标题，自动按宽窄屏截断 |
| record.date | string | 已格式化日期，原样显示 |
| record.image | string，可选 | 图片 URL；默认占位 |
| record.href | string，可选 | 详情链接，新标签页打开；无值时不自动导航 |
