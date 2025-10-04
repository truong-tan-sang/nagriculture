import React, { useEffect, useRef, useState } from "react";
import grassImage from '../../public/favicon.ico'; // Import hình ảnh
const COL = 8
const ROW = 5
const SOIL_TYPES = ["Ngập nước", "Truyền thống"]
import Image from "next/image";
import IsometricCube from "./IsometricCube";

function Tile({ tile, index, onMouseDown, onMouseEnter, onClick }) {
    const plantEmoji = tile.planted
        ? tile.growth >= 100
            ? "🌾"
            : tile.growth >= 80
                ? "🌿"
                : "🌱"
        : null;
    return (
        <div className="w-20 h-20 flex items-center justify-center overflow-hidden relative"
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown(index);
            }}
            onMouseEnter={(e) => {
                e.preventDefault();
                onMouseEnter(index)}}
            onClick={() => onClick(index)}
            title={`Soil: ${tile.soilType} | Growth: ${Math.round(tile.growth)}%`}
        >

            <div className="absolute inset-0"
                style={{
                    backgroundImage: "url('/images/dirt.png')",
                    backgroundSize: "80px 80px", // kích thước mỗi ô lặp
                }}
            />
            {tile.soilType === "Ngập nước" && (            
                <div className="absolute inset-0"
                style={{
                    backgroundImage: "url('/images/water.png')",
                    backgroundSize: "80px 80px", // kích thước mỗi ô lặp
                    opacity: 0.3
                }}
            />
            )}
            {tile.soilType === "Truyền thống" && (    
            <div className="absolute inset-0"
                style={{ backgroundColor: "rgba(0, 0, 0, 1)", opacity: tile.water / 200 }}>
            </div>

            )}
        {/* Water Indicator Bar */}
        <div className="absolute left-0 h-1.5 bottom-1.5 w-full grid grid-cols-10 gap-0 border-white border-1 ">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="w-full"
                    style={{
                        backgroundColor:
                            i < Math.round((tile.water / 100) * 10)
                                ? 'rgba(0, 251, 255, 1)'
                                : 'rgba(200, 200, 255, 0.3)'
                    }}
                ></div>
            ))}
        </div>
        <div className="absolute left-0 h-1.5 bottom-0 w-full grid grid-cols-10 gap-0 border-white border-1 ">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="w-full"
                    style={{
                        backgroundColor:
                            i < Math.round((tile.nutrition / 100) * 10)
                                ? 'rgba(255, 136, 0, 1)'
                                : 'rgba(200, 200, 255, 0.3)',
                    }}
                ></div>
            ))}
        </div>
            <div className={`absolute inset-0 p-2 flex items-end justify-center`}>
                {tile.planted ? (
                    <div className="text-2xl pointer-events-none">{plantEmoji}</div>
                ) : (
                    <div className="text-xs text-gray-400"></div>
                )}
            </div>
        </div>
    );
}

function createEmptyTile() {
    return {
        planted: false,
        growth: 0,
        stage: "Empty",
        water: 0,
        nutrition: 0,
        soilType: "Ngập nước",
        lastWatered: 0,
    };
}

