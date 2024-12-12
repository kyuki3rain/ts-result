import { Result,Ok,Err } from '../core/result-basic';

/**
 * mapAsync: if r is Ok, apply fn async and wrap the result; if Err, return Err.
 * Similar to map, but for async functions.
 */
export async function mapAsync<T,U,E>(
  r:Result<T,E>,
  fn:(val:T)=>Promise<U>
):Promise<Result<U,E>> {
  if(!r.ok) return r;
  try {
    const val = await fn(r.value);
    return Ok(val);
  } catch(e) {
    return Err(e as E);
  }
}

/**
 * andThenAsync: if Ok, apply fn returning a Result; if Err, return Err.
 * Async version of andThen.
 */
export async function andThenAsync<T,U,E>(
  r:Result<T,E>,
  fn:(val:T)=>Promise<Result<U,E>>
):Promise<Result<U,E>> {
  if(!r.ok) return r;
  return fn(r.value);
}

/**
 * orElseAsync: if Err, apply fn returning a Result<T,F>; if Ok, return Ok.
 * Async version of orElse.
 */
export async function orElseAsync<T,E,F>(
  r:Result<T,E>,
  fn:(err:E)=>Promise<Result<T,F>>
):Promise<Result<T,F>> {
  if(r.ok) return r;
  return fn(r.error);
}

/**
 * mapErrAsync: if Err, apply fn async to transform error; if Ok, return Ok.
 * Async version of mapErr.
 */
export async function mapErrAsync<T,E,F>(
  r:Result<T,E>,
  fn:(err:E)=>Promise<F>
):Promise<Result<T,F>> {
  if(r.ok) return r;
  try {
    const newErr = await fn(r.error);
    return Err(newErr);
  } catch(e) {
    return Err(e as F);
  }
}