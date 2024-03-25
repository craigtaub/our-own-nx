import { getProjects, processTaskDependencies } from "./helpers";
import { TaskGraph } from "./types";

const buildGraph = () => {
    // process projects in monorepo
    const projects = getProjects(process.cwd());
    // console.log('projects', projects)

    // build task dependencies graph
    const graphDependencies = processTaskDependencies(projects)
    // console.log('graphDependencies c test deps', graphDependencies['project-c'].targets.test.dependencies)
    return graphDependencies;

}

const executeTask = (projectTarget: string, graph: TaskGraph): void => {
    const [ project, target ] = projectTarget.split(':');
    const cacheKey =  graph[project].targets[target].inputs;
    // TODO - check key, if fail run then store output
    const output = `RUN ${projectTarget}`

    console.log(output)
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