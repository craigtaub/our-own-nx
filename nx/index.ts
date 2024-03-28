import { getProjects, processTaskDependencies, executeChildProcess } from "./helpers";
import { TaskGraph, SimpleObject } from "./types";

const buildGraph = () => {
    // process projects in monorepo
    const projects = getProjects(process.cwd());
    // console.log('projects', projects)

    // build task dependencies graph
    const graphDependencies = processTaskDependencies(projects)
    // console.log('graphDependencies c test deps', graphDependencies['project-c'].targets.test.dependencies)
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
    const [ project, target ] = projectTarget.split(':');
    // TODO - fix casting due to having input as string and array but 1 type
    const cacheKey =  graph[project].targets[target].inputs as any as string;
    // run output from cache if exist
    let output = getInputCache(cacheKey);
    if(output) {
        console.log('HIT')
    } else {
        console.log('MISS')
        output = `console.log("${projectTarget}")`
        setInputCache(cacheKey, output)
    }
    // run command in async child process
    executeChildProcess(output)
}

const run = () => {
    
    const command = process.argv[2];
    
    const graph = buildGraph();

    const affectedProjects = ['project-c'] // TODO - use Git cli to check file changes

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