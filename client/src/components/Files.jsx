const FileTreeNode = ({ name, nodes }) => {
  return (
    <div className="ml-3">
      {name}
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => {
            return (
              <li key={child}>
                <FileTreeNode name={child} nodes={nodes[child]} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Files = ({ tree }) => {
  return <FileTreeNode name={"/"} nodes={tree} />;
};

export default Files;
