export const NEWS_TABS = [
  { label: '最新', value: 'latest' },
  { label: '公告', value: 'notices' },
  { label: '活动', value: 'events' },
  { label: '新闻', value: 'news' },
]

export function bulletinUrl({ tab = 'latest', page = 1, pageSize = 9, lang = 'zh-cn' } = {}) {
  if (!NEWS_TABS.some((item) => item.value === tab)) throw new Error('未知公告分类')
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1) throw new Error('页码和每页数量必须为正整数')
  const url = new URL('https://web-news.hypergryph.com/api/bulletin')
  url.search = new URLSearchParams({ lang, code: 'endfield_web', page, pageSize })
  if (tab !== 'latest') url.searchParams.set('tabs[]', tab)
  return url.toString()
}

// Thumbnails stay placeholders unless the caller explicitly enables official covers.
export async function fetchBulletins({ signal, ...query }, { images = false } = {}) {
  const response = await fetch(bulletinUrl(query), { signal })
  if (!response.ok) throw new Error(`公告请求失败 (${response.status})`)
  const result = await response.json()
  if (result.code !== 0 || !Array.isArray(result.data?.list)) throw new Error(result.msg || '公告响应格式错误')
  return {
    total: result.data.total,
    records: result.data.list.map((item) => ({
      id: item.cid,
      tab: item.tab,
      title: item.title,
      date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(item.displayTime * 1000)).replaceAll('-', '.'),
      image: images ? item.cover : undefined,
      href: `https://endfield.hypergryph.com/news/${encodeURIComponent(item.cid)}`,
    })),
  }
}
