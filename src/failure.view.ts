import { html, TemplateResult } from '@nutmeg/seed';

export class FailureView {
  constructor(private error: string) {}

  public get content(): TemplateResult {
    return html`
      <div id="error" class="row">
        ${this.error}
      </div>
    `;
  }
}
