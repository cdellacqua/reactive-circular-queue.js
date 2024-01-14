reactive-circular-queue

# reactive-circular-queue

## Table of contents

### Classes

- [NotEnoughAvailableSlotsQueueError](classes/NotEnoughAvailableSlotsQueueError.md)
- [NotEnoughFilledSlotsQueueError](classes/NotEnoughFilledSlotsQueueError.md)

### Type Aliases

- [CircularQueue](README.md#circularqueue)
- [ReadonlyCircularQueue](README.md#readonlycircularqueue)
- [ReadonlyStore](README.md#readonlystore)
- [Subscriber](README.md#subscriber)
- [Unsubscribe](README.md#unsubscribe)

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

[src/lib/index.ts:62](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L62)

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
| `availableSlots$` | [`ReadonlyStore`](README.md#readonlystore)<`number`\> | A store that contains the number of available slots inside the queue. |
| `empty$` | [`ReadonlyStore`](README.md#readonlystore)<`boolean`\> | A store that contains true if the number of filled slots is zero.  Note: a queue with a capacity of zero is always empty. |
| `filledSlots$` | [`ReadonlyStore`](README.md#readonlystore)<`number`\> | A store that contains the number of filled slots inside the queue. |
| `full$` | [`ReadonlyStore`](README.md#readonlystore)<`boolean`\> | A store that contains true if the number of filled slots equals the capacity.  Note: a queue with a capacity of zero is always full. |
| ``get` **capacity**(): `number`` | {} | - |
| `at` | (`positiveOrNegativeIndex`: `number`) => `undefined` \| `T` | Return an element of a queue given an index. The index can be positive or negative. If the index is positive, it counts forwards from the head of the queue, if it's negative, it counts backwards from the tail of the queue. As an example q.at(-1) returns the last enqueued element.  Note: if the index is out of bounds, this method returns undefined. |
| `indexOf` | (`searchElement`: `T`) => `number` | Return the index of a given item inside the queue. |
| `toArray` | () => `T`[] | Return a copy of this queue in the form of an array. |

#### Defined in

[src/lib/index.ts:8](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L8)

___

### ReadonlyStore

Ƭ **ReadonlyStore**<`T`\>: `Object`

A store that can have subscribers and emit values to them. It also
provides the current value upon subscription. It's readonly in the
sense that it doesn't provide direct set/update methods, unlike {@link Store},
therefore its value can only be changed by a {@link StartHandler} (see also {@link makeReadonlyStore}).

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `content` | () => `T` |
| `nOfSubscriptions` | () => `number` |
| `subscribe` | (`subscriber`: [`Subscriber`](README.md#subscriber)<`T`\>) => [`Unsubscribe`](README.md#unsubscribe) |

#### Defined in

node_modules/universal-stores/dist/index.d.ts:33

___

### Subscriber

Ƭ **Subscriber**<`T`\>: (`current`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`current`): `void`

A generic subscriber that takes a value emitted by a signal as its only parameter.

##### Parameters

| Name | Type |
| :------ | :------ |
| `current` | `T` |

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:2

___

### Unsubscribe

Ƭ **Unsubscribe**: () => `void`

#### Type declaration

▸ (): `void`

A function that's used to unsubscribe a subscriber from a signal.

##### Returns

`void`

#### Defined in

node_modules/@cdellacqua/signals/dist/index.d.ts:4

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

[src/lib/index.ts:182](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L182)

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

[src/lib/index.ts:201](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L201)
