import { useEffect, useState } from "react";
import Files from "./components/Files";
import Terminal from "./components/Terminal";

const App = () => {
  const [fileTree, setFileTree] = useState({});

  const getFileTree = async () => {
    const url = "http://localhost:9000/files";
    const response = await fetch(url);
    const result = await response.json();
    setFileTree(result.tree);
  };

  useEffect(() => {
    getFileTree();
  }, []);
  return (
    <div className="flex flex-col">
      <div className="h-[55vh]">
        <div>
          <Files tree={fileTree} key={1} />
        </div>
        <div></div>
      </div>
      <div className="bg-black overflow-hidden h-[45vh]">
        <Terminal />
      </div>
    </div>
  );
};

export default App;
