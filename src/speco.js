import isString from "lodash.isstring";
import isNumber from "lodash.isnumber";

function isValid(spec, value) { 
  return spec.execute(value);
}

export default {
  isValid,
  STRING(value){
    return {
      execute: isString,
      describe: () => "spec.STRING"
    };
  },
  NUM(value) {
    return {
      execute: isNumber,
      describe: () => "spec.NUM"
    };
  },
  pred(fn) {
    return {
      execute: fn,
      describe: () => "spec.pred("+ fn.name + ")"
    };
  },
  and(...specs) {
    return {
      execute:(value) => specs.reduce((acc, spec) => acc && spec.execute(value), true),
      describe: () => "and [" + specs.map((spec) => spec.describe()).join(", ") + "]"
    };
  },
  or(...specs) {
    return  {
      execute: (value) => specs.reduce((acc, spec) => acc || spec.execute(value), false),
      describe: () => "or [" + specs.map((spec) => spec.describe()).join(", ") + "]"
    };
  },
  not(spec) {
    return {
      execute: (value) => !spec(value), 
      describe: () => "not [" + spec.describe() + "]"
    };
  },
  explain: (spec, value) => {
    console.log(isValid(spec, value));
    if(!isValid(spec, value)) {
      return "Ok";
    }
    return ""
  }
}
