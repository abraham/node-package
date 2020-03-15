import { PackageData } from './pkg';

export class Api {
  private readonly apiHost = 'https://unpkg.com/';

  public async fetch(name: string): Promise<PackageData> {
    const response = await fetch(this.url(name));
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      throw await response.text();
    }
  }

  private url(name: string): string {
    return `${this.apiHost}${name}/package.json`;
  }
}
