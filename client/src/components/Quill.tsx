import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const TextEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");

  return (
    <div className="mt-4 border-none rounded-lg border-gray-300  ">

      <ReactQuill value={content} className="border-none" onChange={setContent} />
      <div className="mt-4 p-3 border">
        <h3 className="text-lg font-medium">Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
};

export default TextEditor;
