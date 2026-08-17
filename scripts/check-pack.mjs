// Assert that every `files` entry in package.json actually reaches the tarball.
//
// `npm pack --dry-run` alone is not a check: it exits 0 when a `files` entry
// points at nothing. Measured on npm 11 — adding "does-not-exist-xyz" to
// `files` produced the same 13-file tarball, the same exit 0, and no warning.
// A CI step that runs it and trusts the exit code therefore passes whether the
// package is intact or has silently stopped shipping its macOS sources.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const entries = pkg.files ?? []
if (entries.length === 0) {
  console.error('package.json has no "files" allowlist; this check cannot prove anything')
  process.exit(1)
}

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json'], { encoding: 'utf8' }),
)[0].files.map((f) => f.path)

// An entry is satisfied by an exact file or by anything beneath it as a
// directory. Compared against the real tarball listing rather than the
// filesystem, because shipping is what is under test — .npmignore can drop a
// path that exists on disk.
const missing = entries.filter(
  (e) => !packed.some((p) => p === e || p.startsWith(`${e.replace(/\/$/, '')}/`)),
)

if (missing.length > 0) {
  console.error(`these "files" entries ship nothing:\n  ${missing.join('\n  ')}`)
  process.exit(1)
}
console.log(`pack check: ${entries.length} files entries all ship (${packed.length} paths)`)
