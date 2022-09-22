import { Common } from '..'
import { IdeState, SourcePath, SrcHighlight } from '../common'

import CodeMirror from 'codemirror'
import { getHighlights } from './utils'
import { BehaviorSubject } from 'rxjs'
import { filter, take } from 'rxjs/operators'

export class CodeEditorView extends Common.CodeEditorView {
    public readonly highlights$ = new BehaviorSubject<SrcHighlight[]>([])
    public readonly ideState: IdeState

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
        log.info('CodeEditorView.constructor()')

        this.ideState.environment$
            .pipe(
                take(1),
                tap(({ fsMap }) => {
                    const highlights = getHighlights(
                        fsMap,
                        fsMap.get(params.path),
                    )
                    this.highlights$.next(highlights)
                }),
                mergeMap(() => this.nativeEditor$),
            )
            .subscribe((editor) => {
                editor.setValue(editor.getValue())
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
