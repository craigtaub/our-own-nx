import { getProjects } from "./helpers";

const buildGraph = () => {
    const projects = getProjects(process.cwd());
    console.log('projects', projects)
}

buildGraph();