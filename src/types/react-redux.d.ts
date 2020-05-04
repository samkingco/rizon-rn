import { AppState, Dispatch } from "../store/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as reactRedux from "react-redux";

declare module "react-redux" {
  // Pre-fill the useSelector generic so that it automatically uses our store
  // type. Otherwise you have to import it and use it every time.
  export function useSelector<TSelected>(
    selector: (state: AppState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;

  // Make sure useDispatch returns a dispatch function that is strongly
  // typed to ONLY support our actions.
  export function useDispatch(): Dispatch;
}
