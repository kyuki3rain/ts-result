import { Result, Ok, Err, ResultOps } from './result-basic';
import { Some, None, Option } from './option';

declare module './result-basic' {
  interface ResultOps<T,E> {
    /**
     * Returns fn(val) if Ok, otherwise defaultValue if Err.
     * Equivalent to Rust's result.map_or.
     */
    mapOr<U>(defaultValue:U, fn:(val:T)=>U):U;

    /**
     * Returns fn(val) if Ok, otherwise errFn(err) if Err.
     * Equivalent to Rust's result.map_or_else.
     */
    mapOrElse<U>(errFn:(err:E)=>U, fn:(val:T)=>U):U;

    /**
     * If Ok, calls fn for side-effects and returns self; no change if Err.
     * Equivalent to Rust's result.inspect.
     */
    inspect(fn:(val:T)=>void):Result<T,E>;

    /**
     * If Err, calls fn for side-effects and returns self; no change if Ok.
     * Equivalent to Rust's result.inspect_err.
     */
    inspectErr(fn:(err:E)=>void):Result<T,E>;

    /**
     * Applies okFn if Ok, or errFn if Err, returning the result.
     * Equivalent to Rust's result.fold (or result.map_or_else with both functions).
     */
    fold<U>(okFn:(val:T)=>U, errFn:(err:E)=>U):U;

    /**
     * Maps both Ok and Err, equivalent to calling map and mapErr.
     * Equivalent to a combination of Rust's map and map_err, often called bimap in other libraries.
     */
    bimap<U,F>(okFn:(val:T)=>U, errFn:(err:E)=>F):Result<U,F>;

    /**
     * Flattens a nested Result: if T is itself a Result<U,E>, flatten turns Result<Result<U,E>,E> into Result<U,E>.
     * Equivalent to Rust's result.flatten.
     * 
     * NOTE: TypeScript cannot enforce T is Result<U,E> at type-level easily. 
     * It's the user's responsibility that T is a Result.
     */
    flatten<U>(this:ResultOps<Result<U,E>,E>):Result<U,E>;

    /**
     * Returns an Option<T>. If Ok, returns Some(value); if Err, returns None.
     * Equivalent to Rust's result.ok().
     */
    ok(): Option<T>;

    /**
     * Returns an Option<E>. If Err, returns Some(error); if Ok, returns None.
     * Equivalent to Rust's result.err().
     */
    err(): Option<E>;
  }
}

ResultOps.prototype.mapOr = function(defaultValue, fn) {
  return this.r.ok ? fn(this.r.value) : defaultValue;
};

ResultOps.prototype.mapOrElse = function(errFn, fn) {
  return this.r.ok ? fn(this.r.value) : errFn(this.r.error);
};

ResultOps.prototype.inspect = function(fn) {
  if (this.r.ok) fn(this.r.value);
  return this.r;
};

ResultOps.prototype.inspectErr = function(fn) {
  if (!this.r.ok) fn(this.r.error);
  return this.r;
};

ResultOps.prototype.fold = function(okFn, errFn) {
  return this.r.ok ? okFn(this.r.value) : errFn(this.r.error);
};

ResultOps.prototype.bimap = function(okFn, errFn) {
  return this.r.ok ? Ok(okFn(this.r.value)) : Err(errFn(this.r.error));
};

ResultOps.prototype.flatten = function() {
  if (!this.r.ok) return this.r;
  // Assume this.r.value is a Result<U,E>
  return this.r.value;
};

ResultOps.prototype.ok = function() {
  return this.r.ok ? Some(this.r.value) : None();
};

ResultOps.prototype.err = function() {
  return this.r.ok ? None() : Some(this.r.error);
};