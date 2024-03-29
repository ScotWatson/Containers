/*
(c) 2023 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/20230705/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/20230705/ErrorLog.mjs";
import * as Memory from "https://scotwatson.github.io/Memory/20230705/Memory.mjs";
import * as Tasks from "https://scotwatson.github.io/Tasks/20230705/Tasks.mjs";

export class Sequence {
  #array;
  constructor(args) {
    try {
      this.#array = [];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence constructor",
        error: e,
      });
    }
  }
  get length() {
    try {
      return this.#array.length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sequence.length",
        error: e,
      });
    }
  }
  get [Symbol.iterator]() {
    try {
      return this.#array[Symbol.iterator];
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sequence[Symbol.iterator]",
        error: e,
      });
    }
  }
  at(args) {
    try {
      let index;
      if (Types.isInteger(args)) {
        index = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "index"))) {
          throw "Argument \"index\" is required.";
        }
        if (!(Types.isInteger(args.index))) {
          throw "Argument \"index\" must be an integer.";
        }
        index = args.index;
      } else {
        throw "Invalid Arguments";
      }
      return this.#array.at(index);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.at",
        error: e,
      });
    }
  }
  concat(args) {
    try {
      let sequences;
      if (Types.isArray(args)) {
        sequences = args;
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "sequences"))) {
          throw "Argument \"sequences\" is required.";
        }
        if (Types.isArray(args.sequences)) {
          throw "Argument \"sequences\" must be an array.";
        }
        sequences = args.sequences;
      } else {
        throw "Invalid Arguments";
      }
      let arrays = [];
      for (const thisSeq of sequences) {
        if (!(thisSeq instanceof Sequence)) {
          throw "Only sequences can be concatenated with sequences.";
        }
        arrays.push(thisSeq.#array);
      }
      return this.#array.concat(...arrays);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.concat",
        error: e,
      });
    }
  }
  copyWithin(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "target"))) {
        throw "Argument \"target\" is required.";
      }
      if (!(Types.isInteger(args.target))) {
        throw "Argument \"target\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "start"))) {
        throw "Argument \"start\" is required.";
      }
      if (!(Types.isInteger(args.start))) {
        throw "Argument \"start\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "end"))) {
        throw "Argument \"end\" is required.";
      }
      if (!(Types.isInteger(args.end))) {
        throw "Argument \"end\" must be an integer.";
      }
      return this.#array.copyWithin(args.target, args.start, args.end);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.copyWithin",
        error: e,
      });
    }
  }
  pop() {
    try {
      return this.#array.pop();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.pop",
        error: e,
      });
    }
  }
  push(args) {
    try {
      if (Types.isArray(args)) {
        push_elements(args);
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "element"))) {
          push_element(args.element);
        } else if (!(Object.hasOwn(args, "elements"))) {
          push_elements(args.elements);
        } else {
          throw "Argument \"element\" or \"elements\" must be provided.";
        }
      } else {
        throw "Invalid Arguments";
      }
      function push_elements(elements) {
        return this.#array.push(...elements);
      }
      function push_element(element) {
        return this.#array.push(element);
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.push",
        error: e,
      });
    }
  }
  reverse() {
    try {
      return this.#array.reverse();
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.reverse",
        error: e,
      });
    }
  }
  shift() {
    return this.#array.shift();
  }
  slice(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "start"))) {
        throw "Argument \"start\" is required.";
      }
      if (!(Types.isInteger(args.start))) {
        throw "Argument \"start\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "end"))) {
        throw "Argument \"end\" is required.";
      }
      if (!(Types.isInteger(args.end))) {
        throw "Argument \"end\" must be an integer.";
      }
      return this.#array.slice(args.start, args.end);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.slice",
        error: e,
      });
    }
  }
  splice(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "start"))) {
        throw "Argument \"start\" is required.";
      }
      if (!(Types.isInteger(args.start))) {
        throw "Argument \"start\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "deleteCount"))) {
        throw "Argument \"deleteCount\" is required.";
      }
      if (!(Types.isInteger(args.deleteCount))) {
        throw "Argument \"deleteCount\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "items"))) {
        throw "Argument \"items\" is required.";
      }
      if (!(Types.isArray(args.items))) {
        throw "Argument \"items\" must be an integer.";
      }
      return this.#array.splice(args.start, args.deleteCount, ...args.items);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.splice",
        error: e,
      });
    }
  }
  unshift(args) {
    try {
      if (Types.isArray(args)) {
        unshift_elements(args);
      } else if (Types.isSimpleObject(args)) {
        if (!(Object.hasOwn(args, "element"))) {
          unshift_element(args.element);
        } else if (!(Object.hasOwn(args, "elements"))) {
          unshift_elements(args.elements);
        } else {
          throw "Invalid Arguments";
        }
      } else {
        unshift_element(args);
      }
      function push_elements(elements) {
        return this.#array.unshift(...elements);
      }
      function push_element(element) {
        return this.#array.unshift(element);
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.unshift",
        error: e,
      });
    }
  }
  toArray() {
    return this.#array;
  }
  isSubsequence(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.isSubsequence",
        error: e,
      });
    }
  }
  endsWith(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.endsWith",
        error: e,
      });
    }
  }
  padEnd(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "targetLength"))) {
        throw "Argument \"targetLength\" is required.";
      }
      if (!(Types.isInteger(args.targetLength))) {
        throw "Argument \"targetLength\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "padElement"))) {
        throw "Argument \"padElement\" is required.";
      }
      return Array(args.targetLength).fill(args.padElement).concat(this.#array).slice(-(Math.max(args.targetLength, this.#array.length)));
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.padEnd",
        error: e,
      });
    }
  }
  padStart(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "targetLength"))) {
        throw "Argument \"targetLength\" is required.";
      }
      if (!(Types.isInteger(args.targetLength))) {
        throw "Argument \"targetLength\" must be an integer.";
      }
      if (!(Object.hasOwn(args, "padElement"))) {
        throw "Argument \"padElement\" is required.";
      }
      return this.#array.concat(Array(args.targetLength).fill(args.padElement)).slice(-(Math.max(args.targetLength, this.#array.length)));
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.padEnd",
        error: e,
      });
    }
  }
  repeat(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "count"))) {
        throw "Argument \"count\" is required.";
      }
      if (!(Types.isInteger(args.count))) {
        throw "Argument \"count\" must be an integer.";
      }
      return Array(args.count).fill(this.#array).flat(1);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.repeat",
        error: e,
      });
    }
  }
  replace(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "findSequence"))) {
        throw "Argument \"findSequence\" is required.";
      }
      if (!(args.findSequence instanceof Sequence)) {
        throw "Argument \"findSequence\" must be of type Sequence.";
      }
      if (!(Object.hasOwn(args, "newSequence"))) {
        throw "Argument \"newSequence\" is required.";
      }
      if (!(args.newSequence instanceof Sequence)) {
        throw "Argument \"newSequence\" must be of type Sequence.";
      }
      let newSequenceIterator = args.newSequence[Symbol.iterator]();
      let thisIterator = this.#array[Symbol.iterator]();
      while (!thisIterator.done) {
        if (newSequenceIterator.value === thisIterator.value) {
          newSequenceIterator = newSequenceIterator.next();
        }
        if (newSequenceIterator.done) {
          // Sequence Found!
          newSequenceIterator = args.newSequence[Symbol.iterator]();
        }
        thisIterator = thisIterator.next();
      }
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.replace",
        error: e,
      });
    }
  }
  replaceAll(args) {
    try {
      // sequence:substr
      // sequence:newSubstr
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.replaceAll",
        error: e,
      });
    }
  }
  split(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.split",
        error: e,
      });
    }
  }
  startsWith(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.startsWith",
        error: e,
      });
    }
  }
  toString() {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.toString",
        error: e,
      });
    }
  }
  trim(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.trim",
        error: e,
      });
    }
  }
  trimEnd(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.trimEnd",
        error: e,
      });
    }
  }
  trimStart(args) {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.trimStart",
        error: e,
      });
    }
  }
  valueOf() {
    try {
      throw "Not yet implemented";
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "Sequence.valueOf",
        error: e,
      });
    }
  }
}

export class ByteSequence {
  #buffer;
  #byteLength;
  #reserveLength;
  #outputIndex;
  #inputCallbackController;
  #outputCallbackController;
  constructor() {
    try {
      this.#buffer = new Memory.Block({
        byteLength: 0,
      });
      this.#byteLength = 0;
      this.#reserveLength = 0;
      this.#outputIndex = 0;
      const staticAllocate = Tasks.createStatic({
        function: this.#allocate,
        this: this,
      });
      const staticPush = Tasks.createStatic({
        function: this.#push,
        this: this,
      });
      this.#inputCallbackController = new Tasks.UniqueByteCallbackController({
        allocate: staticAllocate,
        invoke: staticPush,
      });
      const staticPull = Tasks.createStatic({
        function: this.#pull,
        this: this,
      });
      this.#outputCallbackController = new Tasks.UniqueCallbackController({
        invoke: staticPull,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence constructor",
        error: e,
      });
    }
  }
  get byteLength() {
    try {
      return this.#byteLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ByteSequence.byteLength",
        error: e,
      });
    }
  }
  get capacity() {
    try {
      return this.#buffer.length;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ByteSequence.capacity",
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
          if (!("byteLength" in args)) {
            throw "Argument \"byteLength\" must be provided.";
          }
          if (!(Types.isInteger(args.byteLength))) {
            throw "Argument \"byteLength\" must be an integer.";
          }
          return args.index;
        } else {
          throw "Invalid Argument";
        }
      })();
      this.#inputCallbackController.revokeCallback();
      this.#outputCallbackController.revokeCallback();
      return this.#allocate(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.reserve",
        error: e,
      });
    }
  }
  extend(args) {
    try {
      const byteLength = (function () {
        if (Types.isInteger(args)) {
          return args;
        } else if (Types.isSimpleObject(args)) {
          if (!("byteLength" in args)) {
            throw "Argument \"byteLength\" must be provided.";
          }
          if (!(Types.isInteger(args.byteLength))) {
            throw "Argument \"byteLength\" must be an integer.";
          }
          return args.index;
        } else {
          throw "Invalid Argument";
        }
      })();
      this.#inputCallbackController.revokeCallback();
      this.#outputCallbackController.revokeCallback();
      this.#push(byteLength);
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.extend",
        error: e,
      });
    }
  }
  shrinkToFit() {
    try {
      this.#inputCallbackController.revokeCallback();
      this.#outputCallbackController.revokeCallback();
      const oldBufferView = new Memory.View({
        memoryBlock: this.#buffer,
      });
      const fromView = bufferView.createSlice({
        byteOffset: 0,
        byteLength: this.#byteLength,
      });
      this.#buffer = new Memory.Block({
        memoryBlock: this.#byteLength,
      });
      const newBufferView = new Memory.View({
        memoryBlock: this.#buffer,
      });
      newBufferView.set({
        from: fromView,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.shrinkToFit",
        error: e,
      });
    }
  }
  createView(args) {
    try {
      const bufferView = new Memory.View({
        memoryBlock: this.#buffer,
      });
      return bufferView.createSlice({
        byteOffset: 0,
        byteLength: this.#byteLength,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.shrinkToFit",
        error: e,
      });
    }
  }
  get inputCallback() {
    try {
      return this.#inputCallbackController.callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ByteSequence.inputCallback",
        error: e,
      });
    }
  }
  get outputCallback() {
    try {
      return this.#outputCallbackController.callback;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get ByteSequence.outputCallback",
        error: e,
      });
    }
  }
  resetOutput() {
    try {
      this.#outputIndex = 0;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.resetOutput",
        error: e,
      });
    }
  }
  #allocate(byteLength) {
    try {
      this.#reserveLength = byteLength;
      const minByteLength = this.#byteLength + byteLength;
      if (minByteLength > this.#buffer.byteLength) {
        const oldBufferView = new Memory.View({
          memoryBlock: this.#buffer,
        });
        let newByteLength = this.#buffer.byteLength * 2;
        if (newByteLength < minByteLength) {
          newByteLength = minByteLength;
        }
        this.#buffer = new Memory.Block({
          byteLength: newByteLength,
        });
        const newBufferView = new Memory.View({
          memoryBlock: this.#buffer,
        });
        const toView = newBufferView.createSlice({
          byteOffset: 0,
          byteLength: oldBufferView.byteLength,
        });
        toView.set({
          from: oldBufferView,
        });
      }
      const bufferView = new Memory.View({
        memoryBlock: this.#buffer,
      });
      return bufferView.createSlice({
        byteOffset: this.#byteLength,
        byteLength: byteLength,
      });
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.#allocate",
        error: e,
      });
    }
  }
  #push(byteLength) {
    try {
      if (byteLength > this.#reserveLength) {
        throw "Cannot extend further than allocated";
      }
      this.#byteLength += byteLength;
      this.#reserveLength = 0;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.#push",
        error: e,
      });
    }
  }
  #pull(outputView) {
    try {
      const bufferView = new Memory.View({
        memoryBlock: this.#buffer,
      });
      const fromView = (function () {
        if (this.#outputIndex + outputView.byteLength < this.#byteLength) {
          return bufferView.createSlice({
            byteOffset: this.#outputIndex,
            byteLength: outputView.byteLength,
          });
        } else {
          return bufferView.createSlice({
            byteOffset: this.#outputIndex,
            byteLength: this.#byteLength - this.#outputIndex,
          });
        }
      })();
      outputView.set({
        from: fromView,
      });
      this.#outputIndex += fromView.byteLength;
      return fromView.byteLength;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "ByteSequence.#pull",
        error: e,
      });
    }
  }
}
