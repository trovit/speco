import s from "./speco";

describe("checking some data follows a spec", () => {  
  test("if it doesn't, it throws an exception explaining why not", () => {
    const objSpec = s.OBJ({req: {}});
    expect(() => s.check(objSpec, [])).toThrowError("error: [] is not a plain object");

    const currencySpec = s.OBJ({ req: { code: s.STRING, symbol: s.STRING } });
    const configSpec = s.OBJ({
      req: {
        currencies: s.ARRAY_OF(currencySpec),
        sitesToPublish: s.ARRAY_OF(s.STRING),
      },
    });

    expect(
      () => s.check(
          configSpec,
          {
            currencies: [{ code: "CLP", symbol: "$" }, { code: "CLF", symbol: "UF" }]
          }
      )
    ).toThrowError("error: {\"currencies\":[{\"code\":\"CLP\",\"symbol\":\"$\"},{\"code\":\"CLF\",\"symbol\":\"UF\"}]} missing keywords (sitesToPublish)");

    expect(
      () => s.check(
          configSpec,
          {
            sitesToPublish: ["mitula", "dotProperty", "puntoPropiedad", "laEncontre"]
          }
      )
    ).toThrowError("error: {\"sitesToPublish\":[\"mitula\",\"dotProperty\",\"puntoPropiedad\",\"laEncontre\"]} missing keywords (currencies)");

    expect(
      () => s.check(
          configSpec,
          {
            currencies: [{ code: "CLP", symbol: "$" }, { code: "CLF", symbol: "UF" }],
            sitesToPublish: ["mitula", 3, "puntoPropiedad", "laEncontre"]
          }
      )
    ).toThrowError("error: key sitesToPublish with value [\"mitula\",3,\"puntoPropiedad\",\"laEncontre\"] failures -> 3 fails spec.STRING");

    expect(
      () => s.check(
          configSpec,
          {
            currencies: [{ code: "CLP", symbol: true }, { code: "CLF", symbol: "UF" }],
            sitesToPublish: ["mitula", "dotProperty", "puntoPropiedad", "laEncontre"]
          }
      )
    ).toThrowError("error: key currencies with value [{\"code\":\"CLP\",\"symbol\":true},{\"code\":\"CLF\",\"symbol\":\"UF\"}] failures -> key symbol with value true failures -> true fails spec.STRING");
  });
});
