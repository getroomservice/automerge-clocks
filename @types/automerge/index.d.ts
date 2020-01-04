import { Map } from "immutable";

declare module "automerge" {
  interface BackendState extends Map<any, any> {}
}
