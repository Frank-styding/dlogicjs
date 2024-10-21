import { Component } from "../core/Component";

enum Direction {
  DOWN,
  RIGHT,
  TOP,
  LEFT,
}

interface ConnectionData {
  name: string;
  direction: Direction;
  size: number;
}

interface GateData {
  connections: ConnectionData;
  name: string;
}

export class Gate extends Component {}
