import React, { useState, useEffect, useRef } from "react";
import { Slider, Box, Typography, Button } from "@mui/material";

export default function SliderGame({
    stage = 3,
    base = 7,
    minA = 5,
    maxA = 10,
    onResultChange,
}) {
    const [value, setValue] = useState(base);
    const [running, setRunning] = useState(true);
    const [result, setResult] = useState(null);
    const direction = useRef(1);

    useEffect(() => {
        if (!running) return;
        const speed = 75 - stage * 8.5;
        const interval = setInterval(() => {
            setValue((prev) => {
                let next = prev + direction.current * 0.02 * stage;
                if (next >= 15) {
                    next = 15;
                    direction.current = -1;
                } else if (next <= 0) {
                    next = 0;
                    direction.current = 1;
                }
                return next;
            });
        }, speed);

        return () => clearInterval(interval);
    }, [running, stage]);

    const handleStop = () => {
        setRunning(false);
        const success = value >= minA && value <= maxA;
        setResult(success);
        if (onResultChange) onResultChange(success);
    };

    const marks = Array.from({ length: 16 }, (_, i) => {
        const val = i - base;
        return { value: val, label: `${val}` };
    });

    return (
        <Box
            sx={{
                width: 500,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h6" gutterBottom>
                🎯 Stage {stage} — Try to stop between {minA} and {maxA}
            </Typography>

            <Box sx={{ width: "100%", position: "relative" }}>
                <Slider
                    value={value}
                    min={0 - base}
                    max={15 - base}
                    step={0.1}
                    marks={Array.from({ length: 16 }, (_, i) => ({
                        value: i - base,
                        label: `${i - base}`,
                    }))}
                    disabled
                    sx={{
                        height: 8,
                        "& .MuiSlider-thumb": { display: "none" },
                    }}
                />
                {/* Highlight vùng đúng */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: `${(minA / 15) * 100}%`,
                        width: `${((maxA - minA) / 15) * 100}%`,
                        height: 8,
                        backgroundColor: "rgba(76,175,80,0.3)",
                        transform: "translateY(-50%)",
                        borderRadius: 1,
                    }}
                />

                {/* Thanh chạy */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: `${(value / 15) * 100}%`,
                        width: 3,
                        height: 18,
                        backgroundColor: "red",
                        transform: "translate(-50%, -50%)",
                        borderRadius: 1,
                    }}
                />
            </Box>

            <Button
                variant="contained"
                color={running ? "primary" : result ? "success" : "error"}
                onClick={handleStop}
                sx={{ mt: 3 }}
                disabled={!running}
            >
                {running ? "Stop" : result ? "Success ✅" : "Fail ❌"}
            </Button>
        </Box>
    );
}
