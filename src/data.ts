import { NodePackage } from './node-package';
import { Pkg } from './pkg';
import { SuccessView } from './success.view';

enum Statuses {
  Initiated,
  Pending,
  Success,
  Failure,
}

export class Initiated {
  public status = Statuses.Initiated;
}

export class Pending {
  public status = Statuses.Pending;
  constructor(public name: string) {};
}

export class Success {
  public status = Statuses.Success;
  public view: SuccessView;
  constructor(public name: string, public pkg: Pkg, parent: NodePackage) {
    this.view = new SuccessView(parent, pkg)
  };
}

export class Failure {
  public status = Statuses.Failure;
  constructor(public name: string, public error: string) {};
}

export type RemoteData = Pending | Initiated | Success | Failure;
