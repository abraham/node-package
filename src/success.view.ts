import { html, svg, TemplateResult } from '@nutmeg/seed';
import { repeat } from 'lit-html/directives/repeat';
import { NodePackage } from './node-package';
import { InstallCommand, InstallSource, Pkg } from './pkg';

export class SuccessView {
  constructor(private component: NodePackage, private pkg: Pkg, private selectedInstallCommand: InstallSource) {}

  public get name(): string {
    return this.pkg.name;
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

  private selectInstallCommand(event: MouseEvent, command: InstallCommand): void {
    event.preventDefault();
    this.component.selectedTab = command.id;
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
      <a class="${classes}" href="#" @click=${(event: MouseEvent) => this.selectInstallCommand(event, command)}>
        <label for="${command.id}">
          ${command.id}
        </label>
      </a>
    `;
  }

  private installCommand(command: InstallCommand): TemplateResult {
    return html`
      <input id="${command.id}" class="command fixed-width ellipsis item ${this.selectedInstallCommand !== command.id ? 'hidden' : ''}" readonly value="${command.command}">
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
            <a id="copy" href="#" title="Copy command" @click=${(event: MouseEvent) => this.copyInstallCommand(event)}>${this.copy}</a>
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

  private get copy(): TemplateResult {
    return svg`
      <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
      </svg>
    `;
  }
}
