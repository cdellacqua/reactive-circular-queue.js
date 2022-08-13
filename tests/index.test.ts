import {expect} from 'chai';
import {makeCircularQueue, NotEnoughAvailableSlotsQueueError, NotEnoughFilledSlotsQueueError} from '../src/lib/index';

describe('circular queue', () => {
	it('constructs a queue of length 0', () => {
		const q = makeCircularQueue<number>(0);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(() => q.enqueue(1)).to.throw(NotEnoughAvailableSlotsQueueError);
		expect(() => q.dequeue()).to.throw(NotEnoughFilledSlotsQueueError);
		expect(q.empty$.content()).to.be.true;
		expect(q.full$.content()).to.be.true;
	});
	it('constructs a queue from an array', () => {
		const q = makeCircularQueue([0, 1, 2, 3]);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(q.filledSlots$.content()).to.eq(4);
		expect(q.capacity).to.eq(4);
		expect(q.dequeue()).to.eq(0);
		expect(q.dequeue()).to.eq(1);
		expect(q.dequeue()).to.eq(2);
		expect(q.dequeue()).to.eq(3);
		expect(q.availableSlots$.content()).to.eq(4);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.capacity).to.eq(4);
	});
	it('constructs a queue from an array, but specifies a capacity greater than its length', () => {
		const q = makeCircularQueue([0, 1, 2, 3], 7);
		expect(q.availableSlots$.content()).to.eq(3);
		expect(q.filledSlots$.content()).to.eq(4);
		expect(q.capacity).to.eq(7);
		q.enqueue(4);
		q.enqueue(5);
		q.enqueue(6);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(q.filledSlots$.content()).to.eq(7);
		expect(q.capacity).to.eq(7);
		expect(q.dequeue()).to.eq(0);
		expect(q.dequeue()).to.eq(1);
		expect(q.dequeue()).to.eq(2);
		expect(q.dequeue()).to.eq(3);
		expect(q.dequeue()).to.eq(4);
		expect(q.dequeue()).to.eq(5);
		expect(q.dequeue()).to.eq(6);
		expect(q.availableSlots$.content()).to.eq(7);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.capacity).to.eq(7);
	});
	it('constructs a queue from an array, but specifies a capacity less than its length', () => {
		const q = makeCircularQueue([0, 1, 2, 3], 2);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.capacity).to.eq(2);
		expect(q.dequeue()).to.eq(0);
		expect(q.dequeue()).to.eq(1);
		expect(q.availableSlots$.content()).to.eq(2);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.capacity).to.eq(2);
	});
	it('checks the getters', () => {
		const q = makeCircularQueue<number>(1);

		expect(q.capacity).to.eq(1);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.availableSlots$.content()).to.eq(1);
		expect(q.empty$.content()).to.be.true;
		expect(q.full$.content()).to.be.false;

		q.enqueue(1);
		expect(q.capacity).to.eq(1);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(q.empty$.content()).to.be.false;
		expect(q.full$.content()).to.be.true;

		expect(q.dequeue()).to.eq(1);
		expect(q.capacity).to.eq(1);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.availableSlots$.content()).to.eq(1);
		expect(q.empty$.content()).to.be.true;
		expect(q.full$.content()).to.be.false;
	});
	it('fails to construct a queue of length 0.5', () => {
		expect(() => makeCircularQueue<number>(0.5)).to.throw('Invalid array length');
	});
	it('constructs a queue of length 1', () => {
		const q = makeCircularQueue<number>(1);
		expect(q.availableSlots$.content()).to.eq(1);
		q.enqueue(1);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(() => q.enqueue(2)).to.throw(NotEnoughAvailableSlotsQueueError);
		expect(q.dequeue()).to.eq(1);
		expect(q.availableSlots$.content()).to.eq(1);
	});
	it('constructs a queue of length 2', () => {
		const q = makeCircularQueue<number>(2);
		expect(q.availableSlots$.content()).to.eq(2);
		q.enqueue(1);
		expect(q.availableSlots$.content()).to.eq(1);
		q.enqueue(2);
		expect(q.availableSlots$.content()).to.eq(0);
		expect(q.dequeue()).to.eq(1);
		expect(q.availableSlots$.content()).to.eq(1);
		expect(q.dequeue()).to.eq(2);
		expect(q.availableSlots$.content()).to.eq(2);
	});
	it('checks that the queue rotates', () => {
		const q = makeCircularQueue<number>(10);
		for (let i = 0; i < 10; i++) {
			q.enqueue(i);
		}
		for (let i = 10; i < 100; i++) {
			expect(() => q.enqueue(i)).to.throw(NotEnoughAvailableSlotsQueueError);
			expect(q.dequeue()).to.eq(i - 10);
			q.enqueue(i);
		}
	});
	it('clears the queue', () => {
		const q = makeCircularQueue<number>(10);
		for (let i = 0; i < 10; i++) {
			q.enqueue(i);
		}
		expect(q.full$.content()).to.be.true;
		q.clear();
		expect(q.full$.content()).to.be.false;
		for (let i = 0; i < 10; i++) {
			q.enqueue(i);
		}
		expect(q.full$.content()).to.be.true;
	});
	it('consumes the queue using a for..of loop', () => {
		const q = makeCircularQueue<number>(10);
		for (let i = 0; i < 10; i++) {
			q.enqueue(i);
		}
		expect(q.full$.content()).to.be.true;
		let i = 0;
		for (const value of q) {
			expect(value).to.eq(i);
			i++;
		}
		expect(q.empty$.content()).to.be.true;
	});
	it('consumes the queue using an iterator', () => {
		const q = makeCircularQueue<number>(10);
		for (let i = 0; i < 10; i++) {
			q.enqueue(i);
		}
		expect(q.full$.content()).to.be.true;
		let i = 0;
		const iterator = q.iter();
		let current = iterator.next();
		while (!current.done) {
			expect(current.value).to.eq(i);
			i++;
			current = iterator.next();
		}
		expect(q.empty$.content()).to.be.true;
	});
	it('consumes an empty queue using an iterator', () => {
		const q = makeCircularQueue<number>(10);
		expect(q.empty$.content()).to.be.true;
		expect(q.iter().next().done).to.be.true;
	});
	it('consumes an empty queue with a for..of loop', () => {
		const q = makeCircularQueue<number>(10);
		expect(q.empty$.content()).to.be.true;
		let looped = false;
		for (const _value of q) {
			looped = true;
		}
		expect(looped).to.be.false;
	});
	it('checks stores', () => {
		const q = makeCircularQueue<number>(2);
		expect(q.empty$.content()).to.eq(q.empty$.content());
		expect(q.full$.content()).to.eq(q.full$.content());
		expect(q.availableSlots$.content()).to.eq(q.availableSlots$.content());
		expect(q.filledSlots$.content()).to.eq(q.filledSlots$.content());

		q.enqueue(10);
		expect(q.empty$.content()).to.eq(q.empty$.content());
		expect(q.full$.content()).to.eq(q.full$.content());
		expect(q.availableSlots$.content()).to.eq(q.availableSlots$.content());
		expect(q.filledSlots$.content()).to.eq(q.filledSlots$.content());

		q.enqueue(11);
		expect(q.empty$.content()).to.eq(q.empty$.content());
		expect(q.full$.content()).to.eq(q.full$.content());
		expect(q.availableSlots$.content()).to.eq(q.availableSlots$.content());
		expect(q.filledSlots$.content()).to.eq(q.filledSlots$.content());

		q.dequeue();
		expect(q.empty$.content()).to.eq(q.empty$.content());
		expect(q.full$.content()).to.eq(q.full$.content());
		expect(q.availableSlots$.content()).to.eq(q.availableSlots$.content());
		expect(q.filledSlots$.content()).to.eq(q.filledSlots$.content());

		q.dequeue();
		expect(q.empty$.content()).to.eq(q.empty$.content());
		expect(q.full$.content()).to.eq(q.full$.content());
		expect(q.availableSlots$.content()).to.eq(q.availableSlots$.content());
		expect(q.filledSlots$.content()).to.eq(q.filledSlots$.content());
	});
	it('reacts to filledSlots$ changes', () => {
		const q = makeCircularQueue<number>(2);
		let actual = -1;
		q.filledSlots$.subscribe((n) => (actual = n));
		expect(actual).to.eq(0);
		q.enqueue(10);
		expect(actual).to.eq(1);
		q.enqueue(11);
		expect(actual).to.eq(2);
		q.dequeue();
		expect(actual).to.eq(1);
		q.dequeue();
		expect(actual).to.eq(0);
	});
	it('tests toArray()', () => {
		const q = makeCircularQueue<number>(5);
		expect(q.toArray().join(', ')).to.eq('');
		q.enqueue(1);
		expect(q.toArray().join(', ')).to.eq('1');
		q.enqueue(2);
		expect(q.toArray().join(', ')).to.eq('1, 2');
		q.enqueue(3);
		expect(q.toArray().join(', ')).to.eq('1, 2, 3');
		q.enqueue(4);
		expect(q.toArray().join(', ')).to.eq('1, 2, 3, 4');
		q.dequeue();
		expect(q.toArray().join(', ')).to.eq('2, 3, 4');
		q.enqueue(5);
		expect(q.toArray().join(', ')).to.eq('2, 3, 4, 5');
		q.enqueue(6);
		expect(q.toArray().join(', ')).to.eq('2, 3, 4, 5, 6');
	});
	it('tests at(i)', () => {
		const q = makeCircularQueue<number>(5);
		expect(q.at(0)).to.be.undefined;
		expect(q.at(1)).to.be.undefined;
		expect(q.at(-1)).to.be.undefined;
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		expect(q.toArray().join(', ')).to.eq('');
		q.enqueue(1);
		expect(q.toArray().join(', ')).to.eq('1');
		expect(q.at(0)).to.eq(1);
		expect(q.at(1)).to.be.undefined;
		expect(q.at(-1)).to.eq(1);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.enqueue(2);
		expect(q.toArray().join(', ')).to.eq('1, 2');
		expect(q.at(0)).to.eq(1);
		expect(q.at(1)).to.eq(2);
		expect(q.at(-1)).to.eq(2);
		expect(q.at(2)).to.be.undefined;
		expect(q.at(-2)).to.eq(1);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.enqueue(3);
		expect(q.toArray().join(', ')).to.eq('1, 2, 3');
		expect(q.at(0)).to.eq(1);
		expect(q.at(1)).to.eq(2);
		expect(q.at(-1)).to.eq(3);
		expect(q.at(2)).to.eq(3);
		expect(q.at(-2)).to.eq(2);
		expect(q.at(3)).to.be.undefined;
		expect(q.at(-3)).to.eq(1);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.enqueue(4);
		expect(q.toArray().join(', ')).to.eq('1, 2, 3, 4');
		expect(q.at(0)).to.eq(1);
		expect(q.at(1)).to.eq(2);
		expect(q.at(-1)).to.eq(4);
		expect(q.at(2)).to.eq(3);
		expect(q.at(-2)).to.eq(3);
		expect(q.at(3)).to.eq(4);
		expect(q.at(-3)).to.eq(2);
		expect(q.at(4)).to.be.undefined;
		expect(q.at(-4)).to.eq(1);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.dequeue();
		expect(q.toArray().join(', ')).to.eq('2, 3, 4');
		expect(q.at(0)).to.eq(2);
		expect(q.at(1)).to.eq(3);
		expect(q.at(-1)).to.eq(4);
		expect(q.at(2)).to.eq(4);
		expect(q.at(-2)).to.eq(3);
		expect(q.at(3)).to.be.undefined;
		expect(q.at(-3)).to.eq(2);
		expect(q.at(4)).to.be.undefined;
		expect(q.at(-4)).to.be.undefined;
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.enqueue(5);
		expect(q.toArray().join(', ')).to.eq('2, 3, 4, 5');
		expect(q.at(0)).to.eq(2);
		expect(q.at(1)).to.eq(3);
		expect(q.at(-1)).to.eq(5);
		expect(q.at(2)).to.eq(4);
		expect(q.at(-2)).to.eq(4);
		expect(q.at(3)).to.eq(5);
		expect(q.at(-3)).to.eq(3);
		expect(q.at(4)).to.be.undefined;
		expect(q.at(-4)).to.eq(2);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
		q.enqueue(6);
		expect(q.toArray().join(', ')).to.eq('2, 3, 4, 5, 6');
		expect(q.at(0)).to.eq(2);
		expect(q.at(1)).to.eq(3);
		expect(q.at(-1)).to.eq(6);
		expect(q.at(2)).to.eq(4);
		expect(q.at(-2)).to.eq(5);
		expect(q.at(3)).to.eq(5);
		expect(q.at(-3)).to.eq(4);
		expect(q.at(4)).to.eq(6);
		expect(q.at(-4)).to.eq(3);
		expect(q.at(5)).to.be.undefined;
		expect(q.at(-5)).to.eq(2);
		expect(q.at(100)).to.be.undefined;
		expect(q.at(-100)).to.be.undefined;
	});
	it('tests replace(i, item)', () => {
		const q = makeCircularQueue<number>(5);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(() => q.replace(0, 1)).to.throw(RangeError);
		expect(() => q.replace(-1, 1)).to.throw(RangeError);
		expect(() => q.replace(1, 1)).to.throw(RangeError);
		expect(() => q.replace(-2, 1)).to.throw(RangeError);
		q.enqueue(1);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.at(0)).to.eq(1);
		q.replace(0, 2);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.at(0)).to.eq(2);
		q.replace(-1, 3);
		expect(q.at(0)).to.eq(3);
		expect(() => q.replace(-2, 4)).to.throw(RangeError);
		q.enqueue(10);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.at(1)).to.eq(10);
		q.replace(1, 20);
		expect(q.at(1)).to.eq(20);
		q.replace(-1, 30);
		expect(q.at(1)).to.eq(30);
		q.replace(-2, 40);
		expect(q.at(0)).to.eq(40);
		expect(() => q.replace(-3, 4)).to.throw(RangeError);
		expect(q.filledSlots$.content()).to.eq(2);
	});
	it('tests at/replace on a queue of length 0', () => {
		const q = makeCircularQueue<number>(0);
		expect(q.at(0)).to.be.undefined;
		expect(() => q.replace(0, 3)).to.throw(RangeError);
	});
	it('tests the return value of replace(i, item)', () => {
		const q = makeCircularQueue<number>(5);
		expect(q.filledSlots$.content()).to.eq(0);
		q.enqueue(1);
		expect(q.replace(0, 2)).to.eq(1);
		expect(q.replace(-1, 3)).to.eq(2);
		q.enqueue(10);
		expect(q.replace(1, 20)).to.eq(10);
		expect(q.replace(-2, 4)).to.eq(3);
	});
	it('dequeues passing the number of items to remove', () => {
		const q = makeCircularQueue<number>(5);
		expect(() => q.dequeue(0)).not.to.throw();
		q.enqueue(42);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(() => q.dequeue(0)).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.dequeue(1)).to.eql([42]);
		expect(q.filledSlots$.content()).to.eq(0);
		q.enqueue(42);
		q.enqueue(73);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.dequeue(2)).to.eql([42, 73]);
		expect(q.filledSlots$.content()).to.eq(0);
		q.enqueue(42);
		q.enqueue(73);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(() => q.dequeue(3)).to.throw(NotEnoughFilledSlotsQueueError);
		expect(q.dequeue(1)).to.eql([42]);
	});
	it('dequeues all elements using dequeueAll', () => {
		const q = makeCircularQueue<number>(5);
		expect(() => q.dequeueAll()).not.to.throw();
		q.enqueue(42);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(() => q.dequeueAll()).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(0);
		expect(() => q.dequeueAll()).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(0);
		q.enqueue(42);
		q.enqueue(73);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.dequeueAll()).to.eql([42, 73]);
		expect(q.filledSlots$.content()).to.eq(0);
		q.enqueue(42);
		q.enqueue(73);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(() => q.dequeueAll()).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(0);
	});
	it('enqueues multiple items at once', () => {
		const q = makeCircularQueue<number>(5);
		expect(() => q.enqueueMulti([1, 2, 3, 4, 5])).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(5);
		q.dequeue();
		expect(q.filledSlots$.content()).to.eq(4);
		expect(() => q.enqueueMulti([6, 7, 8])).to.throw(NotEnoughAvailableSlotsQueueError);
		expect(q.filledSlots$.content()).to.eq(4);
		expect(() => q.enqueueMulti([6])).not.to.throw();
		expect(q.filledSlots$.content()).to.eq(5);
		q.dequeue(3);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(() => q.enqueueMulti([7, 8, 9])).not.to.throw();
		expect(q.toArray()).to.eql([5, 6, 7, 8, 9]);
		expect(() => q.enqueueMulti([])).not.to.throw();
		expect(() => q.enqueueMulti([1])).to.throw(NotEnoughAvailableSlotsQueueError);
	});
	it('enqueues zero elements', () => {
		const q = makeCircularQueue<number>(5);
		expect(() => q.enqueueMulti([])).not.to.throw();
		expect(() => q.enqueueMulti([1, 2, 3, 4, 5])).not.to.throw();
		expect(() => q.enqueueMulti([])).not.to.throw();
	});
	it('dequeues zero elements', () => {
		const q = makeCircularQueue<number>(5);
		q.enqueueMulti([1, 2, 3, 4, 5]);
		expect(q.filledSlots$.content()).to.eq(5);
		expect(q.dequeue(0).length).to.eq(0);
		expect(q.filledSlots$.content()).to.eq(5);
	});
	it('dequeues all elements from an empty queue', () => {
		const q = makeCircularQueue<number>(5);
		expect(q.filledSlots$.content()).to.eq(0);
		expect(q.dequeueAll().length).to.eq(0);
		expect(q.filledSlots$.content()).to.eq(0);
	});
	it('removes an element from an empty queue', () => {
		const q = makeCircularQueue<number>(3);
		expect(() => q.remove(0)).to.throw(RangeError);
		expect(() => q.remove(-1)).to.throw(RangeError);
		expect(() => q.remove(1)).to.throw(RangeError);
		expect(() => q.remove(-2)).to.throw(RangeError);
		expect(() => q.remove(2)).to.throw(RangeError);
	});
	it('removes elements from invalid index in a queue', () => {
		const q = makeCircularQueue([1, 2, 3]);
		expect(q.toArray()).to.eql([1, 2, 3]);
		expect(q.filledSlots$.content()).to.eq(3);
		expect(() => q.remove(3)).to.throw(RangeError);
		expect(() => q.remove(-4)).to.throw(RangeError);
		expect(() => q.remove(100)).to.throw(RangeError);
		expect(() => q.remove(-40)).to.throw(RangeError);
		expect(q.toArray()).to.eql([1, 2, 3]);
	});
	it('removes elements from the head of a queue', () => {
		const q = makeCircularQueue([1, 2, 3]);
		expect(q.toArray()).to.eql([1, 2, 3]);
		expect(q.filledSlots$.content()).to.eq(3);
		expect(q.remove(0)).to.eq(1);
		expect(q.toArray()).to.eql([2, 3]);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.remove(0)).to.eq(2);
		expect(q.toArray()).to.eql([3]);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.remove(0)).to.eq(3);
		expect(q.toArray()).to.eql([]);
		expect(q.filledSlots$.content()).to.eq(0);
	});
	it('removes elements from the tail of a queue', () => {
		const q = makeCircularQueue([1, 2, 3]);
		expect(q.toArray()).to.eql([1, 2, 3]);
		expect(q.filledSlots$.content()).to.eq(3);
		expect(q.remove(-1)).to.eq(3);
		expect(q.toArray()).to.eql([1, 2]);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.remove(-1)).to.eq(2);
		expect(q.toArray()).to.eql([1]);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.remove(-1)).to.eq(1);
		expect(q.toArray()).to.eql([]);
		expect(q.filledSlots$.content()).to.eq(0);
	});
	it('removes elements from the middle of a queue', () => {
		const q = makeCircularQueue([1, 2, 3]);
		expect(q.toArray()).to.eql([1, 2, 3]);
		expect(q.filledSlots$.content()).to.eq(3);
		expect(q.remove(Math.floor((q.filledSlots$.content() - 1) / 2))).to.eq(2);
		expect(q.toArray()).to.eql([1, 3]);
		expect(q.filledSlots$.content()).to.eq(2);
		expect(q.remove(Math.floor((q.filledSlots$.content() - 1) / 2))).to.eq(1);
		expect(q.toArray()).to.eql([3]);
		expect(q.filledSlots$.content()).to.eq(1);
		expect(q.remove(Math.floor((q.filledSlots$.content() - 1) / 2))).to.eq(3);
		expect(q.toArray()).to.eql([]);
		expect(q.filledSlots$.content()).to.eq(0);
	});
	it('enqueues, dequeues and removes elements from a queue', () => {
		const q = makeCircularQueue<number>(20);
		// offset head and tail
		for (let i = 0; i < 18; i++) {
			q.enqueue(1);
			q.dequeue();
		}
		q.enqueue(1);
		q.enqueue(2);
		q.enqueue(3);
		q.remove(-1);
		q.enqueue(3);
		expect(q.toArray()).to.eql([1, 2, 3]);
		expect(q.filledSlots$.content()).to.eq(3);
		q.remove(1);
		expect(q.toArray()).to.eql([1, 3]);
		expect(q.filledSlots$.content()).to.eq(2);
		q.dequeue();
		expect(q.toArray()).to.eql([3]);
		expect(q.filledSlots$.content()).to.eq(1);
		q.enqueue(1);
		q.enqueue(2);
		q.enqueue(3);
		q.remove(-2);
		q.dequeue();
		q.enqueue(5);
		expect(q.toArray()).to.eql([1, 3, 5]);
		expect(q.filledSlots$.content()).to.eq(3);
	});
	it('tests the indexOf method', () => {
		const q = makeCircularQueue<string>(['0', '1', '2', '3', '4', '5']);
		expect(q.indexOf(1 as unknown as string)).to.eq(-1);
		expect(q.indexOf('0')).to.eq(0);
		expect(q.indexOf('2')).to.eq(2);
		expect(q.indexOf('5')).to.eq(5);
		q.dequeue();
		expect(q.indexOf('5')).to.eq(4);
		q.dequeue();
		expect(q.indexOf('4')).to.eq(2);
		q.dequeue();
		expect(q.indexOf('3')).to.eq(0);
		q.enqueue('20');
		expect(q.indexOf('3')).to.eq(0);
		expect(q.indexOf('20')).to.eq(3);
		q.enqueue('20');
		expect(q.indexOf('20')).to.eq(3);
	});
});
