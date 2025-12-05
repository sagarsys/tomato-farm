import { useMemo } from "react";
import { Node, Edge } from "@xyflow/react";
import { useOrdersData } from "@/features/orders/hooks/useOrdersData";
import { farms, warehouses, stores } from "@/services/mockData";

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  city: string;
  type: "farm" | "warehouse" | "store";
  orderCount: number;
  volume: number;
  isContaminated?: boolean;
}

/**
 * Hook to generate React Flow nodes and edges from supply chain data
 * Creates a visual graph of Farm → Warehouse → Store connections
 */
export function useSupplyChainFlow() {
  const { buyOrders, sellOrders, isPending } = useOrdersData();

  const { nodes, edges } = useMemo(() => {
    // Find entities that actually have orders (not just first N)
    const farmsWithOrders = new Map<string, typeof farms[0]>();
    const warehousesWithOrders = new Map<string, typeof warehouses[0]>();
    const storesWithOrders = new Map<string, typeof stores[0]>();

    // Collect entities from buy orders
    buyOrders.slice(0, 2000).forEach((order) => {
      farmsWithOrders.set(order.supplier.id, order.supplier);
      warehousesWithOrders.set(order.destination.id, order.destination);
    });

    // Collect entities from sell orders
    sellOrders.slice(0, 1000).forEach((order) => {
      const warehouseId = order.costs[0]?.destination.id;
      if (warehouseId) {
        warehousesWithOrders.set(warehouseId, order.costs[0].destination);
      }
      storesWithOrders.set(order.destination.id, order.destination);
    });

    // Sample from entities with actual orders
    const sampleFarms = Array.from(farmsWithOrders.values()).slice(0, 50);
    const sampleWarehouses = Array.from(warehousesWithOrders.values()).slice(0, 20);
    const sampleStores = Array.from(storesWithOrders.values()).slice(0, 20);

    // Create ID sets for quick lookup
    const farmIds = new Set(sampleFarms.map(f => f.id));
    const warehouseIds = new Set(sampleWarehouses.map(w => w.id));
    const storeIds = new Set(sampleStores.map(s => s.id));

    const nodes: Node<FlowNodeData>[] = [];
    const edges: Edge[] = [];
    const edgeCountMap = new Map<string, { source: string; target: string; count: number; volume: number; contaminated: boolean }>();

    // Create farm nodes (left column)
    sampleFarms.forEach((farm, index) => {
      const farmOrders = buyOrders.filter((o) => o.supplier.id === farm.id);
      const totalVolume = farmOrders.reduce((sum, o) => sum + o.volume, 0);
      const hasContamination = farmOrders.some((o) => o.isContaminated);

      nodes.push({
        id: `farm-${farm.id}`,
        type: "custom",
        position: { x: 0, y: index * 120 },
        data: {
          label: farm.name,
          city: farm.city,
          type: "farm",
          orderCount: farmOrders.length,
          volume: totalVolume,
          isContaminated: hasContamination,
        },
      });
    });

    // Create warehouse nodes (middle column)
    sampleWarehouses.forEach((warehouse, index) => {
      const warehouseOrders = buyOrders.filter((o) => o.destination.id === warehouse.id);
      const totalVolume = warehouseOrders.reduce((sum, o) => sum + o.volume, 0);
      const hasContamination = warehouseOrders.some((o) => o.isContaminated);

      nodes.push({
        id: `warehouse-${warehouse.id}`,
        type: "custom",
        position: { x: 500, y: index * 150 },
        data: {
          label: warehouse.name,
          city: warehouse.city,
          type: "warehouse",
          orderCount: warehouseOrders.length,
          volume: totalVolume,
          isContaminated: hasContamination,
        },
      });
    });

    // Create store nodes (right column)
    sampleStores.forEach((store, index) => {
      const storeOrders = sellOrders.filter((o) => o.destination.id === store.id);
      const totalVolume = storeOrders.reduce(
        (sum, o) => sum + o.costs.reduce((s, c) => s + c.volume, 0),
        0
      );
      const hasContamination = storeOrders.some((o) =>
        o.costs.some((c) => c.isContaminated)
      );

      nodes.push({
        id: `store-${store.id}`,
        type: "custom",
        position: { x: 1000, y: index * 150 },
        data: {
          label: store.name,
          city: store.city,
          type: "store",
          orderCount: storeOrders.length,
          volume: totalVolume,
          isContaminated: hasContamination,
        },
      });
    });

    // Create edges for buy orders (Farm → Warehouse)
    buyOrders.forEach((order) => {
      // Only create edges for entities in our sample
      if (!farmIds.has(order.supplier.id) || !warehouseIds.has(order.destination.id)) {
        return;
      }

      const sourceId = `farm-${order.supplier.id}`;
      const targetId = `warehouse-${order.destination.id}`;
      const edgeId = `${sourceId}-${targetId}`;

      const existing = edgeCountMap.get(edgeId);
      if (existing) {
        existing.count += 1;
        existing.volume += order.volume;
        existing.contaminated = existing.contaminated || order.isContaminated;
      } else {
        edgeCountMap.set(edgeId, {
          source: sourceId,
          target: targetId,
          count: 1,
          volume: order.volume,
          contaminated: order.isContaminated,
        });
      }
    });

    // Create edges for sell orders (Warehouse → Store)
    sellOrders.forEach((order) => {
      const warehouseId = order.costs[0]?.destination.id;
      if (!warehouseId) return;

      // Only create edges for entities in our sample
      if (!warehouseIds.has(warehouseId) || !storeIds.has(order.destination.id)) {
        return;
      }

      const sourceId = `warehouse-${warehouseId}`;
      const targetId = `store-${order.destination.id}`;
      const edgeId = `${sourceId}-${targetId}`;

      const isContaminated = order.costs.some((c) => c.isContaminated);
      const volume = order.costs.reduce((sum, c) => sum + c.volume, 0);

      const existing = edgeCountMap.get(edgeId);
      if (existing) {
        existing.count += 1;
        existing.volume += volume;
        existing.contaminated = existing.contaminated || isContaminated;
      } else {
        edgeCountMap.set(edgeId, {
          source: sourceId,
          target: targetId,
          count: 1,
          volume,
          contaminated: isContaminated,
        });
      }
    });

    // Convert edge map to actual edges
    edgeCountMap.forEach((data, edgeId) => {
      edges.push({
        id: edgeId,
        source: data.source,
        target: data.target,
        animated: data.contaminated,
        style: {
          stroke: data.contaminated ? "hsl(0, 84%, 60%)" : "hsl(142, 76%, 36%)",
          strokeWidth: Math.min(Math.max(data.count / 2, 1), 5),
        },
        label: `${data.count} orders`,
        labelStyle: { fill: "hsl(var(--foreground))", fontSize: 10 },
      });
    });

    return { nodes, edges };
  }, [buyOrders, sellOrders]);

  return {
    nodes,
    edges,
    isPending,
  };
}

