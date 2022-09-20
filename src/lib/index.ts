import { install } from '@youwol/cdn-client'
import { setup, typescriptEntry /*, typescriptEntry*/ } from '../auto-generated'

export * as Common from './common'

export type TsCodeEditorModule = typeof import('./typescript')

/**
 * I wish this can be done:
 * ```ts
 * export function TypescriptModule(): Promise<TsCodeEditorModule> {
 *     const tsVersion = setup.runTimeDependencies.differed['typescript']
 *     return install({
 *         modules: [
 *             `typescript#${tsVersion}`,
 *         ],
 *     }).then(() => {
 *         return import('./typescript')
 *     })
 * }
 * ```
 */
export function TypescriptModule(): Promise<TsCodeEditorModule> {
    const tsVersion = setup.runTimeDependencies.differed['typescript']
    return install({
        modules: [`typescript#${tsVersion}`],
        scripts: [typescriptEntry.distBundle],
    }).then(() => {
        return window[typescriptEntry.exportedSymbol]
    })
}
