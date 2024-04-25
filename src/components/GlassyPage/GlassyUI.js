import React, { useRef } from "react";
import "./style.css";
import Layered from "../ReactflowAssets/Layered";
import Radial from "../ReactflowAssets/Radial";
import { ReactComponent as ZoomOut } from '../ReactflowAssets/zoomout.svg';
import { ReactComponent as ZoomIn } from '../ReactflowAssets/zoomin.svg';
import { ReactComponent as FitView } from '../ReactflowAssets/fitview.svg';
import { ReactComponent as PDF } from '../ReactflowAssets/pdf.svg';
import { ReactComponent as PNG } from '../ReactflowAssets/png-svgrepo-com.svg'; // Assume this is your SVG for PNG

const GlassyUi = () => {
  const reactFlowWrapper = useRef(null);

  const handleControlClick = (selector) => {
    const button = reactFlowWrapper.current?.querySelector(selector);
    if (button) {
      button.click();
    } else {
      console.error('Button not found:', selector);
    }
  };

  return (
    <div className="upper-layer">
      <header>
        <button className="btn" onClick={() => handleControlClick(".react-flow__controls-zoomin")}>
          <ZoomIn />
        </button>
        &nbsp;
        <button className="btn" onClick={() => handleControlClick(".react-flow__controls-zoomout")}>
          <ZoomOut />
        </button>
        &nbsp;
        <button className="btn" onClick={() => handleControlClick(".react-flow__controls-fitview")}>
          <FitView />
        </button>
        &nbsp;
        <button className="bookmarkBtn" onClick={() => handleControlClick(".download-btn-PDF")}>
          <PDF />
          <p className="text">PDF</p>
        </button>
        &nbsp;
        <button className="bookmarkBtn" onClick={() => handleControlClick(".download-btn-PNG")}>
          <PNG />
          <p className="text">PNG</p>
        </button>
      </header>
      <div ref={reactFlowWrapper} style={{ height: "100%", width: "100%" }}>
        <Radial/>
        {/* <Layered /> */}
      </div>
    </div>
  );
};

export default GlassyUi;
