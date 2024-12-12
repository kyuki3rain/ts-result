/**
 * Result<T,E> is a Rust-like result type.
 * - Ok<T> means success with a value of type T
 * - Err<E> means failure with an error of type E
 */
export type Result<T,E> = { ok:true; value:T } | { ok:false; error:E };

/**
 * Create an Ok result.
 */
export function Ok<T>(value:T):Result<T,never> {
  return { ok:true, value };
}

/**
 * Create an Err result.
 */
export function Err<E>(error:E):Result<never,E> {
  return { ok:false, error };
}

/**
 * ResultOps provides methods similar to Rust's Result methods.
 * Wrap a Result<T,E> with wrapResult to access these methods.
 */
export class ResultOps<T,E> {
  constructor(public r:Result<T,E>){}

  /**
   * Check if the result is Ok.
   */
  isOk():boolean { return this.r.ok; }

  /**
   * Check if the result is Err.
   */
  isErr():boolean { return !this.r.ok; }

  /**
   * Maps an Ok value using fn, leaving Err unchanged.
   * Equivalent to Rust's result.map.
   */
  map<U>(fn:(val:T)=>U):Result<U,E> {
    return this.r.ok ? Ok(fn(this.r.value)) : this.r;
  }

  /**
   * Maps an Err value using fn, leaving Ok unchanged.
   * Equivalent to Rust's result.map_err.
   */
  mapErr<F>(fn:(err:E)=>F):Result<T,F> {
    return this.r.ok ? this.r : Err(fn(this.r.error));
  }

  /**
   * Calls fn if Ok, otherwise returns Err as is.
   * Equivalent to Rust's result.and_then.
   */
  andThen<U>(fn:(val:T)=>Result<U,E>):Result<U,E> {
    return this.r.ok ? fn(this.r.value) : this.r;
  }

  /**
   * Calls fn if Err, otherwise returns Ok as is.
   * Equivalent to a reverse of andThen for error side (Rust's result.or_else).
   */
  orElse<F>(fn:(err:E)=>Result<T,F>):Result<T,F> {
    return this.r.ok ? this.r : fn(this.r.error);
  }

  /**
   * Unwraps the Ok value or throws the Err error.
   * Equivalent to Rust's result.unwrap (but throws in JS).
   */
  unwrap():T {
    if(this.r.ok) return this.r.value;
    throw this.r.error;
  }

  /**
   * Unwraps the Ok value or throws an Error with given message if Err.
   * Equivalent to Rust's result.expect.
   */
  expect(msg:string):T {
    if(this.r.ok) return this.r.value;
    throw new Error(`${msg}: ${String(this.r.error)}`);
  }

  /**
   * Returns the contained Ok value or a default.
   * Equivalent to Rust's result.unwrap_or.
   */
  unwrapOr(def:T):T {
    return this.r.ok ? this.r.value : def;
  }

  /**
   * Returns the contained Ok value or computes it from Err using fn.
   * Equivalent to Rust's result.unwrap_or_else.
   */
  unwrapOrElse(fn:(err:E)=>T):T {
    return this.r.ok ? this.r.value : fn(this.r.error);
  }
}

/**
 * Wrap a Result to use Rust-like methods (map, andThen, unwrap...).
 */
export function wrapResult<T,E>(r:Result<T,E>):ResultOps<T,E> {
  return new ResultOps(r);
}