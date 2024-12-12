export type Result<T,E> = { ok:true; value:T } | { ok:false; error:E };

export function Ok<T>(value:T):Result<T,never> {
  return { ok:true, value };
}

export function Err<E>(error:E):Result<never,E> {
  return { ok:false, error };
}

export class ResultOps<T,E> {
  constructor(public r:Result<T,E>){}

  isOk():boolean { return this.r.ok; }
  isErr():boolean { return !this.r.ok; }

  map<U>(fn:(val:T)=>U):Result<U,E> {
    return this.r.ok ? Ok(fn(this.r.value)) : this.r;
  }

  mapErr<F>(fn:(err:E)=>F):Result<T,F> {
    return this.r.ok ? this.r : Err(fn(this.r.error));
  }

  andThen<U>(fn:(val:T)=>Result<U,E>):Result<U,E> {
    return this.r.ok ? fn(this.r.value) : this.r;
  }

  orElse<F>(fn:(err:E)=>Result<T,F>):Result<T,F> {
    return this.r.ok ? this.r : fn(this.r.error);
  }

  unwrap():T {
    if(this.r.ok) return this.r.value;
    throw this.r.error;
  }

  expect(msg:string):T {
    if(this.r.ok) return this.r.value;
    throw new Error(`${msg}: ${String(this.r.error)}`);
  }

  unwrapOr(def:T):T {
    return this.r.ok ? this.r.value : def;
  }

  unwrapOrElse(fn:(err:E)=>T):T {
    return this.r.ok ? this.r.value : fn(this.r.error);
  }
}

export function wrapResult<T,E>(r:Result<T,E>):ResultOps<T,E> {
  return new ResultOps(r);
}