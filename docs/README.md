reactive-circular-queue

# reactive-circular-queue

## Table of contents

### Classes

- [NotEnoughAvailableSlotsQueueError](classes/NotEnoughAvailableSlotsQueueError.md)
- [NotEnoughFilledSlotsQueueError](classes/NotEnoughFilledSlotsQueueError.md)

### Type Aliases

- [CircularQueue](README.md#circularqueue)
- [ReadonlyCircularQueue](README.md#readonlycircularqueue)

### Functions

- [makeCircularQueue](README.md#makecircularqueue)

## Type Aliases

### CircularQueue

Ƭ **CircularQueue**<`T`\>: [`ReadonlyCircularQueue`](README.md#readonlycircularqueue)<`T`\> & { `[iterator]`: () => `Iterator`<`T`, `any`, `undefined`\> ; `clear`: () => `void` ; `dequeue`: () => `T`(`n`: `number`) => `T`[] ; `dequeueAll`: () => `T`[] ; `enqueue`: (`v`: `T`) => `void` ; `enqueueMulti`: (`v`: `T`[]) => `void` ; `iter`: () => `Iterator`<`T`, `any`, `undefined`\> ; `remove`: (`positiveOrNegativeIndex`: `number`) => `T` ; `replace`: (`positiveOrNegativeIndex`: `number`, `item`: `T`) => `T`  }

A circular queue implementation with reactive features and Symbol.iterator support.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/lib/index.ts:80](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L80)

___

### ReadonlyCircularQueue

Ƭ **ReadonlyCircularQueue**<`T`\>: `Object`

A circular queue "view" that exposes read-only methods.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `availableSlots$` | `ReadonlyStore`<`number`\> | A reactive store that contains the number of available slots inside the queue. |
| `empty$` | `ReadonlyStore`<`boolean`\> | A store that contains true if the number of filled slots is zero.  Note: a queue with a capacity of zero is always empty. |
| `filledSlots$` | `ReadonlyStore`<`number`\> | A reactive store that contains the number of filled slots inside the queue. |
| `full$` | `ReadonlyStore`<`boolean`\> | A reactive store that contains true if the number of filled slots equals the capacity.  Note: a queue with a capacity of zero is always full. |
| ``get` **availableSlots**(): `number`` | {} | - |
| ``get` **capacity**(): `number`` | {} | - |
| ``get` **empty**(): `boolean`` | {} | - |
| ``get` **filledSlots**(): `number`` | {} | - |
| ``get` **full**(): `boolean`` | {} | - |
| `at` | (`positiveOrNegativeIndex`: `number`) => `undefined` \| `T` | Return an element of a queue given an index. The index can be positive or negative. If the index is positive, it counts forwards from the head of the queue, if it's negative, it counts backwards from the tail of the queue. As an example q.at(-1) returns the last enqueued element.  Note: if the index is out of bounds, this method returns undefined. |
| `indexOf` | (`searchElement`: `T`) => `number` | Return the index of a given item inside the queue. |
| `toArray` | () => `T`[] | Return a copy of this queue in the form of an array. |

#### Defined in

[src/lib/index.ts:6](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L6)

## Functions

### makeCircularQueue

▸ **makeCircularQueue**<`T`\>(`capacity`): [`CircularQueue`](README.md#circularqueue)<`T`\>

Create a circular queue of a given capacity.

Example usage:
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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `capacity` | `number` | the number of slots to allocate for this queue. |

#### Returns

[`CircularQueue`](README.md#circularqueue)<`T`\>

a [CircularQueue](README.md#circularqueue)

#### Defined in

[src/lib/index.ts:200](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L200)

▸ **makeCircularQueue**<`T`\>(`fromArray`, `capacity?`): [`CircularQueue`](README.md#circularqueue)<`T`\>

Create a circular queue and initialize it with
elements from an array. If the capacity (second optional parameter) is not passed,
the array length will be used to determine the maximum queue size.

Example usage:
```ts
const queue = makeCircularQueue(['hello', 'world']);
console.log(queue.dequeue()); // hello
console.log(queue.dequeue()); // world
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromArray` | `T`[] | an array used to initialize the queue. |
| `capacity?` | `number` | (optional) the maximum queue size. If the array length is greater than the capacity, the extra elements will be ignored. |

#### Returns

[`CircularQueue`](README.md#circularqueue)<`T`\>

a [CircularQueue](README.md#circularqueue)

#### Defined in

[src/lib/index.ts:219](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L219)
