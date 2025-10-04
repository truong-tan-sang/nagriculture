import { Box, Grid, Typography } from "@mui/material";
import { useRiceGame } from "./RiceGameContext";
import { BevelButton } from "@/components/ThemeProvider";
import { useState } from "react";

export default function StepSelectSeason() {
    const { seasons, season, setSeason, setStep, method, sessionKey, setSessionKey } = useRiceGame();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleSeasonSelect = async (s: any) => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                player_name: "Anonymous",
                start_time: new Date().toISOString(),
                status: "in_progress",
                season_key: s.key || "dong-xuan", // fallback
                water_regime: method || "AWD",
            };

            const res = await fetch("https://monnas-backend.onrender.com/game-sessions/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            // console.log("🎮 Game session created:", data);
            console.log("🔑 Session Key:", data._id);
            setSessionKey(data._id);
            // ✅ Cập nhật context + chuyển bước tiếp theo
            setSeason(s);
            setStep(2);

        } catch (err: any) {
            console.error("❌ Failed to create game session:", err);
            setError("Không thể tạo session, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                height: "30%",
                width: "50%",
                overflow: "auto",
                p: 2,
            }}
        >
            <Grid container spacing={2} justifyContent="center" sx={{ width: "80%" }}>
                {seasons.map((s, i) => (
                    <Grid key={i} size={4}>
                        <Box
                            className="neumorphic"
                            onClick={() => handleSeasonSelect(s)}
                            sx={{
                                ...BevelButton,
                                cursor: "pointer",
                                height: "100%",
                                boxShadow: season?.name === s.name ? 8 : 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                }}
                            >
                                <Typography variant="h6">{s.name}</Typography>
                                <Typography variant="body2">{s.time}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
