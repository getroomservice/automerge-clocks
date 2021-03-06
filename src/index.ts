import Automerge, { Backend, Frontend } from "automerge";
import { Map } from "immutable";

type Clock = Map<string, number>;

/**
 * Merges two vector clocks by taking the maximum value
 * for each entry. Returns a new clock.
 * @param clock1
 * @param clock2
 */
export function union(clock1: Clock, clock2: Clock): Clock {
  const left = clock1 || Map();
  const right = clock2 || Map();

  return left.mergeWith(
    (lSeq: number, rSeq: number) => Math.max(lSeq, rSeq),
    right
  );
}

/**
 * Returns true if the first clock is later than the second clock
 * @param clock1
 * @param clock2
 */
export function later(clock1: Clock, clock2: Clock): boolean {
  const keys = clock1.keySeq().concat(clock2.keySeq());

  // @ts-ignore
  for (let key of keys) {
    if (clock1.get(key, -1) > clock2.get(key, -1)) return true;
  }

  return false;
}

/**
 * Gets the current clock of a document
 * @param doc
 */
export function getClock(doc: Automerge.Doc<any>): Clock {
  const state = Frontend.getBackendState(doc);
  return state.getIn(["opSet", "clock"]);
}

/**
 * Given someone else's clock, get the changes
 * we need to update them, to the best of our
 * knowledge.
 *
 * Returns an empty array if our document is older
 * than the clock we're given.
 * @param doc
 * @param theirClock
 */
export function recentChanges(
  doc: Automerge.Doc<any>,
  theirClock: Clock
): Automerge.Change[] {
  // This is a really common bug that happens when people incorrectly
  // assume that something they got from the network is already converted
  // into an immutable obj.
  if (
    // We're doing some duck typing here bc automerge doesn't use the newest
    // verison of immutable and we're trying to stick with it.
    !theirClock.toOrderedSet ||
    typeof theirClock.toOrderedSet !== "function"
  ) {
    throw new Error(
      "theirClock is not an Immutable.js object, but it should be. You may be passing in a JSON map instead."
    );
  }

  const state = Frontend.getBackendState(doc);

  // @ts-ignore because automerge has bad typings
  const cl: Automerge.Clock = theirClock;

  return Backend.getMissingChanges(state, cl);
}
