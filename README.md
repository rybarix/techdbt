# techdbt

dbt is a simple tool to scan your codebase for TODO, FIXME, and REFACTOR comments.

dbt has 0 externaldependencies.

## Installation

```bash
npm install -g techdbt
```

## Usage

```bash
dbt ./src
dbt ./src/index.js
```

| -o {format} | Description                                              |
| ----------- | -------------------------------------------------------- |
| json        | Output findings in JSON format                           |
| jsonl       | Output findings in JSONL format                          |
| txt         | Output findings in plain text format                     |
| ctxt        | Output findings in colorized plain text format (Default) |

## Example outputs

### -o ctxt

```bash
# ctxt, colored terminal output (default)
dbt ./src -o ctxt
scanner.js:25 FIXME:s?(.*)", "REFACTOR:s?(.*)", "TODO:s?(.*)"]
scanner.js:114 FIXME: replace with function that respects .gitignore file
```

### -o txt

```bash
# txt
dbt ./src -o txt
scanner.js:25 FIXME:s?(.*)", "REFACTOR:s?(.*)", "TODO:s?(.*)"]
scanner.js:114 FIXME: replace with function that respects .gitignore file
```

### -o json

```bash
# json
dbt ./src -o json
[{"file":"scanner.js","line":25,"comment":"FIXME:s?(.*)\", \"REFACTOR:s?(.*)\", \"TODO:s?(.*)\"]"},{"file":"scanner.js","line":114,"comment":"FIXME: replace with function that respects .gitignore file"}]
```

### -o jsonl

```bash
# jsonl
dbt ./src -o jsonl
{"file":"scanner.js","line":25,"comment":"FIXME:s?(.*)\", \"REFACTOR:s?(.*)\", \"TODO:s?(.*)\"]"}
{"file":"scanner.js","line":114,"comment":"FIXME: replace with function that respects .gitignore file"}
```
