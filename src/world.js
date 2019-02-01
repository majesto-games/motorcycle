import { World as PlanckWorld, Vec2, Edge, Box, RevoluteJoint, Circle, WheelJoint } from "planck-js"

const CATEGORY_PLAYER = 0x0001
const CATEGORY_SCENERY = 0x0004

const HZ = 8.0
const ZETA = 0.7
const LINE_WIDTH = 2

const pscale = 30

export function mpx(m) {
  return m * pscale
}

export function pxm(p) {
  return p / pscale
}

export class World {
  constructor(gravity = 10) {
    this.world = new PlanckWorld({ gravity: Vec2(0, -gravity) })
    this.graphicsList = []
    this.motorcycles = []

    this.createGround()

    this.addGroundFixture(-20, 0, 20, 0)

    const hs = [0.25, 1.0, 4.0, 0.0, 0.0, -1.0, -2.0, -2.0, -1.25, 0.0]

    let x = 20.0
    let y1 = 0.0
    let dx = 5.0

    for (let i = 0; i < 10; ++i) {
      const y2 = hs[i]
      this.addGroundFixture(x, y1, x + dx, y2)
      y1 = y2
      x += dx
    }

    for (let i = 0; i < 10; ++i) {
      const y2 = hs[i]
      this.addGroundFixture(x, y1, x + dx, y2)
      y1 = y2
      x += dx
    }

    this.addGroundFixture(x, 0.0, x + 40.0, 0.0)

    x += 80.0
    this.addGroundFixture(x, 0.0, x + 40.0, 0.0)

    x += 40.0
    this.addGroundFixture(x, 0.0, x + 10.0, 5.0)

    x += 20.0
    this.addGroundFixture(x, 0.0, x + 40.0, 0.0)

    x += 40.0
    this.addGroundFixture(x, 0.0, x, 20.0)

    this.createTeeter(140, 0)
    this.createBridge(160, 0)

    this.createBox(230.0, 0.5)
    this.createBox(230.0, 1.5)
    this.createBox(230.0, 2.5)
    this.createBox(230.0, 3.5)
    this.createBox(230.0, 4.5)

    this.createMotorcycle(2, 8, 0x4db6ac)
    // this.createMotorcycle(2, 8, 0xe57373)
  }

  step(timeStep, velocityIterations, positionIterations) {
    this.world.step(timeStep, velocityIterations, positionIterations)
  }

  createGround(x, y) {
    const createGroundGraphics = (body) => {
      this.groundGraphics = new PIXI.Graphics()
      this.groundGraphics.body = body
      this.groundGraphics.moveTo(mpx(x), mpx(y))

      this.graphicsList.push(this.groundGraphics)
    }

    this.groundBody = this.world.createBody(Vec2(x, y))
    createGroundGraphics(this.groundBody)
  }

  addGroundFixture(x1, y1, x2, y2) {
    const createEdgeGraphics = () => {
      const g = new PIXI.Graphics()
      g.lineStyle(LINE_WIDTH, 0xffffff)
      g.moveTo(mpx(x1), mpx(y1))
      g.lineTo(mpx(x2), mpx(y2))

      this.groundGraphics.addChild(g)
    }

    const fixtureOptions = {
      density: 0,
      friction: 0.8,
      filterCategoryBits: CATEGORY_SCENERY,
    }
    this.groundBody.createFixture(Edge(Vec2(x1, y1), Vec2(x2, y2)), fixtureOptions)
    createEdgeGraphics()
  }

  createBridge(x, y) {
    const createEdgeGraphics = (body) => {
      const edgeGraphics = new PIXI.Graphics()
      edgeGraphics.body = body
      edgeGraphics.lineStyle(LINE_WIDTH * 8, 0xffffff, 0.2)
      edgeGraphics.moveTo(mpx(-1), mpx(0.125))
      edgeGraphics.lineTo(mpx(1), mpx(0.125))

      this.graphicsList.push(edgeGraphics)
    }

    const fixtureOptions = {
      density: 1,
      friction: 0.6,
      filterCategoryBits: CATEGORY_SCENERY,
    }

    let prevBody = this.groundBody
    for (let i = 0; i < 20; ++i) {
      const bridgeBlock = this.world.createDynamicBody(Vec2(x + 1 + 2.0 * i, y - 0.125))
      bridgeBlock.createFixture(Box(1, 0.125), fixtureOptions)

      createEdgeGraphics(bridgeBlock)

      this.world.createJoint(RevoluteJoint({}, prevBody, bridgeBlock, Vec2(x + 2.0 * i, y - 0.125)))

      prevBody = bridgeBlock
    }

    this.world.createJoint(RevoluteJoint({}, prevBody, this.groundBody, Vec2(x + 2.0 * 20, y - 0.125)))
  }

