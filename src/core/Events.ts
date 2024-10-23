import { Context } from "./Component";

export function CallEvent(context: Context, name: string, ...args: any[]) {
  context[name] ||= [];
  for (let i = 0; i < context[name].length; i++) {
    context[name][i](...args);
  }
}

export function RegisterEvent(
  context: Context,
  name: string,
  callback: Function
) {
  context[name] ||= [];
  context[name].push(callback);
}
