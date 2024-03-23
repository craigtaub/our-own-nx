import { getProjects, processProjectDependencies, processTaskDependencies } from "./helpers";

const buildGraph = () => {
    // 1 - process projects in monorepo
    const projects = getProjects(process.cwd());
    // console.log('projects', projects)

    // 2 - build list of project with its dependencies
    const projectDependencies = processProjectDependencies(projects);
    // console.log('projectDependencies', projectDependencies)

    // 3 - build task dependencies graph
    const graphDependencies = processTaskDependencies(projects, projectDependencies)
    // console.log('graphDependencies', graphDependencies)
    // console.log('graphDependencies c test deps', graphDependencies['project-c'].targets.test.dependencies)
    return graphDependencies;

}

const executeTask = (projectTarget: string, graph: any): void => {
    console.log(`RUN ${projectTarget}`)
}
const run = () => {
    
    const command = process.argv[2];
    
    const graph = buildGraph();

    const affectedProjects = ['project-c'] // TODO - use Git cli to check file changes

    affectedProjects.map((affected) => {
        // grab command - command located inside "graph[affected].targets[command]"
        const thisProjectTarget = `${affected}:${command}`

        // grab deps
        const thisDeps = graph[affected].targets[command].dependencies
        
        // execute deps
        thisDeps.map((dep: string) => executeTask(dep, graph));

        // execute target
        executeTask(thisProjectTarget, graph)
    });
}
run()