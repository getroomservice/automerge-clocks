import { from } from "automerge";
import { getClock } from "./index";

test("earlier returns true if the clock is ", () => {
  const clock = getClock(from({ myDoc: "hi" }));
  expect(clock.size).toBe(1);
});
