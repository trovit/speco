## Specifying values using predicates

Use `pred` passing it the predicate you want to use to check the values:

```js
import s from "./speco";

const isEven = (n) => {return n%2 === 0;}

const predicatesSpec = s.pred(isEven)

s.isValid(predicatesSpec, 1);
// => false

s.isValid(predicatesSpec, 2);
// => true
```
