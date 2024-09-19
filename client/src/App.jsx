import Terminal from "./components/Terminal";

const App = () => {
  return (
    <div className="flex flex-col">
      <div className="h-[55vh]"></div>
      <div className="bg-black overflow-hidden h-[45vh]">
        <Terminal />
      </div>
    </div>
  );
};

export default App;
