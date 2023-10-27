var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import shortid from 'shortid';
export const terminalNode = (ai) => __awaiter(void 0, void 0, void 0, function* () {
    // process.stdout.write('----> ')
    process.stdin.on('data', (data) => {
        const id = shortid.generate();
        // process.stdout.moveCursor(0, -1) // up one line
        // process.stdout.clearLine(1)
        ai.emit('terminal-input', { id, data });
        // process.stdout.write('----> ' + data.toString().trim() + '\n')
        // process.stdout.write('----> ')
    });
    // process.stdout.on('data', (data: Buffer) => {
    //   process.stdout._write('----> ' + data.toString(), 'utf8')
    // })
    ai.on('terminal-input', (input) => {
        ai.emit('input', {
            id: input.id,
            sourceId: 'training',
            source: 'terminal-input',
            destination: 'terminal-output',
            data: Buffer.from(input.data.toString().trim()),
            type: { mode: 'verbal', plain: 'text' }
        });
    });
    ai.on('terminal-output', (output) => {
        // console.log('debug', output)
        process.stdout.write(output.data.toString() + '\n');
    });
});
