
import * as fs from 'fs';
import * as path from 'path';

import { Projects, ProjectDependencies, FolderContents, SimpleObject } from './types'


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
                // this.project-c.prepare // this project
                // this.project-a.prepare
                // this.project-a.prepare
            // ]
export function processTaskDependencies(projects: Projects, projectDependencies: ProjectDependencies[]) {
    
    const projectWithTaskDeps = projects.reduce((previousValue: any, project: FolderContents, index: number, projects: Projects) => {
        const targets = Object.keys(project.projectJson.targets).reduce((acc: SimpleObject, target: string) => {
            const dependsOn = project.projectJson.targets[target].dependsOn;
            // TODO - type
            let dependencies: any = null;
            if (dependsOn) {
                dependsOn.map(dependent => {
                    if (dependent[0] === '^') {
                        // grab task dep for all project dependents
                        const taskFromProjects = dependent.slice(1);
                        // console.log('taskFromProjects', taskFromProjects)
                        const commandsToRun = projects
                            .filter(tmpProject => tmpProject.packageJson.name !== project.packageJson.name)
                            .map(tmpProject => ({
                                command: tmpProject.projectJson.targets[taskFromProjects],
                                project: tmpProject.projectJson.id
                            }));
                        dependencies = commandsToRun
                        // console.log('commandsToRun', commandsToRun)
                        
                    } else {
                        // grab task dep for this project
                        const taskFromThisProject = dependent
                        // console.log('taskFromThisProject', taskFromThisProject)
                        const commandFromThisProject = project.projectJson.targets[taskFromThisProject]
                        // console.log('commandFromThisProject', commandFromThisProject)
                        dependencies = commandFromThisProject
                    }   
                });
            }
            acc[target] = {
                ...project.projectJson.targets[target],
                dependencies,
            };
            return acc;
        }, {})
        previousValue[project.projectJson.id] =  { targets }
        return previousValue;
    }, {})

    // FIX THIS
    console.log('projectWithTaskDeps', projectWithTaskDeps['project-c'].targets.test.dependencies)

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
    
    return ''
}
export function processProjectDependencies(projects: Projects): ProjectDependencies[] {
    return projects.map(project => ({
        name: project.projectJson.id,
        dependencies: Object.keys(project.packageJson.dependencies)
    }))
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