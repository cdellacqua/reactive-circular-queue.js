# reactive-circular-queue

A circular queue implementation with reactive features and Symbol.iterator support.

A circular queue (or ring buffer, or circular buffer) is a data structure where
elements can be stored and removed without reallocating the underline
array. It's often used to implement First In-First Out queues.

[NPM Package](https://www.npmjs.com/package/reactive-circular-queue)

`npm install reactive-circular-queue`

[Documentation](./docs/README.md)

## Highlights

`CircularQueue<T>` provides methods such as:

- `enqueue(value)`, to enqueue a single value;
- `enqueueMulti([value1, value2, ...])`, to enqueue multiple values;
- `dequeue()`, to dequeue a single value;
- `dequeue(n)`, to dequeue n values;
- `dequeueAll()`, to dequeue all elements at once;
- `clear()`, to remove all elements from the queue;
- `toArray()`, to create an array containing the elements in the queue;
- `at(index)`, to read (without dequeueing) an element in the queue at a given index (positive or negative);
- `replace(index, item)`, to replace (without affecting the queue size) an element in the queue at a given index (positive or negative);
- `remove(index)`, to remove an element from the queue given an index (positive or negative);
- `iter()`, to get an iterator that dequeues elements one at a time (it also supports `Symbol.iterator`, see the example below).

It also provides the following stores to monitor the state of the queue:

- `availableSlots$`, corresponding to the number of empty slots still available in the queue;
- `filledSlots$`, corresponding to the number of filled slots in the queue;
- `full$`, which corresponds to `filledSlots$.content() === capacity.content()`;
- `empty$`, which corresponds to `filledSlots$.content() === 0`.

Finally, there is also a `capacity` property, corresponding to the total number of slots in the queue, available or filled.

The stores used in this library are [`ReadonlyStore`](https://www.npmjs.com/package/universal-stores).

This library provides a function called `makeCircularQueue` to create `CircularQueue<T>` objects.
This function has two overloads:
- `makeCircularQueue(capacity)`, which takes the maximum size of the queue as its only parameter;
- `makeCircularQueue(array, capacity)`, which takes an array that will be used to initialize the
queue as its first parameter and a second optional parameter which is the capacity of the queue.
If the capacity is not passed, the array length will be used to determine the maximum queue size. If the capacity is less than the array length, only the elements that can fit into
the queue will be added.

```ts
import {makeCircularQueue} from 'reactive-circular-queue';

// Create an empty queue that can hold up to 3 items.
const queue1 = makeCircularQueue<string>(3);
console.log(queue1.capacity); // 3
console.log(queue1.filledSlots$.content()); // 0
// Create a full queue that can hold up to 3 items (deduced from the array length).
const queue2 = makeCircularQueue(['hello', 'world', '!']);
console.log(queue2.capacity); // 3
console.log(queue2.filledSlots$.content()); // 3
// Create an almost full queue that can hold up to 3 items (as per the second argument).
const queue3 = makeCircularQueue(['hello', 'world'], 3);
console.log(queue3.capacity); // 3
console.log(queue3.filledSlots$.content()); // 2
// Create a full queue that can hold up to 2 items (as per the second argument).
const queue4 = makeCircularQueue(['hello', 'world', '!'], 2);
console.log(queue4.capacity); // 2
console.log(queue4.filledSlots$.content()); // 2, only 'hello' and 'world' were copied inside the queue.
```

### Examples

Basics:

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueue('hello');
queue.enqueue('world');
queue.enqueue('!');
console.log(queue.dequeue()); // hello
console.log(queue.dequeue()); // world
queue.enqueue('bye');
console.log(queue.toArray().join(', ')); // !, bye
```

Reactivity:

```ts
const queue = makeCircularQueue<string>(3);
queue.filledSlots$.subscribe((n) => console.log(`using ${n} of ${queue.capacity} slots`)); // immediately prints "using 0 of 3 slots"
queue.enqueue('hello'); // will trigger the above console.log, printing "using 1 of 3 slots"
queue.enqueue('world'); // will trigger the above console.log, printing "using 2 of 3 slots"
queue.enqueue('!'); // will trigger the above console.log, printing "using 3 of 3 slots"
queue.dequeue(); // will trigger the above console.log, printing "using 2 of 3 slots"
queue.dequeue(); // will trigger the above console.log, printing "using 1 of 3 slots"
queue.enqueue('bye'); // will trigger the above console.log, printing "using 2 of 3 slots"
console.log(queue.toArray().join(', ')); // !, bye
```

Usage of `enqueueMulti`:

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
queue.enqueue('!');
console.log(queue.toArray().join(', ')); // hello, world, !
```

Usage of `dequeue(n)`:

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
queue.enqueue('!');
console.log(queue.dequeue(2).join(', ')); // hello, world
console.log(queue.dequeue()); // !
```

Usage of `dequeueAll(n)`:

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
queue.enqueue('!');
console.log(queue.dequeueAll().join(', ')); // hello, world, !
```

Usage of `at(i)`:

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
console.log(queue.at(0)); // hello
console.log(queue.at(1)); // world
console.log(queue.at(2)); // undefined
console.log(queue.at(-1)); // world
console.log(queue.at(-2)); // hello
```

Usage of `replace(i, item)`:

```ts
const queue = makeCircularQueue<string>(1);
queue.enqueue('hello');
console.log(queue.replace(0, 'world')); // hello
console.log(queue.dequeue()); // world
```

Usage of `remove(i)`:

```ts
const queue = makeCircularQueue<string>(2);
queue.enqueue('world');
queue.enqueue('hello');
console.log(queue.remove(-1)); // hello
console.log(queue.dequeue()); // world
```

Usage with `for..of` (`[Symbol.iterator]()`):

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
console.log(queue.filledSlots$.content()); // 2
for (const value of queue) {
	console.log(value); // prints hello, then world
	console.log(queue.filledSlots$.content()); // prints 1, then 0
}
```
