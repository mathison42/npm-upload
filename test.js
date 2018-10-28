function delay() {
  return new Promise(resolve => setTimeout(resolve, 3000));
 }
async function delayedLog(item) {
  // notice that we can await a function that returns promise
  await delay();
  // log item only after a delay
  console.log(item);
}
async function processArray(array) {
  for (const item in array) {
    await delayedLog(array[item])
  }
  console.log("done!")
}
processArray([1, 2, 3]);
