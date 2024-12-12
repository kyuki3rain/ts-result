import { Result,Ok,Err } from '../core/result-basic';

/**
 * tryCatch: run fn, if exception occurs, return Err, else Ok.
 * mapErr can transform the caught exception.
 */
export function tryCatch<T,E=Error>(fn:()=>T, mapErr?:(e:unknown)=>E):Result<T,E> {
  try {
    return Ok(fn());
  } catch(e) {
    return Err(mapErr ? mapErr(e) : (e as E));
  }
}