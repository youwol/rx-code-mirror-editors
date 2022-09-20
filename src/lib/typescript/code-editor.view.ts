import { Common } from '..'
import { IdeState, SourcePath, SrcHighlight } from '../common'

import CodeMirror from 'codemirror'
import { getHighlights } from './utils'
import { BehaviorSubject } from 'rxjs'
import { filter, take } from 'rxjs/operators'

export class CodeEditorView extends Common.CodeEditorView {
    public readonly highlights$ = new BehaviorSubject<SrcHighlight[]>([])

    constructor(params: {
        ideState: IdeState
        path: SourcePath
        config: { [k: string]: unknown }
    }) {
        super({
            ...params,
            language: 'text/typescript',
            config: {
                ...params.config,
                gutters: ['CodeMirror-lint-markers'],
                lint: {
                    options: {
                        editorKind: 'TsCodeEditorView',
                        esversion: 2021,
                    },
                },
            },
        })
        this.ideState.fsMap$
            .pipe(
                filter((fsMap) => fsMap != undefined),
                take(1),
            )
            .subscribe((fsMap) => {
                const highlights = getHighlights(fsMap, fsMap.get(params.path))
                this.highlights$.next(highlights)
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
            this.highlights$.next(highlights)
            return highlights.map((highlight) => ({
                ...highlight,
                message: highlight.messageText,
            }))
        })
    }
}
