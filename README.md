# @kyuki3rain/ts-result

A Rust-like `Result` and `Option` type implementation for TypeScript, along with a set of utilities for error handling, asynchronous operations, and more. This library aims to bring a familiar, functional-style error handling approach from Rust into the TypeScript ecosystem.

**Key Features**:
- **Rust-like `Result<T,E>`**: Use `Ok` and `Err` to represent success or failure.
- **Rust-like `Option<T>`**: Use `Some` and `None` to represent optional values.
- **Rich Utility Methods**: Methods like `map`, `andThen`, `mapErr`, `fold`, `bimap`, `flatten`, `tryMap`, `tryForEach`, `fromPromise`, `tryCatch`, and more.
- **Extensible Error Types**: Standardized `StdError` with `cause`, plus common patterns (`InvalidArgumentError`, `NotFoundError`, etc.).

## Installation

You can install this package using npm, yarn, or pnpm:

```bash
# npm
npm install @kyuki3rain/ts-result

# yarn
yarn add @kyuki3rain/ts-result

# pnpm
pnpm add @kyuki3rain/ts-result
```

## Basic Usage

Here is a simple example demonstrating basic operations:

```typescript
import { Ok, Err, fromPromise, Some, None } from '@kyuki3rain/ts-result';

// Using Result
const result = Ok(42)
  .map(x => x * 2)       // Ok(84)
  .fold(
    val => `Value: ${val}`,
    err => `Error: ${err}`
  );

console.log(result); // "Value: 84"

// Using fromPromise to handle async
async function fetchData() {
  const res = await fromPromise(fetch('https://example.com').then(r => r.text()));
  if (res.ok) {
    console.log("Fetched data:", res.value);
  } else {
    console.error("Fetch error:", res.error);
  }
}

// Using Option
function getOptionalValue(flag: boolean) {
  return flag ? Some("Hello") : None();
}

const opt = getOptionalValue(true)
  .map(str => str + " World")
  .unwrapOr("Default Value");

console.log(opt); // "Hello World"
```

## Documentation

For detailed documentation, usage patterns, and more examples, we plan to provide a GitHub Pages site or additional docs in the future.

## Contributing

Contributions are welcome! You can open issues for bugs or feature requests, and submit pull requests with improvements. Before contributing, please ensure:
- Code is well-formatted and linted.
- Tests (if applicable) run successfully.

## License

This project is licensed under the [MIT License](./LICENSE).

By using this library, you agree to the terms of the MIT license.