import s from "./speco";

describe("explaining arrays according to specs", () => {  
  test("sth is an array", () => {
    const arraySpec = s.ARRAY();
    function Foo() {
      this.a = 1;
    }
 
    expect(s.explain(arraySpec, [])).toEqual("Ok");
    expect(s.explain(arraySpec, [1, 2])).toEqual("Ok");
    expect(s.explain(arraySpec, 1)).toEqual("error: 1 is not an array");
    expect(s.explain(arraySpec, "a")).toEqual("error: \"a\" is not an array");
    expect(s.explain(arraySpec, {})).toEqual("error: {} is not an array");
    expect(s.explain(arraySpec, new Foo())).toEqual("error: Foo{\"a\":1} is not an array");
  });

  test("specifying array elements", () => {
    const arraySpec = s.ARRAY(s.STRING, s.NUM, s.OBJ());
 
    expect(s.explain(arraySpec, ["a", 1, {}])).toEqual("Ok");
    expect(s.explain(arraySpec, ["a", 1])).toEqual("error: [\"a\",1] should have 3 elements");
    expect(s.explain(arraySpec, [1, 2, []])).toEqual("error: 1 fails spec.STRING, [] is not a plain object");
    expect(s.explain(arraySpec, [3, 1])).toEqual("error: [3,1] should have 3 elements, 3 fails spec.STRING");
  });

  test("specifying array with all elements of the same type", () => {
    const arraySpec = s.ARRAY_OF(s.STRING);
 
    expect(s.explain(arraySpec, ["a"])).toEqual("Ok");
    expect(s.explain(arraySpec, ["a", "b"])).toEqual("Ok");
    expect(s.explain(arraySpec, ["a", 1, {}])).toEqual("error: 1 fails spec.STRING, {} fails spec.STRING");
    expect(s.explain(arraySpec, [1, "l"])).toEqual("error: 1 fails spec.STRING");
  });

  test("composing not and array specs", () => {
    const arraySpec = s.ARRAY();
    
    expect(s.explain(s.not(arraySpec), [])).toEqual("error: [] fails not [spec.ARRAY([])]");
    expect(s.explain(s.not(arraySpec), 1)).toEqual("Ok");

    const otherArraySpec = s.ARRAY(s.STRING, s.NUM, s.OBJ({}));
    expect(s.explain(s.not(otherArraySpec), ["a", 1, {}])).toEqual("error: [\"a\",1,{}] fails not [spec.ARRAY([spec.STRING, spec.NUM, OBJ({})])]");
    expect(s.explain(s.not(otherArraySpec), ["a", 1])).toEqual("Ok");
  });
});

describe("validating arrays according to specs", () => {  
  test("sth is an array", () => {
    const arraySpec = s.ARRAY();
    function Foo() {
      this.a = 1;
    }
 
    expect(s.isValid(arraySpec, [])).toEqual(true);
    expect(s.isValid(arraySpec, [1, 2])).toEqual(true);
    expect(s.isValid(arraySpec, 1)).toEqual(false);
    expect(s.isValid(arraySpec, "a")).toEqual(false);
    expect(s.isValid(arraySpec, {})).toEqual(false);
    expect(s.isValid(arraySpec, () => {})).toEqual(false);
    expect(s.isValid(arraySpec, new Foo())).toEqual(false);
  });

  test("composing not and array specs", () => {
    const arraySpec = s.ARRAY();
    
    expect(s.isValid(s.not(arraySpec), [])).toEqual(false);
    expect(s.isValid(s.not(arraySpec), 1)).toEqual(true);
  });

  test("specifying array elements", () => {
    const arraySpec = s.ARRAY(s.STRING, s.NUM, s.OBJ({}));
 
    expect(s.isValid(arraySpec, ["a", 1, {}])).toEqual(true);
    expect(s.isValid(arraySpec, ["a", 1])).toEqual(false);
    expect(s.isValid(arraySpec, [1, 2, []])).toEqual(false);
    expect(s.isValid(arraySpec, [3, 1])).toEqual(false);
  });

  test("specifying array with all elements of the same type", () => {
    const arraySpec = s.ARRAY_OF(s.STRING);
 
    expect(s.isValid(arraySpec, ["a"])).toEqual(true);
    expect(s.isValid(arraySpec, ["a", "b"])).toEqual(true);
    expect(s.isValid(arraySpec, ["a", 1, {}])).toEqual(false);
    expect(s.isValid(arraySpec, [1, "l"])).toEqual(false);
  });
});