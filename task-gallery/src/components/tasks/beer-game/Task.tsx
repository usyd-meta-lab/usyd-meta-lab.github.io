"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  onComplete: () => void;
}

const TOTAL_WEEKS = 36;
// Delays used in simulation timing
// const SHIPPING_DELAY = 2;
// const ORDER_DELAY = 1;
const HOLDING_COST = 0.5;
const BACKLOG_COST = 1.0;
const BASE_STOCK = 12;

interface Role {
  name: string;
  inventory: number;
  backlog: number;
  incomingShipments: number[];
  incomingOrders: number[];
  lastOrder: number;
}

function createRole(name: string): Role {
  return {
    name,
    inventory: 12,
    backlog: 0,
    incomingShipments: [4, 4],
    incomingOrders: [4],
    lastOrder: 4,
  };
}

function aiOrder(role: Role): number {
  const effectiveInventory = role.inventory - role.backlog;
  const pipeline =
    role.incomingShipments.reduce((a, b) => a + b, 0);
  const order = Math.max(0, BASE_STOCK - effectiveInventory - pipeline + role.lastOrder);
  return Math.round(order);
}

function demand(week: number): number {
  return week < 4 ? 4 : 8;
}

interface ChartPoint {
  week: number;
  retailerInv: number;
  wholesalerInv: number;
  distributorInv: number;
  factoryInv: number;
}

const DOMAIN = "#7B6CA8";

