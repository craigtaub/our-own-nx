
import * as fs from 'fs';
import * as path from 'path';

interface FolderContents {
    folderPath: string;
    projectJson: string;
    packageJson: string;
}

export function getProjects(currentPath: string): FolderContents[] {
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