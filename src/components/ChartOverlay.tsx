import { Box, Button, Typography } from "@mui/material";
import React from "react";
import {
    LineChart, Line, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { HoverBackground } from "./ThemeProvider";

// Dữ liệu mẫu
const data = [
    { day: 'Mon', temp: 28, humidity: 65, rain: 10 },
    { day: 'Tue', temp: 30, humidity: 70, rain: 5 },
    { day: 'Wed', temp: 27, humidity: 60, rain: 15 },
    { day: 'Thu', temp: 25, humidity: 75, rain: 20 },
    { day: 'Fri', temp: 29, humidity: 68, rain: 0 },
];

export default function ChartOverlay({
    chartOpen, setChartOpen,
}: {
    chartOpen: boolean;
    setChartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    if (!chartOpen) return null;

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
            }}
        >
            {/* Chart container */}
            <Box
                sx={{
                    ...HoverBackground,
                    flex: 1,
                    width: "100%",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Biểu đồ Nhiệt độ - Độ ẩm - Lượng mưa
                </Typography>

                {/* Chart */}
                <Box sx={{ width: "100%", height: "90%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />

                            {/* Trục trái cho nhiệt độ */}
                            <YAxis
                                yAxisId="left"
                                label={{
                                    value: "Temp (°C)",
                                    angle: -90,
                                    position: "insideLeft",
                                }}
                            />
                            {/* Trục phải cho độ ẩm + mưa */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{
                                    value: "Humidity (%) / Rain (mm)",
                                    angle: 90,
                                    position: "insideRight",
                                }}
                            />

                            <Tooltip />
                            <Legend />

                            {/* Bar chart cho mưa */}
                            <Bar
                                yAxisId="right"
                                dataKey="rain"
                                fill="#4fc3f7"
                                name="Rain (mm)"
                            />

                            {/* Line chart cho nhiệt độ */}
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="temp"
                                stroke="#e53935"
                                name="Temp (°C)"
                            />

                            {/* Line chart cho độ ẩm */}
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="humidity"
                                stroke="#43a047"
                                name="Humidity (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                {/* Close button */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setChartOpen(false)}
                    sx={{ position: "absolute", top: 16, right: 16 }}
                >
                    Đóng
                </Button>
            </Box>
        </Box>
    );
}
