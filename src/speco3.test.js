import s from "./speco3";
import isNumber from "lodash.isnumber";

describe("specs explanations", () => {
  test("explaining string specs", () => {
    expect(s.explain(s.STRING, 1)).toEqual("error: 1 fails spec.STRING");
    expect(s.explain(s.STRING, "1")).toEqual("Ok");
  });

  test("explaining number specs", () => {
    expect(s.explain(s.NUM, 1)).toEqual("Ok");
    expect(s.explain(s.NUM, "1")).toEqual("error: \"1\" fails spec.NUM");
  });

  test("explaining predicates specs defined with arrow functions", () => {
    const isEven = (n) => {return n%2 === 0;}
    const predicatesSpec = s.pred(isEven)

    expect(s.explain(predicatesSpec, 1)).toEqual("error: 1 fails spec.pred(isEven)");
    expect(s.explain(predicatesSpec, 2)).toEqual("Ok");
  });

  test("explaining predicates specs defined with old functions", () => {
    const isEven = function(n) {return n%2 === 0;}
    const predicatesSpec = s.pred(isEven)

    expect(s.explain(predicatesSpec, 1)).toEqual("error: 1 fails spec.pred(isEven)");
    expect(
      s.explain(s.pred(function koko(n) {return n%2 === 0;}), 1)
    ).toEqual("error: 1 fails spec.pred(koko)");
  });

  test("composing specs with not", () => {
    const negatedSpec = s.not(s.NUM);

    expect(s.explain(negatedSpec, "2")).toEqual("Ok");
    expect(s.explain(negatedSpec, 3)).toEqual("error: 3 fails not [spec.NUM]");
    expect(s.explain(negatedSpec, {})).toEqual("Ok");
    expect(s.explain(s.not(negatedSpec), 3)).toEqual("Ok");
  });  

  test("composing specs with and", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s.and(s.pred(isEven), s.NUM);

    expect(s.explain(composedSpec, "2")).toEqual("error: and [\"2\" fails spec.NUM]");
    expect(s.explain(composedSpec, 2)).toEqual("Ok");

    const multipleOfTen = (n) => n%10 === 0;
    const manyComposedSpec = s.and(
      s.pred(multipleOfTen),
      s.pred(isEven), 
      s.NUM
    );

    expect(s.explain(manyComposedSpec, "20")).toEqual("error: and [\"20\" fails spec.NUM]");
    expect(s.explain(manyComposedSpec, 2)).toEqual("error: and [2 fails spec.pred(multipleOfTen)]");
    expect(s.explain(manyComposedSpec, 20)).toEqual("Ok");
  
    const containsTwo = (n) => `${n}`.indexOf("2") >= 0;
    const otherManyComposedSpec = s.and(
      s.pred(multipleOfTen),
      s.pred(isEven), 
      s.and(s.NUM, s.pred(containsTwo))
    );

    expect(s.explain(otherManyComposedSpec, 20)).toEqual("Ok");
    expect(s.explain(otherManyComposedSpec, 30)).toEqual("error: and [and [30 fails spec.pred(containsTwo)]]");
    expect(s.explain(otherManyComposedSpec, 63)).toEqual("error: and [63 fails spec.pred(multipleOfTen), 63 fails spec.pred(isEven), and [63 fails spec.pred(containsTwo)]]");
  });

  test("composing specs with not and and", () => {
    const notString = s.not(s.STRING);
    const isEven = (n) => n%2 === 0;
    const andComposedSpec = s.and(
      notString,
      s.pred(isEven), 
    );

    expect(s.explain(andComposedSpec, 2)).toEqual("Ok");
    expect(s.explain(andComposedSpec, 3)).toEqual("error: and [3 fails spec.pred(isEven)]");
    expect(s.explain(andComposedSpec, "3")).toEqual("error: and [\"3\" fails not [spec.STRING], \"3\" fails spec.pred(isEven)]");
    expect(s.explain(andComposedSpec, "2")).toEqual("error: and [\"2\" fails not [spec.STRING]]"); // because isEven("2") => true ;)

    const negatedAndSpec = s.not(
      s.and(s.STRING, s.pred(isEven))
    );

    expect(s.explain(negatedAndSpec, 3)).toEqual("Ok");
    expect(s.explain(negatedAndSpec, 2)).toEqual("Ok");
    expect(s.explain(negatedAndSpec, "2")).toEqual("error: \"2\" fails not [and [spec.STRING, spec.pred(isEven)]]");
  });

  test("composing specs with or", () => {
    const isFive = (n) => n===5;
    const isEven = (n) => n%2 === 0;
    const composedSpec = s.or(
      s.and(
        s.NUM, 
        s.pred(isEven)
      ), 
      s.pred(isFive)
    );

    expect(s.explain(composedSpec, 2)).toEqual("Ok");
    expect(s.explain(composedSpec, "2")).toEqual("error: or [and [\"2\" fails spec.NUM], \"2\" fails spec.pred(isFive)]");
    expect(s.explain(composedSpec, 3)).toEqual("error: or [and [3 fails spec.pred(isEven)], 3 fails spec.pred(isFive)]");
    expect(s.explain(composedSpec, 5)).toEqual("Ok");
  });

  test("composing specs with not and or", () => {
    const notString = s.not(s.STRING);
    const isEven = (n) => n%2 === 0;
    const orComposedSpec = s.or(
      notString,
      s.pred(isEven), 
    );

    expect(s.explain(orComposedSpec, 2)).toEqual("Ok");
    expect(s.explain(orComposedSpec, 3)).toEqual("Ok");
    expect(s.explain(orComposedSpec, "3")).toEqual("error: or [\"3\" fails not [spec.STRING], \"3\" fails spec.pred(isEven)]");

    const negatedOrSpec = s.not(
      s.or(s.STRING, s.pred(isEven))
    );

    expect(s.explain(negatedOrSpec, 3)).toEqual("Ok");
    expect(s.explain(negatedOrSpec, 2)).toEqual("error: 2 fails not [or [spec.STRINGspec.pred(isEven)]]");
    expect(s.explain(negatedOrSpec, "2")).toEqual("error: \"2\" fails not [or [spec.STRINGspec.pred(isEven)]]");
  });
});

