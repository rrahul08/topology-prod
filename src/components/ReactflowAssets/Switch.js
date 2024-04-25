import React from 'react';
import PropTypes from 'prop-types';
import './style.css'; // Ensure the CSS path is correct
import Switch from '../../Assets/switch.png'; // Ensure the image path is correct

function Device({ data }) {
    return (
        <div className="plan">
              {/* <img className='switchNodeImage' src={Switch} alt="" /> */}
            <div className="inner">
                <p className="title">ID : {data.label}</p>
                <p className="title">Metric : {data.details.metric}</p>
            </div>
        </div>
    );
}

Device.propTypes = {
    data: PropTypes.string.isRequired,
};

export default Device;
