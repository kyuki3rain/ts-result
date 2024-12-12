import { Result,Ok,Err } from '../core/result-basic';

export function fromNullable<T,E>(val:T|null|undefined, err:E):Result<T,E> {
  return val == null ? Err(err) : Ok(val);
}

export function collect<T,E>(results:Result<T,E>[]):Result<T[],E> {
  const arr:T[] = [];
  for(const r of results) {
    if(!r.ok) return r;
    arr.push(r.value);
  }
  return Ok(arr);
}

export function partition<T,E>(results:Result<T,E>[]):[T[],E[]] {
  const oks:T[] = [];
  const errs:E[] = [];
  for(const r of results) {
    r.ok ? oks.push(r.value) : errs.push(r.error);
  }
  return [oks, errs];
}