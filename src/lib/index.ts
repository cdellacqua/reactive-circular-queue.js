import {makeDerivedStore, makeStore, ReadonlyStore} from 'universal-stores';

/**
 * A circular queue "view" that exposes read-only methods.
 */
export type ReadonlyCircularQueue<T> = {
	/**
	 * Return the number of available slots inside the queue.
	 */
	get availableSlots(): number;
	/**
	 * A reactive store that contains the number of available slots inside the queue.
	 */
	availableSlots$: ReadonlyStore<number>;
	/**
	 * Return the number of filled slots inside the queue.
	 */
	get filledSlots(): number;
	/**
	 * A reactive store that contains the number of filled slots inside the queue.
	 */
	filledSlots$: ReadonlyStore<number>;
	/**
	 * Return the total number of slots allocated for this queue.
	 */
	get capacity(): number;
	/**
	 * Return true if the number of filled slots equals the capacity.
	 *
	 * Note: a queue with a capacity of zero is always full.
	 */
	get full(): boolean;
	/**
	 * A reactive store that contains true if the number of filled slots equals the capacity.
	 *
	 * Note: a queue with a capacity of zero is always full.
	 */
	full$: ReadonlyStore<boolean>;
	/**
	 * Return true if the number of filled slots is zero.
	 *
	 * Note: a queue with a capacity of zero is always empty.
	 */
	get empty(): boolean;
	/**
	 * A store that contains true if the number of filled slots is zero.
	 *
	 * Note: a queue with a capacity of zero is always empty.
	 */
	empty$: ReadonlyStore<boolean>;
	/**
	 * Return a copy of this queue in the form of an array.
	 */
	toArray(): T[];
	/**
	 * Return an element of a queue given an index.
	 * The index can be positive or negative.
	 * If the index is positive, it counts forwards from the head of the queue,
	 * if it's negative, it counts backwards from the tail of the queue.
	 * As an example q.at(-1) returns the last enqueued element.
	 *
	 * Note: if the index is out of bounds, this method returns undefined.
	 *
	 * @param positiveOrNegativeIndex an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).
	 * @returns the element at the given index or undefined if the index is incompatible with the current queue size (i.e. the number of filled slots).
	 */
	at(positiveOrNegativeIndex: number): T | undefined;
	/**
	 * Return the index of a given item inside the queue.
	 *
	 * @param searchElement the element to search in the queue.
	 * @returns the first index at which the element is found or -1 if the element is not found.
	 */
	indexOf(searchElement: T): number;
};

/**
 * A circular queue implementation with reactive features and Symbol.iterator support.
 */
export type CircularQueue<T> = ReadonlyCircularQueue<T> & {
	/**
	 * Empty the queue.
	 *
	 * Note: this method also resets all references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 */
	clear(): void;
	/**
	 * Enqueue an element.
	 * @param v a value to enqueue.
	 * @throws {NotEnoughAvailableSlotsQueueError} if the queue is already full.
	 */
	enqueue(v: T): void;
	/**
	 * Enqueue all the elements contained in a given array.
	 * @param v an array of values to enqueue.
	 * @throws {NotEnoughAvailableSlotsQueueError} if the number of elements to enqueue exceeds the available space of the queue.
	 */
	enqueueMulti(v: T[]): void;
	/**
	 * Remove an element from the start of the queue.
	 *
	 * Note: this method also resets the reference inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 *
	 * @returns the element removed from the queue.
	 * @throws {NotEnoughFilledSlotsQueueError} if the queue is empty.
	 */
	dequeue(): T;
	/**
	 * Remove a given number of elements from the start of the queue.
	 *
	 * Note: this method also resets the references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 *
	 * @returns an array containing the elements removed from the queue.
	 * @throws {NotEnoughFilledSlotsQueueError} if the queue contains less than the specified number of elements.
	 */
	dequeue(n: number): T[];
	/**
	 * Remove all the element from the queue.
	 *
	 * Note: this method also resets the references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 *
	 * @returns an array containing the elements removed from the queue.
	 */
	dequeueAll(): T[];
	/**
	 * Return an iterator that consumes the queue by dequeueing one element at a time.
	 */
	iter(): Iterator<T>;
	/**
	 * Return an iterator that consumes the queue by dequeueing one element at a time.
	 */
	[Symbol.iterator](): Iterator<T>;
	/**
	 * Replace the element of a queue at the given index, returning the replaced element.
	 * The index can be positive or negative.
	 * If the index is positive, it counts forwards from the head of the queue,
	 * if it's negative, it counts backwards from the tail of the queue.
	 * As an example q.replace(-1, 'hello') replaces the last enqueued element,
	 * while q.replace(0, 'hello') replaces the first element.
	 *
	 * @param positiveOrNegativeIndex an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).
	 * @returns {T} the replaced element.
	 * @throws {RangeError} if the index is incompatible with the current queue size (i.e. the number of filled slots).
	 */
	replace(positiveOrNegativeIndex: number, item: T): T;
	/**
	 * Remove an element from the queue given an index, returning the removed element.
	 * The index can be positive or negative.
	 * If the index is positive, it counts forwards from the head of the queue,
	 * if it's negative, it counts backwards from the tail of the queue.
	 * As an example q.remove(-1) removes the last enqueued element,
	 * while q.remove(0) removes the first element.
	 *
	 * @param positiveOrNegativeIndex an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).
	 * @throws {RangeError} if the index is incompatible with the current queue size (i.e. the number of filled slots).
	 */
	remove(positiveOrNegativeIndex: number): T;
};

