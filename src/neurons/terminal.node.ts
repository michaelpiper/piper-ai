import { type AI } from '../ai.js'
import { type Input } from './input.node.js'
import shortid from 'shortid'
// import { DBPlugin } from 'zeroant-common/plugins/db.plugin'
export interface TerminalInput {
  id: string
  data: Buffer
}
export interface TerminalOutput {
  id: string
  data: Buffer
}
export const terminalNode = async (ai: AI) => {
  // process.stdout.write('----> ')
  process.stdin.on('data', (data: Buffer) => {
    const id = shortid.generate()
    // process.stdout.moveCursor(0, -1) // up one line
    // process.stdout.clearLine(1)
    ai.emit('terminal-input', { id, data } satisfies TerminalInput)
    // process.stdout.write('----> ' + data.toString().trim() + '\n')
    // process.stdout.write('----> ')
  })
  // process.stdout.on('data', (data: Buffer) => {
  //   process.stdout._write('----> ' + data.toString(), 'utf8')
  // })
  ai.on('terminal-input', (input: TerminalInput) => {
    ai.emit('input', {
      id: input.id,
      sourceId: 'training',
      source: 'terminal-input',
      destination: 'terminal-output',
      data: Buffer.from(input.data.toString().trim()),
      type: { mode: 'verbal', plain: 'text' }
    } satisfies Input)
  })
  ai.on('terminal-output', (output: TerminalOutput) => {
    // console.log('debug', output)
    process.stdout.write(output.data.toString() + '\n')
  })
}
