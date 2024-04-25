import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
export default memo(({ data, isConnectable }) => {
    return (
        <>
           
 <div className="card">
            <div className="card-img">
            </div>
            <div className="card-info">
                <p className="text-title">ID : {props.data.source}</p>
                <p className="text-title">Metric : </p>
            </div>
        </div>
           

        </>
    );
});
