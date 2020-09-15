## Composing specs

### 1. Composing specs with `not`

Use `not` passing it the spec you'd like to negate:

```js
import s from "./speco";

const notNumberSpec = s.not(s.NUM);

s.isValid(notNumberSpec, "2");
// => true

s.isValid(notNumberSpec, 3);
// => false

s.isValid(notNumberSpec, {});
// => true

s.isValid(s.not(notNumberSpec), 3);
// => true
```

### 2. Composing specs with `and`
Use `and` passing it all the specs that a value should satisfy:

Example specifying a value that is an even number:

```js
import s from "./speco";

const isEven = (n) => n%2 === 0;
const numberAndEvenSpec = s.and(
  s.pred(isEven), 
  s.NUM
);

s.isValid(numberAndEvenSpec, "2");
// => false

s.isValid(numberAndEvenSpec, 2);
// => true
```

`and` returns a spec so it can be composed using any other function for composing specs.

Example using `not` and the precious spec to specify a value that is not even or not a number:

```js
import s from "./speco";

const isEven = (n) => n%2 === 0;
const numberAndEvenSpec = s.and(
  s.pred(isEven), 
  s.NUM
);
const notNumberOrNotEvenSpec = s.not(numberAndEvenSpec);

s.isValid(notNumberOrNotEvenSpec, "2");
// => true

s.isValid(notNumberOrNotEvenSpec, 2);
// => false

s.isValid(notNumberOrNotEvenSpec, 3);
// => true
```

Another example using `and` several times:

```js
import s from "./speco";

const usingSeveralAndsSpec = s.and(
  s.pred((n) => n%10 === 0),
  s.pred(isEven), 
  s.and(s.NUM,s.pred((n) => `${n}`.indexOf("2") >= 0))
);

s.isValid(usingSeveralAndsSpec, 20);
// => true

s.isValid(usingSeveralAndsSpec, 30);
// => false
```

### 3. Composing specs with `or`