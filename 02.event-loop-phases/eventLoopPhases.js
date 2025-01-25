/*
 * ==> Node.js event loop phases <==
 *
       ------       -------       -------       --------       ---------
  --> | Poll | --> | Close | --> | Check | --> | Timers | --> | Pending | -->
 |     ------       -------       -------       --------       ---------     |
 |								             |
  <--------------------------------------------------------------------------
  
 * Additionally, there're also two more queues called the microtask queues,
 * 1- A microtask-queue that handles callbacks registered using process.nextTick()
 * 2- The second one handles promises that reject or resolve.
 *
 * Important: 
 * Callbacks in the microtask-queues take priority over callbacks in the phase's normal queus, and
 * the callbacks in the next tick microtask-queue run before callbacks in the promise microtask-queue.
*/


const fs = require('fs');

setImmediate(() => console.log(1)); // Check phase

Promise.resolve().then(() => console.log(2)); // Promises microtask-queue

process.nextTick(()=> console.log(3)); // process.nextTick microtask-queue

fs.readFile('dummyFile', () => {
	console.log(4);	// poll phase
	setTimeout(() => console.log(5)); // Timers phase
	setImmediate(() => console.log(6)); // Check phase
	process.nextTick(() => console.log(7)); // nextTick microtask-queue
});
console.log(8); // poll phase

/*
 * -- OUTPUT --
 * 8  // poll-phase, application code
 * 3  // nextTick microtask-queue has higher priority than phase's normal queue and Promise's microtask-queue.
 * 2  // Promises microtask-queue has higher priority than phase's normal queue.
 * 1  // Check-phase
 * 4  // poll-phase
 * 7  // nextTick microtask-queue has higher priority than phase's normal queue
 * 6  // check-phase comes before timers phase
 * 5  // timers-phase comes last
 */





