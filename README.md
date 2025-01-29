[![npm](https://img.shields.io/npm/v/@smockle/regression.svg)](https://www.npmjs.com/package/@smockle/regression)
[![codecov](https://codecov.io/gh/smockle/regression/branch/main/graph/badge.svg)](https://codecov.io/gh/smockle/regression)

# regression

Estimate multiple linear regression fit using least squares.

## Installation

Run `npm install --save @smockle/regression` to add `regression` to your project.

## Usage

```JavaScript
import Regression from '@smockle/regression'
```

## API Reference

- [regression](#module_regression)
  - [Regression](#exp_module_regression--Regression) ⏏
    - [new Regression(X, Y)](#new_module_regression--Regression_new)
    - [.inspect()](#module_regression--Regression+inspect) ⇒ <code>string</code>

<a name="exp_module_regression--Regression"></a>

### Regression ⏏

**Kind**: Exported class  
<a name="new_module_regression--Regression_new"></a>

#### new Regression(X, Y)

Estimate multiple linear regression fit using least squares

**Returns**: <code>Regression</code> - Multiple linear regression

| Param | Type                | Description  |
| ----- | ------------------- | ------------ |
| X     | <code>Matrix</code> | Input matrix |
| Y     | <code>Matrix</code> | Input matrix |

<a name="module_regression--Regression+inspect"></a>

#### regression.inspect() ⇒ <code>string</code>

Format and print this regression

**Kind**: instance method of [<code>Regression</code>](#exp_module_regression--Regression)  
**Returns**: <code>string</code> - Regression results

## Testing

`regression` includes several unit tests. After cloning the `regression` repo locally, run `npm install` in the project folder to install dependencies. Run `npm test` to execute the tests.
