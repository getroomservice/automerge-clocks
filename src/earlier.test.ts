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

test("later returns true in the complex case", () => {
  const islater = later(
    Map({
      bob: 8,
      george: 19
    }),
    Map({
      bob: 8,
      george: 18
    })
  );
  expect(islater).toBe(true);
});

test("clocks that are the same are not later", () => {
  const islater = later(
    Map({
      bob: 1
    }),
    Map({
      bob: 1
    })
  );
  expect(islater).toBe(false);
});

test("If any actor is later, then it's later.", () => {
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
  expect(islater).toBe(true);
});
