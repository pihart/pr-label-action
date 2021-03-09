# pr-label-action

Run an ordered list of commands on a pull request (PR) based on its labels.

Example use case:
label PRs with semantic versioning and update versions on merge.

## Usage

### Workflow

For npm projects and SemVer:

```yaml
name: NPM SemVer

on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  semver:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true

    steps:
      - uses: actions/checkout@v2
      - run: |
          git config --global user.name 'Avi Mehra'
          git config --global user.email 'pihart@users.noreply.github.com'
      - uses: pihart/pr-label-action@v2.2.1
        with:
          label-prefix: "Semver: "
          run-prefix: "npm version "
          items: |
            [
              {
                "label": "Major",
                "run": "major"
              },
              {
                "label": "Minor",
                "run": "minor"
              },
              {
                "label": "Patch",
                "run": "patch"
              },
              
              {
                "label": "Premajor",
                "run": "premajor"
              },
              {
                "label": "Preminor",
                "run": "preminor"
              },
              {
                "label": "Prepatch",
                "run": "prepatch"
              }
            ]
      - run: |
          git push origin HEAD:main
```

For full documentation on the inputs, see [action.yml](action.yml).

### Library

```shell
npm i pr-label-action
```
