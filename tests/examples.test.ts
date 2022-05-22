import {expect} from 'chai';
import {makeCircularQueue} from '../src/lib/index';

describe('examples', () => {
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
});
