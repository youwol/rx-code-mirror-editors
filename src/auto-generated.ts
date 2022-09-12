const runTimeDependencies = {
    load: {
        '@youwol/flux-view': '^1.0.0',
        rxjs: '^6.5.5',
        '@youwol/cdn-client': '^1.0.1',
        codemirror: '^5.52.0',
        typescript: '^4.7.4',
        '@typescript/vfs': '^1.3.5',
    },
    differed: {},
    includedInBundle: ['@typescript/vfs'],
}

const externals = {
    '@youwol/flux-view': '@youwol/flux-view_APIv1',
    rxjs: 'rxjs_APIv6',
    '@youwol/cdn-client': '@youwol/cdn-client_APIv1',
    codemirror: 'CodeMirror_APIv5',
    typescript: 'ts_APIv4',
    'rxjs/operators': {
        commonjs: 'rxjs/operators',
        commonjs2: 'rxjs/operators',
        root: ['rxjs_APIv6', 'operators'],
    },
}
export const setup = {
    name: '@youwol/fv-code-mirror-editors',
    assetId: 'QHlvdXdvbC9mdi1jb2RlLW1pcnJvci1lZGl0b3Jz',
    version: '0.1.0',
    shortDescription:
        'Code editors (typescript, python) using codemirror & flux-view.',
    developerDocumentation:
        'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/fv-code-mirror-editors',
    npmPackage: 'https://www.npmjs.com/package/@youwol/fv-code-mirror-editors',
    sourceGithub: 'https://github.com/youwol/fv-code-mirror-editors',
    userGuide: 'https://l.youwol.com/doc/@youwol/fv-code-mirror-editors',
    apiVersion: '01',
    runTimeDependencies,
    externals,
}
