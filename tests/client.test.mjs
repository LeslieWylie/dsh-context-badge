import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(here, '..', 'lib', 'client.js'), 'utf8')

function load() {
  let captured
  const fakeWindow = { __ModuleLoader__: { load: (opts) => { captured = opts } } }
  new Function('window', source)(fakeWindow)
  const fakeReact = {
    createElement: (...args) => ({ args }),
    Fragment: 'fragment',
    useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
    useEffect: () => {},
  }
  const mod = captured.factory((name) => {
    if (name === 'react') return fakeReact
    throw new Error(`unexpected require: ${name}`)
  })
  return mod
}

const { __testables } = load()

test('bundle registers the official DSH loader id', () => {
  let captured
  new Function('window', source)({ __ModuleLoader__: { load: (opts) => { captured = opts } } })
  assert.equal(captured.id, 'dsh-context-badge')
})

test('sessionContext derives a stable DSH session/workspace summary', () => {
  const context = __testables.sessionContext({
    sessionId: 's-1',
    session: { sessionId: 's-1' },
    useSessions: () => ({ byId: { 's-1': { displayTitle: 'Release audit', cwd: '/tmp/demo' } } }),
    useProjection: (key) => key === 'sessionStats'
      ? { turns: 2, steps: 4 }
      : { uncachedInputTokens: 1000, outputTokens: 200 },
  })
  assert.deepEqual(context, { key: 's-1', title: 'Release audit', workspace: 'demo', turns: 2, steps: 4, input: 1000, output: 200 })
})

test('todo ids and formatting are deterministic enough for local persistence', () => {
  const todo = __testables.newTodo('  ship plugin  ')
  assert.equal(todo.text, 'ship plugin')
  assert.equal(todo.done, false)
  assert.match(todo.id, /^[a-z0-9]+$/)
  assert.equal(__testables.fmt(1500), '1.5K')
  assert.equal(__testables.fmt(2_000_000), '2M')
})
