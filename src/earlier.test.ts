import { Map } from "immutable";
import { earlier } from "./index";

test("earlier returns true if the clock is earlier in the simple case", () => {
  const isEarlier = earlier(
    Map({
      george: 1
    }),
    Map({
      george: 2
    })
  );
  expect(isEarlier).toBe(true);
});

test("earlier returns false in the simple case", () => {
  const isEarlier = earlier(
    Map({
      bob: 5
    }),
    Map({
      bob: 1
    })
  );
  expect(isEarlier).toBe(false);
});

test("earlier returns false if not all actors are earlier ", () => {
  const isEarlier = earlier(
    Map({
      george: 1,
      bob: 2
    }),
    Map({
      george: 2,
      bob: 1
    })
  );
  expect(isEarlier).toBe(false);
});