  createBox(x, y) {
    const createBoxGraphics = (body) => {
      const edgeGraphics = new PIXI.Graphics()
      edgeGraphics.body = body
      edgeGraphics.beginFill(0xffffff, 0.2)
      edgeGraphics.drawRect(mpx(-0.5), mpx(-0.5), mpx(1), mpx(1))
      edgeGraphics.endFill()

      this.graphicsList.push(edgeGraphics)
    }

    const fixtureOptions = {
      density: 0.5,
      filterCategoryBits: CATEGORY_SCENERY,
    }
    const body = this.world.createDynamicBody(Vec2(x, y))
    body.createFixture(Box(0.5, 0.5), fixtureOptions)
    createBoxGraphics(body)
  }

  createTeeter(x, y) {
    const createEdgeGraphics = (body) => {
      const edgeGraphics = new PIXI.Graphics()
      edgeGraphics.body = body
      edgeGraphics.lineStyle(LINE_WIDTH * 8, 0xffffff, 0.2)
      edgeGraphics.moveTo(mpx(-8), mpx(0.25))
      edgeGraphics.lineTo(mpx(8), mpx(0.25))

      this.graphicsList.push(edgeGraphics)
    }

    const body = this.world.createDynamicBody(Vec2(x, y))
    const fixtureOptions = {
      density: 1,
      filterCategoryBits: CATEGORY_SCENERY,
    }
    body.createFixture(Box(10.0, 0.25), fixtureOptions)
    createEdgeGraphics(body)

    this.world.createJoint(
      RevoluteJoint(
        {
          lowerAngle: (-8.0 * Math.PI) / 180.0,
          upperAngle: (8.0 * Math.PI) / 180.0,
          enableLimit: true,
        },
        this.groundBody,
        body,
        body.getPosition()
      )
    )

    body.applyAngularImpulse(100.0, true)
  }

  createMotorcycle(x = 0, y = 0, color = 0xffffff) {
    const createBodyGraphics = (body) => {
      const g = new PIXI.Graphics()
      g.body = body
      g.lineStyle(LINE_WIDTH, color)
      g.beginFill(0)
      g.drawPolygon([mpx(-0.75), mpx(-0.25), mpx(0.75), mpx(-0.25), mpx(0.75), mpx(0.15), mpx(-0.75), mpx(0.5)])
      g.closePath()
      g.drawRect(mpx(-1), mpx(0.4), mpx(0.5), mpx(0.15))
      g.endFill()

      this.graphicsList.push(g)
    }

    const createWheelGraphics = (body) => {
      const g = new PIXI.Graphics()
      g.body = body
      g.moveTo(mpx(x), mpx(y))
      g.beginFill(0)
      g.lineStyle(LINE_WIDTH, color)
      g.drawCircle(0, 0, mpx(0.4))
      g.drawCircle(0, 0, mpx(0.3))

      for (let i = 0; i < 12; ++i) {
        g.moveTo(
          Math.cos((((360 / 12) * Math.PI) / 180) * i) * mpx(0.3),
          Math.sin((((360 / 12) * Math.PI) / 180) * i) * mpx(0.3)
        )
        g.lineTo(
          Math.cos((((360 / 12) * Math.PI) / 180) * i) * mpx(0.4),
          Math.sin((((360 / 12) * Math.PI) / 180) * i) * mpx(0.4)
        )
      }

      g.endFill()

      this.graphicsList.push(g)
    }

    const body = this.world.createDynamicBody(Vec2(x, y))

    const bodyFixtureOptions = {
      density: 1,
      filterCategoryBits: CATEGORY_PLAYER,
      filterMaskBits: CATEGORY_SCENERY,
    }
    body.createFixture(Box(0.75, 0.25), bodyFixtureOptions)

    createBodyGraphics(body)

    const wheelFixtureOptions = {
      density: 1,
      friction: 1,
      filterCategoryBits: CATEGORY_PLAYER,
      filterMaskBits: CATEGORY_SCENERY,
    }

    const wheelBack = this.world.createDynamicBody(Vec2(x - 0.6, y - 0.5))
    wheelBack.createFixture(Circle(0.4), wheelFixtureOptions)
    createWheelGraphics(wheelBack)

    const wheelFront = this.world.createDynamicBody(Vec2(x + 0.8, y - 0.3))
    wheelFront.createFixture(Circle(0.4), wheelFixtureOptions)
    createWheelGraphics(wheelFront)

    const backWheelJoint = this.world.createJoint(
      WheelJoint(
        {
          motorSpeed: 0,
          maxMotorTorque: 50.0,
          // enableLimit: true,
          enableMotor: true,
          frequencyHz: HZ,
          dampingRatio: ZETA,
        },
        body,
        wheelBack,
        wheelBack.getPosition(),
        Vec2(0, 0.4)
      )
    )

    this.world.createJoint(
      WheelJoint(
        {
          motorSpeed: 0.0,
          maxMotorTorque: 40.0,
          enableMotor: false,
          frequencyHz: HZ,
          dampingRatio: ZETA,
        },
        body,
        wheelFront,
        wheelFront.getPosition(),
        Vec2(0.8, 0.4)
      )
    )

    this.motorcycles.push({ body, backWheelJoint })
  }
}
