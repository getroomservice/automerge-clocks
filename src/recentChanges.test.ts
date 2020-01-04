import { change, from } from "automerge";
import { Map } from "immutable";
import { getClock, recentChanges } from "./index";

test("changesFrom will add changes for an empty remote clock", () => {
  const doc = from({ name: "alpha" });
  const changes = recentChanges(doc, Map());
  expect(changes.length).toBe(1);
  expect(changes[0].seq).toBe(1);

  const op = changes[0].ops[0];
  expect(op.action).toBe("set");
  expect(op.key).toBe("name");
  expect(op.value).toBe("alpha");
});

test("changesFrom gets the differences from a document", () => {
  const oldDoc = from({ name: "alpha" });
  const newDoc = change(oldDoc, doc => {
    doc.name = "beta";
  });

  const changes = recentChanges(newDoc, getClock(oldDoc));

  expect(changes.length).toBe(1);
  expect(changes[0].seq).toBe(2);

  const op = changes[0].ops[0];
  expect(op.key).toBe("name");
  expect(op.value).toBe("beta");
});

test("changesFrom returns no changes if our document is older than the clock they gave us", () => {
  const oldDoc = from({ name: "alpha" });
  const newDoc = change(oldDoc, doc => {
    doc.name = "beta";
  });

  const changes = recentChanges(oldDoc, getClock(newDoc));
  expect(changes.length).toBe(0);
});
