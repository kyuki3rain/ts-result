/**
 * A Rust-like Option type.
 * Some<T> means a value is present.
 * None means no value.
 */
export type Option<T> = { some:true; value:T } | { some:false };

/**
 * Create a Some value.
 */
export function Some<T>(value:T):Option<T> {
  return { some:true, value };
}

/**
 * Create a None value.
 */
export function None<T=never>():Option<T> {
  return { some:false };
}

/**
 * OptionOps provides Rust-like methods for Option<T>.
 * Basic methods (map, unwrap, unwrapOr, mapOr, etc.) are defined directly in OptionOps below.
 * Additional methods (andThen, inspect) are added via declaration merging.
 */
export class OptionOps<T> {
  constructor(public o:Option<T>){}

  /**
   * Returns true if this is Some.
   */
  isSome(): boolean { return this.o.some; }

  /**
   * Returns true if this is None.
   */
  isNone(): boolean { return !this.o.some; }

  /**
   * Maps a Some value using fn, or returns None if None.
   * Equivalent to Rust's option.map.
   */
  map<U>(fn:(val:T)=>U):Option<U> {
    return this.o.some ? Some(fn(this.o.value)) : None();
  }

  /**
   * Unwraps the Some value or throws an Error if None.
   * Equivalent to Rust's option.unwrap.
   */
  unwrap():T {
    if(this.o.some) return this.o.value;
    throw new Error("Called unwrap on a None value");
  }

  /**
   * Returns the contained value or a default if None.
   * Equivalent to Rust's option.unwrap_or.
   */
  unwrapOr(def:T):T {
    return this.o.some ? this.o.value : def;
  }

  /**
   * Returns the contained value or computes it from fn if None.
   * Equivalent to Rust's option.unwrap_or_else.
   */
  unwrapOrElse(fn:()=>T):T {
    return this.o.some ? this.o.value : fn();
  }

  /**
   * Returns fn(val) if Some, otherwise defaultValue if None.
   * Equivalent to Rust's option.map_or.
   */
  mapOr<U>(defaultValue:U, fn:(val:T)=>U):U {
    return this.o.some ? fn(this.o.value) : defaultValue;
  }

  /**
   * Returns fn(val) if Some, otherwise fnDefault() if None.
   * Equivalent to Rust's option.map_or_else.
   */
  mapOrElse<U>(fnDefault:()=>U, fn:(val:T)=>U):U {
    return this.o.some ? fn(this.o.value) : fnDefault();
  }
}

/**
 * Wrap an Option<T> to access Rust-like methods.
 */
export function wrapOption<T>(o:Option<T>):OptionOps<T> {
  return new OptionOps(o);
}

declare module './option' {
  interface OptionOps<T> {
    /**
     * If Some, calls fn and returns its result; if None, returns None.
     * Equivalent to Rust's option.and_then.
     */
    andThen<U>(fn:(val:T)=>Option<U>):Option<U>;

    /**
     * If Some, calls fn for side-effects and returns self; if None, returns None unchanged.
     * Equivalent to Rust's option.inspect.
     */
    inspect(fn:(val:T)=>void):Option<T>;
  }
}

OptionOps.prototype.andThen = function(fn) {
  return this.o.some ? fn(this.o.value) : None();
};

OptionOps.prototype.inspect = function(fn) {
  if (this.o.some) fn(this.o.value);
  return this.o;
};