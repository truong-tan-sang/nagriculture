"use client";
import React from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import IsometricCube from "@/components/IsometricCube";
import { BevelButton } from "@/components/ThemeProvider";
import RiceGameProvider from "./RiceGameProvider";
import StepSelectMethod from "./StepSelectMethod";
import StepSelectSeason from "./StepSelectSeason";
import StepSelectFertilizer from "./StepSelectFertilizer";
import { useRiceGame } from "./RiceGameContext";
import StepPlay from "./StepPlay";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function RiceGameCore() {
    const { step, water, stage } = useRiceGame();

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
        }}>
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 0 }}>
                <MapView />
            </Box>

            {/* Overlay */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(230,230,255,0.8)",
                    borderRadius: 3,
                    fontSize: 12,
                    zIndex: 1000,
                    width: "95%", height: "95%",
                    display: "flex",
                    alignItems: "center", justifyContent: "center",
                    backdropFilter: "blur(2px)",
                }}
            >
                {/* Cube hiển thị giữa */}
                <Box sx={{ position: "absolute", top: "50%", left: "50%", overflow: "visible" }}>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            width: 360,
                            height: 120,
                            background: "rgba(0,0,0,0.3)",
                            borderRadius: "50%",
                            transform: "translate(-25%,-100%)",
                            filter: "blur(32px)",
                            zIndex: 0,
                        }}
                    />
                    <Box
                        sx={{
                            animation: "floatUpDown 6s ease-in-out infinite",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <IsometricCube
                            overlay={{
                                enabled: true,
                                thickness: water / 300,
                                colors: { top: water ? `rgba(119, 220, 245, ${15/25})` : "transparent", left: "#5ecefea3", right: "#3496afc3" },
                            }}
                            growthStage={stage}
                        />
                    </Box>
                </Box>

                {/* Hiển thị từng bước */}
                {step === 0 && <StepSelectMethod />}
                {step === 1 && <StepSelectSeason />}
                {/* {step === 2 && <StepSelectFertilizer />} */}
                {step === 2 && <StepPlay />}
            </Box>
        </Box>
    );
}

export default function RiceGame() {
    return (
        <RiceGameProvider>
            <RiceGameCore />
        </RiceGameProvider>
    );
}
