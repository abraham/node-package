import { Seed, Property, html, svg, TemplateResult } from '@nutmeg/seed';
import { until } from 'lit-html/lib/until';
import { repeat } from 'lit-html/lib/repeat';

import { InstallCommand, InstallSource, Package } from './package';

export class NodePackage extends Seed {
  @Property() public name: string = '';

  private readonly apiHost = 'https://unpkg.com/';
  private package: Package = new Package();
  private installCommand: InstallSource = 'npm';

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
          box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
          border-radius: 2px;
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
          background-color: var(--node-package-background-color, #FAFAFA);
          color: var(--node-package-color, #212121);
          display: flex;
          flex-direction: column;
        }

        #header { }

        #header a {
          color: var(--node-package-color, #212121);
          text-decoration: none;
        }

        #logo {
          height: 38px;
          width: auto;
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
          background-color: var(--node-package-color, #E0E0E0);
          color: var(--node-package-background-color, #212121);
        }

        #install svg {
          fill: var(--node-package-background-color, #212121);
        }

        .command {
          border: none;
          color: var(--node-package-background-color, #212121);
          background-color: var(--node-package-color, #E0E0E0);
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
          background-color: var(--node-package-background-color, #FAFAFA);
          padding: 12px 24px 8px 24px;
          color: var(--node-package-link-color, #CB3837);
          text-decoration: none;
          text-transform: uppercase;
          border-bottom: var(--node-package-color, #E0E0E0) solid 0;
          transition: border 100ms ease-in-out;
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
          border-radius: 20px;
          color: var(--node-package-background-color, #FFF);
          background-color: var(--node-package-color, #212121);
          transition: bottom 300ms ease-in-out;
        }

        #toast.copied {
          bottom: 34px;
          transition: bottom 300ms ease-in-out;
        }

      </style>
    `;
  }

  private get loadingTemplate(): TemplateResult {
    return html`
      <div id="loading" class="row">
        Loading...
      </div>
    `;
  }

  private get headerTemplate(): TemplateResult {
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
  }

  private keywordTemplate(keyword: string): TemplateResult {
    return html`
        <a href="https://www.npmjs.com/browse/keyword/${keyword}" target="_blank" rel="noopener" class="keyword">#${keyword}</a>
    `;
  }

  private get keywordsTemplate(): TemplateResult {
    return html`
      <div id="keywords" class="row ellipsis">
        ${repeat(this.package.keywords, keyword => keyword, (keyword, _index) => this.keywordTemplate(keyword))}
      </div>
    `;
  }

  private get typesTemplate(): TemplateResult {
    return html`
      <span class="item" title="${this.package.types}">Includes types</span>
    `;
  }

  private installTabTemplate(command: InstallCommand): TemplateResult {
    const classes = `item tab ${this.installCommand === command.id ? 'selected' : ''}`;
    return html`
      <a class$="${classes}" href="#" on-click=${(event: MouseEvent) => this.selectInstallCommand(event, command)}>${command.id}</a>
    `
  }

  private installCommandTemplate(command: InstallCommand): TemplateResult {
    return html`
      <input id="npm" class$="command fixed-width ellipsis item ${this.installCommand !== command.id ? 'hidden' : ''}" value$="${command.command}">
    `
  }

  private get installTemplate(): TemplateResult {
    return html`
      <div id="tabs" class="row">
        ${repeat(this.package.installCommands, command => command.id, (command, _index) => this.installTabTemplate(command))}
      </div>
      <div id="install" class="row row-horizontal">
        ${repeat(this.package.installCommands, command => command.id, (command, _index) => this.installCommandTemplate(command))}
        <div class="item">
          <a id="copy" href="#" title="Copy command" on-click=${(event: MouseEvent) => this.copyInstallCommand(event)}>${this.copy}</a>
        </div>
      </div>
    `;
  }

  private get footerTemplate(): TemplateResult {
    return html`
      <div id="footer" class="row row-horizontal">
        <span class="item">
          v${this.package.version}
        </span>
        ${this.package.types && this.typesTemplate}
        <span class="item">
          ${this.package.license}
        </span>
      </div>
    `;
  }

  private get contentTemplate(): TemplateResult {
    return html`
      <div id="description" class="row">
        ${this.package.description}
      </div>
      ${this.keywordsTemplate}
      ${this.installTemplate}
      ${this.footerTemplate}
      <div id="toast-wrapper">
        <span id="toast">Copied</span>
      </div>
    `;
  }

  private errorTemplate(error: string): TemplateResult {
    return html`
      <div id="error" class="row">
        ${error || 'Error getting pacakge details.'}
      </div>
    `;
  }

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return html`
      <div id="content">
        ${this.headerTemplate}
        ${until(this.fetchPackage().then(() => this.contentTemplate).catch((error: string) => this.errorTemplate(error)), this.loadingTemplate)}
      </div>
    `;
  }

  private get logo(): TemplateResult {
    return svg`
      <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
        <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
        <polygon fill="#FFFFFF" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
        <path fill="#FFFFFF" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
        <polygon fill="#FFFFFF" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
      </svg>
    `;
  }

  private get copy(): TemplateResult {
    return svg`
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
  }

  private async fetchPackage(): Promise<Package> {
    return this.shouldFetchPackage() ? this.fetchData().then(data => this.package = new Package(data)) : this.package;
  }

  private shouldFetchPackage(): boolean {
    return this.package.empty || this.package.name !== this.name;
  }

  private async fetchData(): Promise<string | {}> {
    const response = await fetch(`${this.apiHost}${this.name}/package.json`);
    if (response.status === 200) {
      return response.json();
    } else {
      throw response.text();
    }
  }

  private selectInstallCommand(event: MouseEvent, command: InstallCommand): void {
    event.preventDefault();
    this.installCommand = command.id;
    this.render();
  }

  private copyInstallCommand(event: MouseEvent): void {
    event.preventDefault();
    (this.$('.command:not(.hidden)') as HTMLInputElement).select();
    document.execCommand('copy');
    this.$('#toast').classList.add('copied');
    setTimeout(() => {
      this.$('#toast').classList.remove('copied');
    }, 1000);
  }

  private clearSelectedTabs(): void {
    Array.prototype.forEach.call(this.$$('.tab.selected'), (tab: HTMLElement) => tab.classList.remove('selected'));
  }
}

window.customElements.define('node-package', NodePackage);
