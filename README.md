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

Guide
-----

ohoh.js provides the class `BaseClass` to be instantiated or extended. In most
cases you will probably want to extend it, unless you just want a simple object
that is capable of emitting events.

### Creating a new instance ###

If you are new to JavaScript you may be wondering how to go about instantiating
an object. This is a fairly straightforward process.

"""javascript
var MyInstance = mew BaseClass();
"""

### Inheritance ###

#### Extending the base class ####

"""javascript
var SubClass = BaseClass.extend({
  'initialize': function() {
    console.log('A new instance was constructed.');
  }
});
"""

In the above example, `SubClass` inherits from `BaseClass`. `initialize` is the
constructor for all sub classes of `BaseClass`. It is called every time that a
new instance of a sub class is created. Return to our example this would mean
if you created a new instance of `SubClass`, the text "A new instance was
constructed." would be output to the console.

#### Extending sub classes of the base class ####

All sub classes of `BaseClass` are also extensible.

When you extend a class, all of it's methods are carried over to the inheriting
class. However you may override any existing methods while extending the class.
Some times however, you may want to call the method you are overriding from the
method that is overriding it. This is done using the special `_super` variable
that is made available within the context of the overriding method.

"""javascript
var Father = BaseClass.extend({});
"""
