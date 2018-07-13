export class Initialized {}

export class Pending {}

export class Success<T> {
  constructor(public data: T) {}
}

export class Failure<E> {
  constructor(public error: E) {}
}

export type RemoteData<T, E> = Initialized | Pending | Success<T> | Failure<E>;
