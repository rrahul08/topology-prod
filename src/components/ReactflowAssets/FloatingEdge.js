import { useCallback, useState } from 'react';
import { useStore, getStraightPath, EdgeLabelRenderer, getBezierPath, BaseEdge, useStoreApi , EdgeText} from 'reactflow';
import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, style, data, ...props }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sourceX, sourceY, targetX, targetY, targetPosition, sourcePosition } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sourceX,
    sourceY: sourceY,
    targetX: targetX,
    targetY: targetY,
    sourcePosition,
    targetPosition,
  });

  const dynamicStyle = {
    ...style,
    stroke: isHovered || isSelected ? '#333' : style.stroke || '#b1b1b7',
    strokeWidth: isHovered || isSelected ? 10 : 10,
    animation: isSelected ? 'stroke-dashoffset 2s linear infinite' : 'none',
  };

  if (isSelected) {
    dynamicStyle.strokeDasharray = '10, 10';
    dynamicStyle.strokeDashoffset = '0';
  }

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={dynamicStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsSelected(!isSelected)}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(${labelX - 50}px,${labelY - 50}px)`,
            pointerEvents: "all"
          }}
        >
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsSelected(!isSelected)}
            style={{
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.69)',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {data.label}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;
