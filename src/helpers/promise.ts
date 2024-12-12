import { Result,Ok,Err } from '../core/result-basic';

/**
 * fromPromise: convert a promise into Result, Ok if resolved, Err if rejected.
 * mapErr can customize error mapping.
 */
export async function fromPromise<T,E=unknown>(
  promise:Promise<T>, mapErr?:(e:unknown)=>E
):Promise<Result<T,E>> {
  try {
    const val = await promise;
    return Ok(val);
  } catch(e) {
    return Err(mapErr ? mapErr(e) : (e as E));
  }
}

/**
 * toPromise: convert Result into a Promise, Ok -> resolve, Err -> reject.
 */
export function toPromise<T,E>(r:Result<T,E>):Promise<T> {
  return r.ok ? Promise.resolve(r.value) : Promise.reject(r.error);
}

/**
 * asyncTryCatch: run async fn, capture exceptions as Err, optionally map them.
 * Similar to fromPromise but inline function call.
 */
export async function asyncTryCatch<T,E=Error>(
  fn:()=>Promise<T>, mapErr?:(e:unknown)=>E
):Promise<Result<T,E>> {
  try {
    const val = await fn();
    return Ok(val);
  } catch(e) {
    return Err(mapErr ? mapErr(e) : (e as E));
  }
}

/**
 * fromPromiseAll: await Promise.all, if success Ok(values), if any reject Err.
 */
export async function fromPromiseAll<T,E>(
  promises:Promise<T>[],
  mapErr?:(e:unknown)=>E
):Promise<Result<T[],E>> {
  try {
    const vals = await Promise.all(promises);
    return Ok(vals);
  } catch(e) {
    return Err(mapErr? mapErr(e) : (e as E));
  }
}