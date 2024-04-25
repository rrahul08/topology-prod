import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import Device from './Switch';
import './style.css'; // Assuming you move styles to a CSS file

const CustomNode = memo(({ data, isConnectable }) => (
    <>
        <Handle
            type="target"
            position={Position.Top}
            className="handle"
            onConnect={(params) => console.log('Handle connected', params)}
            isConnectable={isConnectable}
        />
        <Device data={data} />
        <Handle
            type="source"
            position={Position.Bottom}
            id="a"
            className="handle"
            isConnectable={isConnectable}
        />
    </>
));

CustomNode.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired,
    isConnectable: PropTypes.bool,
};

export default CustomNode;
