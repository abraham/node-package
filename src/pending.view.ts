import { html, TemplateResult } from '@nutmeg/seed';

export class PendingView {
  constructor() {}

  public get content(): TemplateResult {
    return html`
      <div id="pending" class="row">
        Loading...
      </div>
    `;
  }
}
