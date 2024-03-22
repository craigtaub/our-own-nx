interface Target {
    executor: string;
    options: {
        command?: string;
        codeCoverage?: boolean;
    };
    dependsOn?: string[];
}

export type SimpleObject = { [key: string]: any }
type Targets = {
    [key: string]: Target
}

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

export interface ProjectDependencies {
    name: string;
    dependencies: string[];
}