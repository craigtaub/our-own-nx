import { readProjectJsonFiles, transform, readConfig } from "./helpers";


const buildGraph = () => {
    try { 
        /// 1- grab config: namedInputs, targetDefaults
        const config = readConfig()
        // console.log(config)

        /// 2 - gather list of projects - {project, target}
        const projects = readProjectJsonFiles(process.cwd());
        console.log(projects)

        /// 3 - build graph off indexes
        // const transformed = transform(projects, config);
        // console.log(transformed)
    } catch (error: any) {
        console.error('Error', error.message)
    }
}

buildGraph()

