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
 * Returns true if the first clock is earlier than the second clock.
 * @param clock1
 * @param clock2
 */
export function earlier(clock1: Clock, clock2: Clock): boolean {
  return clock1
    .keySeq()
    .concat(clock2.keySeq())
    .reduce(
      (result, key) => result && clock1.get(key, 0) <= clock2.get(key, 0),
      true
    );
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
 * Get the changes required to get a document up to date
 * with a remote clock.
 * @param doc
 * @param clock
 */
export function changesFrom(
  doc: Automerge.Doc<any>,
  remoteClock: Clock
): Automerge.Change[] {
  const state = Frontend.getBackendState(doc);

  // @ts-ignore because automerge has bad typings
  const cl: Automerge.Clock = remoteClock;

  return Backend.getMissingChanges(state, cl);
}
