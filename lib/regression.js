const Matrix = require('@smockle/matrix')
const math = require('mathjs')
const fill = require('lodash/fill')
const unzip = require('lodash/unzip')

function Regression (X, Y) {
  const r = Object.create(Regression.prototype)
  r.n = X[0].length
  r.p = X.length
  r.X = Matrix([ fill(Array(r.n), 1) ].concat(X)).transpose()
  r.Y = Matrix(Y).transpose()

  r.B = Matrix.multiply(
    r.X.transpose().multiply(r.X).invert(),
    r.X.transpose().multiply(r.Y)
  )
  r.fitted = r.X.multiply(r.B).__value
  r.mean = math.mean(r.Y.__value)

  r.residuals = math.subtract(r.Y.__value, r.fitted)
  r.SST = r.Y.__value.reduce((xs, y, i) => xs + math.pow(y - r.mean, 2), 0)
  r.SSE = r.fitted.reduce((xs, _fitted) => xs + math.pow(_fitted[0] - r.mean, 2), 0)
  r.SSR = r.Y.__value.reduce((xs, y, i) => xs + math.pow(y[0] - r.fitted[i], 2), 0)
  r.Rsquared = r.SSE / r.SST
  r.Rsquaredadj = r.Rsquared - (1 - r.Rsquared) * (r.p - 1) / (r.n - r.p)
  r.stderr = math.sqrt(r.residuals.reduce((xs, residual) => xs + math.pow(residual[0], 2), 0) / (r.n - r.p - 1))

  r.MSE = math.sqrt(r.fitted.reduce((xs, _fitted, i) => xs + math.pow(_fitted[0] - r.Y.__value[i][0], 2), 0) / (r.n - 2))
  r.VAR = Matrix(math.multiply(r.MSE, r.X.transpose().multiply(r.X).invert().__value))
  r.STDERR = math.sqrt(math.diag(r.VAR.__value))
  r.TSTAT = r.STDERR.map((err, i) => r.B.__value[i] / err)
  return r
}

Regression.prototype.inspect = function () {
  var output = ''
  output += math.format(this.Rsquared, (x) => `R²: ${math.multiply(x, 100).toFixed(2)}%\n`)
  output += math.format(this.Rsquaredadj, (x) => `Adj R²: ${math.multiply(x, 100).toFixed(2)}%\n`)
  output += math.format(this.stderr, (x) => `Std Err: ${x.toFixed(2)}\n\n`)
  const labels = ['y'].concat(fill(Array(this.B.__value.length - 1), 'x'))
  unzip([ unzip(this.B.__value)[0], this.TSTAT ]).forEach((x, i) => {
    output += `${labels[i]}${labels[i] === 'y' ? '' : i}: ${math.format(x[0], { notation: 'fixed', precision: 2 })} (t-stat ${math.format(x[1], { notation: 'fixed', precision: 2 })})${i === this.B.__value.length - 1 ? '' : '\n'}`
  })
  return output
}

module.exports = Regression
