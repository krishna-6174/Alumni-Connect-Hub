import { useEffect, useRef } from 'react';
import Quill from 'quill';
import DOMPurify from 'dompurify';

const QuillEditor = ({ content }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      const quill = new Quill(quillRef.current, {
        readOnly:true,
        theme: 'snow',
        modules:{
            toolbar:false,
        } // Or 'bubble', depending on your setup
      });

      // Ensure that content is being sanitized and set properly in Quill
      const sanitizedContent = DOMPurify.sanitize(content);
      quill.root.innerHTML = sanitizedContent;
    }
  }, [content]);

  return <div ref={quillRef} />;
};

export default QuillEditor;
