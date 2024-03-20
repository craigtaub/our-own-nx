import { getProjects, processDependencies } from "./helpers";

const buildGraph = () => {
    // 1 - process projects in monorepo
    const projects = getProjects(process.cwd());
    // console.log('projects', projects)

    // 2 - build list of project with its dependencies
    const dependencyArray = processDependencies(projects);
    console.log('dependencyArray', dependencyArray)

    // 3 - targets to run
}

buildGraph();