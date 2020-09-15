## Specs for special values

### 1. Specifying that a value can have any type

Use `ANY`:

```js
import s from "./speco";

s.isValid(s.ANY, 3);
// => true

s.isValid(s.ANY, "hola");
// => true

s.isValid(s.ANY, {});
// => true
```

### 2. Specifying that a value is null

Use `NULL`:

```js
import s from "./speco";

s.isValid(s.NULL, 3);
// => false

s.isValid(s.NULL, null);
// => true

s.isValid(s.NULL, {});
// => false
```

### 3. Specifying that a value that satisfies a given spec might be also null
Use `mayBe` passing it the spec that the value should satisfy when it is not null:

```js
import s from "./speco";

const nullableNumSpec = s.mayBe(s.NUM);

s.isValid(nullableNumSpec, 3);
// => true

s.isValid(nullableNumSpec, null);
// => true

s.isValid(nullableNumSpec, {});
// => false
```

`s.mayBe(s.NUM)` is sugar syntax for `s.or(s.NUM, s.NULL)`
