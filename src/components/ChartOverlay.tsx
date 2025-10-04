import React from "react";
import {
    LineChart, Line, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Box, Button, Typography } from "@mui/material";
import { HoverBackground } from "./ThemeProvider";
import { useRiceGame } from "./RiceGameContext";

// 🌾 Sample data (can be replaced later by live data)



export default function ChartOverlay() {
    const { chartOpen, setChartOpen, season, stage, weatherData } = useRiceGame();

    if (!chartOpen) return null;
    const seasonData = weatherData.find(s => s.season === season.name);
    console.log(seasonData);
    console.log(stage);
    const stageData = seasonData?.stages.find(st => st.stage === stage+1);
    console.log(stageData);

    // Flatten into Recharts format
    const chartData = stageData
        ? stageData.weeks.map(w => ({
            week: `W${w.week}`,
            temp: w.temp,
            rain: w.rain,
            humidity: w.humidity,
        }))
        : [];
    console.log(chartData);
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
                p: 10,
                backdropFilter: "blur(6px)",
            }}
        >
            {/* Chart container */}
            <Box
                sx={{
                    ...HoverBackground,
                    flex: 1,
                    width: "100%",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Typography variant="h5" sx={{ mb: 3, color: "#000000ff" }}>
                    🌦️ Weather Data
                </Typography>

                {/* Chart */}
                <Box sx={{ width: "100%", height: "80%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            <XAxis dataKey="week" stroke="#111" />
                            <YAxis
                                yAxisId="left"
                                label={{
                                    value: "Temp (°C)",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { fill: "#111" },
                                }}
                                stroke="#111"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{
                                    value: "Humidity (%) / Rain (mm)",
                                    angle: 90,
                                    position: "insideRight",
                                    style: { fill: "#555" },
                                }}
                                stroke="#555"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#222",
                                    border: "1px solid #555",
                                    borderRadius: 8,
                                }}
                            />
                            <Legend wrapperStyle={{ color: "#000" }} />

                            <Bar
                                yAxisId="right"
                                dataKey="rain"
                                fill="#4fc3f7"
                                name="Rain (mm)"
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="temp"
                                stroke="#e53935"
                                name="Temp (°C)"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="humidity"
                                stroke="#43a047"
                                name="Humidity (%)"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Close button */}
                <Button
                    variant="outlined"
                    onClick={() => setChartOpen(false)}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        borderRadius: "50%",
                        minWidth: 48,
                        minHeight: 48,
                        fontWeight: "bold",
                        border: "none",
                        color: "black",
                    }}
                >
                    ✕
                </Button>
            </Box>
        </Box>
    );
}