function createInitialTiles() {
    const arr = new Array(ROW * COL).fill(0).map(() => createEmptyTile());
    return arr;
}
export default function GridMap() {
    const [mode, setMode] = useState("seed");
    const [activeInfoIndex, setActiveInfoIndex] = useState(null);
    const [tiles, setTiles] = useState(() => {
        return createInitialTiles();
    });
    const modes = [
        { name: "seed", icon: "🪓" },
        { name: "water", icon: "💧" },
        { name: "fertilize", icon: "🧪" },
        { name: "harvest", icon: "🌾" },
    ];
    /* Handle mouse events for hovering over tiles */
    const mouseDownRef = useRef(false);
    const [log, setLog] = useState<string[]>([]);
    useEffect(() => {
        const up = () => (mouseDownRef.current = false);
        window.addEventListener("mouseup", up);
        window.addEventListener("mouseleave", up);
        return () => {
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mouseleave", up);
        };
    }, []);
    function handleMouseDownOnTile(i) {
        mouseDownRef.current = true;
        console.log(i);
        applyAction(i);
    }
    function handleMouseEnterOnTile(i) {
        console.log(i);
        if (mouseDownRef.current) applyAction(i);
        setActiveInfoIndex((prev) => (prev === i ? null : i));
    }

    useEffect(() => {
        const id = setInterval(() => {
            setTiles((prev) =>
                prev.map((t) => {
                    if (!t.planted) return t;
                    const waterFactor = t.water / 100; // 0..1
                    const nutFactor = t.nutrition / 100; // 0..1
                    // base growth per tick depends on water & nutrition
                    const base = 10; // tune this
                    const inc = base * (0.2 + waterFactor * 0.8) * (0.4 + nutFactor * 0.6);
                    let growth = Math.min(100, t.growth + inc);
                    // decay water & nutrition slowly
                    let water = Math.max(0, t.water - 1.5);
                    let nutrition = Math.max(0, t.nutrition - 0.2);
                    const stage = growth >= 100 ? "Trưởng thành" : growth >= 80 ? "Cao" : growth >= 30 ? "Lớn" : "Mầm";
                    return { ...t, growth, water, nutrition, stage };
                })
            );
        }, 2000);
        return () => clearInterval(id);
    }, []);

    function pushLog(text) {
        setLog((l) => [`${new Date().toLocaleTimeString()} — ${text}`, ...l].slice(0, 30));
    }
    function handleClickTile(i) {
        setActiveInfoIndex((prev) => (prev === i ? null : i));
    }
    function applyAction(index) {
        setTiles((prev) =>
            prev.map((t, i) => {
                if (i !== index) return t;
                const tile = { ...t };
                if (mode === "seed") {
                    if (!tile.planted) {
                        tile.planted = true;
                        tile.growth = 0;
                        tile.stage = "Mầm";
                        tile.water = 0;
                        tile.nutrition = 0;
                        tile.lastWatered = Date.now();
                        pushLog(`Gieo hạt ở ô ${index + 1}`);
                    }
                } else if (mode === "water") {
                    if (tile.planted) {
                        tile.water = Math.min(100, tile.water + 25);
                        tile.lastWatered = Date.now();
                        pushLog(`Tưới ở ô ${index + 1}`);
                    }
                } else if (mode === "fertilize") {
                    if (tile.planted) {
                        tile.nutrition = Math.min(100, tile.nutrition + 25);
                        pushLog(`Bón phân ô ${index + 1}`);
                    }
                } else if (mode === "harvest") {
                    if (tile.planted && tile.growth >= 100) {
                        pushLog(`Thu hoạch từ ô ${index + 1}`);
                        return createEmptyTile();
                    }
                }
                return tile;
            })
        );
    }
    return (
        <div className="flex justify-center items-center h-screen font-sans" style={{
            backgroundImage: "url('/images/grass.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "40px 40px", // kích thước mỗi ô lặp
        }}>
            <div className="absolute top-4 left-4 text-lg font-bold flex border border-gray-300 p-2 rounded shadow">
                {modes.map((m) => (
                    <div key={m.name} className={`mx-2 cursor-pointer transition-transform ${m.name === mode ? "scale-120" : ""} hover:scale-120`} title={m.name} onClick={() => {

                        setMode(m.name);
                        console.log(mode);
                    }}>
                        {m.icon}
                    </div>
                ))}
            </div>
            <div className={`grid grid-cols-8 gap-0`}>
                {tiles.map((t, i) => (
                    <Tile
                        key={i}
                        tile={t} index={i}
                        onMouseDown={handleMouseDownOnTile}
                        onMouseEnter={handleMouseEnterOnTile}
                        onClick={handleClickTile}
                    />
                ))}
            </div>

                <div className="absolute left-20  w-40 p-3 border rounded bg-white">
                    <h3 className="font-medium">Hướng dẫn ngắn</h3>
                    <ul className="list-disc ml-5 mt-2 text-sm">
                        <li>Chọn chế độ (Gieo/Tưới/Bón/Thu hoạch).</li>
                        <li>Nhấn giữ chuột vào ô rồi rê để áp dụng cùng lúc trên nhiều ô.</li>
                        <li>Cây lớn dần theo thời gian (mỗi 2s cập nhật 1 lần).</li>
                        <li>Thu hoạch khi cây đạt 100% để nhận hạt giống trở lại.</li>
                    </ul>
                </div>


                <div className="absolute right-20 bottom-10 border w-60 rounded bg-white">
                    <h3 className="font-medium">Log</h3>
                    <div className="text-xs mt-2 max-h-48 overflow-auto">
                        {log.length === 0 ? <div className="text-gray-400">Không có hoạt động</div> : log.map((l, idx) => <div key={idx} className="mb-1">{l}</div>)}
                    </div>
                </div>  


                <div>
                    <div className="absolute right-20 top-10 border rounded bg-white">
                        <h3 className="font-medium">Thông tin ô</h3>
                        {activeInfoIndex == null ? (
                            <div className="text-sm text-gray-400">Nhấn vào ô để xem chi tiết</div>
                        ) : (
                            (() => {
                                const t = tiles[activeInfoIndex];
                                return (
                                    <div>
                                        <div className="text-sm">Ô: {activeInfoIndex + 1}</div>
                                        <div className="text-sm">Soil: {t.soilType}</div>
                                        <div className="text-sm">Planted: {t.planted}</div>
                                        <div className="text-sm">Growth: {Math.round(t.growth)}%</div>
                                        <div className="text-sm">Water: {Math.round(t.water)}</div>
                                        <div className="text-sm">Nutrition: {Math.round(t.nutrition)}</div>
                                        <div className="mt-2">
                                            <button className="px-2 py-1 border rounded mr-2" onClick={() => { setMode('water'); pushLog('Chuyển sang chế độ Tưới'); }}>Tới tưới</button>
                                            <button className="px-2 py-1 border rounded" onClick={() => { setMode('fertilize'); pushLog('Chuyển sang chế độ Bón phân'); }}>Tới bón</button>
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </div>
                </div>
                <IsometricCube
                    size={500}
                    side={400}
                    thickness={0.5}
                    colors={{ top: '#ac6400ff', left: '#b47800ff', right: '#b47800ff' }}
                    overlay={{ enabled: true, thickness: 0.1, colors: { top: '#a2e3ffce', left: '#7dd8ff55', right: '#7dd8ff55' } }}
                />
            </div>
    );
}
