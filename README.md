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
- `at(index)`, to read (without dequeueing) an element in the queue at a given index (positive or negative) with respect to occupied slots;
- `iter()`, to get an iterator that dequeues elements one at a time (it also supports `Symbol.iterator`, see the example below).

It also provides the following getters:

- `availableSlots`, corresponding to the number of empty slots still available in the queue;
- `filledSlots`, corresponding to the number of filled slots in the queue;
- `capacity`, corresponding to the total number of slots in the queue, available or filled;
- `full`, which corresponds to `filledSlots === capacity`;
- `empty`, which corresponds to `filledSlots === 0`.

Each getters has a corresponding [`ReadonlyStore`](https://www.npmjs.com/package/universal-stores): `availableSlots$`, `filledSlots$`, `capacity$`, `full$`, `empty$`.

These stores make this circular queue implementation reactive.

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

Usage with `for..of` (`[Symbol.iterator]()`):

```ts
const queue = makeCircularQueue<string>(3);
queue.enqueueMulti(['hello', 'world']);
console.log(queue.filledSlots); // 2
for (const value of queue) {
	console.log(value); // prints hello, then world
	console.log(queue.filledSlots); // prints 1, then 0
}
```
