import { None, Some, Option } from '../core/option';
import { Result, Ok, Err } from '../core/result-basic';

/**
 * Applies fn to determine if elements should be included.
 * fn returns Result<boolean,E>. If Err occurs, stop and return that Err.
 * Otherwise, return Ok(filteredArray).
 */
export function tryFilter<T,E>(arr:T[], fn:(val:T)=>Result<boolean,E>):Result<T[],E> {
  const res:T[] = [];
  for (const item of arr) {
    const r = fn(item);
    if (!r.ok) return r;
    if (r.value) res.push(item);
  }
  return Ok(res);
}

/**
 * Searches for the first element matching a condition (fn returns Result<boolean,E>).
 * - If Err: return that Err immediately.
 * - If found: return Ok(Some(element))
 * - If none match: return Ok(None())
 */
export function tryFind<T,E>(arr:T[], fn:(val:T)=>Result<boolean,E>):Result<Option<T>,E> {
  for (const item of arr) {
    const r = fn(item);
    if (!r.ok) return r;
    if (r.value) return Ok(Some(item));
  }
  return Ok(None());
}

/**
 * Similar to Rust's "try_map" for arrays.
 * Applies fn to each element. If any fn call Err, stop and return that Err.
 * Otherwise, Ok(U[]).
 */
export function tryMap<T,U,E>(arr: T[], fn:(val:T)=>Result<U,E>):Result<U[],E> {
  const res:U[] = [];
  for (const item of arr) {
    const r = fn(item);
    if (!r.ok) return r;
    res.push(r.value);
  }
  return Ok(res);
}

/**
 * tryForEach: Similar to Rust's try_for_each.
 * If any call returns Err, stop and return that Err.
 * If all succeed, return Ok(void).
 */
export function tryForEach<T,E>(arr: T[], fn:(val:T)=>Result<void,E>):Result<void,E> {
  for (const item of arr) {
    const r = fn(item);
    if (!r.ok) return r;
  }
  return Ok(undefined);
}

/**
 * tryReduce: Similar to Rust's try_fold.
 * Fold over the array with a function returning Result<U,E>.
 * If any step Err, return that Err. Otherwise Ok(accumulated_value).
 */
export function tryReduce<T,U,E>(arr: T[], init:U, fn:(acc:U,val:T)=>Result<U,E>):Result<U,E> {
  let acc = init;
  for (const item of arr) {
    const r = fn(acc, item);
    if (!r.ok) return r;
    acc = r.value;
  }
  return Ok(acc);
}

// Async variants:

/**
 * Async version of tryFilter.
 */
export async function tryFilterAsync<T,E>(arr:T[], fn:(val:T)=>Promise<Result<boolean,E>>):Promise<Result<T[],E>> {
  const res:T[] = [];
  for (const item of arr) {
    const r = await fn(item);
    if (!r.ok) return r;
    if (r.value) res.push(item);
  }
  return Ok(res);
}

/**
 * Async version of tryFind.
 */
export async function tryFindAsync<T,E>(arr:T[], fn:(val:T)=>Promise<Result<boolean,E>>):Promise<Result<Option<T>,E>> {
  for (const item of arr) {
    const r = await fn(item);
    if (!r.ok) return r;
    if (r.value) return Ok(Some(item));
  }
  return Ok(None());
}

/**
 * Async version of tryMap.
 */
export async function tryMapAsync<T,U,E>(arr: T[], fn:(val:T)=>Promise<Result<U,E>>):Promise<Result<U[],E>> {
  const res:U[] = [];
  for (const item of arr) {
    const r = await fn(item);
    if (!r.ok) return r;
    res.push(r.value);
  }
  return Ok(res);
}

/**
 * Async version of tryForEach.
 */
export async function tryForEachAsync<T,E>(arr: T[], fn:(val:T)=>Promise<Result<void,E>>):Promise<Result<void,E>> {
  for (const item of arr) {
    const r = await fn(item);
    if (!r.ok) return r;
  }
  return Ok(undefined);
}

/**
 * Async version of tryReduce.
 */
export async function tryReduceAsync<T,U,E>(arr: T[], init:U, fn:(acc:U,val:T)=>Promise<Result<U,E>>):Promise<Result<U,E>> {
  let acc = init;
  for (const item of arr) {
    const r = await fn(acc, item);
    if (!r.ok) return r;
    acc = r.value;
  }
  return Ok(acc);
}