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
        byteLength: args.byteLength;
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
      let byteLength;
      if (Types.isInteger(args)) {
        byteLength = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "byteLength"))) {
          throw "Argument \"byteLength\" must be provided.";
        }
        byteLength = args.byteLength;
      } else {
        throw "Invalid Argument";
      }
      if (this.#reserveLength !== 0) {
        throw "Attempt to reserve before enqueue.";
      }
      if (byteLength <= 0) {
        throw "Argument \"byteLength\" must be positive.";
      }
      if (byteLength >= this.#block.byteLength) {
        throw "Argument \"byteLength\" must be less than byteCapacity.";
      }
      if ((this.#tailIndex + byteLength) >= this.#block.byteLength) {
        this.#view.copyWithin({
          fromStart: this.#headIndex,
          fromEnd: this.#tailIndex,
          toStart: 0,
        });
        this.#tailIndex -= this.#headIndex;
        this.#headIndex = 0;
      }
      this.#enqueueReserveLength = byteLength;
      return new Memory.View({
        memoryBlock: this.#block,
        byteOffset: this.#tailIndex,
        byteLength: byteLength,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteQueue.reserve",
        error: e,
      });
    }
  }
  enqueue() {
    try {
      this.#tailIndex += this.#enqueueReserveLength;
      this.#enqueueReserveLength = 0;
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
  usedCapacity() {
    return (this.#tailIndex - this.#headIndex);
  }
  unusedCapacity() {
    return (this.#block.byteLength - (this.#tailIndex - this.#headIndex));
  }
}
