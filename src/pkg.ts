export type InstallSource = 'npm' | 'git' | 'unpkg';

export const DEFAULT_INSTALL_SOURCE: InstallSource = 'npm';

export interface InstallCommand {
  command: string;
  id: InstallSource;
}

export class Pkg {
  constructor(private data: PackageData) {
  }

  public get description(): string {
    return this.data.description || '';
  }

  public get git(): string {
    if (typeof this.data.repository === 'object' && this.data.repository.type === 'git') {
      return this.data.repository.url;
    } else {
      return '';
    }
  }

  public get keywords(): string[] {
    return this.dirtyKeywords.map(keyword => keyword.trim());
  }

  public get license(): string {
    if (typeof this.data.license === 'string') {
      return this.data.license;
    } else {
      return '';
    }
  }

  public installCommands(global: boolean): InstallCommand[] {
    const commands: InstallCommand[] = [
      {
        command: `npm install ${this.name}${global ? ' --global' : ''}`,
        id: 'npm',
      }
    ];
    if (this.git) {
      commands.push({
        command: `git clone ${this.git}`,
        id: 'git',
      });
    }
    if (this.unpkg) {
      commands.push({
        command: `<script async src="${this.unpkg}"></script>`,
        id: 'unpkg',
      });
    }
    return commands;
  }

  public get name(): string {
    return this.data.name;
  }

  public get types(): string {
    return this.data.types || this.data.typings ||  '';
  }

  public get version(): string {
    return this.data.version;
  }

  public get unpkg(): string {
    return this.webpath ? new URL(`${this.name}/${this.webpath}`, 'https://unpkg.com/').href : '';
  }

  private get dirtyKeywords(): string[] {
    if (!this.data.keywords) {
      return [];
    }
    if (typeof this.data.keywords === 'string') {
      return this.data.keywords.split(',');
    }
    return this.data.keywords;
  }

  private get webpath(): string {
    if (!!this.data.unpkg) {
      return this.data.unpkg;
    } else if (!!this.data.browser) {
      return this.data.browser;
    } else if (!!this.data.main) {
      return this.data.main;
    } else if (!!this.data.webpack) {
      return this.data.webpack;
    } else {
      return '';
    }
  }
}

export interface PackageData {
  author?: string | PersonData;
  bin?: string | {[index: string]: string};
  bugs?: string | BugsData;
  bundledDependencies?: DependenciesData;
  config?: ConfigData;
  contributors?: Array<string | PersonData>;
  cpu?: string[];
  dependencies?: DependenciesData;
  description?: string;
  devDependencies?: DependenciesData;
  directories?: DirectoriesData;
  engines?: EnginesData;
  files?: string[];
  homepage?: string;
  keywords?: string[] | string;
  license?: string | DeprecatedLicenseData;
  main?: string;
  man?: string | string[];
  name: string;
  optionalDependencies?: DependenciesData;
  os?: string[];
  peerDependencies?: DependenciesData;
  private?: boolean;
  publishConfig?: ConfigData;
  repository?: string | RepositoryData;
  scripts?: {[index: string]: string};
  version: string;

  // Non-standard
  browser?: string;
  readmeFilename?: string;
  types?: string;
  typings?: string;
  unpkg?: string;
  webpack?: string;
}

export interface BugsData {
  url?: string;
  email?: string;
}

export interface DeprecatedLicenseData {
  type: string;
  url: string;
}

export interface PersonData {
  name: string;
  email?: string;
  url?: string;
}

export interface DirectoriesData {
  lib?: string;
  bin?: string;
  man?: string;
  doc?: string;
  example?: string;
  test?: string;
}

export interface RepositoryData {
  type: string;
  url: string;
}

export interface DependenciesData {
  [index: string]: string
}

export interface EnginesData {
  node: string;
  npm?: string;
}

export interface ConfigData {
  [index: string]: string;
}
