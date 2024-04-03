
Run `npm run nx test`

Features:

- Local computation caching 📁
- Task execution 💻
- Build dependencies graph 📈
- Detect affected projects ⏭️

See below for full list of support.

# Local computation caching 📁

## Supports

- Inputs - builds input hash and checks against cache, includes
  - workspace `namedInputs` in hash, supports `runtime` and `env`
  - workspace `targetDefaults`
- Inputs - basic in-memory cache
- Outputs - terminal based

## Doesn't support

- Inputs 
  - source files hash the filename not the file contents 
  - project target configuration values (e.g. the command) -> TODO --- FIX THIS !!!
- Outputs - not file based, no build artifacts from test or complication results

# Task execution 💻

## Supports

- Just console log for simplicity
- Executed in child process

## Doesn't support

- In sync so easier to collect and manage output
- No predefined order
- No custom task runners
- No distributed execution across machines

# Build dependencies graph 📈

## Support

- Build project and task dependency graph, from monorepo
- Detect Task project and workspace dependencies

## Doesnt support

- Source code analysis
- Workspace defaults

processTaskDependencies -> project-c targets
```javascript
{
  prepare: {
    executor: 'nx:run-command',
    options: { command: 'echo file-c.ts' },
    inputs: [ 'env', 'build' ],
    dependencies: [],
    inputHash: 'default-hash'
  },
  test: {
    executor: '@nx/jest:jest',
    options: { codeCoverage: true },
    dependsOn: [ 'prepare', '^prepare' ],
    dependencies: [ 'project-c:prepare', 'project-a:prepare', 'project-b:prepare' ],
    inputHash: 'default-hash'
  }
}
```

# Detect affected projects ⏭️

## Support

- Hardcoded project name for simplicity

## Doesnt support

- Not checking code modificiations or git tools