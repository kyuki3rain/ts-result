import { Result,Ok,Err,ResultOps } from './result-basic';

declare module './result-basic' {
  interface ResultOps<T,E> {
    mapOr<U>(defaultValue:U, fn:(val:T)=>U):U;
    mapOrElse<U>(errFn:(err:E)=>U, fn:(val:T)=>U):U;
    inspect(fn:(val:T)=>void):Result<T,E>;
    inspectErr(fn:(err:E)=>void):Result<T,E>;
    fold<U>(okFn:(val:T)=>U, errFn:(err:E)=>U):U;
    bimap<U,F>(okFn:(val:T)=>U, errFn:(err:E)=>F):Result<U,F>;
    flatten<U>(this:ResultOps<Result<U,E>,E>):Result<U,E>;
  }
}

ResultOps.prototype.mapOr = function(defaultValue, fn) {
  return this.r.ok ? fn(this.r.value) : defaultValue;
};

ResultOps.prototype.mapOrElse = function(errFn, fn) {
  return this.r.ok ? fn(this.r.value) : errFn(this.r.error);
};

ResultOps.prototype.inspect = function(fn) {
  if(this.r.ok) fn(this.r.value);
  return this.r;
};

ResultOps.prototype.inspectErr = function(fn) {
  if(!this.r.ok) fn(this.r.error);
  return this.r;
};

ResultOps.prototype.fold = function(okFn, errFn) {
  return this.r.ok ? okFn(this.r.value) : errFn(this.r.error);
};

ResultOps.prototype.bimap = function(okFn, errFn) {
  return this.r.ok ? Ok(okFn(this.r.value)) : Err(errFn(this.r.error));
};

ResultOps.prototype.flatten = function() {
  if(!this.r.ok) return this.r;
  return this.r.value;
};