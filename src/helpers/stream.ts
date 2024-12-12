import { Result,Ok,Err } from '../core/result-basic';

/**
 * mapAsyncIterable: transform each item with fn async, yield Ok or Err for each.
 * Rust doesn't have async streams by default, but this mimics similar patterns.
 */
export async function* mapAsyncIterable<T,U,E>(
  iterable:AsyncIterable<T>,
  fn:(item:T)=>Promise<U>,
  mapErr?:(e:unknown)=>E
):AsyncIterable<Result<U,E>> {
  for await (const item of iterable) {
    try {
      const val = await fn(item);
      yield Ok(val);
    } catch(e) {
      yield Err(mapErr ? mapErr(e) : (e as E));
    }
  }
}