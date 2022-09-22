import * as cdnClient from '@youwol/cdn-client'
import { setup } from '../auto-generated'
import { logFactory } from './log-factory.conf'
export * as Common from './common'

export type TsCodeEditorModule = typeof import('./typescript')

export function TypescriptModule({
    installParameters,
}: { installParameters? } = {}): Promise<TsCodeEditorModule> {
    const log = logFactory().getChildLogger('index.ts')

    log.info('function TypescriptModule => install required')

    const parameters = installParameters || {}
    const scripts = [
        ...(parameters.scripts || []),
        '' + 'codemirror#5.52.0~mode/javascript.min.js',
        'codemirror#5.52.0~addons/lint/lint.js',
    ]
    const css = [
        ...(parameters.css || []),
        'codemirror#5.52.0~codemirror.min.css',
        'codemirror#5.52.0~addons/lint/lint.css',
        'codemirror#5.52.0~theme/blackboard.min.css', // default theme
    ]

    return setup
        .installAuxiliaryModule({
            name: 'typescript-addon',
            cdnClient,
            installParameters: {
                ...parameters,
                scripts,
                css,
            },
        })
        .then((m) => {
            log.info('function TypescriptModule => install done')
            return m
        })
}
