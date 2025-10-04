import { Box, Grid, Typography } from "@mui/material";
import { useRiceGame } from "./RiceGameContext";
import { BevelButton } from "@/components/ThemeProvider";

export default function StepSelectSeason() {
    const { seasons, season, setSeason, setStep } = useRiceGame();

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
                            onClick={() => {
                                setSeason(s);
                                setStep(2);
                            }}
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
