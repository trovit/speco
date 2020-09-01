import s from "./speco";

describe("checking some data follows a spec", () => {  
  test("if it doesn't, it throws an exception explaining why not", () => {
    const objSpec = s.OBJ({req: {}});

    expect(() => s.check(objSpec, [])).toThrowError("error: [] is not a plain object");
  });
});