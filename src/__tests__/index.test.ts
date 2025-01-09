import { inspect } from "node:util";
import Matrix from "@smockle/matrix";
import { describe, test, expect } from "@jest/globals";
import { format } from "mathjs";
import Regression from "../index.js";

// VBR Return (Return-RF)
const RAR = [
  -3.299606018, 5.660926073, 1.300771693, -1.297986198, 1.370615722,
  -1.507395904, -0.946105019, -4.841277527, -3.586533681, 6.628808772,
  1.316931792, -4.898786803,
];

// Market (MKT-RF)
const MKT = [
  -3.11, 6.13, -1.12, 0.59, 1.36, -1.53, 1.54, -6.04, -3.07, 7.75, 0.56, -2.17,
];

// Size
const SMB = [
  -0.62, 0.47, 3.14, -3.03, 0.95, 2.84, -4.17, 0.43, -2.71, -1.86, 3.55, -2.99,
];

// Value
const HML = [
  -3.06, -2.16, -0.73, 2.13, -1.9, -1.04, -4.49, 2.88, 0.73, -0.32, -1.23,
  -2.07,
];

// Momentum
const UMD = [
  3.76, -2.88, 3.02, -7.41, 5.92, 3.05, 10.24, -2.16, 5.26, -3.92, 2.43, 3.38,
];

const r = Regression([MKT, SMB, HML, UMD], RAR);

