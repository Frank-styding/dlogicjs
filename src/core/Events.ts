import { Context } from "./Component";

const tag = "event_";
export function CallEvent(context: Context, name: string, ...args: any[]) {
  return context[tag + name](...args);
}

export function RegisterEvent(
  context: Context,
  name: string,
  callback: Function
) {
  if (context[tag + name] != undefined) return;
  context[tag + name] = callback;
}
