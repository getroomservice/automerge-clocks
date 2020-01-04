import { Map } from "immutable";
import { union } from "./index";

test("union merges actors", () => {
  const combo = union(
    Map({
      "my-id": 1
    }),
    Map({
      "your-id": 2
    })
  );
  expect(combo.get("your-id")).toBe(2);
  expect(combo.get("my-id")).toBe(1);
});

test("union takes the max of the same actor", () => {
  const combo = union(
    Map({
      "george-id": 1
    }),
    Map({
      "george-id": 2
    })
  );
  expect(combo.get("george-id")).toBe(2);
});
