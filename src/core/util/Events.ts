import { Context } from "../Component";

export function CallEvent(context: Context, name: string, args: () => any[]) {
  if (context.events[name] == undefined) return;

  if (context.events[name].length == 1) {
    return context.events[name][0](...args());
  }
  return context.events[name].map((i) => i(...args()));
}

export function RegisterEvent(
  context: Context,
  name: string,
  callback: Function
) {
  if (context[name] != undefined) return;
  context.events[name] ||= [];
  context.events[name].push(callback);
}
