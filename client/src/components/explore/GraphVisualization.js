import React from 'react'
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

  console.log(data)

  return (
    <InteractiveForceGraph
      zoom={true}
      simulationOptions={{ height: 500, width: 1000, alpha: 1 }}
      labelAttr="label"
      onSelectNode={(node) => console.log(node)}
      radiusMargin={20}
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
  )
})

export default GraphVisualization