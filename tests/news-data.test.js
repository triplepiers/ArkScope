import test from 'node:test'
import assert from 'node:assert/strict'
import { bulletinUrl, fetchBulletins, pageWindow } from '../src/components/NewsList/newsData.js'

test('latest omits category; filtered numeric jumps preserve it with one-based pages', () => {
  assert.equal(new URL(bulletinUrl()).searchParams.has('tabs[]'), false)
  for (const tab of ['notices', 'events', 'news']) {
    for (const page of [1, 2, 9]) {
      const query = new URL(bulletinUrl({ tab, page, pageSize: 4 })).searchParams
      assert.equal(query.get('tabs[]'), tab)
      assert.equal(query.get('page'), String(page))
      assert.equal(query.get('pageSize'), '4')
    }
  }
})

test('reject invalid pagination and categories', () => {
  for (const page of [0, -1, 1.5, NaN, Infinity]) assert.throws(() => bulletinUrl({ page }))
  for (const pageSize of [0, -1, 1.5]) assert.throws(() => bulletinUrl({ pageSize }))
  assert.throws(() => bulletinUrl({ tab: 'invalid' }))
})

test('four-slot page window stays in bounds and keeps current page visible', () => {
  assert.equal(pageWindow(1, 0), 0)
  for (const total of [1, 2, 4, 5, 14, 100]) {
    for (let page = 1; page <= total; page += 1) {
      const start = pageWindow(page, total)
      assert.ok(start >= 0 && start <= Math.max(0, total - 4))
      assert.ok(page - 1 >= start && page - 1 < start + 4)
    }
  }
  assert.equal(pageWindow(3, 14), 1)
  assert.equal(pageWindow(14, 14), 10)
})

test('API adapter uses placeholders, passes cancellation and maps detail/date', async (t) => {
  const controller = new AbortController()
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(new URL(url).searchParams.get('tabs[]'), 'notices')
    assert.equal(options.signal, controller.signal)
    return { ok: true, json: async () => ({ code: 0, data: { total: 1, list: [{ cid: '9335', tab: 'notices', title: 'Example', displayTime: 1784163600, cover: 'https://example.com/cover.png' }] } }) }
  })
  const result = await fetchBulletins({ tab: 'notices', page: 2, signal: controller.signal })
  assert.equal(result.total, 1)
  assert.equal(result.records[0].image, undefined)
  assert.equal(result.records[0].date, '2026.07.16')
  assert.equal(result.records[0].href, 'https://endfield.hypergryph.com/news/9335')
})

test('API adapter rejects HTTP failures and invalid CMS responses', async (t) => {
  const mock = t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 503 }))
  await assert.rejects(fetchBulletins({}), /503/)
  mock.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ code: 1, msg: 'CMS failed' }) }))
  await assert.rejects(fetchBulletins({}), /CMS failed/)
})
