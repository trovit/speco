## speco

Humble specs for JS data


### Documentation

#### 1. Specs for values

##### 1.1. Specifying string values

Use `STRING`:

```js
import s from "./speco";

s.isValid(s.STRING, 1);
// => false

s.isValid(s.STRING, "hola");
// => true
```

##### 1.2. Specifying numeric values

Use `NUM`:

```js
import s from "./speco";

s.isValid(s.NUM, 1);
// => true

s.isValid(s.NUM, "hola");
// => false
```

#### 2. Specs for arrays

##### 2.1. Specifying that a variable is an array

Use `ARRAY` passing it no arguments:

```js
import s from "./speco";

const arraySpec = s.ARRAY();
 
s.isValid(arraySpec, []);
// => true

s.isValid(arraySpec, ["a", 1, {}]);
// => true

s.isValid(arraySpec, [1, 2]);
// => true

s.isValid(arraySpec, 1);
// => false

s.isValid(arraySpec, "a");
// => false

s.isValid(arraySpec, {});
// => false

function SomeObject() {
  this.a = 1;
}
s.isValid(arraySpec, new SomeObject());
// => false

s.isValid(arraySpec, () => {});
// => false
```

##### 2.2. Specifying arrays with any number of elements of the same type

Use `ARRAY_OF` passing it the spec that all its elements follow:

```js
import s from "./speco";

const arraySpec = s.ARRAY_OF(s.STRING);
 
s.isValid(arraySpec, []);
// => true

s.isValid(arraySpec, ["a", "b"]);
// => true

s.isValid(arraySpec, ["a", 1, {}]);
// => false

s.isValid(arraySpec, [1, "l"]);
// => false
```

##### 2.3. Specifying arrays with a given number of elements of given types

Use `ARRAY` passing it the specs for each of the elements of the array:

```js
import s from "./speco";

const arraySpec = s.ARRAY(s.STRING, s.NUM);
 
s.isValid(arraySpec, ["a", 1]):
// => true

s.isValid(arraySpec, ["a", 1, {}]);
// => true

s.isValid(arraySpec, [3, 1]);
// => false

s.isValid(arraySpec, [1, 2, []]);
// => false
```


