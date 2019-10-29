import setupKeyboard, { keyCodes, addKeyListener } from "./keyboard.js"
// import { mpx, World } from "./world.js"
import * as PIXI from "pixi.js"
import Stats from "stats.js"
import React, { useContext, useRef, useState } from "react"
import { render } from "react-dom"
// @ts-ignore
import { Sprite, Stage, Container, Graphics, usePixiTicker } from "react-pixi-fiber"

import "./style.css"
import { Vec2, Box, Circle, WheelJoint, World } from "planck-js"
import Bike from "./Bike.js"

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.dispose(() => {
    const canvas = document.querySelector("canvas")

    canvas
      .getContext("web-gl")
      .getExtension("WEBGL_lose_context")
      .loseContext()

    window.location.reload()
    throw "whatever"
  })
}

PIXI.utils.skipHello()

setupKeyboard()

const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef()
  const previousTimeRef = React.useRef()

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, []) // Make sure the effect runs only once
}

// const renderOptions = {
//   backgroundColor: 0x000000,
//   autoResize: true,
//   resolution: 1,
//   antialias: true,
// }

// const app = new PIXI.Application(renderOptions)
// app.renderer.resize(document.body.clientWidth, document.body.clientHeight)
// document.body.appendChild(app.view)

// window.addEventListener("resize", () => {
//   app.renderer.resize(document.body.clientWidth, document.body.clientHeight)
// })

// const container = new PIXI.Container()
// app.stage.addChild(container)
// container.scale.x = 1
// container.scale.y = 1
// container.scale.y = -container.scale.y // Invert because of physics
// container.position.set(app.renderer.screen.width / 2, app.renderer.screen.height / 2)

const SPEED = 50.0
const ROTATE_SPEED = 0.1

// const world = new World(10)

// Bridge
// const bridgeFD = {};
// bridgeFD.density = 1.0;
// bridgeFD.friction = 0.6;

// let prevBody = ground;
// for (let i = 0; i < 20; ++i) {
//   const bridgeBlock = world.createDynamicBody(Vec2(161.0 + 2.0 * i, -0.125));
//   bridgeBlock.createFixture(Box(1.0, 0.125), bridgeFD);

//   world.createJoint(
//     RevoluteJoint({}, prevBody, bridgeBlock, Vec2(160.0 + 2.0 * i, -0.125))
//   );

//   prevBody = bridgeBlock;
// }

// world.createJoint(
//   RevoluteJoint({}, prevBody, ground, Vec2(160.0 + 2.0 * 20, -0.125))
// );

// Boxes
// const box = Box(0.5, 0.5);

// world.createDynamicBody(Vec2(230.0, 0.5)).createFixture(box, 0.5);

// world.createDynamicBody(Vec2(230.0, 1.5)).createFixture(box, 0.5);

// world.createDynamicBody(Vec2(230.0, 2.5)).createFixture(box, 0.5);

// world.createDynamicBody(Vec2(230.0, 3.5)).createFixture(box, 0.5);

// world.createDynamicBody(Vec2(230.0, 4.5)).createFixture(box, 0.5);

// var stats = new Stats()
// stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom)

// container.addChild(...world.graphicsList)
// const [m1] = world.motorcycles

// const createPausedGraphics = () => {
//   const pausedText = new PIXI.Text("Paused", { fill: 0xffffff, align: "center" })
//   const pausedGraphics = new PIXI.Graphics()
//   pausedGraphics.beginFill(0x000000, 0.8)
//   pausedGraphics.drawRect(0, 0, app.renderer.screen.width, app.renderer.screen.height)
//   pausedGraphics.addChild(pausedText)
//   pausedGraphics.endFill()

//   return pausedGraphics
// }

// let pausedGraphics = null

// addKeyListener("SPACE", "keydown", () => {
//   if (app.ticker.started) {
//     pausedGraphics = createPausedGraphics()
//     app.stage.addChild(pausedGraphics)
//     setTimeout(() => app.ticker.stop(), 0)
//   } else {
//     app.stage.removeChild(pausedGraphics)
//     app.ticker.start()
//   }
// })

