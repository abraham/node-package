enum Status {
  Initialized,
  Pending,
  Success,
  Error,
};

export class Api {
  private static readonly apiHost = 'https://unpkg.com/';

  public static async fetch(name: string): Promise<{}> {
    const response = await fetch(this.url(name));
    if (response.status === 200) {
      return response.json();
    } else {
      throw response.text();
    }
  }

  private static url(name: string): string {
    return `${this.apiHost}${name}/package.json`;
  }
}
