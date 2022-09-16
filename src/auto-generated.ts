
const runTimeDependencies = {
    "load": {
        "@youwol/flux-view": "^1.0.3",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.2",
        "codemirror": "^5.52.0",
        "typescript": "^4.7.4",
        "@typescript/vfs": "^1.3.5"
    },
    "differed": {},
    "includedInBundle": [
        "@typescript/vfs"
    ]
}
const externals = {
    "@youwol/flux-view": {
        "commonjs": "@youwol/flux-view",
        "commonjs2": "@youwol/flux-view",
        "root": "@youwol/flux-view_APIv1"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv6"
    },
    "@youwol/cdn-client": {
        "commonjs": "@youwol/cdn-client",
        "commonjs2": "@youwol/cdn-client",
        "root": "@youwol/cdn-client_APIv1"
    },
    "codemirror": {
        "commonjs": "codemirror",
        "commonjs2": "codemirror",
        "root": "CodeMirror_APIv5"
    },
    "typescript": {
        "commonjs": "typescript",
        "commonjs2": "typescript",
        "root": "ts_APIv4"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv6",
            "operators"
        ]
    }
}
const exportedSymbols = {
    "@youwol/flux-view": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/flux-view"
    },
    "rxjs": {
        "apiKey": "6",
        "exportedSymbol": "rxjs"
    },
    "@youwol/cdn-client": {
        "apiKey": "1",
        "exportedSymbol": "@youwol/cdn-client"
    },
    "codemirror": {
        "apiKey": "5",
        "exportedSymbol": "CodeMirror"
    },
    "typescript": {
        "apiKey": "4",
        "exportedSymbol": "ts"
    }
}
export const setup = {
    name:'@youwol/fv-code-mirror-editors',
        assetId:'QHlvdXdvbC9mdi1jb2RlLW1pcnJvci1lZGl0b3Jz',
    version:'0.1.2-wip',
    shortDescription:"Code editors (typescript, python) using codemirror & flux-view.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/fv-code-mirror-editors',
    npmPackage:'https://www.npmjs.com/package/@youwol/fv-code-mirror-editors',
    sourceGithub:'https://github.com/youwol/fv-code-mirror-editors',
    userGuide:'https://l.youwol.com/doc/@youwol/fv-code-mirror-editors',
    apiVersion:'01',
    runTimeDependencies,
    externals,
    exportedSymbols,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    }
}
