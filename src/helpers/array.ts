import { Result,Ok } from '../core/result-basic';

export function tryMap<T,U,E>(arr:T[], fn:(val:T)=>Result<U,E>):Result<U[],E> {
  const res:U[] = [];
  for(const item of arr) {
    const r = fn(item);
    if(!r.ok) return r;
    res.push(r.value);
  }
  return Ok(res);
}

// 他にもtryForEach, tryReduceなどを追加可能