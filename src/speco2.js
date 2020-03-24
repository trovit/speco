import isString from "lodash.isstring";
import isNumber from "lodash.isnumber";

const noErrors =  {
  errors: []
};

function STRING(value){
  if (isString(value)) {
    return [];
  }
  return [value + " no spec.STRING"];
}

function NUM(value) {
  if (isNumber(value)) {
    return [];
  }
  return ["'" + value + "'" + " no spec.NUM"];
}

function pred(fn) {
  return (value) => {
    if (fn(value)) {
      return [];
    }
    return [value + " no spec.pred("+ fn.name + ")"]; 
  }   
}

function explain(spec, value) { 
  const errors = spec(value)
  if (errors.length === 0) {
    return "Ok";
  }
  return "fail: " + errors.join(", ").replace(/\[, /gi, "[").replace(/, \]/gi, "]");
}

function isValid(spec, value) {
  return spec(value).length === 0;
}

function and(...specs) {
  return function andSpec(value) {
    const errors = getAllErrors(specs, value);
    if(errors.length > 0) {
      return ["and ["].concat(errors).concat(["]"]);
    }
    return errors;
  }
}

function getAllErrors(specs, value) {
  return specs.reduce(
    (acc, spec) => {
      if(!isValid(spec, value)) {
        acc = acc.concat(spec(value));
      }
      return acc;
    }, 
    []
  );
}

function or(...specs) {
  return function orSpec(value) {
    const res = specs.some(
      (spec) => isValid(spec, value)
    );

    if(res === true) {
      return [];
    }
    return ["or ["].concat(getAllErrors(specs, value)).concat(["]"]);
  }
}

function not(spec) {
  return function(value) {
    
  }
}

export default {
  explain,
  STRING,
  NUM, 
  pred,
  and, 
  or, 
  isValid
}