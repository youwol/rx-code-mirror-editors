from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template

template = Template(
    path=Path(__file__).parent,
    type=PackageType.Library,
    name="@youwol/fv-code-mirror-editors",
    version="0.0.2-wip",
    shortDescription="Code editors (typescript, python) using codemirror & flux-view.",
    author="greinisch@youwol.com",
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            load={
                "@youwol/flux-view": "^0.1.1",
                "rxjs": "^6.5.5",
                "@youwol/cdn-client": "^0.1.3",
                "codemirror": "^5.52.0",
                "typescript": "^4.7.4",
                "@typescript/vfs": "^1.3.5",
            },
            differed={
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
