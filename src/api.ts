enum Status {
  Initialized,
  Pending,
  Success,
  Error,
};

export class Api {
  private readonly apiHost = 'https://unpkg.com/';
  private status = Status.Initialized;
  private current!: Promise<{}>;

  public fetch(name: string): Promise<{}> {
    if (this.status !== Status.Pending) {
      this.current = this.actualFetch(name);
    }

    return this.current;
  }

  public async actualFetch(name: string): Promise<{}> {
    this.status = Status.Pending
    const response = await fetch(this.url(name));

    if (response.status === 200) {
      const data = await response.json();
      this.status = Status.Success;
      return data;
    } else {
      this.status = Status.Error;
      throw response.text();
    }
  }

  private url(name: string): string {
    return `${this.apiHost}${name}/package.json`;
  }
}
