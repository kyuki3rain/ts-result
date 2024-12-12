import { Result,Ok,Err } from '../core/result-basic';

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

export async function andThenAsync<T,U,E>(
  r:Result<T,E>,
  fn:(val:T)=>Promise<Result<U,E>>
):Promise<Result<U,E>> {
  if(!r.ok) return r;
  return fn(r.value);
}

export async function orElseAsync<T,E,F>(
  r:Result<T,E>,
  fn:(err:E)=>Promise<Result<T,F>>
):Promise<Result<T,F>> {
  if(r.ok) return r;
  return fn(r.error);
}

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