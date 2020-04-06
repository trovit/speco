import s from "./speco";

describe("explaining arrays according to specs", () => {  
  test("sth is an array", () => {
    const arraySpec = s.ARRAY();
    function Foo() {
      this.a = 1;
    }
 
    expect(s.explain(arraySpec, [])).toEqual("Ok");
    expect(s.explain(arraySpec, [1, 2])).toEqual("Ok");
    expect(s.explain(arraySpec, 1)).toEqual("error: 1 fails spec.ARRAY");
    expect(s.explain(arraySpec, "a")).toEqual("error: \"a\" fails spec.ARRAY");
    expect(s.explain(arraySpec, {})).toEqual("error: {} fails spec.ARRAY");
    expect(s.explain(arraySpec, new Foo())).toEqual("error: Foo{\"a\":1} fails spec.ARRAY");
  });

  test("composing not and array specs", () => {
    const arraySpec = s.ARRAY();
    
    expect(s.explain(s.not(arraySpec), [])).toEqual("error: [] fails not [spec.ARRAY]");
    expect(s.explain(s.not(arraySpec), 1)).toEqual("Ok");
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
    expect(s.isValid(arraySpec, new Foo())).toEqual(false);
  });

  test("composing not and array specs", () => {
    const arraySpec = s.ARRAY();
    
    expect(s.isValid(s.not(arraySpec), [])).toEqual(false);
    expect(s.isValid(s.not(arraySpec), 1)).toEqual(true);
  });
});