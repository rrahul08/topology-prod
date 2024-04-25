import React from 'react';
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
function downloadImage(dataUrl) {
    const a = document.createElement('a');
    a.setAttribute('download', 'Topology.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

function downloadPDF(dataUrl) {
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1024, 768]
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, 1024, 768);
    pdf.save('Topology.pdf');
}

function DownloadButton() {
    const { getNodes } = useReactFlow();

    const onClickPNG = () => {
        const nodesBounds = getRectOfNodes(getNodes());
        const imageWidth = nodesBounds.width + 200;
        const imageHeight = nodesBounds.height + 200;
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
        toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#1a365d',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth,
                height: imageHeight,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadImage);
    };

    const onClickPDF = () => {
        const nodesBounds = getRectOfNodes(getNodes());
        const imageWidth = nodesBounds.width + 200;
        const imageHeight = nodesBounds.height + 200;
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
        toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#1a365d',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth,
                height: imageHeight,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            },
        }).then(downloadPDF);
    };

    return (
        <Panel position="top-left" style={{display:'none'}}>
            <button className="download-btn-PNG" onClick={onClickPNG}>
                Download PNG
            </button>
            <button className="download-btn-PDF" onClick={onClickPDF}>
                Download PDF
            </button>
        </Panel>
    );
}

export default DownloadButton;
