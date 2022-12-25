/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Test/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/Test/ErrorLog.mjs";
import * as Memory from "https://scotwatson.github.io/Memory/Test/Memory.mjs";

export class Queue {
  #items;
  #headIndex;
  #tailIndex;
  constructor(args) {
    try {
      const capacity = (function () {
        if (Types.isSimpleObject(args)) {
          if (!(Object.hasOwn(args, "capacity"))) {
            throw "Argument \"capacity\" is required.";
          }
          return args.capacity;
        } else {
          return args;
        }
      })();
      if (!(Types.isInteger(capacity))) {
        throw "Argument \"capacity\" must be an integer.";
      }
      this.#items = new Array(capacity);
      // Initialize to all nulls
      this.#items.fill(null);
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
      if (this.unusedCapacity() === 0) {
        throw "Queue is full.";
      }
      if (this.#tailIndex === this.#items.length) {
        this.#items.copyWithin(0, this.#headIndex, this.#items.length);
        this.#tailIndex -= this.#headIndex;
        this.#headIndex = 0;
        // Set all remaining slots to null to allow proper GC
        this.#items.fill(null, this.#tailIndex);
      }
      this.#items[this.#tailIndex] = args;
      ++this.#tailIndex;
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
      // Set item to null to allow proper GC
      this.#items[this.#headIndex] = null;
      ++this.#headIndex;
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
  getCapacity() {
    try {
      return this.#items.length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.getCapacity",
        error: e,
      });
    }
  }
  setCapacity(args) {
    try {
      const capacity = (function () {
        if (Types.isSimpleObject(args)) {
          if (!(Object.hasOwn(args, "capacity"))) {
            throw "Argument \"capacity\" is required.";
          }
          return args.capacity;
        } else {
          return args;
        }
      })();
      if (!(Types.isInteger(capacity))) {
        throw "Argument \"capacity\" must be an integer.";
      }
      if (capacity < this.usedCapacity) {
        throw "Argument \"capacity\" cannot be less than the used slots.";
      }
      const newItems = new Array(args);
      // Initialize to all nulls
      this.#items.fill(null);
      for (let i = 0, j = this.#headIndex; j < this.#tailIndex; ++i, ++j) {
        newItems[i] = this.#items[j];
      }
      this.#items = newItems;
      this.#tailIndex -= this.#headIndex;
      this.#headIndex = 0;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.setCapacity",
        error: e,
      });
    }
  }
  get usedCapacity() {
    try {
      return (this.#tailIndex - this.#headIndex);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.usedCapacity",
        error: e,
      });
    }
  }
  get unusedCapacity() {
    try {
      return (this.#items.length - (this.#tailIndex - this.#headIndex));
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Queue.unusedCapacity",
        error: e,
      });
    }
  }
};

export class ByteQueue {
  #block;
  #view; // for memoization
  #headIndex;
  #tailIndex;
  #reserveLength;
  constructor(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Argument must be a simple object.";
      }
      if (!(Object.hasOwn(args, "byteLength"))) {
        throw "Argument \"byteLength\" must be provided.";
      }
      this.#block = new Memory.Block({
        byteLength: args.byteLength,
      });
      this.#headIndex = 0;
      this.#tailIndex = 0;
      this.#reserveLength = 0;
      this.#view = new Memory.View({
        memoryBlock: this.#block,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue constructor",
        error: e,
      });
    }
  }
  reserve(args) {
    try {
      const byteLength = (function () {
        if (Types.isInteger(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(Object.hasOwn(args, "byteLength"))) {
            throw "Argument \"byteLength\" must be provided.";
          }
          return args.byteLength;
        } else {
          throw "Invalid Argument";
        }
      })();
      if (byteLength <= 0) {
        throw "Argument \"byteLength\" must be positive.";
      }
      if (byteLength >= this.#block.byteLength) {
        throw "Argument \"byteLength\" must be less than byteCapacity.";
      }
      if (this.#tailIndex + byteLength > this.#block.byteLength) {
        this.#view.copyWithin({
          fromStart: this.#headIndex,
          fromEnd: this.#tailIndex,
          toStart: 0,
        });
        this.#tailIndex -= this.#headIndex;
        this.#headIndex = 0;
      }
      this.#reserveLength = byteLength;
      return this.#view.createSlice({
        byteOffset: this.#tailIndex,
        byteLength: this.#reserveLength,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.reserve",
        error: e,
      });
    }
  }
  enqueue(args) {
    try {
      const byteLength = (function () {
        if (Types.isInteger(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!(Object.hasOwn(args, "byteLength"))) {
            throw "Argument \"byteLength\" must be provided.";
          }
          return args.byteLength;
        } else {
          throw "Invalid Argument";
        }
      })();
      if (byteLength > this.#reserveLength) {
        throw "Argument \"byteLength\" cannot be greater than reserve byteLength (cannot enqueue more bytes than reserved).";
      }
      this.#tailIndex += this.#reserveLength;
      this.#reserveLength = 0;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.enqueue",
        error: e,
      });
    }
  }
  dequeue(args) {
    try {
      let memoryView;
      if (args.constructor === Memory.View) {
        memoryView = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "memoryView"))) {
          throw "Argument \"memoryView\" must be provided.";
        }
        memoryView = args.memoryView;
      } else {
        throw "Invalid Argument";
      }
      let byteLength = memoryView.byteLength;
      if (this.#headIndex + byteLength >= this.#tailIndex) {
        throw "More bytes requested than are available in queue.";
      }
      const view = this.#view.createSlice({
        byteOffset: this.#headIndex,
        byteLength: memoryView.byteLength,
      });
      memoryView.set(view);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.dequeue",
        error: e,
      });
    }
  }
  get usedCapacity() {
    try {
      return (this.#tailIndex - this.#headIndex);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.unusedCapacity",
        error: e,
      });
    }
  }
  get unusedCapacity() {
    try {
      return (this.#block.byteLength - (this.#tailIndex - this.#headIndex));
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.unusedCapacity",
        error: e,
      });
    }
  }
}
