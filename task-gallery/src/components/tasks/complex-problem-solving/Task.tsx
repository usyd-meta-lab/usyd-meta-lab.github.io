"use client";

import { useState, useCallback, useEffect } from "react";

interface Props {
  onComplete: () => void;
}

const DOMAIN = "#7B6CA8";
const TOTAL_ROUNDS = 10;

interface Inputs {
  staff: number;
  machines: number;
  advertising: number;
  rawMaterials: number;
}

interface Outputs {
  production: number;
  sales: number;
  profit: number;
}

function gaussianNoise(sigma: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function simulate(inputs: Inputs): Outputs {
  // production: staff x machines with diminishing returns
  const staffEffect = Math.sqrt(inputs.staff / 10);
  const machineEffect = Math.sqrt(inputs.machines / 5);
  const materialEffect = Math.min(1, inputs.rawMaterials / 25);
  const baseProduction = 100 * staffEffect * machineEffect * materialEffect;
  const production = Math.max(0, baseProduction * (1 + gaussianNoise(0.1)));

  // sales: driven by advertising and production capacity
  const adEffect = 0.3 + 0.7 * (inputs.advertising / 100);
  const baseSales = production * adEffect;
  const sales = Math.max(0, baseSales * (1 + gaussianNoise(0.1)));

  // profit: revenue minus costs
  const revenue = sales * 3;
  const staffCost = inputs.staff * 15;
  const machineCost = inputs.machines * 20;
  const adCost = inputs.advertising * 0.5;
  const materialCost = inputs.rawMaterials * 2;
  const profit = revenue - staffCost - machineCost - adCost - materialCost;

  return {
    production: Math.round(production * 10) / 10,
    sales: Math.round(sales * 10) / 10,
    profit: Math.round(profit * 10) / 10,
  };
}

interface HistoryEntry {
  round: number;
  inputs: Inputs;
  outputs: Outputs;
}

export default function ComplexProblemSolvingTask({ onComplete }: Props) {
  const [round, setRound] = useState(1);
  const [inputs, setInputs] = useState<Inputs>({
    staff: 5,
    machines: 2,
    advertising: 50,
    rawMaterials: 25,
  });
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [phase, setPhase] = useState<"input" | "result" | "done">("input");
  const [currentOutputs, setCurrentOutputs] = useState<Outputs | null>(null);

  const submitRound = useCallback(() => {
    const outputs = simulate(inputs);
    setCurrentOutputs(outputs);
    setHistory((prev) => [...prev, { round, inputs: { ...inputs }, outputs }]);
    setPhase("result");
  }, [inputs, round]);

  const nextRound = useCallback(() => {
    if (round >= TOTAL_ROUNDS) {
      setPhase("done");
    } else {
      setRound((r) => r + 1);
      setPhase("input");
    }
  }, [round]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onComplete, 2000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const sliders: { key: keyof Inputs; label: string; min: number; max: number }[] = [
    { key: "staff", label: "Staff", min: 0, max: 10 },
    { key: "machines", label: "Machines", min: 0, max: 5 },
    { key: "advertising", label: "Advertising", min: 0, max: 100 },
    { key: "rawMaterials", label: "Raw Materials", min: 0, max: 50 },
  ];

  const outputMetrics: { key: keyof Outputs; label: string; color: string }[] = [
    { key: "production", label: "Production", color: "#4A7C9E" },
    { key: "sales", label: "Sales", color: "#5A8C6A" },
    { key: "profit", label: "Profit", color: DOMAIN },
  ];

  const maxVal = (key: keyof Outputs) => {
    if (history.length === 0) return 100;
    return Math.max(100, ...history.map((h) => Math.abs(h.outputs[key])));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
          TAILORSHOP Simulation
        </h1>
        <p className="font-body text-text-secondary mb-6">
          Round {round} / {TOTAL_ROUNDS}
        </p>

        {phase !== "done" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6">
            <h2 className="font-display text-lg text-text-primary mb-4">
              Adjust Your Inputs
            </h2>
            <div className="space-y-4">
              {sliders.map((s) => (
                <div key={s.key}>
                  <div className="flex justify-between mb-1">
                    <label className="font-body text-sm text-text-primary">
                      {s.label}
                    </label>
                    <span
                      className="font-body text-sm font-medium"
                      style={{ color: DOMAIN }}
                    >
                      {inputs[s.key]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={inputs[s.key]}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        [s.key]: Number(e.target.value),
                      }))
                    }
                    disabled={phase === "result"}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: DOMAIN }}
                  />
                  <div className="flex justify-between font-body text-[10px] text-text-secondary">
                    <span>{s.min}</span>
                    <span>{s.max}</span>
                  </div>
                </div>
              ))}
            </div>

            {phase === "input" && (
              <button
                onClick={submitRound}
                className="mt-6 px-6 py-2 rounded-lg font-body text-white transition-colors"
                style={{ backgroundColor: DOMAIN }}
              >
                Run Simulation
              </button>
            )}

            {phase === "result" && currentOutputs && (
              <div className="mt-6">
                <h3 className="font-display text-md text-text-primary mb-3">
                  Results
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {outputMetrics.map((m) => (
                    <div
                      key={m.key}
                      className="rounded-lg border border-border p-3 text-center"
                    >
                      <p className="font-body text-xs text-text-secondary">
                        {m.label}
                      </p>
                      <p
                        className="font-display text-xl"
                        style={{ color: m.color }}
                      >
                        {currentOutputs[m.key].toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={nextRound}
                  className="px-6 py-2 rounded-lg font-body text-white transition-colors"
                  style={{ backgroundColor: DOMAIN }}
                >
                  {round >= TOTAL_ROUNDS ? "Finish" : "Next Round"}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === "done" && (
          <div className="bg-surface rounded-xl border border-border p-6 mb-6 text-center">
            <p className="font-display text-xl text-text-primary mb-2">
              Simulation Complete!
            </p>
            <p className="font-body text-text-secondary">
              Final profit:{" "}
              {history.length > 0
                ? history[history.length - 1].outputs.profit.toFixed(1)
                : "N/A"}
            </p>
          </div>
        )}

        {/* Sparkline / bar history */}
        {history.length > 0 && (
          <div className="bg-surface rounded-xl border border-border p-4">
            <h3 className="font-display text-md text-text-primary mb-3">
              History
            </h3>
            <div className="space-y-4">
              {outputMetrics.map((m) => (
                <div key={m.key}>
                  <p className="font-body text-xs text-text-secondary mb-1">
                    {m.label}
                  </p>
                  <div className="flex items-end gap-1 h-16">
                    {history.map((h, i) => {
                      const val = h.outputs[m.key];
                      const max = maxVal(m.key);
                      const height = Math.max(
                        2,
                        (Math.abs(val) / max) * 64
                      );
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm transition-all"
                          style={{
                            height: `${height}px`,
                            backgroundColor:
                              val >= 0 ? m.color : "#ef4444",
                            opacity: 0.8,
                          }}
                          title={`Round ${h.round}: ${val.toFixed(1)}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
