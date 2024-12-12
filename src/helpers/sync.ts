import { Result,Ok,Err } from '../core/result-basic';

/**
 * fromNullable: if val is null or undefined, return Err(err), else Ok(val).
 * Similar to Rust's Option -> Result conversions, but here it's a direct helper.
 */
export function fromNullable<T,E>(val:T|null|undefined, err:E):Result<T,E> {
  return val == null ? Err(err) : Ok(val);
}

/**
 * collect: turns an array of Results into a Result of array if all Ok, else the first Err.
 * Equivalent to Rust's Result-based "try_collect" patterns.
 */
export function collect<T,E>(results:Result<T,E>[]):Result<T[],E> {
  const arr:T[] = [];
  for(const r of results) {
    if(!r.ok) return r;
    arr.push(r.value);
  }
  return Ok(arr);
}

/**
 * partition: separate an array of Results into [OkValues,ErrValues].
 * Rust often uses Iterator's partition for Options/Results; this is a direct analog.
 */
export function partition<T,E>(results:Result<T,E>[]):[T[],E[]] {
  const oks:T[] = [];
  const errs:E[] = [];
  for(const r of results) {
    r.ok ? oks.push(r.value) : errs.push(r.error);
  }
  return [oks, errs];
}