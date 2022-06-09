reactive-circular-queue

# reactive-circular-queue

## Table of contents

### Classes

- [NotEnoughAvailableSlotsQueueError](classes/NotEnoughAvailableSlotsQueueError.md)
- [NotEnoughFilledSlotsQueueError](classes/NotEnoughFilledSlotsQueueError.md)

### Type aliases

- [CircularQueue](README.md#circularqueue)

### Functions

- [makeCircularQueue](README.md#makecircularqueue)

## Type aliases

### CircularQueue

Ƭ **CircularQueue**<`T`\>: `Object`

A circular queue implementation with reactive features and Symbol.iterator support.

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
| ``get` **availableSlots**(): `number`` | `Object` | - |
| ``get` **capacity**(): `number`` | `Object` | - |
| ``get` **empty**(): `boolean`` | `Object` | - |
| ``get` **filledSlots**(): `number`` | `Object` | - |
| ``get` **full**(): `boolean`` | `Object` | - |
| `[iterator]` | () => `Iterator`<`T`, `any`, `undefined`\> | - |
| `at` | (`positiveOrNegativeIndex`: `number`) => `undefined` \| `T` | - |
| `clear` | () => `void` | - |
| `dequeue` | () => `T`(`n`: `number`) => `T`[] | - |
| `dequeueAll` | () => `T`[] | - |
| `enqueue` | (`v`: `T`) => `void` | - |
| `enqueueMulti` | (`v`: `T`[]) => `void` | - |
| `iter` | () => `Iterator`<`T`, `any`, `undefined`\> | - |
| `replace` | (`positiveOrNegativeIndex`: `number`, `item`: `T`) => `void` | - |
| `toArray` | () => `T`[] | - |

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

[src/lib/index.ts:163](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L163)

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

[src/lib/index.ts:182](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L182)
