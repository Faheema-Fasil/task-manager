import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import number from "../assets/123.png";
import unordered from "../assets/unordered.png";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#custom-toolbar",
      },
    }),
    []
  );

  const getPlainTextLength = (html: string): number => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent?.replace(/\s+/g, " ").trim().length || 0;
  };

  return (
    <div className="mt-4 border w-full min-h-[150px] rounded-lg border-gray-300 overflow-hidden flex flex-col">
      <div className="quill-editor flex-1">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          theme="snow"
          className="quill-top-editor h-full"
          placeholder="Enter task description..."
        />
      </div>

      <div className="quill-bottom-toolbar bg-gray-50 border-t border-gray-300 p-2 flex justify-between items-center">
        <div id="custom-toolbar" className="flex text-sm items-center space-x-2">
          <button className="ql-bold">B</button>
          <button className="ql-italic">/</button>
          <button className="ql-strike">S</button>
          <span className="text-gray-400">|</span>
          <button className="ql-list" value="ordered">
            <img src={number} alt="ordered list icon" />
          </button>
          <button className="ql-list" value="bullet">
            <img src={unordered} alt="unordered list icon" />
          </button>
        </div>
        <div className="text-right text-sm text-gray-500">
          {getPlainTextLength(value)}/300 characters
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
