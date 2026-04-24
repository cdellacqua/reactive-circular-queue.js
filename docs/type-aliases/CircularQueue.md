[**reactive-circular-queue**](../README.md)

***

[reactive-circular-queue](../README.md) / CircularQueue

# Type Alias: CircularQueue\<T\>

> **CircularQueue**\<`T`\> = [`ReadonlyCircularQueue`](ReadonlyCircularQueue.md)\<`T`\> & `object`

Defined in: [src/lib/index.ts:62](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L62)

A circular queue implementation with reactive features and Symbol.iterator support.

## Type Declaration

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<`T`\>

Return an iterator that consumes the queue by dequeueing one element at a time.

#### Returns

`Iterator`\<`T`\>

### clear()

> **clear**(): `void`

Empty the queue.

Note: this method also resets all references inside the queue, so that the garbage collector
can intervene to free up some memory if necessary.

#### Returns

`void`

### dequeue()

#### Call Signature

> **dequeue**(): `T`

Remove an element from the start of the queue.

Note: this method also resets the reference inside the queue, so that the garbage collector
can intervene to free up some memory if necessary.

##### Returns

`T`

the element removed from the queue.

##### Throws

if the queue is empty.

#### Call Signature

> **dequeue**(`n`): `T`[]

Remove a given number of elements from the start of the queue.

Note: this method also resets the references inside the queue, so that the garbage collector
can intervene to free up some memory if necessary.

##### Parameters

###### n

`number`

##### Returns

`T`[]

an array containing the elements removed from the queue.

##### Throws

if the queue contains less than the specified number of elements.

### dequeueAll()

> **dequeueAll**(): `T`[]

Remove all the element from the queue.

Note: this method also resets the references inside the queue, so that the garbage collector
can intervene to free up some memory if necessary.

#### Returns

`T`[]

an array containing the elements removed from the queue.

### enqueue()

> **enqueue**(`v`): `void`

Enqueue an element.

#### Parameters

##### v

`T`

a value to enqueue.

#### Returns

`void`

#### Throws

if the queue is already full.

### enqueueMulti()

> **enqueueMulti**(`v`): `void`

Enqueue all the elements contained in a given array.

#### Parameters

##### v

`T`[]

an array of values to enqueue.

#### Returns

`void`

#### Throws

if the number of elements to enqueue exceeds the available space of the queue.

### iter()

> **iter**(): `Iterator`\<`T`\>

Return an iterator that consumes the queue by dequeueing one element at a time.

#### Returns

`Iterator`\<`T`\>

### remove()

> **remove**(`positiveOrNegativeIndex`): `T`

Remove an element from the queue given an index, returning the removed element.
The index can be positive or negative.
If the index is positive, it counts forwards from the head of the queue,
if it's negative, it counts backwards from the tail of the queue.
As an example q.remove(-1) removes the last enqueued element,
while q.remove(0) removes the first element.

#### Parameters

##### positiveOrNegativeIndex

`number`

an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).

#### Returns

`T`

#### Throws

if the index is incompatible with the current queue size (i.e. the number of filled slots).

### replace()

> **replace**(`positiveOrNegativeIndex`, `item`): `T`

Replace the element of a queue at the given index, returning the replaced element.
The index can be positive or negative.
If the index is positive, it counts forwards from the head of the queue,
if it's negative, it counts backwards from the tail of the queue.
As an example q.replace(-1, 'hello') replaces the last enqueued element,
while q.replace(0, 'hello') replaces the first element.

#### Parameters

##### positiveOrNegativeIndex

`number`

an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).

##### item

`T`

#### Returns

`T`

the replaced element.

#### Throws

if the index is incompatible with the current queue size (i.e. the number of filled slots).

## Type Parameters

### T

`T`
