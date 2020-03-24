import isString from "lodash.isstring";
import isNumber from "lodash.isnumber";

function format(value) {
  if (isString(value)) {
    return "\"" + value + "\"";
  }
  return value;
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

function explain(spec, value) { 
  const errors = spec(value).errors();
  if (errors.length === 0) {
    return "Ok";
  }
  return "error: " + errors.join(", ").replace(/\[, /gi, "[").replace(/, \]/gi, "]");
}

function isValid(spec, value) { 
  return spec(value).check();
}

export default {
  explain,
  STRING,
  NUM,
  pred,
  not,
  and,
  or,
  isValid
}