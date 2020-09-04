## speco

Humble specs for JS data


### Documentation

#### 1. Specs for values

##### 1.1. Specs to specify string values

Use `s.STRING`:

```js
import s from "./speco";

s.isValid(s.STRING, 1);
// => false

s.isValid(s.STRING, "hola");
// => true
```

##### 1.2. Specs to specify numeric values

Use `s.NUM`:

```js
import s from "./speco";

s.isValid(s.NUM, 1);
// => true

s.isValid(s.NUM, "hola");
// => false
```