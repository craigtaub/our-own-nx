
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto'

import { Projects, ProjectDependencies, FolderContents, SimpleObject, TaskGraph, Target } from './types'

function getHash(content: string) {				
    var hash = crypto.createHash('md5');
    //passing the data to be hashed
    const data = hash.update(content, 'utf-8');
    //Creating the hash in the required format
    return data.digest('hex');
}

export function getConfig () {
    const configJsonPath = path.join('./', 'nx.json');

    return readJsonFile(configJsonPath);
}

function calculateInputHash (inputs: Target['inputs']) {
    const config = getConfig()
    if (!inputs) {
        // config.targetDefaults[target].inputs
        return 'default-hash'
    }
    const namedInputs = config.namedInputs
    const taskInputs = inputs.map((input: any) => {
        return namedInputs[input].map((item: any) => {
            if(item.runtime || item.env) {
                // is runtime or env var
                return getHash(JSON.stringify(item))
            } else if (item.match('{projectRoot}')) {
                // is source file
                return getHash(item)
            }
        });
    })
    
    // hash all hashes
    return getHash(JSON.stringify(taskInputs))
}

// project-a
    // targets
        // prepare
            // deps: null
            // command
// project-b
    // targets
        // prepare
            // deps: null
            // command
// project-c
    // targets
        // prepare
            // deps: null
            // command
        // test
            // deps: [
                // 'project-c:prepare',
                // 'project-a:prepare',
                // 'this.project-a:prepare'
            // ]
export function processTaskDependencies(projects: Projects): TaskGraph {
    
    const projectWithTaskDeps = projects.reduce((previousValue: any, project: FolderContents, index: number, projects: Projects) => {
        const targets = Object.keys(project.projectJson.targets).reduce((acc: SimpleObject, target: string) => {
            const dependsOn = project.projectJson.targets[target].dependsOn;
            // TODO - type
            const dependencies = new Array();
            if (dependsOn) {
                dependsOn.map(dependent => {
                    if (dependent[0] === '^') {
                        // grab task dep for all project dependents
                        const taskFromProjects = dependent.slice(1);
                        // NOTE - list project:target, dont list command itself
                        const listOfProjectTargets = projects
                            .filter(tmpProject => tmpProject.packageJson.name !== project.packageJson.name)
                            .map(tmpProject => `${tmpProject.projectJson.id}:${taskFromProjects}`);
                        dependencies.push(...listOfProjectTargets)
                        
                    } else {
                        // grab task dep for this project
                        const taskFromThisProject = dependent
                        // NOTE - list project:target, dont list command itself
                        const projectTarget = `${project.projectJson.id}:${taskFromThisProject}`
                        dependencies.push(projectTarget)
                    }   
                });
            }
            acc[target] = {
                ...project.projectJson.targets[target],
                dependencies,
                inputs: calculateInputHash(project.projectJson.targets[target].inputs),
            };
            return acc;
        }, {})
        previousValue[project.projectJson.id] =  { targets }
        return previousValue;
    }, {})

    // console.log('project-c test deps', projectWithTaskDeps['project-c'].targets.test.dependencies)
    
    return projectWithTaskDeps
}

export function getProjects(currentPath: string): Projects {
    const rawItems = fs.readdirSync(currentPath);
    const items = rawItems.filter(folder => !['node_modules', '.git', 'nx'].includes(folder))
    const projects = new Array();
    for (const item of items) {
        const itemPath = path.join(currentPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            projects.push(processFolder(itemPath));
            getProjects(itemPath); // Recurse into subfolders
        }
    }
    return projects
}

function processFolder(folderPath: string): FolderContents {
    const packageJsonPath = path.join(folderPath, 'package.json');
    const projectJsonPath = path.join(folderPath, 'project.json');

    const packageJson = readJsonFile(packageJsonPath);
    const projectJson = readJsonFile(projectJsonPath);

    return {
        folderPath,
        projectJson,
        packageJson
    }
}

function readJsonFile(filePath: string): any {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error: any) {
        console.error(`Error reading ${filePath}: ${error.message}`);
        return null;
    }
}

// -------> OLD 2

// OLD FORMAT
// for each project
// projects.map(project => {
//     // for each target
//     Object.keys(project.projectJson.targets).map(target => {
        
//         const dependsOn = project.projectJson.targets[target].dependsOn;
        
//         // TODO - targetDefaults

//         // if target has dependents
//         if (dependsOn) {
//             // console.log('project with dependsOn', project.packageJson.name)
//             // for each dep
//             dependsOn.map(dependent => {
//                 if (dependent[0] === '^') {
//                     // grab task dep for all project dependents
//                     const taskFromProjects = dependent.slice(1);
//                     // console.log('taskFromProjects', taskFromProjects)
//                     const commandsToRun = projects
//                         .filter(tmpProject => tmpProject.packageJson.name !== project.packageJson.name)
//                         .map(tmpProject => ({
//                             command: tmpProject.projectJson.targets[taskFromProjects],
//                             project: tmpProject.projectJson.id
//                         }));
//                     // console.log('commandsToRun', commandsToRun)
                    
//                 } else {
//                     // grab task dep for this project
//                     const taskFromThisProject = dependent
//                     // console.log('taskFromThisProject', taskFromThisProject)
//                     const commandFromThisProject = project.projectJson.targets[taskFromThisProject]
//                     // console.log('commandFromThisProject', commandFromThisProject)
//                 }
                
//             });
//         }
//     })
// })

// -------> OLD

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

// export function transform (rawProjects, config) {

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
    
    // return rawProjects
// }