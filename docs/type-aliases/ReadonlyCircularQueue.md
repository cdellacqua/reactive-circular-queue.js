[**reactive-circular-queue**](../README.md)

***

[reactive-circular-queue](../README.md) / ReadonlyCircularQueue

# Type Alias: ReadonlyCircularQueue\<T\>

> **ReadonlyCircularQueue**\<`T`\> = `object`

Defined in: [src/lib/index.ts:8](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L8)

A circular queue "view" that exposes read-only methods.

## Type Parameters

### T

`T`

## Properties

### availableSlots$

> **availableSlots$**: [`ReadonlyStore`](ReadonlyStore.md)\<`number`\>

Defined in: [src/lib/index.ts:12](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L12)

A store that contains the number of available slots inside the queue.

***

### empty$

> **empty$**: [`ReadonlyStore`](ReadonlyStore.md)\<`boolean`\>

Defined in: [src/lib/index.ts:32](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L32)

A store that contains true if the number of filled slots is zero.

Note: a queue with a capacity of zero is always empty.

***

### filledSlots$

> **filledSlots$**: [`ReadonlyStore`](ReadonlyStore.md)\<`number`\>

Defined in: [src/lib/index.ts:16](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L16)

A store that contains the number of filled slots inside the queue.

***

### full$

> **full$**: [`ReadonlyStore`](ReadonlyStore.md)\<`boolean`\>

Defined in: [src/lib/index.ts:26](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L26)

A store that contains true if the number of filled slots equals the capacity.

Note: a queue with a capacity of zero is always full.

## Accessors

### capacity

#### Get Signature

> **get** **capacity**(): `number`

Defined in: [src/lib/index.ts:20](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L20)

Return the total number of slots allocated for this queue.

##### Returns

`number`

## Methods

### at()

> **at**(`positiveOrNegativeIndex`): `T` \| `undefined`

Defined in: [src/lib/index.ts:49](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L49)

Return an element of a queue given an index.
The index can be positive or negative.
If the index is positive, it counts forwards from the head of the queue,
if it's negative, it counts backwards from the tail of the queue.
As an example q.at(-1) returns the last enqueued element.

Note: if the index is out of bounds, this method returns undefined.

#### Parameters

##### positiveOrNegativeIndex

`number`

an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).

#### Returns

`T` \| `undefined`

the element at the given index or undefined if the index is incompatible with the current queue size (i.e. the number of filled slots).

***

### indexOf()

> **indexOf**(`searchElement`): `number`

Defined in: [src/lib/index.ts:56](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L56)

Return the index of a given item inside the queue.

#### Parameters

##### searchElement

`T`

the element to search in the queue.

#### Returns

`number`

the first index at which the element is found or -1 if the element is not found.

***

### toArray()

> **toArray**(): `T`[]

Defined in: [src/lib/index.ts:36](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L36)

Return a copy of this queue in the form of an array.

#### Returns

`T`[]
