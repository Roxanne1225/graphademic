import React, { useState, useEffect, useRef } from 'react'
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force'

const COLORS = [
  '#ea90b1',
  '#fea58e',
  '#f5c78e',
  '#a2d28f',
  '#51d3d9',
  '#81c1fd',
  '#bda9ea',
  '#9784c2'
]

function pickRandomColor() {
  const len = COLORS.length
  const idx = Math.floor(Math.random() * len)
  return COLORS[idx]
}

const GraphVisualization = React.memo(({
  data,
  onSelect
}) => {
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 })
  useEffect(() => {
    const boundingRect = container.current.getBoundingClientRect()
    const { height, width } = boundingRect

    setDimensions({
      height,
      width
    })
  }, [])

  const container = useRef()
  return (
    <div ref={container} style={{ height: '100%', width: '100%' }}>
      <InteractiveForceGraph
        zoom={true}
        simulationOptions={{ ...dimensions, alpha: 1 }}
        labelAttr="label"
        onSelectNode={(e, val) => onSelect(val)}
        radiusMargin={20}
        opacityFactor={1.7}
        highlightDependencies
      >
        {
          data.nodes.map(node =>
            <ForceGraphNode
              node={node}
              key={node.id}
              fill={pickRandomColor()}
            />)
        }
        {data.links.map(link =>
          <ForceGraphLink
            id={`${link.source}-> ${link.target}`}
            key={`${link.source} -> ${link.target}`}
            link={link}
          />
        )}

      </InteractiveForceGraph>
    </div >
  )
})

export default GraphVisualization