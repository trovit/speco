## Specs for objects

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

Use `OBJ` passing it an object which has a `req` key with an object as value that associates an spec for each required key:

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

### 3. Specifying that a variable is a plain object with optional keys

Use `OBJ` passing it an object which has an `opt` key with an object as value that associates an spec for each optional key:

```js
import s from "./speco";

const objSpec = s.OBJ({opt: {a: s.NUM, b: s.STRING}});
    
s.isValid(objSpec, {a: 1, b: "lala"}));
// => true

// missing an optional key is ok
s.isValid(objSpec, {a: 1}));
// => true
s.isValid(objSpec, {b: "lala"}));
// => true

// value associated to `b` key should be a string
s.isValid(objSpec, {a: 1, b: 2}));
// => false

// value associated to `a` key should be a number
s.isValid(objSpec, {a: true}));
// => false
```

### 4. Specifying nested objects

Use `OBJ` again to specify the value of the key in the specification of the outer object:


```js
import s from "./speco";

const innerObjSpec = s.OBJ({req: {a: s.STRING}});
const objSpec = s.OBJ({req: {x: innerObjSpec}});

s.isValid(objSpec, {x: {a: "2"}});
// => true

// outer object missing required key `x`
s.isValid(objSpec, {y: {a: "2"}});
// => false

// value associated to `x` key should be an object
s.isValid(objSpec, {x: true});
// => false

// inner object missing required key `a`
s.isValid(objSpec, {x: {b: "2"}});
// => false

// value associated to `a` key of the inner object should be a string
s.isValid(objSpec, {x: {a: 2}});
// => false
```

Object nesting can have as many levels as you like.
    
