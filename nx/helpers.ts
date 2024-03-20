import * as fs from 'fs';
import * as path from 'path';

interface Config {
    namedInputs: object 
    targetDefaults: object
}
interface Target {
    name: string
    dependsOn: string[];
}

interface ProjectData {
    project: string;
    targets: Target[];
    dependencies: string[];
}

export function readProjectJsonFiles(dir: string): ProjectData[] {
    const projectData: ProjectData[] = [];

    function readDirRecursive(currentDir: string) {
        const files = fs.readdirSync(currentDir);

        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readDirRecursive(filePath);
            // } else {

            } else if (file === 'project.json' || file === 'package.json') {
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    // for (const target in content.targets) {
                    
                    projectData.push({ project: content.id, targets: content.targets, dependencies: content.dependencies });
                        // dependsOn: content.targets[target]?.dependsOn || null 
                    // }
                } catch (error: any) {
                    throw new Error(`Error reading ${file}: ${error.message}`);
                }
            }
        }
    }

    readDirRecursive(dir);
    return projectData;
}


export function readConfig (): Config {
    const filePath = path.join(process.cwd(), 'nx.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}


// build a new array off projects
// for each project
    // if has dependsOn
        // if dependent is ^
            // grab name
            // if exists in config targetDefaults
                // grab inputs
                // filter projects array for index of matching target NOT project, return indexes
        // if dependent is not ^
            // grab name
            // filter projects array for index of matching project + target, return index

export function transform (rawProjects: ProjectData[], config: Config) {
    
    // const projects = rawProjects.map(project => {
    //     if (project.dependsOn) {
    //         project.dependsOn.map(dependent => {
    //             if (dependent[0] === '^') {
    //                 const name = dependent.slice(1);
    //                 console.log('name', name)
    //             } else {
    //                 //
    //             }
    //         })
    //     }
    // });
    
    return rawProjects
}