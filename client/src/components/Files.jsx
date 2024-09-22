// const FileTreeNode = ({ name, nodes }) => {
//   return (
//     <div className="ml-3">
//       {name}
//       {nodes && (
//         <ul>
//           {Object.keys(nodes).map((child) => {
//             return (
//               <li key={child}>
//                 <FileTreeNode name={child} nodes={nodes[child]} />
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// const Files = ({ tree }) => {
//   return <FileTreeNode name={"/"} nodes={tree} />;
// };

// export default Files;
const FileTreeNode = ({ name, nodes, onSelect, path }) => {
  const isFolder = nodes !== null;
  return (
    <div
      className="ml-4"
      onClick={(e) => {
        e.stopPropagation();
        if (isFolder) {
          return;
        } else {
          onSelect(path);
        }
      }}
    >
      <span
        className={`${
          isFolder ? "text-yellow-400" : "text-green-400 cursor-pointer"
        } font-semibold`}
      >
        {name}
      </span>
      {isFolder && (
        <ul className="mt-2 space-y-1">
          {Object.keys(nodes).map((child) => (
            <li key={child}>
              <FileTreeNode
                onSelect={onSelect}
                name={child}
                nodes={nodes[child]}
                path={path + "/" + child}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Files = ({ tree, onSelect }) => {
  return (
    <div className="p-4 bg-black text-white h-full w-full">
      <FileTreeNode name="/" nodes={tree} path={""} onSelect={onSelect} />
    </div>
  );
};

export default Files;
