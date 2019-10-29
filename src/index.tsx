import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { World, Vec2 } from "planck-js";
import { Stage, Container } from "@inlet/react-pixi";
import BikeWithPhysics from "./Bike";

import "./index.css";

export const HZ = 8.0;
export const ZETA = 0.7;
export const LINE_WIDTH = 2;

export const CATEGORY_PLAYER = 0x0001;
export const CATEGORY_SCENERY = 0x0004;

const pscale = 30;

export function mpx(m: number) {
  return m * pscale;
}

export function pxm(p: number) {
  return p / pscale;
}

const world = new World({ gravity: Vec2(0, -10) });
export const WorldContext = createContext(world);

(function loop() {
  world.step(1 / 60);
  setTimeout(loop, 1000 / 60);
})();

ReactDOM.render(
  <Stage options={{ resizeTo: window, antialias: true, resolution: 1 }}>
    <Container pivot={[-100, 100]} scale={[1, -1]}>
      <BikeWithPhysics />
    </Container>
  </Stage>,
  document.getElementById("root")
);
