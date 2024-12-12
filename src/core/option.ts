export type Option<T> = { some:true; value:T } | { some:false };

export function Some<T>(value:T):Option<T> {
  return { some:true, value };
}

export function None<T=never>():Option<T> {
  return { some:false };
}

export class OptionOps<T> {
  constructor(public o:Option<T>){}

  isSome(): boolean { return this.o.some; }
  isNone(): boolean { return !this.o.some; }

  map<U>(fn:(val:T)=>U):Option<U> {
    return this.o.some ? Some(fn(this.o.value)) : None();
  }

  unwrap():T {
    if(this.o.some) return this.o.value;
    throw new Error("Called unwrap on a None value");
  }

  unwrapOr(def:T):T {
    return this.o.some ? this.o.value : def;
  }

  unwrapOrElse(fn:()=>T):T {
    return this.o.some ? this.o.value : fn();
  }

  mapOr<U>(defaultValue:U, fn:(val:T)=>U):U {
    return this.o.some ? fn(this.o.value) : defaultValue;
  }

  mapOrElse<U>(fnDefault:()=>U, fn:(val:T)=>U):U {
    return this.o.some ? fn(this.o.value) : fnDefault();
  }
}

export function wrapOption<T>(o:Option<T>):OptionOps<T> {
  return new OptionOps(o);
}