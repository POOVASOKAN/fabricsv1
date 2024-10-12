import "./App.css";
import Controls from "./Components/Controls";
import Split from "react-split";
import Preview from "./Components/Preview";
import Node from "./Components/Node";
// eslint-disable-next-line no-unused-vars
import { LightContext, LightProvider } from "./Components/LightContext";

function App() {
  return (
    <LightProvider>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Split
          className="split-container"
          sizes={[50, 50]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          direction="horizontal"
          cursor="col-resize"
        >
          {/* Left side - FabricPreview */}
          <Preview />

          {/* Right side - ControlPanel */}
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Node />
          </div>
        </Split>
        <Controls />
      </div>
    </LightProvider>
  );
}

export default App;
//v3 - All UI updated