describe("Regression", () => {
  test("n observations", () => {
    expect(r.n).toBe(12);
  });

  test("p factor terms", () => {
    expect(r.p).toBe(4);
  });

  test("X matrix", () => {
    expect(r.X).toStrictEqual(
      Matrix([
        [1, -3.11, -0.62, -3.06, 3.76],
        [1, 6.13, 0.47, -2.16, -2.88],
        [1, -1.12, 3.14, -0.73, 3.02],
        [1, 0.59, -3.03, 2.13, -7.41],
        [1, 1.36, 0.95, -1.9, 5.92],
        [1, -1.53, 2.84, -1.04, 3.05],
        [1, 1.54, -4.17, -4.49, 10.24],
        [1, -6.04, 0.43, 2.88, -2.16],
        [1, -3.07, -2.71, 0.73, 5.26],
        [1, 7.75, -1.86, -0.32, -3.92],
        [1, 0.56, 3.55, -1.23, 2.43],
        [1, -2.17, -2.99, -2.07, 3.38],
      ])
    );
  });

  test("Y matrix", () => {
    expect(r.Y).toStrictEqual(
      Matrix([
        [-3.299606018],
        [5.660926073],
        [1.300771693],
        [-1.297986198],
        [1.370615722],
        [-1.507395904],
        [-0.946105019],
        [-4.841277527],
        [-3.586533681],
        [6.628808772],
        [1.316931792],
        [-4.898786803],
      ])
    );
  });

  test("β coefficients factor terms", () => {
    expect(r.B.valueOf()).toStrictEqual([
      [expect.closeTo(-0.11570512587416651)],
      [expect.closeTo(0.9965414089434049)],
      [expect.closeTo(0.46406431951315674)],
      [expect.closeTo(0.29410972011067305)],
      [expect.closeTo(0.0758741075412841)],
    ]);
  });

  test("fitted Y values", () => {
    expect(r.fitted).toStrictEqual([
      [expect.closeTo(-4.117357884969744)],
      [expect.closeTo(5.3574095159621375)],
      [expect.closeTo(0.23977016847441873)],
      [expect.closeTo(-0.8696340157676041)],
      [expect.closeTo(1.5708185422604861)],
      [expect.closeTo(-0.3969288950543946)],
      [expect.closeTo(-1.0597813505453595)],
      [expect.closeTo(-5.25211965687211)],
      [expect.closeTo(-3.818903655863128)],
      [expect.closeTo(6.352789547145502)],
      [expect.closeTo(1.912405522995039)],
      [expect.closeTo(-4.018104935765246)],
    ]);
  });

  test("mean Y value", () => {
    expect(r.mean).toBeCloseTo(-0.3416364248333333);
  });

  test("residual Y values", () => {
    expect(r.residuals).toStrictEqual([
      [expect.closeTo(0.8177518669697439)],
      [expect.closeTo(0.3035165570378622)],
      [expect.closeTo(1.0610015245255813)],
      [expect.closeTo(-0.4283521822323959)],
      [expect.closeTo(-0.2002028202604862)],
      [expect.closeTo(-1.1104670089456055)],
      [expect.closeTo(0.1136763315453595)],
      [expect.closeTo(0.4108421298721101)],
      [expect.closeTo(0.23236997486312783)],
      [expect.closeTo(0.27601922485449837)],
      [expect.closeTo(-0.5954737309950389)],
      [expect.closeTo(-0.8806818672347543)],
    ]);
  });

  test("SST total sum of squares", () => {
    expect(r.SST).toBeCloseTo(155.93033742014742);
  });

  test("SSE explained sum of squares", () => {
    expect(r.SSE).toBeCloseTo(151.14498353223317);
  });

  test("SSR residual sum of squares", () => {
    expect(r.SSR).toBeCloseTo(4.785353887914211);
  });

  test("SST = SSE + SSR", () => {
    expect(format(r.SST, { notation: "fixed", precision: 8 })).toBe(
      format(r.SSE + r.SSR, { notation: "fixed", precision: 8 })
    );
  });

  test("R² coefficient of determination", () => {
    expect(r.Rsquared).toBeCloseTo(0.969310950216055);
  });

  test("adjusted R²", () => {
    expect(r.Rsquaredadj).toBeCloseTo(0.9578025565470756);
  });

  test("standard error of regression", () => {
    expect(r.stderr).toBeCloseTo(0.8268143588422642);
  });

  test("MSE mean standard error", () => {
    expect(r.MSE).toBeCloseTo(0.6917625234077234);
  });

  test("variance matrix", () => {
    expect(r.VAR.valueOf()).toStrictEqual([
      [
        expect.closeTo(0.07196948249766646),
        expect.closeTo(0.0025212277747416315),
        expect.closeTo(0.0025208085553061446),
        expect.closeTo(0.015445877772156624),
        expect.closeTo(0.00047794386911134755),
      ],
      [
        expect.closeTo(0.0025212277747416315),
        expect.closeTo(0.008540646610658573),
        expect.closeTo(0.0005674745970637586),
        expect.closeTo(0.01395071899820061),
        expect.closeTo(0.005872357927868933),
      ],
      [
        expect.closeTo(0.002520808555306144),
        expect.closeTo(0.0005674745970637586),
        expect.closeTo(0.009048264369132409),
        expect.closeTo(-0.00017904322635722093),
        expect.closeTo(0.00016540723502594728),
      ],
      [
        expect.closeTo(0.015445877772156624),
        expect.closeTo(0.01395071899820061),
        expect.closeTo(-0.00017904322635722077),
        expect.closeTo(0.04885262790234827),
        expect.closeTo(0.016993607738073208),
      ],
      [
        expect.closeTo(0.00047794386911134755),
        expect.closeTo(0.0058723579278689335),
        expect.closeTo(0.00016540723502594734),
        expect.closeTo(0.01699360773807321),
        expect.closeTo(0.008750503967407862),
      ],
    ]);
  });

  test("standard error matrix (diagonal of variance)", () => {
    expect(r.STDERR).toStrictEqual([
      expect.closeTo(0.26827128526487226),
      expect.closeTo(0.09241561886747593),
      expect.closeTo(0.09512236524147415),
      expect.closeTo(0.22102630590576378),
      expect.closeTo(0.09354412844966734),
    ]);
  });

  test("test statistic (significance)", () => {
    expect(r.TSTAT).toStrictEqual([
      expect.closeTo(-0.4312989582911469),
      expect.closeTo(10.783257431543538),
      expect.closeTo(4.878603663135374),
      expect.closeTo(1.3306548236664144),
      expect.closeTo(0.8111049704430051),
    ]);
  });
});

describe("Regression#inspect", () => {
  test("inspect regression", () => {
    expect(inspect(r)).toBe(
      "R²: 96.93%\nAdj R²: 95.78%\nStd Err: 0.83\n\ny: -0.12 (t-stat -0.43)\nx1: 1.00 (t-stat 10.78)\nx2: 0.46 (t-stat 4.88)\nx3: 0.29 (t-stat 1.33)\nx4: 0.08 (t-stat 0.81)"
    );
  });
});
