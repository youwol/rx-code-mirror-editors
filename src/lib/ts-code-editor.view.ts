import { CodeEditorView } from './code-editor.view'
import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { createDefaultMapFromCDN } from './vfs_default_map_cdn'
import CodeMirror from 'codemirror'
import { filter, map, take, withLatestFrom } from 'rxjs/operators'

import * as ts from 'typescript'
import {
    createSystem,
    createVirtualTypeScriptEnvironment,
} from '@typescript/vfs'
import { VirtualDOM } from '@youwol/flux-view'
import { SourceCode, SourcePath } from './common'

export class CodeIdeState {
    public readonly entryPoint: SourcePath
    public readonly currentFile$: BehaviorSubject<SourceCode>

    public readonly fsMap$ = new BehaviorSubject<Map<string, string>>(undefined)
    public readonly parsedSrc$ = new ReplaySubject<{
        jsSrc: string
        tsSrc: string
    }>(1)

    public readonly config = {
        lineNumbers: true,
        theme: 'blackboard',
        lineWrapping: false,
        gutters: ['CodeMirror-lint-markers'],
        indentUnit: 4,
        lint: {
            options: {
                editorKind: 'TsCodeEditorView',
                esversion: 2021,
            },
        },
        extraKeys: {
            'Ctrl-Enter': () => {
                this.parseCurrentFile$().subscribe((parsed) => {
                    this.parsedSrc$.next(parsed)
                })
            },
        },
    }

    constructor(params: {
        files: SourceCode[] | SourceCode
        entryPoint: SourcePath
    }) {
        Object.assign(this, params)
        const files = Array.isArray(params.files)
            ? params.files
            : [params.files]

        this.currentFile$ = new BehaviorSubject<SourceCode>(
            files.find((sourceCode) => {
                return sourceCode.path == this.entryPoint
            }),
        )
        createDefaultMapFromCDN(
            { target: ts.ScriptTarget.ES2020 },
            '4.7.4',
        ).then((fsMap) => {
            files.forEach((file) => {
                fsMap.set(file.path.substring(1), file.content)
            })
            this.fsMap$.next(fsMap)
        })

        this.currentFile$.subscribe((file) => {
            const fsMap = this.fsMap$.getValue()
            fsMap && fsMap.set(file.path.substring(1), file.content)
            fsMap && this.fsMap$.next(fsMap)
        })
    }

    parseCurrentFile$() {
        return this.currentFile$.pipe(
            take(1),
            map((file) => {
                const transpiled = ts
                    .transpileModule(file.content, {
                        compilerOptions,
                    })
                    .outputText.replace('export {};', '')
                return {
                    tsSrc: file.content,
                    jsSrc: transpiled,
                }
            }),
        )
    }
}

export class CodeIdeView implements VirtualDOM {
    public readonly class = 'd-flex h-100'
    public readonly children: VirtualDOM[]
    public readonly ideState: CodeIdeState
    public readonly tsCodeEditorView: TsCodeEditorView

    constructor(params: { ideState: CodeIdeState }) {
        Object.assign(this, params)
        this.tsCodeEditorView = new TsCodeEditorView(params)
        this.children = [this.tsCodeEditorView]
    }
}

export class TsCodeEditorView extends CodeEditorView {
    public readonly ideState: CodeIdeState

    constructor(params: { ideState: CodeIdeState }) {
        super({
            file$: params.ideState.currentFile$,
            language: 'text/typescript',
            config: params.ideState.config,
        })
        Object.assign(this, params)

        this.ideState.fsMap$
            .pipe(
                filter((d) => d != undefined),
                withLatestFrom(this.nativeEditor$),
                take(1),
            )
            .subscribe(([_, native]) => {
                native.setValue(native.getValue())
            })

        CodeMirror.registerHelper('lint', 'javascript', (text, options) => {
            if (options.editorKind != 'TsCodeEditorView') {
                return []
            }
            const fsMapBase = this.ideState.fsMap$.getValue()
            if (!fsMapBase) {
                return
            }
            const highlights = getHighlights(fsMapBase, text)
            return (
                highlights
                    // allow 'return' outside a function body
                    .filter((highlight) => highlight.diagnostic.code != 1108)
                    .map((highlight) => ({
                        ...highlight,
                        message: highlight.messageText,
                    }))
            )
        })
    }
}

export interface SrcPosition {
    line: number
    ch: number
}

export class SrcHighlight {
    public readonly messageText: string
    public readonly from: SrcPosition
    public readonly to: SrcPosition

    constructor(public readonly diagnostic: ts.Diagnostic) {
        this.messageText = diagnostic.messageText as string
        if (this.messageText['messageText']) {
            this.messageText = this.messageText['messageText']
        }
        const from_location = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start,
        )
        this.from = {
            line: from_location.line,
            ch: from_location.character,
        }
        const to_location = diagnostic.file.getLineAndCharacterOfPosition(
            diagnostic.start + diagnostic.length,
        )
        this.to = { line: to_location.line, ch: to_location.character }
    }
}

export const compilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ES2020,
    esModuleInterop: true,
    noImplicitAny: false,
    baseUrl: '/',
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
    ].map((d) => new SrcHighlight(d))
}
