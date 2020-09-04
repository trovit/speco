## Specs for arrays

### 1. Specifying that a variable is a plain object

Use `OBJ` passing it no arguments:

```js
import s from "./speco";

const objSpec = s.OBJ();

s.isValid(objSpec, {});
// => true
    
s.isValid(objSpec, {a: 1, b: 2});
// => true

s.isValid(objSpec, []);
// => false

s.isValid(objSpec, 1);
// => false

s.isValid(objSpec, "a");
// => false

s.isValid(objSpec, () => {});
// => false

function SomeObject() {
  this.a = 1;
}
s.isValid(objSpec, new SomeObject());
// => false
```

### 2. Specifying that a variable is a plain object with required keys

Use `OBJ` passing it an object which has a `req` key with an object as value that associstes an spec for each required key:

```js
import s from "./speco";

const objSpec = s.OBJ({req: {a: s.NUM, b: s.STRING}});
    
s.isValid(objSpec, {a: 1, b: "koko"});
// => true

// not an object
s.isValid(objSpec, []);
// => false

// missing a required key
s.isValid(objSpec, {a: 1}); 
// => false

// value associated to `b` key should be a string
s.isValid(objSpec, {a: 1, b: 2}); 
// => false

// keys not specified as required are not taken into account
s.isValid(objSpec, {a: 1, b: "koko", c: "moko"}); 
// => true
```

### 3. Specifying that a variable is a plain object with required keys

TODO