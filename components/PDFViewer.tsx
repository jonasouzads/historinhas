import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl: string;
}

export default function PDFViewer({ pdfUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4 flex gap-4">
        <button
          onClick={prevPage}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="flex items-center text-gray-600 dark:text-gray-300">
          Página {pageNumber} de {numPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors disabled:opacity-50"
        >
          Próxima →
        </button>
        <button
          onClick={zoomOut}
          className="px-4 py-2 bg-secondary-100 text-secondary-600 rounded-full hover:bg-secondary-200 transition-colors"
        >
          🔍-
        </button>
        <button
          onClick={zoomIn}
          className="px-4 py-2 bg-secondary-100 text-secondary-600 rounded-full hover:bg-secondary-200 transition-colors"
        >
          🔍+
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="max-w-full"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
