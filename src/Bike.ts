import { CustomPIXIComponent, usePixiTicker } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import { CATEGORY_PLAYER, CATEGORY_SCENERY, mpx, LINE_WIDTH, WorldContext } from "."
import { useContext, useState, useRef, useEffect } from "react"
import { Vec2, Box } from "planck-js"
import * as React from "react"

const TYPE = "Bike"
export const behavior = {
  customDisplayObject: (props) => {
    const graphics = new PIXI.Graphics()

    graphics.lineStyle(LINE_WIDTH, 0xff0000)
    graphics.beginFill(0)
    graphics.drawPolygon([mpx(-0.75), mpx(-0.25), mpx(0.75), mpx(-0.25), mpx(0.75), mpx(0.15), mpx(-0.75), mpx(0.5)])
    graphics.closePath()
    graphics.drawRect(mpx(-1), mpx(0.4), mpx(0.5), mpx(0.15))
    graphics.endFill()

    return graphics
  },
  customApplyProps: function(graphics, oldProps, newProps) {
    // graphics.beginFill(0xff0000)
    // graphics.drawCircle(40, newProps.y, 40)
    // graphics.endFill()

    this.applyDisplayObjectProps(oldProps, newProps)
  },
}

const Bike = CustomPIXIComponent(behavior, TYPE)

export default function BikeWithPhysics() {
  const world = useContext(WorldContext)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const bodyRef = useRef<planck.Body>()

  useEffect(() => {
    const body = world.createDynamicBody(Vec2(40, -40))
    const bodyFixtureOptions = {
      density: 1,
      filterCategoryBits: CATEGORY_PLAYER,
      filterMaskBits: CATEGORY_SCENERY,
    }

    body.createFixture(Box(0.75, 0.25), bodyFixtureOptions)

    bodyRef.current = body

    return () => world.destroyBody(bodyRef.current)
  }, [])

  usePixiTicker(() => {
    const { x, y } = bodyRef.current.getPosition()
    setPosition({ x, y })
  })

  return <Bike position={position} />
}
