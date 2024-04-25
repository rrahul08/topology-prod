import React from 'react';
import PropTypes from 'prop-types';
import { getStraightPath } from 'reactflow';

const CustomConnectionLine = React.memo(({ fromX, fromY, toX, toY, connectionLineStyle }) => {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle cx={toX} cy={toY} fill="black" r={3} stroke="black" strokeWidth={5.5} />
    </g>
  );
});

CustomConnectionLine.propTypes = {
  fromX: PropTypes.number.isRequired,
  fromY: PropTypes.number.isRequired,
  toX: PropTypes.number.isRequired,
  toY: PropTypes.number.isRequired,
  connectionLineStyle: PropTypes.object,
};

export default CustomConnectionLine;
