import { from } from "automerge";
import { Map } from "immutable";
import { changesFrom } from "./index";

test("changesFrom gets the differences from a document", () => {
  const doc = from({ myDoc: "hi " });

  const changes = changesFrom(doc, Map());
  expect(changes.length).toBe(1);
});
