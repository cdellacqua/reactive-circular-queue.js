import {makeCircularQueue} from './lib';

const q = makeCircularQueue(10);
q.filledSlots$.subscribe((n) => console.log(`usage: ${Math.floor((n * 100) / q.capacity)}%`));
q.enqueue(10);
q.enqueueMulti([11, 12, 13]);
q.enqueueMulti([11, 12, 13]);
q.enqueueMulti([11, 12, 13]);
q.dequeueAll();
