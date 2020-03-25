import s from "./speco";

describe("explaining objects according to specs", () => {
  
  test("only plain objects", () => {
    const objSpec = s.OBJ({req: {}});
    function Foo() {
      this.a = 1;
    }
 
    expect(s.explain(objSpec, {a: 1, b: 2})).toEqual("Ok");
    expect(s.explain(objSpec, [])).toEqual("error: [] is not a plain object");
    expect(s.explain(objSpec, 1)).toEqual("error: 1 is not a plain object");
    expect(s.explain(objSpec, "a")).toEqual("error: \"a\" is not a plain object");
    expect(s.explain(objSpec, new Foo())).toEqual("error: Foo{\"a\":1} is not a plain object");
  });

  test("required keys", () => {
    const objSpec = s.OBJ({req: {a: s.ANY, b: s.ANY}});

    expect(s.explain(objSpec, {a: 1, b: 2})).toEqual("Ok");
    expect(s.explain(objSpec, {a: 1})).toEqual("error: {\"a\":1} missing keywords (b)");
    expect(s.explain(objSpec, {})).toEqual("error: {} missing keywords (a, b)");
  });

  test("specifying values for required keys", () => {
    const objSpec = s.OBJ({req: {a: s.NUM, b: s.STRING}});

    expect(s.explain(objSpec, {a: 1, b: "lala"})).toEqual("Ok");
    expect(s.explain(objSpec, {a: 1, b: 2})).toEqual("error: key b with value 2 failures -> 2 fails spec.STRING");
    expect(s.explain(objSpec, {a: true, b: "koko"})).toEqual("error: key a with value true failures -> true fails spec.NUM");
  });  

  test("specifying values for optional keys", () => {
    const objSpec = s.OBJ({opt: {a: s.NUM, b: s.STRING}});

    expect(s.explain(objSpec, {a: 1, b: "lala"})).toEqual("Ok");
    expect(s.explain(objSpec, {a: 1})).toEqual("Ok");
    expect(s.explain(objSpec, {b: "lala"})).toEqual("Ok");
    expect(s.explain(objSpec, {a: 1, b: 2})).toEqual("error: key b with value 2 failures -> 2 fails spec.STRING");
    expect(s.explain(objSpec, {a: true, b: "koko"})).toEqual("error: key a with value true failures -> true fails spec.NUM");
  });

  test("specifying values of keys composing specs", () => {
    const isEven = (n) => n%2 === 0;
    const multipleOfTen = (n) => n%10 === 0;
    const containsTwo = (n) => `${n}`.indexOf("2") >= 0;
    const composedSpec = s.and(
      s.pred(multipleOfTen),
      s.pred(isEven), 
      s.and(s.NUM, s.pred(containsTwo))
    );
    const objSpec = s.OBJ({req: {a: composedSpec}});

    expect(s.explain(objSpec, {a: 1})).toEqual(
      "error: key a with value 1 failures -> and [1 fails spec.pred(multipleOfTen), 1 fails spec.pred(isEven), and [1 fails spec.pred(containsTwo)]]"
      );

    const anotherSpec = s.and(s.pred(isEven), s.STRING);
    expect(s.explain(
      s.OBJ({req: {a: composedSpec, b: anotherSpec}}), {a: 1, b: "3"})).toEqual(
      "error: key a with value 1 failures -> and [1 fails spec.pred(multipleOfTen), 1 fails spec.pred(isEven), and [1 fails spec.pred(containsTwo)]], key b with value \"3\" failures -> and [\"3\" fails spec.pred(isEven)]"
    );
  });

  test("specifying nested objects", () => {
    const isEven = (n) => n%2 === 0;
    const multipleOfTen = (n) => n%10 === 0;
    const containsTwo = (n) => `${n}`.indexOf("2") >= 0;
    const composedSpec = s.and(s.pred(isEven), s.STRING);
    const innerObjSpec = s.OBJ({req: {a: composedSpec}});
    const objSpec = s.OBJ({req: {x: innerObjSpec}});

    expect(s.explain(objSpec, {a: 1})).toEqual("error: {\"a\":1} missing keywords (x)");
    expect(s.explain(objSpec, {x: 1})).toEqual("error: key x with value 1 failures -> 1 is not a plain object, 1 missing keywords (a)");
    expect(s.explain(objSpec, {x: {b: 3}})).toEqual("error: key x with value {\"b\":3} failures -> {\"b\":3} missing keywords (a)");    
    expect(s.explain(objSpec, {x: {a: 2}})).toEqual("error: key x with value {\"a\":2} failures -> key a with value 2 failures -> and [2 fails spec.STRING]");
    expect(s.explain(objSpec, {x: {a: "2"}})).toEqual("Ok");
  });
});
