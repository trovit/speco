## Specs for primitive values

### 1. Specifying string values

Use `STRING`:

```js
import s from "./speco";

s.isValid(s.STRING, 1);
// => false

s.isValid(s.STRING, "hola");
// => true
```

### 2. Specifying numeric values

Use `NUM`:

```js
import s from "./speco";

s.isValid(s.NUM, 1);
// => true

s.isValid(s.NUM, "hola");
// => false
```
