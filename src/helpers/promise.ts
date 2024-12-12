import { Result,Ok,Err } from '../core/result-basic';

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

export function toPromise<T,E>(r:Result<T,E>):Promise<T> {
  return r.ok ? Promise.resolve(r.value) : Promise.reject(r.error);
}

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