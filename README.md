
Run `npm run nx test`

# Local computation caching 📁

## Supports

- Inputs cache - builds input hash and checks against cache
- Inputs cache - basic in-memory
- Outputs - terminal based

## Doesn't support

- Inputs - task level or basic string, doesnt check workspace config for targetDefaults
- Inputs - source files hash filename file contents.
- Outputs - not file based

# Task execution 💻

## Supports

- Just console log for simplicity

## Doesn't support

- In sync so easier to manage output, not parallel
- No custom task runners

# Build dependencies graph 📈

## Support

- Build project and task dependency graph
- Detect Task project and workspace dependencies

## Doesnt support

- Source code analysis
- Workspace defaults

# Detect affected projects ⏭️

## Support

- Hardcoded project name for simplicity

## Doesnt support
- Manually sets which project has changed, could use git tools