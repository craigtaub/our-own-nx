
## Support
- Build project and task dependency graph
- Tasks -> project and workspace dependencies
- Inputs cache -> builds input hash and checks against cache

## Doesnt support
- Inputs Cache -> basic in-memory
- Outputs -> terminal only, not file
- Inputs 
    - task level or basic string, doesnt check workspace config for targetDefaults
    - source files hash filename file contents.
- Task orchestration
    - in sync so easier to manage output, but could be parallel
- Task execution
    - just console log for simplicity
- Affected projects
    - Manually sets which project has changed, could use git tools