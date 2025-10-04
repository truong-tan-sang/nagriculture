"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * FarmGame.jsx
 * Single-file React component (usable in Next.js app router or pages router)
 * - 12 x 8 grid
 * - Drag to plant/water/fertilize using pointer events
 * - Pause / Normal / x50 speed
 * - Growth simulation with time scaling
 * - LocalStorage persistence
 *
 * Usage:
 * - Place this file in a page (e.g. app/farm/page.jsx -> export default FarmGame)
 * - Make sure TailwindCSS is available in the project (styles use Tailwind classes)
 */

const COLS = 8;
const ROWS = 6;
const CELL_COUNT = COLS * ROWS;

const SEEDS = {
    carrot: { name: "Carrot", baseSecondsToMature: 60 },
    tomato: { name: "Tomato", baseSecondsToMature: 120 },
    wheat: { name: "Wheat", baseSecondsToMature: 90 },
};

function makeEmptyGrid() {
    const grid = [];
    for (let r = 0; r < ROWS; r++) {
        const row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({ plant: null });
        }
        grid.push(row);
    }
    return grid;
}

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

export default function FarmGame() {
    const [grid, setGrid] = useState(() => {
        try {
            const raw = localStorage.getItem("farm_grid_v1");
            if (raw) return JSON.parse(raw);
        } catch (e) { }
        return makeEmptyGrid();
    });

    const [tool, setTool] = useState("seed"); // seed | water | fert
    const [selectedSeed, setSelectedSeed] = useState("carrot");
    const [isDragging, setIsDragging] = useState(false);
    const draggingRef = useRef(false);
    const toolRef = useRef(tool);
    const speedOptions = [0, 1, 50]; // 0==pause, 1==normal, 50==x50
    const [speed, setSpeed] = useState(1);
    const speedRef = useRef(speed);

    // simulation time tracking
    const lastTsRef = useRef(performance.now());

    // persist grid regularly
    useEffect(() => {
        try {
            localStorage.setItem("farm_grid_v1", JSON.stringify(grid));
        } catch (e) { }
    }, [grid]);

    // Keep refs up to date
    useEffect(() => {
        toolRef.current = tool;
    }, [tool]);
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

    // Simulation loop using requestAnimationFrame for smoothness
    useEffect(() => {
        let raf = 0;
        function tick(now) {
            const last = lastTsRef.current || now;
            let dt = (now - last) / 1000; // seconds
            lastTsRef.current = now;

            const multiplier = speedRef.current;
            if (multiplier > 0) {
                // scale dt by speed
                const scaledDt = dt * multiplier;

                // update grid
                setGrid((prevGrid) => {
                    // shallow clone rows we change
                    let changed = false;
                    const newGrid = prevGrid.map((row) => row.slice());

                    for (let r = 0; r < ROWS; r++) {
                        for (let c = 0; c < COLS; c++) {
                            const cell = newGrid[r][c];
                            if (cell.plant) {
                                const p = { ...cell.plant };
                                // watering and fertilizing effects: water adds a small growth boost, fertilizer multiply growth rate
                                // we treat p.watered and p.fertilized as remaining seconds of effect

                                // compute effective growth speed factor
                                let growthFactor = 1;
                                if (p.fertilized && p.fertilized > 0) growthFactor += 1.5; // fertilizer substantial boost
                                if (p.watered && p.watered > 0) growthFactor += 0.5; // water small boost

                                const timeNeeded = SEEDS[p.type].baseSecondsToMature;
                                p.progressSeconds = (p.progressSeconds || 0) + scaledDt * growthFactor;

                                // decrement effect timers (they do NOT scale with speed - they are real-time durations but for simplicity we scale them too)
                                if (p.watered && p.watered > 0) p.watered = Math.max(0, p.watered - scaledDt);
                                if (p.fertilized && p.fertilized > 0) p.fertilized = Math.max(0, p.fertilized - scaledDt);

                                // clamp
                                p.progressSeconds = clamp(p.progressSeconds, 0, timeNeeded);

                                // once matured, mark ready
                                if (p.progressSeconds >= timeNeeded) p.ready = true;

                                // write back if changed
                                if (
                                    p.progressSeconds !== cell.plant.progressSeconds ||
                                    p.watered !== cell.plant.watered ||
                                    p.fertilized !== cell.plant.fertilized ||
                                    p.ready !== cell.plant.ready
                                ) {
                                    newGrid[r][c] = { plant: p };
                                    changed = true;
                                }
                            }
                        }
                    }

                    return changed ? newGrid : prevGrid;
                });
            }

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    // pointer handlers for planting/watering/fertilizing
    function handlePointerDown(r, c, e) {
        e.preventDefault();
        draggingRef.current = true;
        setIsDragging(true);
        applyToolToCell(r, c);
    }
    function handlePointerEnter(r, c, e) {
        if (!draggingRef.current) return;
        e.preventDefault();
        applyToolToCell(r, c);
    }
    function handlePointerUp() {
        draggingRef.current = false;
        setIsDragging(false);
    }

    useEffect(() => {
        window.addEventListener("pointerup", handlePointerUp);
        return () => window.removeEventListener("pointerup", handlePointerUp);
    }, []);

    function applyToolToCell(row, col) {
        setGrid((prev) => {
            const newGrid = prev.map((r) => r.slice());
            const cell = newGrid[row][col];

            if (toolRef.current === "seed") {
                // if empty, plant the selected seed
                if (!cell.plant) {
                    newGrid[row][col] = {
                        plant: {
                            type: selectedSeed,
                            plantedAt: Date.now(),
                            progressSeconds: 0,
                            watered: 0,
                            fertilized: 0,
                            ready: false,
                        },
                    };
                }
            } else if (toolRef.current === "water") {
                if (cell.plant) {
                    const p = { ...cell.plant };
                    p.watered = (p.watered || 0) + 20; // seconds of water effect
                    newGrid[row][col] = { plant: p };
                }
            } else if (toolRef.current === "fertilize") {
                if (cell.plant) {
                    const p = { ...cell.plant };
                    p.fertilized = (p.fertilized || 0) + 40; // seconds of fertilizer effect
                    newGrid[row][col] = { plant: p };
                }
            }

            return newGrid;
        });
    }

    function harvestCell(r, c) {
        setGrid((prev) => {
            const newGrid = prev.map((row) => row.slice());
            const cell = newGrid[r][c];
            if (cell.plant && cell.plant.ready) {
                // harvesting resets cell
                newGrid[r][c] = { plant: null };
            }
            return newGrid;
        });
    }

    function resetFarm() {
        if (!confirm("Reset farm? All plants will be lost.")) return;
        setGrid(makeEmptyGrid());
    }

    function speedLabel(s) {
        if (s === 0) return "Pause";
        if (s === 1) return "Normal";
        return `x${s}`;
    }

    // tiny visual helpers
    function progressPercent(cell) {
        if (!cell.plant) return 0;
        const need = SEEDS[cell.plant.type].baseSecondsToMature;
        return Math.round(((cell.plant.progressSeconds || 0) / need) * 100);
    }

    return (
        <div className="p-0 min-h-screen bg-slate-50">
            <div className="w-full max-w-7xl mx-auto p-4">
                <header className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">Mini Farm — 12×8 Grid</h1>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setSpeed(0)}
                            className={`px-3 py-1 rounded ${speed === 0 ? "bg-sky-600 text-white" : "bg-white border"}`}
                        >
                            Pause
                        </button>
                        <button
                            onClick={() => setSpeed(1)}
                            className={`px-3 py-1 rounded ${speed === 1 ? "bg-sky-600 text-white" : "bg-white border"}`}
                        >
                            Normal
                        </button>
                        <button
                            onClick={() => setSpeed(50)}
                            className={`px-3 py-1 rounded ${speed === 50 ? "bg-sky-600 text-white" : "bg-white border"}`}
                        >
                            x50
                        </button>

                        <div className="px-3 py-1 border rounded">Speed: {speedLabel(speed)}</div>
                        <button onClick={resetFarm} className="px-3 py-1 rounded bg-red-50 border text-red-700">
                            Reset
                        </button>
                    </div>
                </header>

                <main className="grid grid-cols-4 gap-4">
                    {/* Left: toolbox */}
                    <aside className="col-span-1 bg-white p-4 rounded shadow-sm">
                        <h2 className="font-semibold mb-2">Tools</h2>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setTool("seed")}
                                    className={`flex-1 px-3 py-2 rounded ${tool === "seed" ? "bg-emerald-500 text-white" : "bg-white border"}`}
                                >
                                    Seed
                                </button>
                                <button
                                    onClick={() => setTool("water")}
                                    className={`flex-1 px-3 py-2 rounded ${tool === "water" ? "bg-amber-400 text-white" : "bg-white border"}`}
                                >
                                    Water
                                </button>
                                <button
                                    onClick={() => setTool("fertilize")}
                                    className={`flex-1 px-3 py-2 rounded ${tool === "fertilize" ? "bg-fuchsia-500 text-white" : "bg-white border"}`}
                                >
                                    Fertilize
                                </button>
                            </div>

                            <div className="mt-2">
                                <div className="text-sm text-slate-600 mb-1">Seed type</div>
                                <div className="flex gap-2">
                                    {Object.keys(SEEDS).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setSelectedSeed(key);
                                                setTool("seed");
                                            }}
                                            className={`px-3 py-1 rounded text-sm ${selectedSeed === key ? "bg-green-600 text-white" : "bg-white border"}`}
                                        >
                                            {SEEDS[key].name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-3 text-sm text-slate-500">
                                Hướng dẫn: Chọn công cụ, nhấn giữ chuột (hoặc chạm), rê qua các ô để thực hiện hành động.
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-medium mb-1">Instructions</div>
                                <ul className="text-xs list-disc ml-4 text-slate-600">
                                    <li>Seed: gieo hạt nếu ô trống</li>
                                    <li>Water: tưới cho cây (tăng tốc phần trăm tăng trưởng)</li>
                                    <li>Fertilize: bón phân (tăng mạnh tốc độ phát triển)</li>
                                    <li>Click mature plant to harvest</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                    {/* Middle: game grid */}
                    <section className="col-span-2 bg-white p-4 rounded shadow-sm">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm text-slate-700">Grid: {COLS} × {ROWS}</div>
                            <div className="text-sm text-slate-600">Dragging: {isDragging ? "Yes" : "No"}</div>
                        </div>

                        <div
                            className="grid border rounded overflow-hidden"
                            style={{
                                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                                aspectRatio: `${COLS} / ${ROWS}`,
                                height: "600px",
                            }}
                        >
                            {grid.map((row, r) =>
                                row.map((cell, c) => {
                                    const pct = progressPercent(cell);
                                    const plant = cell.plant;

                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            onPointerDown={(e) => handlePointerDown(r, c, e)}
                                            onPointerEnter={(e) => handlePointerEnter(r, c, e)}
                                            className={`border border-slate-200 relative select-none flex items-end justify-center p-1 touch-none`}>

                                            {/* background for empty vs planted */}
                                            <div className="absolute inset-0 pointer-events-none">
                                                {!plant ? (
                                                    <div className="w-full h-full bg-amber-50" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        {/* simple crop visuals */}
                                                        <div className="text-xs text-center">
                                                            <div className={`text-sm font-semibold`}>{SEEDS[plant.type].name}</div>
                                                            <div className={`text-[10px]`}>{pct}%</div>
                                                            <div className={`text-[10px] mt-1`}>
                                                                {plant.ready ? "READY" : `${Math.round((plant.progressSeconds || 0))}s`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* progress bar at bottom */}
                                            <div className="absolute bottom-0 left-0 w-full h-2 bg-slate-100">
                                                <div style={{ width: `${pct}%` }} className="h-full bg-green-400" />
                                            </div>

                                            {/* overlay buttons for mature plants */}
                                            {plant && plant.ready && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        harvestCell(r, c);
                                                    }}
                                                    className="z-10 px-2 py-1 bg-yellow-300 rounded text-xs border"
                                                >
                                                    Harvest
                                                </button>
                                            )}

                                            {/* small badges for water/fert */}
                                            {plant && plant.watered > 0 && (
                                                <div className="absolute top-1 left-1 text-[10px] bg-blue-100 px-1 rounded">W</div>
                                            )}
                                            {plant && plant.fertilized > 0 && (
                                                <div className="absolute top-1 right-1 text-[10px] bg-pink-100 px-1 rounded">F</div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* Right: status / debug */}
                    <aside className="col-span-1 bg-white p-4 rounded shadow-sm">
                        <h3 className="font-semibold">Farm Status</h3>
                        <div className="mt-2 text-sm text-slate-600">
                            <div>Speed: {speedLabel(speed)}</div>
                            <div>Tool: {tool}</div>
                            <div className="mt-2">Selected seed: {SEEDS[selectedSeed].name}</div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium">Legend</div>
                            <div className="text-xs text-slate-600 mt-2">
                                <div>W = watered, F = fertilized, READY = harvestable</div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium">Controls</div>
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => setSpeed(0)} className="px-2 py-1 border rounded text-sm">Pause</button>
                                <button onClick={() => setSpeed(1)} className="px-2 py-1 border rounded text-sm">Normal</button>
                                <button onClick={() => setSpeed(50)} className="px-2 py-1 border rounded text-sm">x50</button>
                            </div>
                        </div>

                        <div className="mt-6 text-xs text-slate-500">
                            Note: For simplicity this demo scales growth and effect timers with speed. In a production game you might keep some timers tied to real time.
                        </div>
                    </aside>
                </main>

                <footer className="mt-6 text-center text-sm text-slate-500">Built with Next.js + React — demo farm</footer>
            </div>
        </div>
    );
}
