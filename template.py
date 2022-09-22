import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template, AuxiliaryModule, Bundles, MainModule
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
            externals={
                "@youwol/flux-view": "^1.0.3",
                "rxjs": "^6.5.5",
                "@youwol/cdn-client": "^1.0.2",
                "codemirror": "^5.52.0",
                "typescript": "^4.7.4",
                "@youwol/logging": "^0.1.0"
            },
            includedInBundle={"@typescript/vfs": "^1.3.5"}
        ),
        devTime={
            "@types/lz-string": "^1.3.34",  # Required to generate doc
            "lz-string": "^1.4.4",  # Required to generate doc
        }
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./lib/index.ts",
            loadDependencies=["@youwol/flux-view", "rxjs", "@youwol/cdn-client", "codemirror", "@youwol/logging"]
        ),
        auxiliaryModules=[
            AuxiliaryModule(
                name='typescript-addon',
                entryFile="./lib/typescript/index.ts",
                loadDependencies=["typescript"]
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
for file in ['README.md', '.gitignore', '.npmignore', '.prettierignore', 'LICENSE', 'package.json',
             'tsconfig.json', 'webpack.config.ts']:
    shutil.copyfile(
        src=folder_path / '.template' / file,
        dst=folder_path / file
    )

