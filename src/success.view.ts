import { html, svg, TemplateResult } from '@nutmeg/seed';
import { repeat } from 'lit-html/lib/repeat';
import { NodePackage } from './node-package';
import { InstallCommand, InstallSource, Pkg } from './pkg';

export class SuccessView {
  private selectedInstallCommand: InstallSource = 'npm';

  constructor(private component: NodePackage, private pkg: Pkg) {}

  private selectInstallCommand(event: MouseEvent, command: InstallCommand): void {
    event.preventDefault();
    this.selectedInstallCommand = command.id;
    this.component.render();
  }

  private copyInstallCommand(event: MouseEvent): void {
    event.preventDefault();
    (this.component.$('.command:not(.hidden)') as HTMLInputElement).select();
    document.execCommand('copy');
    this.component.$('#toast').classList.add('copied');
    setTimeout(() => {
      this.component.$('#toast').classList.remove('copied');
    }, 2750);
  }

  private keyword(keyword: string): TemplateResult {
    return html`
        <a href="https://www.npmjs.com/browse/keyword/${keyword}" target="_blank" rel="noopener" class="keyword">#${keyword}</a>
    `;
  }

  private get keywords(): TemplateResult {
    return html`
      <div id="keywords" class="row ellipsis">
        ${repeat(this.pkg.keywords, keyword => keyword, (keyword, _index) => this.keyword(keyword))}
      </div>
    `;
  }

  private get types(): TemplateResult {
    return html`
      <span class="item" title="${this.pkg.types}">Includes types</span>
    `;
  }

  private installTab(command: InstallCommand): TemplateResult {
    const classes = `item tab ${this.selectedInstallCommand === command.id ? 'selected' : ''}`;
    return html`
      <a class$="${classes}" href="#" on-click=${(event: MouseEvent) => this.selectInstallCommand(event, command)}>
        <label for$="${command.id}">
          ${command.id}
        </label>
      </a>
    `;
  }

  private installCommand(command: InstallCommand): TemplateResult {
    return html`
      <input id="${command.id}" class$="command fixed-width ellipsis item ${this.selectedInstallCommand !== command.id ? 'hidden' : ''}" readonly value$="${command.command}">
    `;
  }

  private get install(): TemplateResult {
    return html`
      <div id="install" class="row">
        <div id="tabs">
          ${repeat(this.pkg.installCommands(this.component.global), command => command.id, (command, _index) => this.installTab(command))}
        </div>
        <div id="commands" class="row-horizontal">
          ${repeat(this.pkg.installCommands(this.component.global), command => command.id, (command, _index) => this.installCommand(command))}
          <div class="item">
            <a id="copy" href="#" title="Copy command" on-click=${(event: MouseEvent) => this.copyInstallCommand(event)}>${this.copy}</a>
          </div>
        </div>
      </div>
    `;
  }

  private get footer(): TemplateResult {
    return html`
      <div id="footer" class="row row-horizontal">
        <span class="item">
          v${this.pkg.version}
        </span>
        ${this.pkg.types && this.types}
        <span class="item">
          ${this.pkg.license}
        </span>
      </div>
    `;
  }

  public get content(): TemplateResult {
    return html`
      <div id="description" class="row">
        ${this.pkg.description}
      </div>
      ${this.keywords}
      ${this.install}
      ${this.footer}
      <div id="toast-wrapper">
        <span id="toast">Copied to clipboard</span>
      </div>
    `;
  }

  public static get logo(): TemplateResult {
    return svg`
      <svg id="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="540px" height="210px" viewBox="0 0 18 7">
        <path fill="#CB3837" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
        <polygon fill="#fff" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
        <path fill="#fff" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
        <polygon fill="#fff" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
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
}
