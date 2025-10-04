import { Box, Grid, Typography, Button } from "@mui/material";
import { PrettoSlider } from "@/components/PrettoSlider";
import { useRiceGame } from "./RiceGameContext";
import { BevelButton, neumorphism } from "@/components/ThemeProvider";

export default function StepSelectFertilizer() {
    const { amendments, fertilizer1, setFertilizer1, fertilizer1A, setfertilizer1A, setStep } = useRiceGame();

    return (
        <Box>
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
                    width: "100%",
                    overflow: "auto",
                    p: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Chọn loại phân hữu cơ
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {amendments.map((a, i) => (
                        <Grid key={i} size={2}>
                            <Button
                                onClick={() => setFertilizer1(a)}
                                sx={{
                                    ...BevelButton,
                                    cursor: "pointer",
                                    width: "100%",
                                    height: "100%",
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    textAlign: "center",
                                    boxShadow: fertilizer1?.name === a.name ? neumorphism.hover : neumorphism.outline,
                                }}
                            >
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    <Typography variant="h6">{a.name}</Typography>
                                    <Typography variant="body2">
                                        CFOA: {a.cfoa} (± {a.range})
                                    </Typography>
                                </Box>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "30%",
                    width: "50%",
                    overflow: "auto",
                    p: 2,
                }}
            >
                <Typography gutterBottom>Lượng phân: {fertilizer1A} ton/ha</Typography>
                <PrettoSlider
                    valueLabelDisplay="auto"
                    aria-label="pretto slider"
                    value={fertilizer1A}
                    min={0}
                    max={20}
                    step={0.5}
                    onChange={(e, val) => setfertilizer1A(val)}
                />
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => setStep(3)} disabled={!fertilizer1}>
                    NextStage
                </Button>
            </Box>
        </Box>
    );
}
