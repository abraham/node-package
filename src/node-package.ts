import { Failure, fold, Initialized, Pending, RemoteData, Success } from '@abraham/remotedata';
import { html, Property, Seed, TemplateResult } from '@nutmeg/seed';
import { Api } from './api';
import { Pkg } from './pkg';
import { SuccessView } from './success.view';

type State = RemoteData<SuccessView, string>;

export class NodePackage extends Seed {
  @Property() public global: boolean = false;
  @Property() public name?: string;

  private api = new Api();
  private state: State = new Initialized();

  constructor() {
    super();
  }

  /** The component instance has been inserted into the DOM. */
  public connectedCallback() {
    super.connectedCallback();
  }

  /** The component instance has been removed from the DOM. */
  public disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** Watch for changes to these attributes. */
  public static get observedAttributes(): string[] {
    return super.observedAttributes;
  }

  /** Rerender when the observed attributes change. */
  public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  /** Styling for the component. */
  public get styles(): TemplateResult {
    return html`
      <style>
        :host {
          width: 100%;
          border: 1px solid var(--node-package-background-color, #dadce0);
          border-radius: 8px;
          overflow: hidden;
        }

        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }

        .fixed-width {
          font-family: Consolas, Courier, Courier New, Lucida Console, Monaco;
        }

        .hidden {
          display: none;
        }

        .row-horizontal {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        #content {
          background-color: var(--node-package-background-color, #fff);
          color: var(--node-package-color, #202124);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 340px;
          overflow: hidden;
        }

        #header h1 {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        #header a {
          color: var(--node-package-color, #202124);
          text-decoration: none;
        }

        #logo {
          height: 38px;
          width: auto;
        }

        #description {
          max-height: 3em;
        }

        #keywords {
          margin-right: 8px;
        }

        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        #footer {}

        #install {
          padding: 0;
        }

        #commands {
          background-color: var(--node-package-color, #dadce0);
          color: var(--node-package-background-color, #202124);
          padding: 16px;
        }

        #commands input::selection {
          color: var(--node-package-color, #dadce0);
          background-color: var(--node-package-background-color, #202124);
        }

        #commands svg {
          fill: var(--node-package-background-color, #202124);
        }

        .command {
          border: none;
          color: var(--node-package-background-color, #202124);
          background-color: var(--node-package-color, #dadce0);
          width: 100%;
          height: 24px;
          font-size: 16px;
          outline: none;
          margin-right: 16px;
        }

        #tabs {
          padding: 0 0 0 16px;
          display: flex;
          flex-direction: row;
        }

        .tab {
          background-color: var(--node-package-background-color, #fff);
          padding: 12px 24px 8px 24px;
          color: var(--node-package-link-color, #CB3837);
          text-decoration: none;
          text-transform: uppercase;
          border-bottom: var(--node-package-color, #dadce0) solid 0;
          transition: border 100ms ease-in-out;
        }

        .tab label {
          cursor: pointer;
        }

        .tab.selected, .tab:hover {
          border-bottom-width: 3px;
          transition: border 100ms ease-in-out;
        }

        h1 {
          margin: 0;
        }

        .row {
          margin: 0;
          padding: 16px;
        }

        #keywords a {
          color: var(--node-package-link-color, #CB3837);
          text-decoration: none;
        }

        #keywords a:hover {
          text-decoration: underline;
        }

        #toast-wrapper {
          text-align: center;
          height: 0;
        }

        #toast {
          font-size: 12px;
          position: relative;
          bottom: -24px;
          padding: 8px 16px;
          border-radius: 24px;
          color: var(--node-package-background-color, #fff);
          background-color: var(--node-package-color, #202124);
          transition: bottom 300ms ease-in-out;
        }

        #toast.copied {
          bottom: 36px;
          transition: bottom 300ms ease-in-out;
        }

        #loading, #error {
          font-size: 24px;
        }
      </style>
    `;
  }

  private get header(): TemplateResult {
    return html`
      <div id="header" class="row row-horizontal">
        <h1 class="item">
          <a href="https://npmjs.com/package/${this.name}" target="_blank" rel="noopener" title="Open ${this.name} on NPM">${this.name}</a>
        </h1>
        <span class="item">
          <a href="https://npmjs.com/package/${this.name}" target="_blank" rel="noopener" title="Open ${this.name} on NPM">${SuccessView.logo}</a>
        </span>
      </div>
    `;
  }

  private get loading(): TemplateResult {
    return html`
      <div id="loading" class="row">
        Loading...
      </div>
    `;
  }

  private error(error: string): TemplateResult {
    return html`
      <div id="error" class="row">
        ${error || 'Error getting pacakge details.'}
      </div>
    `;
  }

  private get handler(): (state: State) => TemplateResult {
    return fold<TemplateResult, SuccessView, string>(
      () => {
        if (this.name) { this.fetchPackage(); }
        return this.loading
      },
      () => this.loading,
      (view: SuccessView) => {
        if (this.updateData) { this.fetchPackage(); }
        return view.content;
      },
      (error: string) => {
        if (this.updateData) { this.fetchPackage(); }
        return this.error(error)
      },
    );
  }

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return html`
      <div id="content">
        ${this.header}
        ${this.handler(this.state)}
      </div>
    `;
  }

  private async fetchPackage(): Promise<void> {
    if (this.name) {
      this.state = new Pending();
      try {
        const pkg = new Pkg(await this.api.fetch(this.name));
        this.state = new Success(new SuccessView(this, pkg));
      } catch (error) {
        this.state = new Failure(error);
      }
      this.render();
    }
  }

  private get updateData(): boolean {
    return this.state instanceof Success && this.state.data.name !== this.name;
  }
}

window.customElements.define('node-package', NodePackage);
