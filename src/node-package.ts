import { Failure, fold, Initialized, Pending, RemoteData, Success } from '@abraham/remotedata';
import { html, property, Seed, svg, TemplateResult } from '@nutmeg/seed';
import { Api } from './api';
import { FailureView } from './failure.view';
import { PendingView } from './pending.view';
import { DEFAULT_INSTALL_SOURCE, InstallSource, Pkg } from './pkg';
import { SuccessView } from './success.view';

interface SuccessData {
  pkg: Pkg,
  selectedTab: InstallSource,
}

type State = RemoteData<string, SuccessData>;

export class NodePackage extends Seed {
  @property({ type: Boolean }) public global: boolean = false;
  @property({ type: String }) public name?: string;

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
        /** Global */
        :host {
          width: 100%;
          border: 1px solid var(--node-package-background-color, #dadce0);
          border-radius: 8px;
          overflow: hidden;
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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

        /** Success */
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

        /** Pending */
        #pending {
          font-size: 24px;
        }

        /** Failure */
        #error {
          font-size: 24px;
        }
      </style>
    `;
  }

  public get logo(): TemplateResult {
    return svg`
      <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
        <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
        <polygon fill="#fff" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
        <path fill="#fff" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
        <polygon fill="#fff" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
      </svg>
    `;
  }

  private get header(): TemplateResult {
    if (this.name) {
      return html`
        <div id="header" class="row row-horizontal">
          <h1 class="item">
            <a href="https://npmjs.com/package/${this.name}" target="_blank" rel="noopener" title="Open ${this.name} on NPM">${this.name}</a>
          </h1>
          <span class="item">
            <a href="https://npmjs.com/package/${this.name}" target="_blank" rel="noopener" title="Open ${this.name} on NPM">${this.logo}</a>
          </span>
        </div>
      `;
    } else {
      return html`
        <div id="header" class="row row-horizontal">
          <span class="item"></span>
          <span class="item">
            ${this.logo}
          </span>
        </div>
      `;
    }
  }

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return html`
      <div id="content">
        ${this.header}
        ${this.view(this.state)}
      </div>
    `;
  }

  public set selectedTab(tab: InstallSource) {
    if (this.state instanceof Success) {
      this.state.data.selectedTab = tab;
    }
  }

  private pendingHandler(): TemplateResult {
    return new PendingView().content;
  }

  private initializedHandler(): TemplateResult {
    if (this.name) {
      this.fetchPackage();
      return this.pendingHandler()
    } else {
      return new FailureView('Missing required value "name"').content;
    }
  }

  private errorHandler(error: string): TemplateResult {
    if (this.updateData) { this.fetchPackage(); }
    return new FailureView(error).content;
  }

  private successHandler(data: SuccessData): TemplateResult {
    if (this.updateData) { this.fetchPackage(); }
    return new SuccessView(this, data.pkg, data.selectedTab).content;
  }

  private get view(): (state: State) => TemplateResult {
    return fold<TemplateResult, string, SuccessData>(
      () => this.initializedHandler(),
      () => this.pendingHandler(),
      (error: string) => this.errorHandler(error),
      (data: SuccessData) => this.successHandler(data),
    );
  }

  private async fetchPackage(): Promise<void> {
    if (this.name) {
      this.state = new Pending();
      try {
        const pkg = new Pkg(await this.api.fetch(this.name));
        this.state = new Success({ selectedTab: DEFAULT_INSTALL_SOURCE, pkg });
      } catch (error) {
        this.state = new Failure(error);
      }
      this.render();
    }
  }

  private get updateData(): boolean {
    return this.state instanceof Success && this.state.data.pkg.name !== this.name;
  }
}

window.customElements.define('node-package', NodePackage);
