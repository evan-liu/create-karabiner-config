#!/usr/bin/env node

import { join } from 'node:path'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const name = process.argv[2] || 'karabiner-config'
const destDir = join(process.cwd(), name)
const srcDir = join(destDir, 'src')

if (existsSync(destDir)) {
  console.error(`❌  Directory ${name} already exist.\n\n${destDir}\n`)
  process.exit(1)
}

mkdirSync(srcDir, { recursive: true })

writeFileSync(join(destDir, 'package.json'), `\
{
  "name": "karabiner-config",
  "description": "karabiner config in karabiner.ts",
  "scripts": {
    "build": "ts-node src/index.ts",
    "update": "npm update karabiner.ts"
  },
  "devDependencies": {
    "@types/node": "^20.1.3",
    "karabiner.ts": "latest",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
}
`)

writeFileSync(join(srcDir, 'index.ts'), `\
import {
  layer,
  map,
  NumberKeyValue,
  rule,
  withMapper,
  writeToProfile,
} from 'karabiner.ts'

// ! Change '--dry-run' to your Karabiner-Elements Profile name.
// (--dry-run print the config json into console)
// + Create a new profile if needed.
writeToProfile('--dry-run', [
  // It is not required, but recommended to put symbol alias to layers,
  // (If you type fast, use simlayer instead, see https://evan-liu.github.io/karabiner.ts/rules/simlayer)
  // to make it easier to write '←' instead of 'left_arrow'.
  // Supported alias: https://github.com/evan-liu/karabiner.ts/blob/main/src/utils/key-alias.ts
  layer('/', 'symbol-mode').manipulators([
    //     / + [ 1    2    3    4    5 ] =>
    withMapper(['⌘', '⌥', '⌃', '⇧', '⇪'])((k, i) =>
      map((i + 1) as NumberKeyValue).toPaste(k),
    ),
    withMapper(['←', '→', '↑', '↓', '␣', '⏎', '⇥', '⎋', '⌫', '⌦', '⇪'])((k) =>
      map(k).toPaste(k),
    ),
  ]),

  rule('Key mapping').manipulators([
    // config key mappings
    map(1).to(1)
  ]),
])
`)

console.info('$ npm install')
execSync('npm install', {cwd: destDir, stdio: 'inherit'})

console.info(`\n🎉 ${name} is ready. \nStart config at ${name}/src/index.ts\n`)
