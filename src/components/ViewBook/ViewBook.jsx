import { React, useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './ViewBook.css'
import { Document, Page, pdfjs } from 'react-pdf'
import { check_user_access } from '../../services/utils'
import { BASE_URL, fetchBook } from '../../services/api'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function ViewBook() {

    const [numPages, setNumPages ] = useState(null)
    const navigate = useNavigate()
    const { state } = useLocation()
    const accessToken = check_user_access(navigate)
    const book_id = state?.book_id 
    const book_name = state?.book_name 

    const onLoadSuccess = (pdf)=>{
        setNumPages(pdf.numPages)
    }

    const handleDownload = async () => {
        try {
            // Fetch the PDF from the backend using view_book
            const pdf = await fetchBook(accessToken, book_id); // Assumes view_book returns a Blob
            console.log(pdf)
        
            // Create a temporary URL for the PDF Blob
            const url = URL.createObjectURL(pdf);
        
            // Create an anchor element for downloading
            const link = document.createElement('a');
            link.href = url;
            link.download = 'MapYourFreedom.pdf'; 
        
            // Append the link to the document, trigger the click, and remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    }

    const PDF_URL = `${BASE_URL}books/${book_id}/get_book/`
    const file = useMemo(() => ({
        url: PDF_URL,
        httpHeaders: {
            Authorization: accessToken 
        },
    }), [PDF_URL])

    const options = useMemo(()=>({
        disableTextLayer: true
    }), [])
  
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 's')) {
                e.preventDefault();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

  return (
    <div className="MYF-container" onContextMenu={(e)=> e.preventDefault()}>
        {file? (
            <>
                <div className="book-title-container">
                    <p>{ book_name  }</p>
                    <button onClick={ handleDownload }><i class="fa-solid fa-download" /></button>
                </div>

                <div className="document-container">
                    <Document
                    file={file}
                    options={options}
                    onLoadSuccess={onLoadSuccess}
                    onLoadError={(error)=>(console.log("Error loading document: ", error))}
                    >
                        {numPages &&
                        Array.from(new Array(numPages), (el, index) => (
                            <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            className="pdf-page"
                            />
                        ))}
                    </Document>
                </div>
            </>
        ): (
            <p>You donot have access to this book.</p>
        )}
        
    </div>
  )
}

export default ViewBook