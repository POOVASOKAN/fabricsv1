import "./App.css";
import Split from "react-split";
import Preview from "./Components/Preview";
import {
  ReactFlowProvider,
  ReactFlow,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { LightProvider } from "./Components/LightContext";
import MapProvider from "./Components/MapContext";
import MainNode from "./Components/MainNode";
import MapNode from "./Components/MapNode";
import ControlGUI from "./Components/ControlGUI";
import { useCallback, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const mainNode = {
    id: "1",
    type: "mainNode",
    position: { x: 250, y: 5 },
    data: {
      label: "Fabric Name",
      maps: [
        "Diffuse",
        "Environment",
        "Refraction",
        "Bump",
        "Normal",
        "Displacement",
        "Specular",
        "Emissive",
        "Opacity",
        "AO",
        "Metalness",
        "Roughness",
      ],
    },
  };

  useState(() => setNodes([mainNode]), []);

  const addMapNode = useCallback(() => {
    const newMapNode = {
      id: `map-${nodes.length + 1}`,
      type: "mapNode",
      position: { x: Math.random() * 250 + 400, y: Math.random() * 250 + 50 },
      data: {
        label: "Upload a map",
        thumbnail: null,
        mapType: null,
        updateNodeData: (nodeId, file, thumbnail) => {
          const fileName = file.name;
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId
                ? {
                    ...node,
                    data: { ...node.data, thumbnail, label: fileName },
                  }
                : node
            )
          );
        },
      },
    };
    setNodes((nds) => [...nds, newMapNode]);
  }, [nodes, setNodes]);

  const edgeOptions = {
    style: { strokeWidth: 4, stroke: "#333" },
  };

  const onConnect = useCallback(
    (params) => {
      const targetNode = nodes.find((node) => node.id === params.target);
      const targetMapType =
        targetNode?.data?.maps[
          parseInt(params.targetHandle?.replace("handle-", ""))
        ];

      if (targetMapType) {
        const mapNodeId = params.source;
        setNodes((nds) =>
          nds.map((node) =>
            node.id === mapNodeId
              ? { ...node, data: { ...node.data, mapType: targetMapType } }
              : node
          )
        );
      }
      setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    },
    [setEdges, nodes, setNodes]
  );

  const onEdgeDoubleClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      const mapNodeId = edge.source;
      const mapType = nodes.find((node) => node.id === mapNodeId)?.data
        ?.mapType;

      if (mapType) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === mapNodeId
              ? { ...node, data: { ...node.data, mapType: null } }
              : node
          )
        );
      }
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges, nodes, setNodes]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setSelectedNode(node);
    setModalOpen(true);
  }, []);

  const confirmDeleteNode = useCallback(() => {
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
      )
    );
    setModalOpen(false);
  }, [selectedNode, setNodes, setEdges]);

  const closeModal = () => setModalOpen(false);

  const nodeTypes = useMemo(
    () => ({ mainNode: MainNode, mapNode: MapNode }),
    []
  );

  return (
    <LightProvider>
      <MapProvider>
        <div style={{ height: "100vh", width: "100vw" }}>
          <Split
            className="split-container"
            sizes={[50, 50]}
            minSize={100}
            expandToMin={false}
            gutterSize={10}
            direction="horizontal"
            cursor="col-resize"
            style={{ height: "100vh" }}
          >
            <Preview />

            <div
              style={{
                flexGrow: 1,
                height: "100%",
                position: "relative",
              }}
            >
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onEdgeDoubleClick={onEdgeDoubleClick}
                  onNodeContextMenu={onNodeContextMenu}
                  fitView
                  defaultEdgeOptions={edgeOptions}
                >
                  <Controls />
                  <Background />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          </Split>

          <ControlGUI addMapNode={addMapNode} />

          <Dialog open={modalOpen} onClose={closeModal}>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this map node?
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDeleteNode} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </MapProvider>
    </LightProvider>
  );
}

export default App;
//v5
