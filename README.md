# Automerge Clocks

This library contains a set of utilities for implementing your own Automerge network protocol.

## Install

```
npm install --save automerge-clocks
```

## Usage

An Automerge network protocol should keep track of the Vector Clock of it's local document as well as the clock (or clocks) of it's peers. A Vector Clock is an [immutable](https://immutable-js.github.io/immutable-js/docs/#/Map) map of Actors (someone who did something to the document) and a counter of changes they've made to the document (called the `sequence`).

For example, a clock might look like this:

```js
import { Map } from "immutable";

const clock = Map({
  "georges-uuid": 5,
  "alices-uuid": 10
});
```

If all `seq` counters for all actors in a clock are less than or equal to those another clock, we'll say the first clock is "earlier" than the second. 

### The TL;DR of your protocol

Keep a copy of our clock and their clock. Then, follow these rules:

- If `theirClock` is "earlier" than `ourClock`, then send changes.
- If `ourClock` is "earlier" than `theirClock`, then ask for changes.

### The building blocks

#### `getClock`

All Automerge documents have a clock. `automerge-clocks` has a built-in helper to get the current clock:

```js
import { getClock } from "automerge-clocks";
import { init } from "automerge";

const myDoc = init();
const clock = getClock(myDoc); // hurray it's a clock!
```

#### `earlier`

To check if one clock is earlier than another, use `earlier`:

```js
import { earlier } from "automerge-clocks";

const shouldSendChanges = earlier(theirClock, ourClock);
```

#### `recentChanges`

Given `theirClock` and our current document, get the changes we'd need to send in order to update the peer to where we are.

```js
import { recentChanges } from "automerge-clocks";

const changes = recentChanges(ourDoc, theirClock);
MyNetwork.send(changes);
```

If ourDoc is `earlier` than `theirClock`, `recentChanges` will return `[]`.

```js
const changes = recentChanges(superOldDoc, superNewClock);
changes == []; // Nothing to update!
```

#### `union`

To combine clocks, use `union`:

```js
import { union } from "automerge-clocks";

union(ourClock, theirClock);
```

You should use this after you make a change and send it to a peer. For example:

```js
import { union, recentChanges, getClock } from "automerge-clocks";

// Make changes and send them to the network
const newDoc = Automerge.change(ourDoc, d => {
  d.name = "new-name";
});
const changes = recentChanges(newDoc, theirClock);
MyNetwork.send(changes);

// use `union` to optimisticly update theirClock
// with what we just sent them
theirClock = union(theirClock, getClock(newDoc));
```

## License
MIT
