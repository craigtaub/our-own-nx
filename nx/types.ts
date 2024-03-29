export interface TaskGraph {
    [key: string]: {
        targets: Targets
    }
}

type Targets = {
    [key: string]: Target
}
export interface Target {
    executor: string;
    options: {
        command?: string;
        codeCoverage?: boolean;
    };
    dependsOn?: string[];
    // optional but defaults
    inputs?: string[];
    // processed into object
    dependencies?: string[];
}

export type SimpleObject = { [key: string]: any }

interface ProjectConfig {
    id: string;
    targets: Targets;
}
interface PackageConfig {
    name: string;
    version: string;
    description: string;
    dependencies: any;
}
export interface FolderContents {
    folderPath: string;
    projectJson: ProjectConfig;
    packageJson: PackageConfig;
}

export type Projects = FolderContents[];

// NOT USED
// export interface ProjectDependencies {
//     name: string;
//     dependencies: string[];
// }