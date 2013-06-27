ohoh.js
=======

ohoh.js is a simple utility library to assist with event-driven,
object-oriented javascript.

Quickstart
----------

ohoh.js provides an extendable base class to get you started. All subclasses of
this base class are also extendable. Here is a simple example of some of the
things you can do.

```javascript
// Animal extends BaseClass
var Animal = BaseClass.extend({
  initialize: function(name) {
    this.name = name;
  },
  identify: function() {
    console.log('Hi, my name is ' + this.name + '.');

    // Return the instance to allow chaining
    return this;
  }
});

// Dog extends Animal
var Dog = Animal.extend({
  bark: function() {
    console.log('Woof!');

    // Trigger a bark event
    this.trigger('bark');

    // Return the instance to allow chaining
    return this;
  }
});

// Create a new instance of Dog
var Rufus = new Dog('Rufus');

// Listen for the bark event.
Rufus.on('bark', function() {
  console.log(this.name + ' just barked!');
});

// Make Rufus bark
Rufus.bark();
```
