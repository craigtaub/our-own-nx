import { getProjects, processProjectDependencies, processTaskDependencies } from "./helpers";

const buildGraph = () => {
    // 1 - process projects in monorepo
    const projects = getProjects(process.cwd());
    // console.log('projects', projects)

    // 2 - build list of project with its dependencies
    const projectDependencies = processProjectDependencies(projects);
    // console.log('projectDependencies', projectDependencies)

    // 3 - detect effected projects
    const affected = 'project-3' // TODO - use Git cli to check file changes

    // 4 - build task dependencies graph
    const graphDependencies = processTaskDependencies(projects, projectDependencies)
    console.log('graphDependencies', graphDependencies)
    console.log('graphDependencies c test deps', graphDependencies['project-c'].targets.test.dependencies)
}

buildGraph();