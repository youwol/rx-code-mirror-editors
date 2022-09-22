import { BehaviorSubject, merge } from 'rxjs'
import { UpdateOrigin, SourceCode, SourceContent, SourcePath } from './models'
import { logFactory } from './log-factory.conf'
import { debounceTime, filter } from 'rxjs/operators'

const log = logFactory().getChildLogger('ide.state.ts')

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

        this.fsMap$
            .pipe(filter((fsMap) => fsMap != undefined))
            .subscribe(() => log.info('IdeState => fsMap updated'))

        log.info('IdeState.constructor()')
        params.defaultFileSystem.then((defaultFsMap) => {
            const fsMap = new Map(defaultFsMap)
            params.files.forEach((file) => {
                fsMap.set(file.path, file.content)
            })
            log.info('IdeState => virtual files system initialized')
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
        merge(...Object.values(this.updates$))
            .pipe(debounceTime(250))
            .subscribe(({ path, content }) => {
                const fsMap = this.fsMap$.getValue()
                fsMap && fsMap.set(path, content)
                fsMap && this.fsMap$.next(fsMap)
            })
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
}
