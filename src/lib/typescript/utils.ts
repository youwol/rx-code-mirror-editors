import * as ts from 'typescript'
import { compilerOptions } from './ide.state'
import {
    createSystem,
    createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'
import { SrcHighlight } from '../common'

export function parseTypescript(tsSrc: string) {
    const transpiled = ts
        .transpileModule(tsSrc, {
            compilerOptions,
        })
        .outputText.replace('export {};', '')

    return {
        tsSrc: tsSrc,
        jsSrc: transpiled,
    }
}

export function getHighlights(fsMap, src) {
    fsMap.set('index.ts', `${src}`)
    const system = createSystem(fsMap)
    const env = createVirtualTypeScriptEnvironment(
        system,
        ['index.ts'],
        ts,
        compilerOptions,
    )

    return [
        ...env.languageService.getSyntacticDiagnostics('index.ts'),
        ...env.languageService.getSemanticDiagnostics('index.ts'),
    ]
        .map((d) => new SrcHighlight(d))
        .filter((highlight) => highlight.diagnostic.code != 1108)
}
