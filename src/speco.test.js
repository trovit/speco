import s from "./speco";
import s2 from "./speco2";
import isNumber from "lodash.isnumber";

describe("specs explanations", () => {
  test("explaining string specs", () => {
    expect("fail: 1 no spec.STRING").toEqual(s2.explain(s2.STRING, 1));
    expect("Ok").toEqual(s2.explain(s2.STRING, "1"));
  });

  test("explaining number specs", () => {
    expect("Ok").toEqual(s2.explain(s2.NUM, 1));
    expect("fail: '1' no spec.NUM").toEqual(s2.explain(s2.NUM, "1"));
  });

  test("explaining predicates specs defined with arrow functions", () => {
    const isEven = (n) => {return n%2 === 0;}
    const predicatesSpec = s2.pred(isEven)

    expect("fail: 1 no spec.pred(isEven)").toEqual(s2.explain(predicatesSpec, 1));
    expect("Ok").toEqual(s2.explain(predicatesSpec, 2));
  });

  test("explaining predicates specs defined with old functions", () => {
    const isEven = function(n) {return n%2 === 0;}
    const predicatesSpec = s2.pred(isEven)

    expect("fail: 1 no spec.pred(isEven)").toEqual(s2.explain(predicatesSpec, 1));
    expect("fail: 1 no spec.pred(koko)").toEqual(
      s2.explain(
        s2.pred(function koko(n) {return n%2 === 0;}), 
        1
      )
    );
  });

  test("composing specs with and", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s2.and(s2.pred(isEven), s2.NUM);

    expect(s2.explain(composedSpec, "2")).toEqual("fail: and ['2' no spec.NUM]");
    expect(s2.explain(composedSpec, 2)).toEqual("Ok");

    const multipleOfTen = (n) => n%10 === 0;
    const manyComposedSpec = s2.and(
      s2.pred(multipleOfTen),
      s2.pred(isEven), 
      s2.NUM
    );

    expect(s2.explain(manyComposedSpec, "20")).toEqual("fail: and ['20' no spec.NUM]");
    expect(s2.explain(manyComposedSpec, 2)).toEqual("fail: and [2 no spec.pred(multipleOfTen)]");
    expect(s2.explain(manyComposedSpec, 20)).toEqual("Ok");
  
    const containsTwo = (n) => `${n}`.indexOf("2") >= 0;
    const otherManyComposedSpec = s2.and(
      s2.pred(multipleOfTen),
      s2.pred(isEven), 
      s2.and(s2.NUM, s2.pred(containsTwo))
    );

    expect(s2.explain(otherManyComposedSpec, 20)).toEqual("Ok");
    expect(s2.explain(otherManyComposedSpec, 30)).toEqual("fail: and [and [30 no spec.pred(containsTwo)]]");
    expect(s2.explain(otherManyComposedSpec, 63)).toEqual("fail: and [63 no spec.pred(multipleOfTen), 63 no spec.pred(isEven), and [63 no spec.pred(containsTwo)]]");
  });

  test("composing specs with or", () => {
    const isFive = (n) => n===5;
    const isEven = (n) => n%2 === 0;
    const composedSpec = s2.or(
      s2.and(
        s2.NUM, 
        s2.pred(isEven)
      ), 
      s2.pred(isFive)
    );

    expect(s2.explain(composedSpec, 2)).toEqual("Ok");
    expect(s2.explain(composedSpec, "2")).toEqual("fail: or [and ['2' no spec.NUM], 2 no spec.pred(isFive)]");
    expect(s2.explain(composedSpec, 3)).toEqual("fail: or [and [3 no spec.pred(isEven)], 3 no spec.pred(isFive)]");
    expect(s2.explain(composedSpec, 5)).toEqual("Ok");
  });

  xtest("composing specs with not", () => {
    const negatedSpec = s.not(s.NUM);

    expect(s.explain(negatedSpec, "2")).toEqual("Ok");
    expect(s.explain(negatedSpec, 3)).toEqual("fail: not [3 no spec.NUM]");
    expect(s.explain(negatedSpec, {})).toEqual("Ok");
  });  

});

describe("specs validations", ()=> {
  test("validating strings", () => {
    expect(false).toEqual(s2.isValid(s2.STRING, 1));
    expect(true).toEqual(s2.isValid(s2.STRING, "1"));
  });

  test("validating numbers", () => {
    expect(true).toEqual(s2.isValid(s2.NUM, 1));
    expect(false).toEqual(s2.isValid(s2.NUM, "1"));
  });

  test("validating predicates", () => {
    const isEven = (n) => {return n%2 === 0;}
    const predicatesSpec = s2.pred(isEven)

    expect(false).toEqual(s2.isValid(predicatesSpec, 1));
    expect(true).toEqual(s2.isValid(predicatesSpec, 2));
  });

  test("composing specs with and", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s2.and(s2.pred(isEven), s2.NUM);

    expect(false).toEqual(s2.isValid(composedSpec, "2"));
    expect(true).toEqual(s2.isValid(composedSpec, 2));

    const manyComposedSpec = s2.and(
      s2.pred((n) => n%10 === 0),
      s2.pred(isEven), 
      s2.NUM
    );

    expect(s2.isValid(manyComposedSpec, "20")).toEqual(false);
    expect(s2.isValid(manyComposedSpec, 2)).toEqual(false);
    expect(s2.isValid(manyComposedSpec, 20)).toEqual(true);

    const otherManyComposedSpec = s2.and(
      s2.pred((n) => n%10 === 0),
      s2.pred(isEven), 
      s2.and(s2.NUM,s2.pred((n) => `${n}`.indexOf("2") >= 0))
    );

    expect(s2.isValid(otherManyComposedSpec, 20)).toEqual(true);
    expect(s2.isValid(otherManyComposedSpec, 30)).toEqual(false);
  });

  test("composing specs with or", () => {
    const isEven = (n) => n%2 === 0;
    const composedSpec = s2.or(
      s2.and(
        s2.NUM, 
        s2.pred(isEven)
      ), 
      s2.pred((n) => n===5)
    );

    expect(false).toEqual(s2.isValid(composedSpec, "2"));
    expect(true).toEqual(s2.isValid(composedSpec, 2));
    expect(false).toEqual(s2.isValid(composedSpec, 3));
    expect(true).toEqual(s2.isValid(composedSpec, 5));
  });

  // test("composing specs with not", () => {
  //   const negatedSpec = s2.not(s2.NUM);

  //   expect(true).toEqual(s2.isValid(negatedSpec, "2"));
  //   expect(false).toEqual(s2.isValid(negatedSpec, 3));
  //   expect(true).toEqual(s2.isValid(negatedSpec, {}));
  // });
});

