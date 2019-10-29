import { CATEGORY_SCENERY, LINE_WIDTH, WorldContext } from ".";
import { useContext, useRef, useEffect } from "react";
import { Vec2, Edge } from "planck-js";
import * as React from "react";
import { PixiComponent, applyDefaultProps } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

type FloorProps = {
  position: [number, number];
};

const Floor = PixiComponent<FloorProps, PIXI.Graphics>("Floor", {
  create: props => {
    const graphics = new PIXI.Graphics();

    graphics.lineStyle(LINE_WIDTH, 0xffffff);
    graphics.moveTo(-200, 0);
    graphics.lineTo(200, 0);

    return graphics;
  },
  applyProps: applyDefaultProps
});

const x = 0;
const y = 0;

export default function FloorWithPhysics() {
  const world = useContext(WorldContext);
  const bodyRef = useRef<planck.Body>();

  useEffect(() => {
    const body = world.createBody(Vec2(x, y));
    const fixtureOptions = {
      density: 0,
      friction: 0.8,
      filterCategoryBits: CATEGORY_SCENERY
    };

    body.createFixture(Edge(Vec2(-200, 0), Vec2(200, 0)), fixtureOptions);

    bodyRef.current = body;

    return () => {
      world.destroyBody(bodyRef.current!);
    };
  }, [world]);

  return <Floor position={[x, y]} />;
}
