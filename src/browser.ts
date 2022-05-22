import {makeCircularQueue} from './lib';

const q = makeCircularQueue(10);

const div = document.createElement('div');
document.body.appendChild(div);

q.filledSlots$.subscribe((n) => (div.innerText = `usage: ${Math.floor((n * 100) / q.capacity)}%`));

const buttonAdd = document.createElement('button');
buttonAdd.innerText = 'add';
buttonAdd.addEventListener('click', () => q.enqueue(Math.floor(10 * Math.random())));
document.body.appendChild(buttonAdd);

const buttonRemove = document.createElement('button');
buttonRemove.innerText = 'remove';
buttonRemove.addEventListener('click', () => q.dequeue());
document.body.appendChild(buttonRemove);

const buttonClear = document.createElement('button');
buttonClear.innerText = 'clear';
buttonClear.addEventListener('click', () => q.clear());
document.body.appendChild(buttonClear);

const divSummary = document.createElement('div');
q.filledSlots$.subscribe(() => (divSummary.innerText = q.toArray().join(', ')));
document.body.appendChild(divSummary);
