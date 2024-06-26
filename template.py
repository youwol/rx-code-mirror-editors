import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template, AuxiliaryModule, Bundles, MainModule
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / 'package.json')

load_dependencies = {
    "@youwol/rx-vdom": "^1.0.1",
    "rxjs": "^7.5.6",
    "@youwol/webpm-client": "^3.0.0",
    "codemirror": "^5.52.0",
    "@youwol/logging": "^0.2.0",
}

template = Template(
    path=folder_path,
    type=PackageType.LIBRARY,
    name=pkg_json['name'],
    version=pkg_json['version'],
    shortDescription=pkg_json['description'],
    author=pkg_json['author'],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            externals={
                **load_dependencies,
                "typescript": "5.3.3",
                "@typescript/vfs": "^1.4.0"
            }
        ),
        devTime={
            "@types/codemirror": "^5.52.0",  # Required to generate doc
            "lz-string": "^1.4.4",  # Required to generate doc
        }
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./lib/index.ts",
            loadDependencies=list(load_dependencies.keys())
        ),
        auxiliaryModules=[
            AuxiliaryModule(
                name='typescript-addon',
                entryFile="./lib/typescript/index.ts",
                loadDependencies=["typescript", "@typescript/vfs"]
            )
        ],
    ),
    userGuide=True
)

generate_template(template)

shutil.copyfile(
    src=folder_path / '.template' / 'src' / 'auto-generated.ts',
    dst=folder_path / 'src' / 'auto-generated.ts'
)
for file in [
    'README.md',
    '.gitignore',
    '.npmignore',
    '.prettierignore',
    'LICENSE',
    'package.json',
    # 'tsconfig.json', references `rx-vdom-config.ts`
    'webpack.config.ts']:
    shutil.copyfile(
        src=folder_path / '.template' / file,
        dst=folder_path / file
    )

