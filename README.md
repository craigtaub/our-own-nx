
Run `npm run nx test`

# Local computation caching 📁

## Supports

- Inputs cache - builds input hash and checks against cache
- Inputs cache - basic in-memory
- Outputs - terminal based

## Doesn't support

- Inputs - task level or basic string, doesn't check workspace config for targetDefaults
- Inputs - source files hash filename file contents 
    - TODO - CONFIRM THIS
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

- Build project and task dependency graph
- Detect Task project and workspace dependencies

## Doesnt support

- Source code analysis
- Workspace defaults

processTaskDependencies
```
project-a
    targets
        prepare
            deps: null
            command
project-b
    targets
        prepare
            deps: null
            command
project-c
    targets
        prepare
            deps: null
            command
        test
            deps: [
                'project-c:prepare',
                'project-a:prepare',
                'this.project-a:prepare'
            ]
```

# Detect affected projects ⏭️

## Support

- Hardcoded project name for simplicity

## Doesnt support

- Not checking code modificiations or git tools