/**
 * Error that is thrown when trying to dequeue n items from a queue containing m < n items.
 */
export class NotEnoughFilledSlotsQueueError extends Error {
	constructor(public requestedItems: number, public filledSlots: number) {
		super(`queue doesn't contain enough elements, requested ${requestedItems}, filled slots ${filledSlots}`);
	}
}

/**
 * Error that is thrown when trying to enqueue n items into a queue having an availability of m < n slots.
 */
export class NotEnoughAvailableSlotsQueueError extends Error {
	constructor(public requestedItems: number, public availableSlots: number) {
		super(`queue doesn't have enough space, requested ${requestedItems}, available slots ${availableSlots}`);
	}
}

/**
 * Create a circular queue of a given capacity.
 *
 * Example usage:
 * ```ts
 * const queue = makeCircularQueue<string>(3);
 * queue.enqueue('hello');
 * queue.enqueue('world');
 * queue.enqueue('!');
 * console.log(queue.dequeue()); // hello
 * console.log(queue.dequeue()); // world
 * queue.enqueue('bye');
 * console.log(queue.toArray().join(', ')); // !, bye
 * ```
 *
 * @param capacity the number of slots to allocate for this queue.
 * @returns a {@link CircularQueue}
 */
export function makeCircularQueue<T>(capacity: number): CircularQueue<T>;

/**
 * Create a circular queue and initialize it with
 * elements from an array. If the capacity (second optional parameter) is not passed,
 * the array length will be used to determine the maximum queue size.
 *
 * Example usage:
 * ```ts
 * const queue = makeCircularQueue(['hello', 'world']);
 * console.log(queue.dequeue()); // hello
 * console.log(queue.dequeue()); // world
 * ```
 *
 * @param fromArray an array used to initialize the queue.
 * @param capacity (optional) the maximum queue size. If the array length is greater than the capacity,
 * the extra elements will be ignored.
 * @returns a {@link CircularQueue}
 */
export function makeCircularQueue<T>(fromArray: T[], capacity?: number): CircularQueue<T>;

