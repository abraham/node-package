export type InstallSource = 'npm' | 'git' | 'unpkg';

export interface InstallCommand {
  command: string;
  id: InstallSource;
  selected: boolean;
}

export class Package {
  constructor(private data?: any) {
  }

  public get empty(): boolean {
    return !this.data;
  }

  public get description(): string {
    return this.data.description;
  }

  public get git(): string {
    return this.hasGit() ? this.data.repository.url : '';
  }

  public get keywords(): string[] {
    return this.dirtyKeywords.map(keyword => keyword.trim());
  }

  public get license(): string {
    return this.data.license;
  }

  public get installCommands(): InstallCommand[] {
    const commands: InstallCommand[] = [
      {
        command: `npm install ${this.name} --save`,
        id: 'npm',
        selected: true,
      }
    ];
    if (this.git) {
      commands.push({
        command: `git clone ${this.git}`,
        id: 'git',
        selected: false,
      });
    }
    if (this.unpkg) {
      commands.push({
        command: this.unpkg,
        id: 'unpkg',
        selected: false,
      });
    }
    return commands;
  }

  public get name(): string {
    return this.data.name;
  }

  public get types(): string {
    return this.data.types;
  }

  public get version(): string {
    return this.data.version;
  }

  public get unpkg(): string {
    return this.webpath ? new URL(`${this.name}/${this.webpath}`, 'https://unpkg.com/').href : '';
  }

  private hasGit(): boolean {
    return this.data.repository && this.data.repository.type === 'git';
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
    if (this.data.unpkg && typeof this.unpkg === 'string') {
      return this.data.unpkg;
    } else if (this.data.browser && typeof this.data.browser === 'string') {
      return this.data.browser;
    } else if (this.data.main && typeof this.data.main === 'string') {
      return this.data.main;
    } else {
      return '';
    }
  }
}