// function inputLoop() {
//   if (window._keys[keyCodes["UP"]]) {
//     m1.backWheelJoint.enableMotor(true)
//     m1.backWheelJoint.setMotorSpeed(-SPEED)
//   } else if (window._keys[keyCodes["DOWN"]]) {
//     m1.backWheelJoint.enableMotor(true)
//     m1.backWheelJoint.setMotorSpeed(+SPEED)
//   } else {
//     m1.backWheelJoint.setMotorSpeed(0)
//     m1.backWheelJoint.enableMotor(false)
//   }

//   // if (window._keys[keyCodes["W"]]) {
//   //   m2.backWheelJoint.enableMotor(true)
//   //   m2.backWheelJoint.setMotorSpeed(-SPEED)
//   // } else if (window._keys[keyCodes["S"]]) {
//   //   m2.backWheelJoint.enableMotor(true)
//   //   m2.backWheelJoint.setMotorSpeed(+SPEED)
//   // } else {
//   //   m2.backWheelJoint.setMotorSpeed(0)
//   //   m2.backWheelJoint.enableMotor(false)
//   // }

//   if (window._keys[keyCodes["LEFT"]]) {
//     m1.body.applyAngularImpulse(ROTATE_SPEED)
//   } else if (window._keys[keyCodes["RIGHT"]]) {
//     m1.body.applyAngularImpulse(-ROTATE_SPEED)
//   }
//   // if (window._keys[keyCodes["A"]]) {
//   //   m2.body.applyAngularImpulse(ROTATE_SPEED)
//   // } else if (window._keys[keyCodes["D"]]) {
//   //   m2.body.applyAngularImpulse(-ROTATE_SPEED)
//   // }
// }

// function physicsLoop() {
//   world.step(1 / 60, app.ticker.elapsedMS / 1000)
// }

// function renderLoop() {
//   stats.begin()

//   for (let g of world.graphicsList) {
//     const { x, y } = g.body.getPosition()
//     const angle = g.body.getAngle()
//     g.position.x = mpx(x)
//     g.position.y = mpx(y)
//     g.rotation = angle
//   }

//   const { x, y } = m1.body.getPosition()
//   // const { x: x2, y: y2 } = m2.body.getPosition()

//   // const distance = Math.abs(x - x2)
//   // const scale = Math.min(1, app.renderer.width / mpx(distance * 1.25))
//   // container.scale.x = scale
//   // container.scale.y = -scale

//   container.pivot.x = mpx(x)
//   container.pivot.y = mpx(y)

//   if (!app.ticker.started) {
//   }

//   stats.end()
// }

// const inputTicker = new PIXI.ticker.Ticker()
// inputTicker.autoStart = true
// inputTicker.add(() => {
//   inputLoop()
// })

// app.ticker.add(() => {
//   physicsLoop()
//   renderLoop()
// })

// setTimeout(() => {
//   // app.stop();
// }, 1500)

// setInterval(() => gameLoop(1), 1000);

export const HZ = 8.0
export const ZETA = 0.7
export const LINE_WIDTH = 2

export const CATEGORY_PLAYER = 0x0001
export const CATEGORY_SCENERY = 0x0004

const pscale = 30

export function mpx(m) {
  return m * pscale
}

export function pxm(p) {
  return p / pscale
}

const world = new World({ gravity: Vec2(0, -10) }) // rendering loop

;(function loop() {
  world.step(1 / 60)
  setTimeout(loop, 1000 / 60)
})()

const body = world.createDynamicBody(Vec2(40, -40))
const bodyFixtureOptions = {
  density: 1,
  filterCategoryBits: CATEGORY_PLAYER,
  filterMaskBits: CATEGORY_SCENERY,
}

body.createFixture(Box(0.75, 0.25), bodyFixtureOptions)

function PhysicsBike() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  usePixiTicker(() => {
    const { x, y } = body.getPosition()
    setPosition({ x, y })
  })

  return <Bike position={position} />
}

function App() {
  const [bodies, setBodies] = React.useState([])

  return (
    <Stage
      width={document.body.clientWidth}
      height={document.body.clientHeight}
      options={{ backgroundColor: 0x000000, autoResize: true, resolution: 1, antialias: true }}
    >
      <Container
        // @ts-ignore
        pivot={new PIXI.Point(0, 0)}
        scale={new PIXI.Point(1, -1)}
      >
        <PhysicsBike />
      </Container>
    </Stage>
  )
}

render(<App />, document.getElementById("container"))
