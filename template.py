import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template
from youwol_utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / 'package.json')


template = Template(
    path=folder_path,
    type=PackageType.Library,
    name=pkg_json['name'],
    version=pkg_json['version'],
    shortDescription=pkg_json['description'],
    author=pkg_json['author'],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            load={
                "@youwol/flux-view": "^1.0.3",
                "rxjs": "^6.5.5",
                "@youwol/cdn-client": "^1.0.2",
                "codemirror": "^5.52.0",
            },
            differed={
                "typescript": "^4.7.4",
                "@typescript/vfs": "^1.3.5",
            },
            includedInBundle=["@typescript/vfs"]
        ),
        devTime={
            "@types/lz-string": "^1.3.34",  # Required to generate doc
            "lz-string": "^1.4.4",  # Required to generate doc
        }
    ),
    userGuide=True
)

generate_template(template)

with open('.template/src/auto-generated.ts', 'a') as f:
    f.write("""
export const typescriptEntry = {
    name: `${setup.name}/typescript`,
    entryPoint: './lib/typescript/index.ts',
    exportedSymbol: `${setup.name}/typescript_APIv${setup.apiVersion}`,
    distBundle: `${setup.name}#${setup.version}~dist/${setup.name}/typescript.js`
}""")

shutil.copyfile(
    src=folder_path / '.template' / 'src' / 'auto-generated.ts',
    dst=folder_path / 'src' / 'auto-generated.ts'
)
for file in ['README.md', '.gitignore', '.npmignore', '.prettierignore', 'LICENSE', 'package.json',
             'tsconfig.json']:
    shutil.copyfile(
        src=folder_path / '.template' / file,
        dst=folder_path / file
    )

