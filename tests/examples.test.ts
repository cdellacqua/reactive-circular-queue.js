import {expect} from 'chai';
import {makeCircularQueue} from '../src/lib/index';

describe('examples', () => {
	it('readme 0', () => {
		// Create an empty queue that can hold up to 3 items.
		const queue1 = makeCircularQueue<string>(3);
		expect(queue1.capacity).to.eq(3); // 3
		expect(queue1.filledSlots).to.eq(0); // 0
		// Create a full queue that can hold up to 3 items (deduced from the array length).
		const queue2 = makeCircularQueue(['hello', 'world', '!']);
		expect(queue2.capacity).to.eq(3); // 3
		expect(queue2.filledSlots).to.eq(3); // 3
		// Create an almost full queue that can hold up to 3 items (as per the second argument).
		const queue3 = makeCircularQueue(['hello', 'world'], 3);
		expect(queue3.capacity).to.eq(3); // 3
		expect(queue3.filledSlots).to.eq(2); // 2
		// Create a full queue that can hold up to 2 items (as per the second argument).
		const queue4 = makeCircularQueue(['hello', 'world', '!'], 2);
		expect(queue4.capacity).to.eq(2); // 2
		expect(queue4.filledSlots).to.eq(2); // 2, only 'hello' and 'world' were copied inside the queue.
		expect(queue4.toArray().join(', ')).to.eq('hello, world');
	});
	it('readme 1', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueue('hello');
		queue.enqueue('world');
		queue.enqueue('!');
		expect(queue.dequeue()).to.eq('hello'); // hello
		expect(queue.dequeue()).to.eq('world'); // world
		queue.enqueue('bye');
		expect(queue.toArray().join(', ')).to.eq('!, bye'); // !, bye
	});
	it('readme 2', () => {
		const queue = makeCircularQueue<string>(3);
		let output = '';
		queue.filledSlots$.subscribe((n) => (output = `using ${n} of ${queue.capacity} slots`)); // immediately prints "using 0 of 3 slots"
		queue.enqueue('hello'); // will trigger the above console.log, printing "using 1 of 3 slots"
		expect(output).to.eq('using 1 of 3 slots');
		queue.enqueue('world'); // will trigger the above console.log, printing "using 2 of 3 slots"
		expect(output).to.eq('using 2 of 3 slots');
		queue.enqueue('!'); // will trigger the above console.log, printing "using 3 of 3 slots"
		expect(output).to.eq('using 3 of 3 slots');
		queue.dequeue(); // will trigger the above console.log, printing "using 2 of 3 slots"
		expect(output).to.eq('using 2 of 3 slots');
		queue.dequeue(); // will trigger the above console.log, printing "using 1 of 3 slots"
		expect(output).to.eq('using 1 of 3 slots');
		queue.enqueue('bye'); // will trigger the above console.log, printing "using 2 of 3 slots"
		expect(output).to.eq('using 2 of 3 slots');
		expect(queue.toArray().join(', ')).to.eq('!, bye'); // !, bye
	});
	it('readme 3', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueueMulti(['hello', 'world']);
		queue.enqueue('!');
		expect(queue.toArray().join(', ')).to.eq('hello, world, !'); // hello, world, !
	});
	it('readme 4', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueueMulti(['hello', 'world']);
		queue.enqueue('!');
		expect(queue.dequeue(2).join(', ')).to.eq('hello, world'); // hello, world
		expect(queue.dequeue()).to.eq('!'); // !
	});
	it('readme 5', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueueMulti(['hello', 'world']);
		queue.enqueue('!');
		expect(queue.dequeueAll().join(', ')).to.eq('hello, world, !'); // hello, world, !
	});
	it('readme 6', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueueMulti(['hello', 'world']);
		expect(queue.at(0)).to.eq('hello'); // hello
		expect(queue.at(1)).to.eq('world'); // world
		expect(queue.at(2)).to.be.undefined; // undefined
		expect(queue.at(-1)).to.eq('world'); // world
		expect(queue.at(-2)).to.eq('hello'); // hello
	});
	it('readme 7', () => {
		const queue = makeCircularQueue<string>(3);
		queue.enqueueMulti(['hello', 'world']);
		expect(queue.filledSlots).to.eq(2); // 2
		let i = 0;
		for (const value of queue) {
			expect(value).to.eq(['hello', 'world'][i]); // prints hello, then world
			expect(queue.filledSlots).to.eq(1 - i); // prints 1, then 0
			i++;
		}
	});
	it('readme 8', () => {
		const queue = makeCircularQueue<string>(1);
		queue.enqueue('hello');
		expect(queue.replace(0, 'world')).to.eq('hello'); // hello
		expect(queue.dequeue()).to.eq('world'); // world
	});
	it('readme 9', () => {
		const queue = makeCircularQueue(['hello', 'world']);
		expect(queue.capacity).to.eq(2);
		expect(queue.dequeue()).to.eq('hello'); // hello
		expect(queue.dequeue()).to.eq('world'); // world
	});
});
