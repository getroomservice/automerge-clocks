# Automerge Simple Connection

This is a simpler, explicit, and asynchronous version of Automerge's [Connection](https://github.com/automerge/automerge/blob/master/src/connection.js) protocol, which is used to send and receive changes to Automerge documents.

Unlike the original Automerge Connection, this connection:

- Supports asynchronous getting and setting documents however you want
- Doesn't use hard-to-debug handlers
- Is written in Typescript

Plus, this connector is interoperable with a peer who's using the original.

## Install

```
npm install --save automerge-simple-connection
```

## Usage

### Setting up a Doc Store

Async Automerge Connection assumes you're implementing an `AsyncDocStore` class that satisfies this interface:

```ts
interface AsyncDocStore {
  getDoc<T>(docId: string): Promise<Doc<T>>;
  setDoc<T>(docId: string, doc: Doc<T>): Promise<Doc<T>>;
}
```

An in-memory example of such a store might just be:

```ts
import { AsyncDocStore } from "automerge-simple-connection";

class MyDocStore extends AsyncDocStore {
  _docs = {};

  getDoc(docId) {
    return _docs[docId];
  }

  setDoc(docId, doc) {
    _docs[docId] = doc;
    return doc;
  }
}
```

### Setting up a sendMsg function

Then, you'll create a `sendMsg` function that takes a message and sends it over the network however you want. For example:

```ts
function sendMsg(msg) {
  myNetwork.send(JSON.stringify(msg));
}
```

### Creating a connection

Finally, you'd create a `Connection` class and pass both your `AsyncDocStore` and your `sendMsg` function in.

```ts
import { Connection } from "automerge-simple-connection";

const connection = new Connection(new MyDocStore(), sendMsg);
```

### Broadcasting changes

To let other clients know a document changed, just call the `docChanged` function:

```ts
connection.docChanged(myDocId, myDoc);
```

### Receiving changes

When you've received a message over the wire (like one you might have sent from your `sendMsg` function), you should call `receiveMsg` like so:

```ts
myNetwork.on("got_message", msg => {
  connection.receiveMsg(msg);
});
```

This will update the document store as needed. If you need to wait for that to complete, the function is asynchronous:

```ts
myNetwork.on("got_message", async msg => {
  await connection.receiveMsg(msg);
});
```

## Why?

The goal of this library is to decouple Automerge Connection from DocSet, so you don't have to load every document into memory. That makes it easier to run a peer that offloads documents into a cache or database.

Because it doesn't use DocSets, it also doesn't use the handler pattern the original Automerge Connection uses. That makes debugging a lot easier since there's less "magic" about when things are sent across the wire.
