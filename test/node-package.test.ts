import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { NodePackage } from '../src/node-package';

describe('<node-package>', () => {
  let component: NodePackage;

  describe('without properties', () => {
    beforeEach(() => {
      component = fixture('<node-package></node-package>');
    });

    it('renders default', () => {
      expect(component.$('.content').innerText).to.include('Welcome to <node-package>');
    });
  });

  
  describe('name', () => {
    beforeEach(() => {
      component = fixture('<node-package name="Pickle"></node-package>');
    });

    it('is rendered', () => {
      expect(component.$('.content').innerText).to.include('name: Pickle');
    });
  });


  describe('slot', () => {
    beforeEach(() => {
      component = fixture('<node-package>slot content</node-package>');
    });

    it('is rendered', () => {
      expect(component.innerText).equal('slot content');
    });
  });

  describe('--node-package-background-color', () => {
    describe('with default', () => {
      beforeEach(() => {
        component = fixture('<node-package></node-package>');
      });

      it('is set', () => {
        expect(getComputedStyle(component.$('.content')).backgroundColor).equal('rgb(250, 250, 250)');
      });
    });

    describe('with outside value', () => {
      beforeEach(() => {
        component = fixture(`
          <div>
            <style>
              node-package.blue {
                --node-package-background-color: #03A9F4;
              }
            </style>
            <node-package class="blue"></node-package>
          </div>
        `).querySelector('node-package') as NodePackage;
      });

      it('is set', () => {
        expect(getComputedStyle(component.$('.content')).backgroundColor).equal('rgb(3, 169, 244)');
      });
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
