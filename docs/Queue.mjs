/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export class Queue {
  #items;
  #headIndex;
  #tailIndex;
  constructor(args) {
    if (!(args.hasOwnProperty("length"))) {
      throw new Error("length is required.");
    }
    this.#items = new Array(length + 1);
    this.#headIndex = 0;
    this.#tailIndex = 0;
  }
  enqueue(args) {
    if (this.availableSlots() === 0) {
      throw new Error("Queue is full.");
    }
    this.#items[this.#tailIndex] = args;
    this.#tailIndex = (this.#tailIndex + 1) % this.#items.length;
  }
  dequeue(args) {
    if (this.isEmpty()) {
      throw new Error("Empty queue cannot be dequeued.");
    }
    const item = this.#items[this.#headIndex];
    this.#items[this.#headIndex] = null;
    this.#headIndex = (this.#headIndex + 1) % this.#items.length;
    return item;
  }
  isEmpty() {
    return (this.#tailIndex === this.#headIndex);
  }
  availableSlots() {
    if (this.#tailIndex > this.#headIndex) {
      return (this.#items.length - (this.#tailIndex - this.#headIndex));
    } else {
      return (this.#headIndex - this.#tailIndex);
    }
  }
  getCapacity() {
    return (this.#items.length - 1);
  }
  setCapacity(args) {
    const usedSlots = (function () {
      if (this.#tailIndex > this.#headIndex) {
        return (this.#tailIndex - this.#headIndex) - 1;
      } else {
        return ((this.#tailIndex - this.#headIndex) + this.#items.length) - 1;
      }
    })();
    if (args < usedSlots) {
      throw new Error("Capacity cannot be less than the used slots.");
    }
    const newItems = new Array(args + 1);
    let i = this.#headIndex;
    let j = 0;
    if (this.#tailIndex > this.#headIndex) {
      for (; i < this.#tailIndex; ++i, ++j) {
        newItems[j] = this.#items[i];
      }
    } else {
      for (; i < this.#items.length; ++i, ++j) {
        newItems[j] = this.#items[i];
      }
      i = 0;
      for (; i < this.#tailIndex; ++i, ++j) {
        newItems[j] = this.#items[i];
      }
    }
    this.#items = newItems;
    this.#headIndex = 0;
    this.#tailIndex = usedSlots;
  }
};

const viewCtors = [ Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array,  BigUint64Array ];

export class DataQueue {
  #buffer;
  #items;
  #reserveLength;
  get viewCtor() {
    const viewCtorNum = (new DataView(this.#buffer)).getUint32(0);
    if (viewCtorNum > viewCtors.length) {
      throw new Error("viewCtorNum out of range: " + viewCtorNum);
    }
    return viewCtors[viewCtorNum];
  }
  get #headIndex() {
    return (new DataView(this.#buffer)).getUint32(4);
  }
  get #tailIndex() {
    return (new DataView(this.#buffer)).getUint32(8);
  }
  set #headIndex(newValue) {
    (new DataView(this.#buffer)).setUint32(4, newValue);
  }
  set #tailIndex(newValue) {
    (new DataView(this.#buffer)).setUint32(8, newValue);
  }
  constructor(args) {
    if (args.hasOwnProperty("buffer")) {
      this.#buffer = args.buffer;
      if (args.hasOwnProperty("viewCtor")) {
        if (args.viewCtor !== this.viewCtor) {
          throw new Error("viewCtor does not match.");
        }
      }
      if (args.hasOwnProperty("length")) {
        const requiredLength = args.length * args.viewCtor.BYTES_PER_ELEMENT + 12;
        if (args.length !== requiredLength) {
          throw new Error("length does not match.");
        }
      }
    } else {
      if (!(args.hasOwnProperty("viewCtor"))) {
        throw new Error("viewCtor is required.");
      }
      if (!(args.hasOwnProperty("length"))) {
        throw new Error("length is required.");
      }
      const viewCtorNum = viewCtors.indexOf(args.viewCtor);
      if (viewCtorNum === -1) {
        throw new Error("args.viewCtor is not a view constructor.");
      }
      // Strict comparison against true to ensure that args.shared is a boolean value
      if (args.shared === true) {
        this.#buffer = new SharedArrayBuffer(args.length * args.viewCtor.BYTES_PER_ELEMENT + 12);
      } else {
        this.#buffer = new ArrayBuffer(args.length * args.viewCtor.BYTES_PER_ELEMENT + 12);
      }
      (new DataView(this.#buffer)).setUint32(0, viewCtorNum);
    }
    this.#reserveLength = 0;
    this.#items = new this.viewCtor(this.#buffer, 12, args.length);
    // headIndex & tailIndex are automatically 0
  }
  reserve(args) {
    if (!(args.hasOwnProperty("length"))) {
      throw new Error("length is required.");
    }
    if (this.#reserveLength !== 0) {
      throw new Error("Enqueue existing reserve before requesting more.");
    }
    if (args.length > this.remainingSpaces()) {
      throw new Error("Insufficient space.");
    }
    if (args.length > (this.#items.length - this.#tailIndex)) {
      this.#items.copyWithin(0, this.#headIndex, this.#tailIndex);
      this.#tailIndex -= this.#headIndex;
      this.#headIndex = 0;
    }
    this.#reserveLength = args.length;
    return this.#items.subarray(this.#tailIndex, this.#tailIndex + args.length);
  }
  enqueue() {
    if (this.#reserveLength === 0) {
      throw new Error("No reserve available to enqueue.");
    }
    this.#tailIndex += this.#reserveLength;
  }
  dequeue(args) {
    if (!(args.hasOwnProperty("view"))) {
      throw new Error("view is required.");
    }
    if (this.#headIndex + args.view.length > this.#tailIndex) {
      throw new Error("More data requested than is available in queue.");
    }
    let ret = this.#items.subarray(this.#headIndex, this.#headIndex + args.view.length);
    args.view.set(ret);
    this.#headIndex += args.length;
    return;
  }
  isEmpty() {
    return (this.#tailIndex === this.#headIndex);
  }
  remainingSpaces() {
    return (this.#items.length - (this.#tailIndex - this.#headIndex));
  }
  // NOTE: Return value is only to be used to construct a copy of the queue. Do not read or modify.
  get buffer() {
    return this.#buffer;
  }
};
