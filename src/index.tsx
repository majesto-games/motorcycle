import React, { createContext } from "react";
import ReactDOM from "react-dom";
import { World, Vec2 } from "planck-js";
import { Stage, Container, useTick } from "@inlet/react-pixi";
import BikeWithPhysics from "./Bike";
import FloorWithPhysics from "./Floor";

import "./index.css";
import setupKeyboard from "./keyboard";
import * as PIXI from "pixi.js";

PIXI.utils.skipHello();

export const LINE_WIDTH = 0.5;

export const CATEGORY_PLAYER = 0x0001;
export const CATEGORY_SCENERY = 0x0004;

setupKeyboard(true);

const world = new World({ gravity: Vec2(0, -10) });
export const WorldContext = createContext(world);

(function loop() {
  world.step(1 / 60);
  setTimeout(loop, 1000 / 60);
})();

// function Camera({ children }) {
//   useTick(() => {
//     children.
//   })
// }

ReactDOM.render(
  <Stage options={{ resizeTo: window, antialias: true, resolution: 1 }}>
    <Container pivot={[-20, 20]} scale={[1, -1]}>
      <BikeWithPhysics />
      <FloorWithPhysics />
    </Container>
  </Stage>,
  document.getElementById("root")
);
