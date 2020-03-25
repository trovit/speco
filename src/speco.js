import isString from "lodash.isstring";
import isNumber from "lodash.isnumber";
import isPlainObject from "lodash.isplainobject";
import isObject from "lodash.isobject";

function format(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }
  if (isString(value)) {
    return "\"" + value + "\"";
  }
  if (isPlainObject(value)) {
    return JSON.stringify(value);
  }
  if (isObject(value)) {
    return value.constructor.name + JSON.stringify(value);
  }
  return value;
}

function formatErrors(errorsExplanation) {
  return errorsExplanation.join(", ").replace(/\[, /gi, "[").replace(/, \]/gi, "]");
}

function simpleErrors({check, describe, format}, formattedValue) {
  if(check()) {
    return [];
  } else {
    return [formattedValue + " fails " + describe()];
  }
}

function STRING(value){
  function describe() {
    return "spec.STRING";
  }

  const check = () => isString(value);
  
  return {
    check,
    describe,
    errors: () => simpleErrors({check, describe}, format(value))
  };
}

function NUM(value) {
  function describe() {
    return "spec.NUM";
  }

  const check = () => isNumber(value);
  
  return {
    check,
    describe,
    errors: () => simpleErrors({check, describe}, format(value))
  };
}

function pred(fn) {
  function describe() {
    return "spec.pred("+ fn.name + ")";
  }

  return (value) => {
    const check = () => fn(value);

    return {
      check,
      describe,
      errors: () => simpleErrors({check, describe}, format(value))
    };
  }
}

function not(spec) {  
  return function(value) {
    const check = () => !spec(value).check();

    function describe() {
      return "not [" + spec(value).describe() + "]";
    }

    return {
      check,
      describe,
      errors: () => simpleErrors({check, describe}, format(value))
    };
  };
}

function extractOnlyErrors(specs, value) {
  return specs.reduce(
    (acc, spec) => {
      if(!spec(value).check()) {
        acc = acc.concat(spec(value).errors());
      }
      return acc;
    }, 
    []
  );
}

function and(...specs) {
  return function(value) {
    const check = () => specs.every(
      (spec) => spec(value).check()
    );

    function describe() {
      return "and [" + specs.map(
        (spec) => spec(value).describe()
      ).join(", ") + "]";
    }

    function errors() {
      const errors = extractOnlyErrors(specs, value);
      if(errors.length > 0) {
        return ["and ["].concat(errors).concat(["]"]);
      }
      return errors;
    }

    return {
      check,
      describe,
      errors
    };
  };
}

function or(...specs) {
  return function(value) {
    const check = () => specs.some(
      (spec) => spec(value).check()
    );

    function describe() {
      return "or [" + specs.reduce(
        (acc, spec) => acc + spec(value).describe(),
        ""
      ) + "]";
    }

    function errors() {
      if(check()) {
        return [];
      }
      return ["or ["].concat(extractOnlyErrors(specs, value)).concat(["]"]);
    }

    return {
      check,
      describe,
      errors
    };
  };
}

function ANY() {
  return {
    check: () => true,
    describe: () => "spec.ANY",
    errors: () => []
  };
}

function OBJ({req, opt}) {
  return function(value) {
    function check() {
      return errors().length === 0;
    }

    function describeSpecs(ks) {
      if(!ks) {
        return "";
      }
      return Object.entries(ks).map(
        ([k, spec]) => {
          return k + ": " +  spec(value).describe();
        },
      ).join(", ");
    }

    function describe() {
      let description = "OBJ({";
      if(req) {
        description +=  "req: {" + describeSpecs(req) + "}";
        if(opt) {
          description += ", "
        }
      }
      if(opt) {
        description += "opt: {" + describeSpecs(opt) + "}"
      }
      description += "})";
      return description;
    }

    function noObjectErrors() {
      if(!isPlainObject(value)) {
        return [format(value) + " is not a plain object"];
      }
      return [];
    }

    function missingKeysErrors() {
      if(!req) {
        return [];
      }
      const missingKeys = Object.keys(req).reduce(
        (acc, requiredKey) => {
          if(!value.hasOwnProperty(requiredKey)) {
            acc.push(requiredKey);
          }
          return acc;
        },
        []
      );

      if(missingKeys.length > 0) {
        return [format(value) + " missing keywords (" + missingKeys.join(", ") + ")"];
      }

      return [];
    }

    function checkingSpecsErrors(objSpec) {
      if(!objSpec) {
        return [];
      }
      return Object.entries(objSpec).reduce(
        (acc, [k, spec]) => {
          if(!value.hasOwnProperty(k)) {
            return acc;
          }
          const keyValueErrors = spec(value[k]).errors();
          if (keyValueErrors.length > 0) {
            return acc.concat(["key " + k + " with value " + format(value[k]) + " failures -> " + formatErrors(keyValueErrors)]);
          } else {
            return acc;
          }
        },
        []
      );
    }

    function errors() {
      return [].concat(
        noObjectErrors()
      ).concat(
        missingKeysErrors()
      ).concat(
        checkingSpecsErrors(req)
      ).concat(
        checkingSpecsErrors(opt)
      );
    }

    return {
      check,
      describe,
      errors
    };
  }
}

function explain(spec, value) { 
  const errors = spec(value).errors();
  if (errors.length === 0) {
    return "Ok";
  }
  return "error: " + formatErrors(errors);
}

function isValid(spec, value) { 
  return spec(value).check();
}

export default {
  explain,
  STRING,
  NUM,
  ANY,
  OBJ,
  pred,
  not,
  and,
  or,
  isValid
}