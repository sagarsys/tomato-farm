import { useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomFlowNode } from "./CustomFlowNode";
import { useSupplyChainFlow } from "../hooks/useSupplyChainFlow";

// Register our custom node type
const nodeTypes: NodeTypes = {
  custom: CustomFlowNode,
};

/**
 * Interactive supply chain flow diagram using React Flow
 * Features: Zoom, Pan, Drag nodes, Mini-map
 */
export function InteractiveFlowDiagram() {
  const { nodes: initialNodes, edges: initialEdges, isPending } = useSupplyChainFlow();
  
  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Supply Chain Flow</CardTitle>
          <CardDescription>Loading visualization...</CardDescription>
        </CardHeader>
        <CardContent className="h-[600px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interactive Supply Chain Flow</CardTitle>
        <CardDescription>
          Drag nodes to rearrange • Scroll to zoom • Click and drag to pan
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: 600 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
          >
            {/* Grid background */}
            <Background color="hsl(var(--muted))" gap={16} />
            
            {/* Zoom controls (bottom-left) */}
            <Controls />
            
            {/* Mini-map (bottom-right) - overview of entire flow */}
            <MiniMap
              nodeColor={(node) => {
                if (node.data.isContaminated) return "#ef4444";
                if (node.data.type === "farm") return "#22c55e";
                if (node.data.type === "warehouse") return "#3b82f6";
                return "#a855f7";
              }}
              maskColor="rgba(0, 0, 0, 0.2)"
            />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}

