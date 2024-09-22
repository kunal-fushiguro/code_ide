import { useEffect, useRef } from "react";
import { Terminal as Xterminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { socketClinet } from "../socket/socketClient";

const Terminal = () => {
  const divRef = useRef();
  const isRendered = useRef(false);
  useEffect(() => {
    if (isRendered.current) {
      return;
    }

    isRendered.current = true;
    const xterm = new Xterminal({
      cols: 100,
      rows: 100,
    });
    xterm.open(divRef.current);
    socketClinet.emit(
      "terminal:write",
      `
`
    );
    xterm.onData((data) => {
      //   console.log(data);
      socketClinet.emit("terminal:write", data);
    });

    function onTerminalWrite(data) {
      xterm.write(data);
    }

    socketClinet.on("terminal:data", onTerminalWrite);

    // return () => {
    //   socketClinet.off("terminal:data");
    // };
  });
  return <div ref={divRef} className="w-screen"></div>;
};

export default Terminal;
