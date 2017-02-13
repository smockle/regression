[![npm](https://img.shields.io/npm/v/@smockle/regression.svg)](https://www.npmjs.com/package/@smockle/regression)
[![Build Status](https://travis-ci.org/smockle/regression.svg?branch=master)](https://travis-ci.org/smockle/regression)
[![Build status](https://ci.appveyor.com/api/projects/status/x1sjhd5q1jv1eupd?svg=true)](https://ci.appveyor.com/project/smockle/regression)
[![Code Climate](https://codeclimate.com/github/smockle/regression/badges/gpa.svg)](https://codeclimate.com/github/smockle/regression)
[![Test Coverage](https://codeclimate.com/github/smockle/regression/badges/coverage.svg)](https://codeclimate.com/github/smockle/regression/coverage)
[![Coverage Status](https://coveralls.io/repos/github/smockle/regression/badge.svg?branch=master)](https://coveralls.io/github/smockle/regression?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/@smockle/regression/badge.svg)](https://snyk.io/test/npm/@smockle/regression)
[![Greenkeeper badge](https://badges.greenkeeper.io/smockle/regression.svg)](https://greenkeeper.io/)

# regression

Estimate multiple linear regression fit using least squares.

## Installation

Run `npm install --save @smockle/regression` to add `regression` to your project.

## Usage

```JavaScript
const regression = require('@smockle/regression')
```

## API Reference

* [regression](#module_regression)
    * [Regression](#exp_module_regression--Regression) ⏏
        * [new Regression(X, Y)](#new_module_regression--Regression_new)
        * [.inspect()](#module_regression--Regression+inspect) ⇒ <code>string</code>

<a name="exp_module_regression--Regression"></a>

### Regression ⏏
**Kind**: Exported class  
<a name="new_module_regression--Regression_new"></a>

#### new Regression(X, Y)
Estimate multiple linear regression fit using least squares

**Returns**: <code>Regression</code> - Multiple linear regression  

| Param | Type | Description |
| --- | --- | --- |
| X | <code>Matrix</code> | Input matrix |
| Y | <code>Matrix</code> | Input matrix |

<a name="module_regression--Regression+inspect"></a>

#### regression.inspect() ⇒ <code>string</code>
Format and print this regression

**Kind**: instance method of <code>[Regression](#exp_module_regression--Regression)</code>  
**Returns**: <code>string</code> - Regression results  

## Testing

`regression` includes several unit tests. After cloning the `regression` repo locally, run `npm install` in the project folder to install dependencies. Run `npm test` to execute the tests.
