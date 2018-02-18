import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { NodePackage } from '../src/node-package';

const TIMEOUT = 0;

describe('<node-package>', () => {
  let component: NodePackage;
  let stub: sinon.SinonStub;

  before(() => {
    const realFetch = window.fetch;
    stub = sinon.stub(window, 'fetch').callsFake((url: string) => {
      const localUrl = url.replace('https://unpkg.com/', './base/test/data/').replace('/package.json', '.json')
      return realFetch(localUrl);
    });
  });

  after(() => {
    stub.restore();
  });

  describe('valid package', () => {
    beforeEach(async () => {
      component = fixture('<node-package name="bluebird"></node-package>');
      await sleep(TIMEOUT);
    });

    describe('header', () => {
      it('renders the package name', () => {
        const links = component.$$('#header a') as NodeListOf<HTMLAnchorElement>;
        const name = links[0];
        expect(name.innerHTML).to.eq('bluebird');
        expect(name.href).to.eq('https://npmjs.com/package/bluebird');
      });

      it('renders the NPM logo', () => {
        const links = component.$$('#header a') as NodeListOf<HTMLAnchorElement>;
        const name = links[1];
        expect(name.href).to.eq('https://npmjs.com/package/bluebird');
        expect(name.querySelector('svg#logo')).to.exist;
      });
    });

    describe('description', () => {
      it('renders the package description', () => {
        const description = component.$('#description') as HTMLDivElement;
        expect(description.innerText).to
          .eq('Full featured Promises/A+ implementation with exceptionally good performance');
      });
    });

    describe('keywords', () => {
      it('link to NPM search', () => {
        const keywords = component.$$('#keywords a') as NodeListOf<HTMLAnchorElement>;
        expect(keywords.length).to.eq(13);
        expect(keywords[0].href).to.eq('https://www.npmjs.com/browse/keyword/promise');
        expect(keywords[0].innerText).to.eq('#promise');
      });

      describe('when a string', () => {
        beforeEach(async () => {
          component = fixture('<node-package name="lodash"></node-package>');
          await sleep(TIMEOUT);
        });

        it('link to NPM search', () => {
          const keywords = component.$$('#keywords a') as NodeListOf<HTMLAnchorElement>;
          expect(keywords.length).to.eq(3);
          expect(keywords[0].href).to.eq('https://www.npmjs.com/browse/keyword/modules');
          expect(keywords[0].innerText).to.eq('#modules');
        });
      });
    });

    describe('install', () => {
      it('renders the tabs', () => {
        const items = component.$$('#tabs .tab') as NodeListOf<HTMLAnchorElement>;
        expect(items.length).to.eq(3);
        expect(items[0].innerText).to.eq('NPM');
        expect(items[1].innerText).to.eq('GIT');
        expect(items[2].innerText).to.eq('UNPKG');
      });

      it('shows one command', () => {
        expect(component.$$('#install .command').length).to.eq(3);
        expect(component.$$('#install .command.hidden').length).to.eq(2);
      });

      function assertCommand(index: number, command: string) {
        let commands = component.$$('#install .command') as NodeListOf<HTMLInputElement>;
        let tabs = component.$$('#tabs .tab') as NodeListOf<HTMLAnchorElement>;
        for (var i = 0; i < tabs.length; i++) {
          if (i === index) {
            expect(commands[i].value).to.eq(command);
            expect(commands[i].classList.contains('hidden')).to.be.false;
            expect(tabs[i].classList.contains('selected')).to.be.true;
          } else {
          expect(commands[i].classList.contains('hidden')).to.be.true;
          expect(tabs[i].classList.contains('selected')).to.be.false;
          }
        }
      }

      it('changes command to match tab', async () => {
        let tabs = component.$$('#tabs .tab') as NodeListOf<HTMLAnchorElement>;
        assertCommand(0, 'npm install bluebird --save');
        tabs[1].click();
        await sleep(TIMEOUT);
        assertCommand(1, 'git clone git://github.com/petkaantonov/bluebird.git');
        tabs[2].click();
        await sleep(TIMEOUT);
        assertCommand(2, 'https://unpkg.com/bluebird/js/browser/bluebird.js');
      });

      describe('without web or git', () => {
        beforeEach(async () => {
          component = fixture('<node-package name="chalk"></node-package>');
          await sleep(TIMEOUT);
        });

        it('renders the tabs', () => {
          const items = component.$$('#tabs .tab') as NodeListOf<HTMLAnchorElement>;
          expect(items.length).to.eq(1);
          expect(items[0].innerText).to.eq('NPM');
        });
      });

      describe('copy command', () => {
        it('copies command', async () => {
          const copy = sinon.spy(document, 'execCommand');
          const input = component.$('#npm') as HTMLInputElement;
          component.$('#copy').click();
          expect(copy.called).to.be.true;
          expect(input.selectionStart).to.eq(0);
          expect(input.selectionEnd).to.eq(27);
          expect(component.$('#toast').classList.contains('copied')).to.be.true;
          await sleep(1000);
          expect(component.$('#toast').classList.contains('copied')).to.be.false;
        });
      });
    });

    describe('footer', () => {
      it('renders the details', () => {
        const items = component.$$('#footer .item') as NodeListOf<HTMLDivElement>;
        expect(items.length).to.eq(2);
        expect(items[0].innerText).to.eq('v3.5.1');
        expect(items[1].innerText).to.eq('MIT');
      });

      describe('with types', () => {
        beforeEach(async () => {
          component = fixture('<node-package name="chalk"></node-package>');
          await sleep(TIMEOUT);
        });

        it('renders types', () => {
          const items = component.$$('#footer .item') as NodeListOf<HTMLDivElement>;
          expect(items.length).to.eq(3);
          expect(items[1].innerText).to.eq('Includes types');
        });
      });
    });

    describe('theme', () => {
      describe('with default colors', () => {
        beforeEach(async () => {
          component = fixture('<node-package name="chalk"></node-package>');
          await sleep(TIMEOUT);
        });

        it('is pretty', () => {
          expect(getComputedStyle(component.$('#content')).backgroundColor).equal('rgb(250, 250, 250)');
          expect(getComputedStyle(component.$('#header')).color).equal('rgb(33, 33, 33)');
          expect(getComputedStyle(component.$('#description')).color).equal('rgb(33, 33, 33)');
          expect(getComputedStyle(component.$('#keywords .keyword')).color).equal('rgb(203, 56, 55)');
          expect(getComputedStyle(component.$('#tabs .tab')).backgroundColor).equal('rgb(250, 250, 250)');
          expect(getComputedStyle(component.$('#tabs .tab')).color).equal('rgb(203, 56, 55)');
          expect(getComputedStyle(component.$('#install .command')).backgroundColor).equal('rgb(224, 224, 224)');
          expect(getComputedStyle(component.$('#install .command')).color).equal('rgb(33, 33, 33)');
          expect(getComputedStyle(component.$('#footer')).color).equal('rgb(33, 33, 33)');
        });
      });

      describe('with custom colors', () => {
        beforeEach(async () => {
          component = fixture(`
            <div>
              <style>
                node-package.blue {
                  --node-package-background-color: #03A9F4;
                  --node-package-color: #FAFAFA;
                  --node-package-link-color: #EEEEEE;
                }
              </style>
              <node-package class="blue" name="bluebird"></node-package>
            </div>
          `).querySelector('node-package') as NodePackage;
          await sleep(TIMEOUT);
        });

        it('is pretty', () => {
          expect(getComputedStyle(component.$('#content')).backgroundColor).equal('rgb(3, 169, 244)');
          expect(getComputedStyle(component.$('#header')).color).equal('rgb(250, 250, 250)');
          expect(getComputedStyle(component.$('#description')).color).equal('rgb(250, 250, 250)');
          expect(getComputedStyle(component.$('#keywords .keyword')).color).equal('rgb(238, 238, 238)');
          expect(getComputedStyle(component.$('#tabs .tab')).backgroundColor).equal('rgb(3, 169, 244)');
          expect(getComputedStyle(component.$('#tabs .tab')).color).equal('rgb(238, 238, 238)');
          expect(getComputedStyle(component.$('#install .command')).backgroundColor).equal('rgb(250, 250, 250)');
          expect(getComputedStyle(component.$('#install .command')).color).equal('rgb(3, 169, 244)');
          expect(getComputedStyle(component.$('#footer')).color).equal('rgb(250, 250, 250)');
        });
      });
    });
  });

  describe('error', () => {
    beforeEach(async () => {
      stub.callsFake(() => {
        return new Response('Cannot find package 404@0.0.0', { status: 404 });
      });
      component = fixture('<node-package name="404"></node-package>');
      await sleep(TIMEOUT);
    });

    afterEach(() => {
      stub.restore();
    });

    it('renders error message', () => {
      expect(component.$('#error').innerText).to.eq('Cannot find package 404@0.0.0');
    });
  });
});

function fixture(tag: string): NodePackage {
  function fixtureContainer(): HTMLElement {
    let div = document.createElement('div');
    div.classList.add('fixture');
    return div;
  }
  let fixture = document.body.querySelector('.fixture') || document.body.appendChild(fixtureContainer());
  fixture.innerHTML = tag;
  return fixture.children[0] as NodePackage;
}

function sleep(ms: number): Promise<{}> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
