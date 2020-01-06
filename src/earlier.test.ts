import { Map } from "immutable";
import { later } from "./index";

test("later returns false if the clock is later in the simple case", () => {
  const islater = later(
    Map({
      george: 1
    }),
    Map({
      george: 2
    })
  );
  expect(islater).toBe(false);
});

test("later returns true in the simple case", () => {
  const islater = later(
    Map({
      bob: 5
    }),
    Map({
      bob: 1
    })
  );
  expect(islater).toBe(true);
});

test("later returns false if not all actors are later ", () => {
  const islater = later(
    Map({
      george: 1,
      bob: 2
    }),
    Map({
      george: 2,
      bob: 1
    })
  );
  expect(islater).toBe(false);
});
