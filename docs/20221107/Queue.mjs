/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/20221107/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/20221107/ErrorLog.mjs";
import * as Memory from "https://scotwatson.github.io/Memory/20221107/Memory.mjs";

export class Queue {
  #items;
  #headIndex;
  #tailIndex;
  constructor(args) {
    try {
      let capacity;
      if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "capacity"))) {
          throw "Argument \"capacity\" is required.";
        }
        capacity = args.capacity;
      } else {
        capacity = args;
      }
      if (!(Types.isInteger(capacity))) {
        throw "Argument \"capacity\" must be an integer.";
      }
      this.#items = new Array(capacity + 1);
      this.#headIndex = 0;
      this.#tailIndex = 0;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue constructor",
        error: e,
      });
    }
  }
  enqueue(args) {
    try {
      if (this.availableSlots() === 0) {
        throw "Queue is full.";
      }
      this.#items[this.#tailIndex] = args;
      this.#tailIndex = (this.#tailIndex + 1) % this.#items.length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.enqueue",
        error: e,
      });
    }
  }
  dequeue(args) {
    try {
      if (this.isEmpty()) {
        throw "Empty queue cannot be dequeued.";
      }
      const item = this.#items[this.#headIndex];
      this.#items[this.#headIndex] = null;
      this.#headIndex = (this.#headIndex + 1) % this.#items.length;
      return item;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.dequeue",
        error: e,
      });
    }
  }
  isEmpty() {
    try {
      return (this.#tailIndex === this.#headIndex);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.isEmpty",
        error: e,
      });
    }
  }
  availableSlots() {
    try {
      if (this.#tailIndex > this.#headIndex) {
        return (this.#items.length - (this.#tailIndex - this.#headIndex));
      } else {
        return (this.#headIndex - this.#tailIndex);
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.availableSlots",
        error: e,
      });
    }
  }
  getCapacity() {
    try {
      return (this.#items.length - 1);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.getCapacity",
        error: e,
      });
    }
  }
  setCapacity(args) {
    try {
      const usedSlots = (function () {
        if (this.#tailIndex > this.#headIndex) {
          return (this.#tailIndex - this.#headIndex) - 1;
        } else {
          return ((this.#tailIndex - this.#headIndex) + this.#items.length) - 1;
        }
      })();
      if (args < usedSlots) {
        throw "Capacity cannot be less than the used slots.";
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
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.setCapacity",
        error: e,
      });
    }
  }
};

export class DataQueue {
  #buffer;
  #items;
  #reserveLength;
  get viewCtor() {
    try {
      const viewCtorNum = (new DataView(this.#buffer)).getUint32(0);
      if (viewCtorNum > viewCtors.length) {
        throw new Error("viewCtorNum out of range: " + viewCtorNum);
      }
      return viewCtors[viewCtorNum];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.viewCtor",
        error: e,
      });
    }
  }
  get #headIndex() {
    try {
      return (new DataView(this.#buffer)).getUint32(4);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataQueue.#headIndex",
        error: e,
      });
    }
  }
  get #tailIndex() {
    try {
      return (new DataView(this.#buffer)).getUint32(8);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataQueue.#tailIndex",
        error: e,
      });
    }
  }
  set #headIndex(newValue) {
    try {
      (new DataView(this.#buffer)).setUint32(4, newValue);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set DataQueue.#headIndex",
        error: e,
      });
    }
  }
  set #tailIndex(newValue) {
    try {
      (new DataView(this.#buffer)).setUint32(8, newValue);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "set DataQueue.#tailIndex",
        error: e,
      });
    }
  }
  constructor(args) {
    try {
      if (Object.hasOwn(args, "buffer")) {
        this.#buffer = args.buffer;
        if (Object.hasOwn(args, "viewCtor")) {
          if (args.viewCtor !== this.viewCtor) {
            throw "viewCtor does not match.";
          }
        }
        if (Object.hasOwn(args, "length")) {
          const requiredLength = args.length * args.viewCtor.BYTES_PER_ELEMENT + 12;
          if (args.length !== requiredLength) {
            throw "length does not match.";
          }
        }
      } else {
        if (!(Object.hasOwn(args, "viewCtor"))) {
          throw "viewCtor is required.";
        }
        if (!(Object.hasOwn(args, "length"))) {
          throw "length is required.";
        }
        const viewCtorNum = viewCtors.indexOf(args.viewCtor);
        if (viewCtorNum === -1) {
          throw "args.viewCtor is not a view constructor.";
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
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue constructor",
        error: e,
      });
    }
  }
  reserve(args) {
    try {
      if (!(args.hasOwnProperty("length"))) {
        throw "length is required.";
      }
      if (this.#reserveLength !== 0) {
        throw "Enqueue existing reserve before requesting more.";
      }
      if (args.length > this.remainingSpaces()) {
        throw "Insufficient space.";
      }
      if (args.length > (this.#items.length - this.#tailIndex)) {
        this.#items.copyWithin(0, this.#headIndex, this.#tailIndex);
        this.#tailIndex -= this.#headIndex;
        this.#headIndex = 0;
      }
      this.#reserveLength = args.length;
      return this.#items.subarray(this.#tailIndex, this.#tailIndex + args.length);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.reserve",
        error: e,
      });
    }
  }
  enqueue() {
    try {
      if (this.#reserveLength === 0) {
        throw "No reserve available to enqueue.";
      }
      this.#tailIndex += this.#reserveLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.enqueue",
        error: e,
      });
    }
  }
  dequeue(args) {
    try {
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
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.dequeue",
        error: e,
      });
    }
  }
  isEmpty() {
    try {
      return (this.#tailIndex === this.#headIndex);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.isEmpty",
        error: e,
      });
    }
  }
  remainingSpaces() {
    try {
      return (this.#items.length - (this.#tailIndex - this.#headIndex));
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "DataQueue.remainingSpaces",
        error: e,
      });
    }
  }
  // NOTE: Return value is only to be used to construct a copy of the queue. Do not read or modify.
  get buffer() {
    try {
      return this.#buffer;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get DataQueue.buffer",
        error: e,
      });
    }
  }
};