export function makeCircularQueue<T>(capacityOrArray: number | T[], optionalCapacity?: number): CircularQueue<T> {
	const isArray = Array.isArray(capacityOrArray);
	const capacity = isArray ? optionalCapacity ?? capacityOrArray.length : capacityOrArray;

	let queue = new Array<T | undefined>(capacity);

	let head = 0;
	let tail = 0;
	const filledSlots$ = makeStore(0);
	const full$ = makeDerivedStore(filledSlots$, (filled) => filled === capacity);
	const empty$ = makeDerivedStore(filledSlots$, (filled) => filled === 0);
	const availableSlots$ = makeDerivedStore(filledSlots$, (filled) => capacity - filled);

	if (isArray) {
		const copyableItems = Math.min(capacityOrArray.length, capacity);
		for (let i = 0; i < copyableItems; i++) {
			queue[tail] = capacityOrArray[i];
			tail = (tail + 1) % capacity;
		}
		filledSlots$.update((n) => n + copyableItems);
	}

	const enqueue = (v: T) => {
		if (full$.value) {
			throw new NotEnoughAvailableSlotsQueueError(1, 0);
		}
		queue[tail] = v;
		tail = (tail + 1) % capacity;
		filledSlots$.update((n) => n + 1);
	};

	const enqueueMulti = (v: T[]) => {
		const available = availableSlots$.value;
		if (available < v.length) {
			throw new NotEnoughAvailableSlotsQueueError(v.length, available);
		}
		for (let i = 0; i < v.length; i++) {
			queue[tail] = v[i];
			tail = (tail + 1) % capacity;
		}
		filledSlots$.update((n) => n + v.length);
	};

	const clear = () => {
		head = 0;
		tail = 0;
		queue = new Array<T>(capacity);
		filledSlots$.set(0);
	};

	function dequeue(): T;
	function dequeue(n: number): T[];
	function dequeue(items?: number) {
		const filled = filledSlots$.value;
		if (typeof items === 'undefined') {
			if (filled === 0) {
				throw new NotEnoughFilledSlotsQueueError(1, 0);
			}
			const value = queue[head];
			queue[head] = undefined;
			head = (head + 1) % capacity;
			filledSlots$.update((n) => n - 1);
			return value as T;
		} else {
			if (items > filled) {
				throw new NotEnoughFilledSlotsQueueError(items, filled);
			}
			const values = new Array<T>(items);
			for (let i = 0; i < values.length; i++) {
				values[i] = queue[(head + i) % capacity] as T;
				queue[(head + i) % capacity] = undefined;
			}
			head = (head + items) % capacity;
			filledSlots$.set(filled - items);
			return values;
		}
	}
	const dequeueAll = () => dequeue(filledSlots$.value);

	function* iter() {
		while (filledSlots$.value > 0) {
			yield dequeue();
		}
	}

	const toArray = () => {
		const array = new Array(filledSlots$.value);
		for (let i = 0; i < array.length; i++) {
			array[i] = queue[(head + i) % capacity];
		}
		return array;
	};

	const at = (i: number) => {
		const filled = filledSlots$.value;
		if (i >= filled || i < -filled) {
			return undefined;
		}
		if (i >= 0) {
			return queue[(head + i) % capacity];
		} else {
			return queue[(head + filled + i) % capacity];
		}
	};

	const replace = (rawIndex: number, item: T) => {
		const filled = filledSlots$.value;
		if (rawIndex >= filled || rawIndex < -filled) {
			throw new RangeError(`${rawIndex} is not a valid positive nor negative index. The number of filled slots is ${filled}`);
		}
		const distanceFromHead = rawIndex >= 0 ? rawIndex : filled + rawIndex;
		const normalizedIndex = (head + distanceFromHead) % capacity;
		const previousElement = queue[normalizedIndex] as T;
		queue[normalizedIndex] = item;
		return previousElement;
	};

	const remove = (rawIndex: number) => {
		const filled = filledSlots$.value;
		if (rawIndex >= filled || rawIndex < -filled) {
			throw new RangeError(`${rawIndex} is not a valid positive nor negative index. The number of filled slots is ${filled}`);
		}
		const distanceFromHead = rawIndex >= 0 ? rawIndex : filled + rawIndex;
		const normalizedIndex = (head + distanceFromHead) % capacity;
		const previousElement = queue[normalizedIndex] as T;
		if (filled - distanceFromHead < distanceFromHead) {
			for (let i = head; i < head + filled - distanceFromHead - 1; i++) {
				queue[i % capacity] = queue[(i + 1) % capacity];
			}
			tail = (tail + capacity - 1) % capacity;
		} else {
			for (let i = head + distanceFromHead - 1; i >= head; i--) {
				queue[(i + 1) % capacity] = queue[i % capacity];
			}
			head = (head + 1) % capacity;
		}
		filledSlots$.set(filled - 1);
		return previousElement;
	};

	const indexOf = (searchElement: T) => {
		const filled = filledSlots$.value;
		for (let i = 0; i < filled; i++) {
			if (queue[(head + i) % capacity] === searchElement) {
				return i;
			}
		}
		return -1;
	};

	return {
		enqueue,
		enqueueMulti,
		dequeue,
		dequeueAll,
		toArray,
		at,
		indexOf,
		replace,
		remove,
		get availableSlots() {
			return availableSlots$.value;
		},
		availableSlots$,
		get filledSlots() {
			return this.filledSlots$.value;
		},
		filledSlots$,
		get capacity() {
			return capacity;
		},
		iter,
		[Symbol.iterator]: iter,
		get full() {
			return full$.value;
		},
		full$,
		get empty() {
			return empty$.value;
		},
		empty$,
		clear,
	};
}
