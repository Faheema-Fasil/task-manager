import React, { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import number from "../assets/123.png";
import unordered from '../assets/unordered.png';
const TextEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");

  // Custom toolbar with external positioning
  const modules = useMemo(() => ({
    toolbar: {
      container: "#custom-toolbar", 
    },
  }), []);

  const getPlainTextLength = (html: string): number => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.replace(/\s+/g, " ").trim().length || 0;
  };

  return (
    <div className="mt-4 border rounded-lg border-gray-300 overflow-hidden">
      <div className="quill-top-editor">
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          theme="snow"
          className=""
          placeholder="Description"
        />
      </div>

      <div className="quill-bottom-toolbar flex justify-between items-center bg-gray-50 border-t border-gray-300">
        <div id="custom-toolbar" className="flex text-sm items-center space-x-2 p-2">
          <button className="ql-bold">B</button>
          <button className="ql-italic" value="sub">/</button>
          <button className="ql-strike">S</button> <span className="text-gray-400">|</span>
          <button className="ql-list" value="ordered"><img src={number} alt="ordered list icon" /></button>
          <button className="ql-list" value={"bullet"}><img src={unordered} alt="" /></button>
        </div>
        <div className="flex text-right items-center px-4 pb-2 text-sm text-gray-500">
          {getPlainTextLength(content)}/300 characters
        </div>
      </div>


      <style jsx global>{`
        .quill-top-editor {
          display: flex;
          flex-direction: column;
          min-height: 150px;
          border: "none"
        }

        /* Ensure toolbar is at the bottom */
        .quill-bottom-toolbar {
          position: static;
          border-top: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;


// import React, { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css"; // Import Quill styles

// const TextEditor: React.FC = () => {
//   const [content, setContent] = useState<string>("");

//   return (
//     <div className="mt-4 border-none rounded-lg border-gray-300  ">

//       <ReactQuill value={content} className="border-none" onChange={setContent} />
//       <div className="mt-4 p-3 border">
//         <h3 className="text-lg font-medium">Preview:</h3>
//         <div dangerouslySetInnerHTML={{ __html: content }} />
//       </div>
//     </div>
//   );
// };

// export default TextEditor;
