
const runTimeDependencies = {
    "externals": {
        "@youwol/flux-view": "^1.0.3",
        "rxjs": "^6.5.5",
        "@youwol/cdn-client": "^1.0.2",
        "codemirror": "^5.52.0",
        "typescript": "^5.2.2",
        "@youwol/logging": "^0.1.0",
        "@typescript/vfs": "^1.4.0"
    },
    "includedInBundle": {}
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
        "root": "ts_APIv5"
    },
    "@youwol/logging": {
        "commonjs": "@youwol/logging",
        "commonjs2": "@youwol/logging",
        "root": "@youwol/logging_APIv01"
    },
    "@typescript/vfs": {
        "commonjs": "@typescript/vfs",
        "commonjs2": "@typescript/vfs",
        "root": "@typescript/vfs_APIv1"
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
        "apiKey": "5",
        "exportedSymbol": "ts"
    },
    "@youwol/logging": {
        "apiKey": "01",
        "exportedSymbol": "@youwol/logging"
    },
    "@typescript/vfs": {
        "apiKey": "1",
        "exportedSymbol": "@typescript/vfs"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./lib/index.ts",
    "loadDependencies": [
        "@youwol/flux-view",
        "rxjs",
        "@youwol/cdn-client",
        "codemirror",
        "@youwol/logging"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {
    "typescript-addon": {
        "entryFile": "./lib/typescript/index.ts",
        "loadDependencies": [
            "typescript",
            "@typescript/vfs"
        ],
        "name": "typescript-addon"
    }
}

const entries = {
     '@youwol/fv-code-mirror-editors': './lib/index.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/fv-code-mirror-editors/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/fv-code-mirror-editors',
        assetId:'QHlvdXdvbC9mdi1jb2RlLW1pcnJvci1lZGl0b3Jz',
    version:'0.3.0',
    shortDescription:"Code editors (typescript, python) using codemirror & flux-view.",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/fv-code-mirror-editors&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/fv-code-mirror-editors',
    sourceGithub:'https://github.com/youwol/fv-code-mirror-editors',
    userGuide:'https://l.youwol.com/doc/@youwol/fv-code-mirror-editors',
    apiVersion:'03',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/fv-code-mirror-editors_APIv03`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/fv-code-mirror-editors#0.3.0~dist/@youwol/fv-code-mirror-editors/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/fv-code-mirror-editors/${entry.name}_APIv03`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
