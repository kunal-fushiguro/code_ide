import { useCallback, useEffect, useState } from "react";
import Files from "./components/Files";
import Terminal from "./components/Terminal";
import { socketClinet } from "./socket/socketClient";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";

const App = () => {
  const [fileTree, setFileTree] = useState({});
  const [selectFile, setSelectedFile] = useState("");
  const [code, setCode] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const isSaved = selectedFileContent === code;

  const getFileTree = async () => {
    const url = "http://localhost:9000/files";
    const response = await fetch(url);
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContent = useCallback(async () => {
    if (!selectFile) {
      return;
    } else {
      const url = `http://localhost:9000/files/content?path=${selectFile}`;
      const response = await fetch(url);
      const result = await response.json();
      setSelectedFileContent(result.content);
    }
  }, [selectFile]);

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    socketClinet.on("file:refresh", getFileTree);
    return () => {
      socketClinet.off("file:refresh", getFileTree);
    };
  }, []);

  useEffect(() => {
    if (code && !isSaved) {
      const timer = setTimeout(() => {
        socketClinet.emit("file:change", {
          path: selectFile,
          content: code,
        });
        console.log("code saved");
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, isSaved]);

  useEffect(() => {
    if (selectFile) {
      getFileContent();
    }
  }, [getFileContent, selectFile]);

  useEffect(() => {
    if (selectFile && selectedFileContent) {
      setCode(selectedFileContent);
    }
  }, [selectFile, selectedFileContent]);

  useEffect(() => {
    setCode("");
  }, [selectFile]);

  return (
    <div className="flex h-screen bg-[#1e1e1e] text-gray-100">
      {/* File explorer section, full height */}
      <div className="w-[20%] bg-[#2f2f2f] p-4 border-r border-gray-700 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">
          File Explorer
        </h2>
        <Files
          tree={fileTree}
          key={1}
          onSelect={(path) => {
            setSelectedFile(path);
          }}
        />
      </div>

      {/* Code Editor and Terminal combined */}
      <div className="flex-1 flex flex-col w-[80%]">
        {/* Code Editor section */}
        <div className="flex-1 p-4">
          {selectFile && (
            <p className="text-sm mb-2 text-gray-400">
              {selectFile.replaceAll("/", " > ")}
            </p>
          )}
          <AceEditor
            mode="javascript"
            theme="one_dark"
            name="editor"
            editorProps={{ $blockScrolling: true }}
            fontSize={14} /* updated font size */
            style={{ width: "100%", height: "100%" }}
            value={code}
            onChange={(e) => {
              setCode(e);
            }}
            className="rounded-md shadow-lg"
          />
        </div>

        {/* Terminal section */}
        <div className="bg-[#2f2f2f] h-[40vh] overflow-hidden">
          <div className="p-4 border-t border-gray-700">
            <Terminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