export default function BeerGameTask({ onComplete }: Props) {
  const [week, setWeek] = useState(0);
  const [phase, setPhase] = useState<"order" | "resolving" | "done">("order");
  const [playerOrder, setPlayerOrder] = useState(4);
  const [totalCost, setTotalCost] = useState(0);

  const [retailer, setRetailer] = useState<Role>(() => createRole("Retailer"));
  const [wholesaler, setWholesaler] = useState<Role>(() => createRole("Wholesaler"));
  const [distributor, setDistributor] = useState<Role>(() => createRole("Distributor"));
  const [factory, setFactory] = useState<Role>(() => createRole("Factory"));

  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const resolveTimer = useRef<NodeJS.Timeout | null>(null);

  const submitOrder = useCallback(() => {
    if (phase !== "order") return;
    setPhase("resolving");

    const r = { ...retailer, incomingShipments: [...retailer.incomingShipments], incomingOrders: [...retailer.incomingOrders] };
    const w = { ...wholesaler, incomingShipments: [...wholesaler.incomingShipments], incomingOrders: [...wholesaler.incomingOrders] };
    const d = { ...distributor, incomingShipments: [...distributor.incomingShipments], incomingOrders: [...distributor.incomingOrders] };
    const f = { ...factory, incomingShipments: [...factory.incomingShipments], incomingOrders: [...factory.incomingOrders] };

    // 1. Receive shipments
    const roles = [r, w, d, f];
    for (const role of roles) {
      const arrived = role.incomingShipments.shift() || 0;
      role.inventory += arrived;
    }

    // 2. Receive and fill orders
    const customerDemand = demand(week);
    r.incomingOrders = [customerDemand];

    const fillOrder = (role: Role) => {
      const orderToFill = (role.incomingOrders.shift() || 0) + role.backlog;
      const shipped = Math.min(role.inventory, orderToFill);
      role.inventory -= shipped;
      role.backlog = orderToFill - shipped;
      return shipped;
    };

    fillOrder(r);
    // Wholesaler receives retailer's order
    w.incomingOrders = [playerOrder];
    const wOrder = aiOrder(w);
    const wShipped = fillOrder(w);
    r.incomingShipments.push(wShipped);

    d.incomingOrders = [wOrder];
    const dOrder = aiOrder(d);
    const dShipped = fillOrder(d);
    w.incomingShipments.push(dShipped);

    f.incomingOrders = [dOrder];
    const fOrder = aiOrder(f);
    const fShipped = fillOrder(f);
    d.incomingShipments.push(fShipped);

    // Factory produces (unlimited raw materials)
    f.incomingShipments.push(fOrder);

    r.lastOrder = playerOrder;
    w.lastOrder = wOrder;
    d.lastOrder = dOrder;
    f.lastOrder = fOrder;

    // Costs
    const weekCost =
      r.inventory * HOLDING_COST +
      r.backlog * BACKLOG_COST;

    setRetailer(r);
    setWholesaler(w);
    setDistributor(d);
    setFactory(f);
    setTotalCost((prev) => prev + weekCost);

    const newPoint: ChartPoint = {
      week: week + 1,
      retailerInv: r.inventory - r.backlog,
      wholesalerInv: w.inventory - w.backlog,
      distributorInv: d.inventory - d.backlog,
      factoryInv: f.inventory - f.backlog,
    };
    setChartData((prev) => [...prev, newPoint]);

    const nextWeek = week + 1;
    setWeek(nextWeek);

    resolveTimer.current = setTimeout(() => {
      if (nextWeek >= TOTAL_WEEKS) {
        setPhase("done");
      } else {
        setPhase("order");
        setPlayerOrder(r.lastOrder);
      }
    }, 2000);
  }, [phase, week, playerOrder, retailer, wholesaler, distributor, factory]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  useEffect(() => {
    return () => {
      if (resolveTimer.current) clearTimeout(resolveTimer.current);
    };
  }, []);

  const roles = [
    { label: "Factory", data: factory },
    { label: "Distributor", data: distributor },
    { label: "Wholesaler", data: wholesaler },
    { label: "Retailer (You)", data: retailer },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          Beer Distribution Game
        </h1>
        <p className="font-body text-text-secondary mb-6">
          Week {week} / {TOTAL_WEEKS} &mdash; Total Cost: ${totalCost.toFixed(2)}
        </p>

        {/* Pipeline diagram */}
        <div className="bg-surface rounded-xl border border-border p-4 mb-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] gap-2">
            {roles.map((r, i) => (
              <div key={r.label} className="flex items-center gap-2">
                <div
                  className="rounded-lg p-3 text-center min-w-[110px]"
                  style={{
                    backgroundColor:
                      r.label.includes("You") ? `${DOMAIN}22` : "#f5f5f0",
                    border: r.label.includes("You")
                      ? `2px solid ${DOMAIN}`
                      : "1px solid #E8E6E0",
                  }}
                >
                  <p className="font-body text-xs text-text-secondary">
                    {r.label}
                  </p>
                  <p className="font-display text-lg text-text-primary">
                    {r.data.inventory}
                  </p>
                  <p className="font-body text-[10px] text-text-secondary">
                    inv
                  </p>
                  {r.data.backlog > 0 && (
                    <p className="font-body text-xs text-red-500">
                      backlog: {r.data.backlog}
                    </p>
                  )}
                </div>
                {i < roles.length - 1 && (
                  <div className="flex flex-col items-center">
                    <span className="text-text-secondary text-lg">→</span>
                    <span className="font-body text-[10px] text-text-secondary">
                      {r.data.incomingShipments.reduce((a, b) => a + b, 0)} in transit
                    </span>
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-lg">→</span>
              <div className="rounded-lg bg-gray-100 p-3 text-center min-w-[80px] border border-border">
                <p className="font-body text-xs text-text-secondary">Customer</p>
                <p className="font-display text-lg text-text-primary">
                  {demand(week)}
                </p>
                <p className="font-body text-[10px] text-text-secondary">
                  demand
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order input */}
        {phase === "order" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <p className="font-body text-text-primary mb-4">
              How many units would you like to order from the Wholesaler this week?
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlayerOrder((o) => Math.max(0, o - 1))}
                className="w-10 h-10 rounded-lg border border-border font-body text-lg hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span
                className="font-display text-2xl min-w-[3ch] text-center"
                style={{ color: DOMAIN }}
              >
                {playerOrder}
              </span>
              <button
                onClick={() => setPlayerOrder((o) => o + 1)}
                className="w-10 h-10 rounded-lg border border-border font-body text-lg hover:bg-gray-50 transition-colors"
              >
                +
              </button>
              <button
                onClick={submitOrder}
                className="ml-4 px-6 py-2 rounded-lg font-body text-white transition-colors"
                style={{ backgroundColor: DOMAIN }}
              >
                Submit Order
              </button>
            </div>
          </div>
        )}

        {phase === "resolving" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6 text-center">
            <p className="font-body text-text-secondary animate-pulse">
              Resolving week {week}...
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6 text-center">
            <p className="font-display text-xl text-text-primary mb-2">
              Game Complete!
            </p>
            <p className="font-body text-text-secondary">
              Total cost: ${totalCost.toFixed(2)}
            </p>
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="font-body text-sm text-text-secondary mb-2">
              Effective Inventory (inventory − backlog) Over Time
            </p>
            <div className="w-full h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E6E0" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11 }}
                    label={{ value: "Week", position: "insideBottom", offset: -2, fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="retailerInv"
                    name="Retailer"
                    stroke={DOMAIN}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="wholesalerInv"
                    name="Wholesaler"
                    stroke="#4A7C9E"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="distributorInv"
                    name="Distributor"
                    stroke="#C4874A"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="factoryInv"
                    name="Factory"
                    stroke="#5A8C6A"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