describe("specs validations", ()=> {
  test("validating strings", () => {
    expect(s.isValid(s.STRING, 1)).toEqual(false);
    expect(s.isValid(s.STRING, "1")).toEqual(true);
  });

  test("validating numbers", () => {
    expect(s.isValid(s.NUM, 1)).toEqual(true);
    expect(s.isValid(s.NUM, "1")).toEqual(false);
  });

  test("validating predicates", () => {
    const isEven = (n) => {return n%2 === 0;}
    const predicatesSpec = s.pred(isEven)

    expect(s.isValid(predicatesSpec, 1)).toEqual(false);
    expect(s.isValid(predicatesSpec, 2)).toEqual(true);
  });

  test("composing specs with not", () => {
    const negatedSpec = s.not(s.NUM);

    expect(s.isValid(negatedSpec, "2")).toEqual(true);
    expect(s.isValid(negatedSpec, 3)).toEqual(false);
    expect(s.isValid(negatedSpec, {})).toEqual(true);
    expect(s.isValid(s.not(negatedSpec), 3)).toEqual(true);
  });

  test("composing specs with and", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s.and(s.pred(isEven), s.NUM);

    expect(s.isValid(composedSpec, "2")).toEqual(false);
    expect(s.isValid(composedSpec, 2)).toEqual(true);

    const manyComposedSpec = s.and(
      s.pred((n) => n%10 === 0),
      s.pred(isEven), 
      s.NUM
    );

    expect(s.isValid(manyComposedSpec, "20")).toEqual(false);
    expect(s.isValid(manyComposedSpec, 2)).toEqual(false);
    expect(s.isValid(manyComposedSpec, 20)).toEqual(true);

    const otherManyComposedSpec = s.and(
      s.pred((n) => n%10 === 0),
      s.pred(isEven), 
      s.and(s.NUM,s.pred((n) => `${n}`.indexOf("2") >= 0))
    );

    expect(s.isValid(otherManyComposedSpec, 20)).toEqual(true);
    expect(s.isValid(otherManyComposedSpec, 30)).toEqual(false);
  });

  test("composing specs with or", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s.or(
      s.and(
        s.NUM, 
        s.pred(isEven)
      ), 
      s.pred((n) => n===5)
    );

    expect(s.isValid(composedSpec, "2")).toEqual(false);
    expect(s.isValid(composedSpec, 2)).toEqual(true);
    expect(s.isValid(composedSpec, 3)).toEqual(false);
    expect(s.isValid(composedSpec, 5)).toEqual(true);
  });

  test("composing specs with not and and", () => {
    const notString = s.not(s.STRING);
    const isEven = (n) => n%2 === 0;
    const andComposedSpec = s.and(
      notString,
      s.pred(isEven), 
    );

    expect(s.isValid(andComposedSpec, 2)).toEqual(true);
    expect(s.isValid(andComposedSpec, 3)).toEqual(false);
    expect(s.isValid(andComposedSpec, "3")).toEqual(false);
    expect(s.isValid(andComposedSpec, "2")).toEqual(false);

    const negatedAndSpec = s.not(
      s.and(s.STRING, s.pred(isEven))
    );

    expect(s.isValid(negatedAndSpec, 3)).toEqual(true);
    expect(s.isValid(negatedAndSpec, 2)).toEqual(true);
    expect(s.isValid(negatedAndSpec, "2")).toEqual(false);
  });

  test("composing specs with not and or", () => {
    const notString = s.not(s.STRING);
    const isEven = (n) => n%2 === 0;
    const orComposedSpec = s.or(
      notString,
      s.pred(isEven), 
    );

    expect(s.isValid(orComposedSpec, 2)).toEqual(true);
    expect(s.isValid(orComposedSpec, 3)).toEqual(true);
    expect(s.isValid(orComposedSpec, "3")).toEqual(false);

    const negatedOrSpec = s.not(
      s.or(s.STRING, s.pred(isEven))
    );

    expect(s.isValid(negatedOrSpec, 3)).toEqual(true);
    expect(s.isValid(negatedOrSpec, 2)).toEqual(false);
    expect(s.isValid(negatedOrSpec, "2")).toEqual(false);
  });
});

