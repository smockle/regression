/** @module regression */

import Matrix from "@smockle/matrix";
import { diag, format, mean, subtract } from "mathjs";
import { fill, unzip } from "lodash-es";

type Matrix1D = Extract<Matrix, { __value: number[] }>;
type Matrix2D = Extract<Matrix, { __value: number[][] }>;

type Regression = {
  /** n observations */
  n: number;
  /** p factor terms */
  p: number;
  /** X Matrix */
  X: Matrix2D;
  /** Y Matrix */
  Y: Matrix2D;
  /** β coefficients factor terms */
  B: Matrix2D;
  /** fitted Y values */
  fitted: number[][];
  /** mean Y value */
  mean: number;
  /** residual Y values */
  residuals: number[][];
  /** SST total sum of squares */
  SST: number;
  /** SSE explained sum of squares */
  SSE: number;
  /** SSR residual sum of squares */
  SSR: number;
  /** R² coefficient of determination */
  Rsquared: number;
  /** adjusted R² */
  Rsquaredadj: number;
  /** standard error of regression */
  stderr: number;
  /** MSE mean standard error */
  MSE: number;
  /** variance matrix */
  VAR: Matrix2D;
  /** standard error matrix (diagonal of variance) */
  STDERR: number[];
  /** test statistic (significance) */
  TSTAT: number[];
};

/**
 * Estimate multiple linear regression fit using least squares
 * @constructor
 * @alias module:regression
 * @param {number[][]} X - Input matrix
 * @param {number[]} Y - Input matrix
 * @return {Regression} Multiple linear regression
 */
function Regression(X: number[][], Y: number[]): Regression {
  const r: Regression = Object.create(Regression.prototype);
  r.n = X[0].length;
  r.p = X.length;
  r.X = Matrix([fill(Array(r.n), 1)].concat(X)).transpose();
  r.Y = Matrix(Y).transpose();

  r.B = Matrix.multiply(
    Matrix.multiply(r.X.transpose(), r.X).invert(),
    Matrix.multiply(r.X.transpose(), r.Y)
  );
  r.fitted = Matrix.multiply(r.X, r.B).__value;
  r.mean = mean<number>(r.Y.__value);

  r.residuals = subtract(r.Y.__value, r.fitted);
  r.SST = r.Y.__value.reduce(
    (xs: number, y: number[]) => xs + Math.pow(y[0] - r.mean, 2),
    0
  );
  r.SSE = r.fitted.reduce(
    (xs: number, _fitted: number[]) => xs + Math.pow(_fitted[0] - r.mean, 2),
    0
  );
  r.SSR = r.Y.__value.reduce(
    (xs: number, y: number[], i: number) =>
      xs + Math.pow(y[0] - r.fitted[i][0], 2),
    0
  );
  r.Rsquared = r.SSE / r.SST;
  r.Rsquaredadj = r.Rsquared - ((1 - r.Rsquared) * (r.p - 1)) / (r.n - r.p);
  r.stderr = Math.sqrt(
    r.residuals.reduce(
      (xs: number, residual: number[]) => xs + Math.pow(residual[0], 2),
      0
    ) /
      (r.n - r.p - 1)
  );

  r.MSE = Math.sqrt(
    r.fitted.reduce(
      (xs: number, _fitted: number[], i: number) =>
        xs + Math.pow(_fitted[0] - r.Y.__value[i][0], 2),
      0
    ) /
      (r.n - 2)
  );
  r.VAR = Matrix(
    Matrix.multiply(r.X.transpose(), r.X)
      .invert()
      .__value.map((x: number[]) => x.map((y: number) => y * r.MSE))
  );
  r.STDERR = Array.from(diag(r.VAR.__value) as unknown as number[]).map((x) =>
    Math.sqrt(x)
  );
  r.TSTAT = r.STDERR.map((err, i) => r.B.__value[i][0] / err);
  return r;
}

/**
 * Format and print this regression
 * @alias module:regression#inspect
 * @return {string} Regression results
 */
Regression.prototype[Symbol.for("nodejs.util.inspect.custom")] =
  function (): string {
    var output: string = "";
    output += format(
      this.Rsquared,
      (x: number) => `R²: ${(x * 100).toFixed(2)}%\n`
    );
    output += format(
      this.Rsquaredadj,
      (x: number) => `Adj R²: ${(x * 100).toFixed(2)}%\n`
    );
    output += format(this.stderr, (x) => `Std Err: ${x.toFixed(2)}\n\n`);
    const labels = ["y"].concat(fill(Array(this.B.__value.length - 1), "x"));
    unzip([unzip(this.B.__value)[0], this.TSTAT]).forEach((x, i) => {
      output += `${labels[i]}${labels[i] === "y" ? "" : i}: ${format(x[0], {
        notation: "fixed",
        precision: 2,
      })} (t-stat ${format(x[1], {
        notation: "fixed",
        precision: 2,
      })})${i === this.B.__value.length - 1 ? "" : "\n"}`;
    });
    return output;
  };

export default Regression;
