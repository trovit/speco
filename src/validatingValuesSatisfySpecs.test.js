import s from "./speco";

describe("validating values satisfy specs", ()=> {
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

  test("specifying any value", () => {
    expect(s.isValid(s.ANY, 3)).toEqual(true);
    expect(s.isValid(s.ANY, "hola")).toEqual(true);
    expect(s.isValid(s.ANY, {})).toEqual(true);
  });

  test("specifying a null value", () => {
    expect(s.isValid(s.NULL, 3)).toEqual(false);
    expect(s.isValid(s.NULL, null)).toEqual(true);
    expect(s.isValid(s.NULL, {})).toEqual(false);
  });

  test("specifying nullable value", () => {
    const nullableNumSpec = s.mayBe(s.NUM);
    expect(s.isValid(nullableNumSpec, 3)).toEqual(true);
    expect(s.isValid(nullableNumSpec, null)).toEqual(true);
    expect(s.isValid(nullableNumSpec, {})).toEqual(false);
  });
});