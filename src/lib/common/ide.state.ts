import { BehaviorSubject, merge } from 'rxjs'
import { UpdateOrigin, SourceCode, SourceContent, SourcePath } from './models'

export class IdeState {
    public readonly fsMap$ = new BehaviorSubject<Map<string, string>>(undefined)

    public readonly updates$: {
        [k: string]: BehaviorSubject<{
            path: SourcePath
            content: SourceContent
            updateOrigin: UpdateOrigin
        }>
    }

    constructor(params: {
        files: SourceCode[]
        defaultFileSystem: Promise<Map<string, string>>
    }) {
        Object.assign(this, params)

        params.defaultFileSystem.then((defaultFsMap) => {
            const fsMap = new Map(defaultFsMap)
            params.files.forEach((file) => {
                fsMap.set(file.path.substring(1), file.content)
            })
            this.fsMap$.next(fsMap)
        })
        this.updates$ = params.files.reduce((acc, e) => {
            return {
                ...acc,
                [e.path]: new BehaviorSubject({
                    path: e.path,
                    content: e.content,
                    updateOrigin: { uid: 'IdeState' },
                }),
            }
        }, {})
        merge(...Object.values(this.updates$)).subscribe(
            ({ path, content }) => {
                const fsMap = this.fsMap$.getValue()
                fsMap && fsMap.set(path.substring(1), content)
                fsMap && this.fsMap$.next(fsMap)
            },
        )
    }

    update({
        path,
        content,
        updateOrigin,
    }: {
        path: SourcePath
        content: SourceContent
        updateOrigin: UpdateOrigin
    }) {
        this.updates$[path].next({
            path,
            content,
            updateOrigin: updateOrigin,
        })
    }
    /*
    parseCurrentFile$() {
        return this.currentFile$.pipe(
            take(1),
            map((file) => {
                let transpiled = ts
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
    */
}
