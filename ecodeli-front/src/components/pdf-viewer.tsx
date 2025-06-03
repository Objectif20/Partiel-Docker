import React from 'react';
import { Root, CurrentPage, ZoomOut, ZoomIn, Viewport, Pages, Page, CanvasLayer, CurrentZoom } from '@fileforge/pdfreader';
import { Spinner } from './ui/spinner';
import { Download } from 'lucide-react';

interface MyPdfReaderProps {
  fileURL: string;
  className?: string;
}

const MyPDFReader: React.FC<MyPdfReaderProps> = ({ fileURL, className }) => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Root
      className={`bg-background border rounded-md overflow-auto ${className}`}
      fileURL={fileURL}
      loader={<div><Spinner /></div>}
    >
      <div className="border-b p-1 flex items-center justify-between text-sm gap-2">
        <div className="flex items-center gap-2  ml-4">
          Page
          <CurrentPage className="bg-background rounded-full px-3 py-1 border text-center" />
        </div>

        <div className="flex items-center gap-2">
          Zoom
          <ZoomOut>-</ZoomOut>
          <CurrentZoom className="bg-background rounded-full px-3 py-1 border text-center w-16" />
          <ZoomIn>+</ZoomIn>
        </div>

        <div className="flex items-center  mr-4">
          <button onClick={handleDownload} className="flex items-center px-3 py-1">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="basis-0 grow min-h-0 relative grid transition-all duration-300 h-[720px]">
        <Viewport className="p-4">
          <Pages>
            <Page className="my-4">
              <CanvasLayer />
            </Page>
          </Pages>
        </Viewport>
      </div>
    </Root>
  );
};

export default MyPDFReader;
