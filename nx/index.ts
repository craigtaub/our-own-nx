import { getProjects, processTaskDependencies, executeChildProcess } from "./helpers";
import { TaskGraph, SimpleObject } from "./types";

const buildGraph = () => {
    // process projects in monorepo
    const projects = getProjects(process.cwd());

    // build task dependencies graph
    const graphDependencies = processTaskDependencies(projects)
    console.log('graphDependencies c test deps', graphDependencies['project-c'].targets)
    return graphDependencies;

}

// in-memory
const inputCache: SimpleObject = {}
function getInputCache(key: string): any {
    return inputCache[key]
}
function setInputCache(key: string, value: any): any {
    inputCache[key] = value
}

const executeTask = (projectTarget: string, graph: TaskGraph): void => {
    console.log('EXECUTE TASK: ', projectTarget)
    const [ project, target ] = projectTarget.split(':');
    const cacheKey =  graph[project].targets[target].inputHash as string;
    // run output from cache if exist
    let output = getInputCache(cacheKey);
    if(output) {
        console.log('HIT: ', cacheKey)
        console.log('(cached) terminal output', output)
    } else {
        console.log('MISS: ', cacheKey)

        // build command
        const command = `console.log('${graph[project].targets[target].executor} ${(graph[project].targets[target].options?.command || '')}')`
        // run in child process and cache output
        const terminalOutput = executeChildProcess(command)
        console.log('terminal output', terminalOutput)
        setInputCache(cacheKey, terminalOutput)
    }

    console.log('\n')
}

const run = () => {
    
    const command = process.argv[2];
    
    const graph = buildGraph();

    // MOCK SETUP
    const affectedProjects = ['project-c'] // use Git cli to check file changes
    setInputCache('aa4bb188cdcb3d13609babb4be52b61a', 'nx:run-command echo file-b.ts') // cached project-b:prepare already

    
    affectedProjects.map((affected) => {
        // grab command - command located inside "graph[affected].targets[command]"
        const thisProjectTarget = `${affected}:${command}`

        // grab deps
        const thisDeps = graph[affected].targets[command].dependencies || []
        
        // execute deps
        thisDeps.map((dep: string) => executeTask(dep, graph));

        // execute target
        executeTask(thisProjectTarget, graph)
    });
}
run()