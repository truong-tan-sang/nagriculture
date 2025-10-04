import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Slider,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import { useRiceGame } from "./RiceGameContext";
import ChartOverlay from "@/components/ChartOverlay";
import { BevelButton, neumorphism } from "@/components/ThemeProvider";
import { PrettoSlider } from "./PrettoSlider";

export default function StepPlay() {
    const {
        stage,
        setStage,
        stages,
        stageColors,
        amendments,
        water,
        setWater,
        chartOpen,
        setChartOpen,
        season,
        setStep,
        setMethod,
        methods,
        fertilizers,
        setFertilizers,
        sessionKey,
    } = useRiceGame();
    const stockFertilizers = [
        { id: 1, name: "Urea", key: "Urea" },
        { id: 2, name: "Diammonium phosphate", key: "Diammonium phosphate" },
        { id: 3, name: "Ammonium sulphate", key: "Ammonium sulphate" },
        { id: 4, name: "Ammonium chloride", key: "Ammonium chloride" },
        { id: 5, name: "Ammonium nitrate", key: "Ammonium nitrate" },
        { id: 6, name: "Superphosphate", key: "Superphosphate" },
        { id: 7, name: "Kali", key: "Kali" },
        { id: 8, name: "NPK (Stage 2 – De Nhanh)", key: "NPK in stage 2 (NPK_de_nhanh)" },
        { id: 9, name: "NPK (Stage 3 – Lam Rong)", key: "NPK in stage 3 (NPK_lam_rong)" },
    ];

    const [stageInfoOpen, setStageInfoOpen] = useState(false);
    const [stageInfo, setStageInfo] = useState<any>(null);
    const [loadingInfo, setLoadingInfo] = useState(false);
    // 📦 Placeholder: Gọi API (ở đây giả lập)
    const fetchStageInfo = async (nextStage: number) => {
        setLoadingInfo(true);
        setStageInfoOpen(true);

        try {
            // ✅ Lấy thông tin hiện tại
            const fertilizer = fertilizers[stage];
            const irrigationLevel = water;

            // ✅ Tạo payload đúng định dạng
            const payload = {
                player_action: {
                    fertilization: {
                        organic_fertilizer: { [fertilizers[0].name]: fertilizers[0].amount }, // bạn có thể sửa logic theo stage
                        synthetic_fertilizer: stage === 0
                            ? {"urea":0}
                            : { [fertilizer?.name || "urea"]: fertilizer?.amount || 0 },
                    },
                    irrigation: { level: irrigationLevel },
                },
            };

            // ✅ Gửi POST API thật
            const res = await fetch(
                `https://monnas-backend.onrender.com/game-sessions/${sessionKey}/play-stage`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();

            // ✅ Nhận dữ liệu phản hồi từ backend (ví dụ: điều kiện môi trường mới)
            setStageInfo({
                title: `Kết quả sau khi hoàn thành giai đoạn ${stage + 1}`,
                temp: data.environment?.temperature ?? Math.round(20 + Math.random() * 10),
                rain: data.environment?.rainfall ?? Math.round(50 + Math.random() * 50),
                soil:
                    data.recommendation ||
                    "Độ ẩm cao, thích hợp bón phân kali",
            });
        } catch (err) {
            console.error("❌ Lỗi khi gọi API play-stage:", err);
            setStageInfo({
                title: "Không thể tải thông tin giai đoạn",
                temp: "-",
                rain: "-",
                soil: "Vui lòng thử lại.",
            });
        } finally {
            setLoadingInfo(false);
        }
    };

    // 🧭 Khi nhấn nút “Tiếp tục”
    const handleNextStage = async () => {
        if (stage < 4) {
            await fetchStageInfo(stage + 1);
        }
    };

    // 🆗 Khi người chơi xác nhận trong overlay
    const handleConfirmNext = () => {
        setStage((s) => Math.min(4, s + 1));
        setStageInfoOpen(false);
        setStageInfo(null);
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2, width: "100%", zIndex: 1 }}>
            {/* Top info */}
            <Box sx={{
                mt: 2,
            }}>
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        background: (() => {
                            switch (season.name) {
                                case "Winter–Spring":
                                    return "linear-gradient(90deg, #00aeffff, #81c784)"; // cool blue-green
                                case "Summer–Autumn":
                                    return "linear-gradient(90deg, #ffb74d, #ef6c00)"; // warm orange tones
                                case "Autumn–Winter":
                                    return "linear-gradient(90deg, #ff9900ff, #0037ffff)"; // golden to icy blue
                                default:
                                    return "linear-gradient(90deg, #9e9e9e, #bdbdbd)"; // fallback gray
                            }
                        })(),
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {season.name}
                </Typography>
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    Stage {stage + 1}/4
                </Typography>

            </Box>
            {/* Middle content */}
            <Box sx={{ flex: 1, position: "relative", width: "100%", mt: -5 }}>
                {/* Timeline */}
                <Box sx={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-40%)" }}>
                    <Timeline position="right" sx={{ minWidth: 400 }}>
                        {stages.map((label, i) => (
                            <TimelineItem key={i}>
                                <TimelineSeparator>
                                    <TimelineDot
                                        sx={{
                                            bgcolor:
                                                i <= stage
                                                    ? stageColors[i]
                                                    : "grey.500",
                                            boxShadow:
                                                i === stage
                                                    ? "0 0 12px 4px rgba(255, 193, 7, 0.8)"
                                                    : "none",
                                            transition: "0.3s",
                                        }}
                                    />
                                    {i < stages.length - 1 && (
                                        <TimelineConnector
                                            sx={{
                                                backgroundColor:
                                                    i <= stage - 1 ? stageColors[i + 1] : "grey.500",
                                                height: 40,
                                            }}
                                        />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent>
                                    <Typography>{label}</Typography>
                                </TimelineContent>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </Box>

                {/* Environmental info */}
                <Box
                    className="neumorphic"
                    sx={{
                        cursor: "pointer",
                        ...BevelButton,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        justifyContent: "center",
                        width: "auto",
                        height: "auto",
                        position: "absolute",
                        top: "50%",
                        left: 40,
                        transform: "translateY(-50%)",
                        zIndex: 10,
                        p: 4,
                    }}
                    onClick={() => setChartOpen(true)}
                >
                    <Typography variant="h6">📈</Typography>
                    <Typography variant="h6">temp: 123</Typography>
                    <Typography variant="h6">moist: 123</Typography>
                    <Typography variant="h6">light: 123</Typography>
                </Box>
            </Box>

            {/* Bottom controls */}
            <Box sx={{ mt: 2 }}>

                <Grid container spacing={1} alignItems="center" justifyContent="center"
                    sx={{
                        px: 10
                    }}>
                    {/* Cột 1: Dropdown chọn phân bón */}
                    <Grid size={6}>

                        <Typography gutterBottom>Điều chỉnh mực nước:</Typography>
                    </Grid>
                    <Grid size={3}>

                        <Typography gutterBottom align="center">
                            Chọn loại và lượng phân bón:
                        </Typography>
                    </Grid>
                    <Grid size={3}>
                        <FormControl fullWidth>
                            <InputLabel>Loại phân bón</InputLabel>
                            <Select
                                value={fertilizers[stage]?.id || ""}
                                label="Loại phân bón"
                                onChange={(e) => {
                                    const selected = (stage === 0 ? amendments : stockFertilizers).find(
                                        (f) => f.id === e.target.value
                                    );
                                    setFertilizers((prev) =>
                                        prev.map((f, i) =>
                                            i === stage ? { ...f, name: selected?.key as number } : f
                                        )
                                    );
                                }}
                            >
                                {(stage === 0 ? amendments : stockFertilizers).map((f) => (
                                    <MenuItem key={f.id} value={f.id}>
                                        {f.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={6}>

                        <Slider
                            value={water}
                            onChange={(e, newVal) => setWater(newVal)}
                            valueLabelDisplay="auto"
                            max={15}
                            step={0.1}
                            sx={{ width: 400 }}
                        />
                        <Typography variant="body2">{water} cm</Typography>
                    </Grid>
                    <Grid size={6}>
                        {fertilizers[stage] && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "stretch",
                                }}
                            >
                                <Slider
                                    value={fertilizers[stage]?.amount || 0}
                                    onChange={(e, val) => {
                                        setFertilizers((prev) =>
                                            prev.map((f, i) =>
                                                i === stage ? { ...f, amount: val as number } : f
                                            )

                                        )
                                        console.log(fertilizers);
                                    }
                                    }
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={20}
                                    step={0.5}
                                />
                                <Typography textAlign="center">
                                    Lượng phân ({fertilizers[stage]?.name}): {fertilizers[stage]?.amount || 0} ton/ha
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => setStage((s) => Math.max(0, s - 1))}
                        disabled={stage === 0}
                    >
                        Trở lại
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleNextStage}
                        disabled={stage === 4}
                    >
                        Tiếp tục
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => {
                            setStep(0);
                            setStage(0);
                            setWater(5);
                            setFertilizers((prev) =>
                                prev.map((f, i) => (i === stage ? { ...f, amount: 0 } : f))
                            );
                        }}
                    >
                        Chơi lại
                    </Button>

                </Box>
            </Box>
            <Dialog open={stageInfoOpen} onClose={() => setStageInfoOpen(false)} maxWidth="sm" fullWidth>
                <DialogContent sx={{ textAlign: "center", py: 4 }}>
                    {loadingInfo ? (
                        <>
                            <CircularProgress />
                            <Typography mt={2}>Đang tải thông tin giai đoạn...</Typography>
                        </>
                    ) : (
                        stageInfo && (
                            <>
                                <Typography variant="h5" gutterBottom>
                                    {stageInfo.title}
                                </Typography>
                                <Typography>🌡️ Nhiệt độ: {stageInfo.temp}°C</Typography>
                                <Typography>🌧️ Lượng mưa: {stageInfo.rain} mm</Typography>
                                <Typography>🌱 Gợi ý: {stageInfo.soil}</Typography>
                            </>
                        )
                    )}
                </DialogContent>
                {!loadingInfo && (
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button variant="contained" onClick={handleConfirmNext}>
                            OK – Sang giai đoạn mới
                        </Button>
                    </DialogActions>
                )}
            </Dialog>


            <ChartOverlay open={chartOpen} onClose={() => setChartOpen(false)} />
        </Box>
    );
}
