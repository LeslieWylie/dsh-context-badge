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

test('sessionContext derives stable session and workspace keys', () => {
  const context = __testables.sessionContext({
    sessionId: 's-1',
    session: { sessionId: 's-1' },
    useSessions: () => ({ byId: { 's-1': { displayTitle: 'Release audit', cwd: '/tmp/demo' } } }),
    useProjection: (key) => key === 'sessionStats'
      ? { turns: 2, steps: 4 }
      : { uncachedInputTokens: 1000, outputTokens: 200 },
  })
  assert.deepEqual(context, {
    key: 's-1',
    sessionKey: 'session:s-1',
    title: 'Release audit',
    workspace: 'demo',
    workspacePath: '/tmp/demo',
    workspaceKey: 'workspace:/tmp/demo',
    turns: 2,
    steps: 4,
    input: 1000,
    output: 200,
  })
})

test('todo ids and formatting are deterministic enough for local persistence', () => {
  const todo = __testables.newTodo('  ship plugin  ')
  assert.equal(todo.text, 'ship plugin')
  assert.equal(todo.done, false)
  assert.match(todo.id, /^[a-z0-9]+$/)
  assert.equal(__testables.fmt(1500), '1.5K')
  assert.equal(__testables.fmt(2_000_000), '2M')
})

test('normalizeStore migrates v1 session records and preserves v2 records', () => {
  const migrated = __testables.normalizeStore({ 's-1': { note: 'keep me', todos: [{ id: 'a', text: 'ship', done: true }] } })
  assert.equal(migrated.records['session:s-1'].note, 'keep me')
  assert.equal(migrated.records['session:s-1'].todos[0].done, true)

  const current = __testables.normalizeStore({
    records: { 'workspace:/tmp/demo': { note: 'workspace note' } },
    recent: [{ key: 'workspace:/tmp/demo', scope: 'workspace', title: 'demo' }],
  })
  assert.equal(current.records['workspace:/tmp/demo'].note, 'workspace note')
  assert.equal(current.recent[0].scope, 'workspace')
})

test('firstUserMessages keeps the first five user/steering messages and extracts text blocks', () => {
  const nodes = Array.from({ length: 7 }, (_, index) => ({
    kind: index === 2 ? 'steering' : 'user',
    seq: index + 1,
    time: index + 100,
    content: [{ type: 'text', text: ` message ${index + 1} ` }],
  }))
  const messages = __testables.firstUserMessages(nodes)
  assert.equal(messages.length, 5)
  assert.deepEqual(messages.map((message) => message.text), [
    'message 1', 'message 2', 'message 3', 'message 4', 'message 5',
  ])
  assert.equal(__testables.derivePurpose(messages, 'demo'), '围绕「message 1」推进')
})
