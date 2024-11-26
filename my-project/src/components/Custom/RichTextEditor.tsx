import React  from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill editor styles
import { Typography, Box} from '@mui/material';

// Define the props for the editor component
interface RichTextEditorProps {
    value: string;
    sourcePage:string;
    onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange,sourcePage }) => {
    // Quill editor modules to control the toolbar (add buttons for headings, font colors, and links)
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link','blockquote', 'code-block'],
            ['clean'], // Remove formatting button
        ],
    };

    const formats = [
        'header', 'font', 'size', 'color', 'background', 'align',
        'bold', 'italic', 'underline', 'strike', 'list', 'bullet',
        'link','code-block','blockquote'
    ];

    return (
        <div>
            <Typography variant="h6" gutterBottom className="text-gray-700">
                {(sourcePage==="Job Page"?"Job Description":'')}
            </Typography>
            <Box className="w-full">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                className="bg-white rounded-md  text-gray-800 h-64 mb-10"/>
                </Box>
        </div>
    );
};

export default RichTextEditor;
