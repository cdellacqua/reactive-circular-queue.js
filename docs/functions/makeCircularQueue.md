[**reactive-circular-queue**](../README.md)

***

[reactive-circular-queue](../README.md) / makeCircularQueue

# Function: makeCircularQueue()

## Call Signature

> **makeCircularQueue**\<`T`\>(`capacity`): [`CircularQueue`](../type-aliases/CircularQueue.md)\<`T`\>

Defined in: [src/lib/index.ts:182](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L182)

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

### Type Parameters

#### T

`T`

### Parameters

#### capacity

`number`

the number of slots to allocate for this queue.

### Returns

[`CircularQueue`](../type-aliases/CircularQueue.md)\<`T`\>

a [CircularQueue](../type-aliases/CircularQueue.md)

## Call Signature

> **makeCircularQueue**\<`T`\>(`fromArray`, `capacity?`): [`CircularQueue`](../type-aliases/CircularQueue.md)\<`T`\>

Defined in: [src/lib/index.ts:201](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L201)

Create a circular queue and initialize it with
elements from an array. If the capacity (second optional parameter) is not passed,
the array length will be used to determine the maximum queue size.

Example usage:
```ts
const queue = makeCircularQueue(['hello', 'world']);
console.log(queue.dequeue()); // hello
console.log(queue.dequeue()); // world
```

### Type Parameters

#### T

`T`

### Parameters

#### fromArray

`T`[]

an array used to initialize the queue.

#### capacity?

`number`

(optional) the maximum queue size. If the array length is greater than the capacity,
the extra elements will be ignored.

### Returns

[`CircularQueue`](../type-aliases/CircularQueue.md)\<`T`\>

a [CircularQueue](../type-aliases/CircularQueue.md)
