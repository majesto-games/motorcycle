import { CATEGORY_PLAYER, CATEGORY_SCENERY, LINE_WIDTH, WorldContext } from ".";
import { useContext, useState, useRef, useEffect } from "react";
import { Vec2, Box, Circle, WheelJoint } from "planck-js";
import * as React from "react";
import { PixiComponent, applyDefaultProps, useTick } from "@inlet/react-pixi";
import * as PIXI from "pixi.js";

type BikeProps = {
  color: number;
  position: number[];
  rotation: number;
};

const Body = PixiComponent<BikeProps, PIXI.Graphics>("BikeBody", {
  create: ({ color }) => {
    const graphics = new PIXI.Graphics();

    graphics.lineStyle(LINE_WIDTH, color);
    graphics.beginFill(0);
    graphics.drawPolygon([-7.5, -2.5, 7.5, -2.5, 7.5, 1.5, -7.5, 5]);
    graphics.closePath();
    graphics.drawRect(-10, 4, 5, 1.5);
    graphics.endFill();

    return graphics;
  },
  applyProps: applyDefaultProps
});

const Wheel = PixiComponent<BikeProps, PIXI.Graphics>("BikeWheel", {
  create: ({ color, position: [x, y] }) => {
    const graphics = new PIXI.Graphics();

    graphics.beginFill(0);
    graphics.lineStyle(LINE_WIDTH, color);
    graphics.drawCircle(0, 0, 4);
    graphics.drawCircle(0, 0, 3);

    for (let i = 0; i < 12; ++i) {
      graphics.moveTo(
        Math.cos((((360 / 12) * Math.PI) / 180) * i) * 3,
        Math.sin((((360 / 12) * Math.PI) / 180) * i) * 3
      );
      graphics.lineTo(
        Math.cos((((360 / 12) * Math.PI) / 180) * i) * 4,
        Math.sin((((360 / 12) * Math.PI) / 180) * i) * 4
      );
    }

    graphics.endFill();

    return graphics;
  },
  applyProps: applyDefaultProps
});

const ROTATE_SPEED = 0.1;
const SPEED = 50;

const HZ = 8.0;
const ZETA = 0.7;

const x = 2;
const y = 8;

export default function BikeWithPhysics() {
  const world = useContext(WorldContext);

  const [state, setState] = useState({
    body: { position: [x, y], rotation: 0 },
    bWheel: { position: [x - 0.6, y - 0.5], rotation: 0 },
    fWheel: { position: [x + 0.8, y - 0.3], rotation: 0 }
  });

  const bodyRef = useRef<planck.Body>();
  const bWheelRef = useRef<planck.Body>();
  const fWheelRef = useRef<planck.Body>();
  const bWheelJointRef = useRef<planck.WheelJoint | null>();
  const fWheelJointRef = useRef<planck.WheelJoint | null>();

  useEffect(() => {
    bodyRef.current = world.createDynamicBody(Vec2(x, y));

    const bodyFixtureOptions = {
      density: 1,
      filterCategoryBits: CATEGORY_PLAYER,
      filterMaskBits: CATEGORY_SCENERY
    };

    const wheelFixtureOptions = {
      density: 1,
      friction: 1,
      filterCategoryBits: CATEGORY_PLAYER,
      filterMaskBits: CATEGORY_SCENERY
    };

    bodyRef.current.createFixture(Box(0.75, 0.25), bodyFixtureOptions);

    bWheelRef.current = world.createDynamicBody(Vec2(x - 0.6, y - 0.5));
    bWheelRef.current.createFixture(Circle(0.4), wheelFixtureOptions);

    fWheelRef.current = world.createDynamicBody(Vec2(x + 0.8, y - 0.3));
    fWheelRef.current.createFixture(Circle(0.4), wheelFixtureOptions);

    bWheelJointRef.current = world.createJoint(
      WheelJoint(
        {
          motorSpeed: 0,
          maxMotorTorque: 50.0,
          // enableLimit: true,
          enableMotor: true,
          frequencyHz: HZ,
          dampingRatio: ZETA
        },
        bodyRef.current,
        bWheelRef.current,
        bWheelRef.current.getPosition(),
        Vec2(0, 0.4)
      )
    );

    fWheelJointRef.current = world.createJoint(
      WheelJoint(
        {
          motorSpeed: 0.0,
          maxMotorTorque: 40.0,
          enableMotor: false,
          frequencyHz: HZ,
          dampingRatio: ZETA
        },
        bodyRef.current,
        fWheelRef.current,
        fWheelRef.current.getPosition(),
        Vec2(0.8, 0.4)
      )
    );

    return () => {
      world.destroyBody(bodyRef.current!);
      world.destroyBody(bWheelRef.current!);
      world.destroyBody(fWheelRef.current!);
      world.destroyJoint(bWheelJointRef.current!);
      world.destroyJoint(fWheelJointRef.current!);
    };
  }, [world]);

  useTick(() => {
    if (window._keys.get("ArrowRight")) {
      bodyRef.current!.applyAngularImpulse(-ROTATE_SPEED);
    }
    if (window._keys.get("ArrowLeft")) {
      bodyRef.current!.applyAngularImpulse(ROTATE_SPEED);
    }

    if (window._keys.get("ArrowUp")) {
      bWheelJointRef.current!.enableMotor(true);
      bWheelJointRef.current!.setMotorSpeed(-SPEED);
    } else if (window._keys.get("ArrowDown")) {
      bWheelJointRef.current!.enableMotor(true);
      bWheelJointRef.current!.setMotorSpeed(+SPEED);
    } else {
      bWheelJointRef.current!.setMotorSpeed(0);
      bWheelJointRef.current!.enableMotor(false);
    }

    const { x: bodyX, y: bodyY } = bodyRef.current!.getPosition();
    const bodyAngle = bodyRef.current!.getAngle();

    const { x: bWheelX, y: bWheelY } = bWheelRef.current!.getPosition();
    const bWheelAngle = bWheelRef.current!.getAngle();

    const { x: fWheelX, y: fWheelY } = fWheelRef.current!.getPosition();
    const fWheelAngle = fWheelRef.current!.getAngle();

    setState({
      body: { position: [bodyX * 10, bodyY * 10], rotation: bodyAngle },
      bWheel: { position: [bWheelX * 10, bWheelY * 10], rotation: bWheelAngle },
      fWheel: { position: [fWheelX * 10, fWheelY * 10], rotation: fWheelAngle }
    });
  });

  return (
    <>
      <Body
        position={state.body.position}
        rotation={state.body.rotation}
        color={0xffffff}
      />
      <Wheel
        position={state.bWheel.position}
        rotation={state.bWheel.rotation}
        color={0xffffff}
      />
      <Wheel
        position={state.fWheel.position}
        rotation={state.fWheel.rotation}
        color={0xffffff}
      />
    </>
  );
}
