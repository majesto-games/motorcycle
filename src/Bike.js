import { CustomPIXIComponent } from "react-pixi-fiber"
import * as PIXI from "pixi.js"
import { CATEGORY_PLAYER, CATEGORY_SCENERY, mpx, LINE_WIDTH } from "."
import { useContext } from "react"
import { Vec2, Box } from "planck-js"

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

export default CustomPIXIComponent(behavior, TYPE)
