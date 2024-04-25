import React from 'react';

const DownloadContext = React.createContext({
  onClickPNG: () => {},
  onClickPDF: () => {}
});

export default DownloadContext;
