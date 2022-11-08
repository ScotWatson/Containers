/*
(c) 2022 Scot Watson  All Rights Reserved
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as Types from "https://scotwatson.github.io/Debug/Types.mjs";
import * as ErrorLog from "https://scotwatson.github.io/Debug/ErrorLog.mjs";
import * as Memory from "https://scotwatson.github.io/Memory/Memory.mjs";

export class Sequence {
  #array;
  #ElementClass;
  constructor(args) {
    try {
      if (!(Types.isSimpleObject(args))) {
        throw "Arguments must be a simple object.";
      }
      if (!(Object.hasOwn(args, "ElementClass"))) {
        throw "Argument \"ElementClass\" is required.";
      }
      this.#ElementClass = args.ElementClass;
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
  get ElementClass() {
    try {
      return this.#ElementClass;
    } catch (e) {
      ErrorLog.rethrow({
        functionName: "get Sequence.ElementClass",
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
          throw "Argument \"sequences\" must be an array.",
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
        if (thisSeq.ElementClass !== this.#ElementClass) {
          throw "Sequences must be of the same type to be concatenated.";
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
      if (args instanceof this.#ElementClass) {
        push_element(args);
      } else if (Types.isArray(args)) {
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
        for (const element of elements) {
          if (!(element instanceof this.#ElementClass)) {
            throw "Element is of incompatible type.";
          }
        }
        return this.#array.push(...elements);
      }
      function push_element(element) {
        if (!(element instanceof this.#ElementClass)) {
          throw "Element is of incompatible type.";
        }
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
        push_elements(args);
      } else if (Types.isSimpleObject(args)) {
        if (!(args.hasOwnProperty("element"))) {
          push_element(args.element);
        } else if (!(args.hasOwnProperty("elements"))) {
          push_elements(args.elements);
        } else {
          throw "Invalid Arguments";
        }
      } else {
        push_element(args);
      }
      function push_elements(elements) {
        for (const element of elements) {
          if (!(this.#alphabet.isValid(element))) {
            throw "Invalid Arguments";
          }
        }
        return this.#array.unshift(...elements);
      }
      function push_element(element) {
        if (!(this.#alphabet.isValid(element))) {
          throw "Invalid Arguments";
        }
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
        throw "Invalid Arguments";
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
      if (!(args.padElement instanceof this.#ElementClass)) {
        throw "Argument \"padElement\" must be of type this.ElementClass.";
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
        throw "Invalid Arguments";
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
      if (!(args.padElement instanceof this.#ElementClass)) {
        throw "Argument \"padElement\" must be of type this.ElementClass.";
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
        throw "Invalid Arguments";
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
        throw new Error("Invalid Arguments");
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
