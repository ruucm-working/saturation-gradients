import { addPropertyControls, ControlType, Color } from "framer"
import * as React from "react"
import { useEffect, useRef } from "react"
import { GlowParticle } from "./glow-particle"

export function MeshGradient({
  play,
  width,
  height,
  colors,
  totalParticles,
  maxRadius,
  minRadius,
}) {
  // convert colors
  const COLORS = colors.map((color) => Color(color))

  const particles = []

  let curColor = 0

  for (let i = 0; i < totalParticles; i++) {
    const item = new GlowParticle(
      Math.random() * width,
      Math.random() * height,
      Math.random() * (maxRadius - minRadius) + minRadius,
      COLORS[curColor]
    )

    if (++curColor >= COLORS.length) {
      curColor = 0
    }

    particles[i] = item
  }
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      const context = canvas.getContext("2d")

      canvas.width = width
      canvas.height = height

      let animationFrameId

      context.globalCompositeOperation = "saturation"

      // Our draw came here
      function render() {
        context.clearRect(0, 0, canvas.width, canvas.height)

        // draw (or animate)
        for (let i = 0; i < totalParticles; i++) {
          const item = particles[i]
          item.animate(context, canvas.width, canvas.height, play)
        }

        animationFrameId = window.requestAnimationFrame(render)
      }
      if (play !== "stop") render()

      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [canvasRef, play])

  return <canvas ref={canvasRef} />
}

MeshGradient.defaultProps = {
  width: 1920,
  height: 1080,

  play: true,
  colors: [
    // "rgb(45, 74, 227)",
    // "rgb(250, 255, 89)",
    // "rgb(255, 104, 248)",
    // "rgb(44, 209, 252)",
    // "rgb(54, 233,84)",
    "rgb(255, 0, 204)",
    "rgb(255, 204, 0)",
    // "rgb(0, 255, 204)",
    // "rgb(204, 255, 0)",
    "rgb(0, 204, 255)",
    // "rgb(204, 0, 255)",
  ],
  totalParticles: 15,
  maxRadius: 900,
  minRadius: 400,
}

addPropertyControls(MeshGradient, {
  play: {
    type: ControlType.SegmentedEnum,
    options: ["play", "pause", "stop"],
  },
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color,
    },
  },
  totalParticles: {
    type: ControlType.Number,
    displayStepper: true,
  },
  maxRadius: {
    type: ControlType.Number,
  },
  minRadius: {
    type: ControlType.Number,
  },
})
