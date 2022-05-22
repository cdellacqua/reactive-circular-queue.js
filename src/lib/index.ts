import {makeDerivedStore, makeStore, ReadonlyStore} from 'universal-stores';

/**
 * A circular queue implementation with reactive features and Symbol.iterator support.
 */
export type CircularQueue<T> = {
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
	 * Empty the queue.
	 *
	 * Note: this method also resets all references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 */
	clear(): void;
	/**
	 * Add an element at the end of the queue.
	 * @param v a value to enqueue.
	 */
	enqueue(v: T): void;
	/**
	 * Add an array of elements at the end of the queue.
	 * @param v an array of values to enqueue.
	 */
	enqueueMulti(v: T[]): void;
	/**
	 * Remove an element from the start of the queue.
	 *
	 * Note: this method also resets the reference inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 */
	dequeue(): T;
	/**
	 * Remove a given number of elements from the start of the queue.
	 *
	 * Note: this method also resets the references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
	 */
	dequeue(n: number): T[];
	/**
	 * Remove all the element from the queue.
	 *
	 * Note: this method also resets the references inside the queue, so that the garbage collector
	 * can intervene to free up some memory if necessary.
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
	 * Return a copy of this queue in the form of an array.
	 */
	toArray(): T[];
	/**
	 * Return an element inside a queue given an index.
	 * The index can be positive or negative.
	 * If the index is positive it counts forwards from the head of the queue,
	 * if it's negative it counts backwards from the tail of the queue.
	 * As an example q.at(-1) returns the last enqueued element.
	 *
	 * Note: if the index is out of bound this method returns undefined.
	 *
	 * @param positiveOrNegativeIndex an index, either positive (counting from the head of the queue) or negative (counting from the tail of the queue).
	 */
	at(positiveOrNegativeIndex: number): T | undefined;
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
export function makeCircularQueue<T>(capacity: number): CircularQueue<T> {
	let queue = new Array<T | undefined>(capacity);

	let head = 0;
	let tail = 0;
	const filledSlots$ = makeStore(0);
	const full$ = makeDerivedStore(filledSlots$, (filled) => filled === capacity);
	const empty$ = makeDerivedStore(filledSlots$, (filled) => filled === 0);
	const availableSlots$ = makeDerivedStore(filledSlots$, (filled) => capacity - filled);

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

	return {
		enqueue,
		enqueueMulti,
		dequeue,
		dequeueAll,
		toArray,
		at,
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
