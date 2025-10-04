import { Box, Grid, Typography } from "@mui/material";
import { useRiceGame } from "./RiceGameContext";
import { BevelButton, neumorphism } from "@/components/ThemeProvider";

export default function StepSelectMethod() {
    const { methods, setMethod, setStep } = useRiceGame();

    return (
        <Box
            sx={{
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
            <Typography variant="h4" gutterBottom mb={4} align="center">
                Choose cultivation method:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {methods.map((m, i) => (
                    <Grid key={i} size={4}>
                        <Box
                            onClick={() => {
                                setMethod(m.key);
                                setStep(1);
                            }}
                            sx={{
                                ...BevelButton,
                                cursor: "pointer",
                                "&:hover": { boxShadow: 6 },
                                height: "100%",
                                backgroundColor: neumorphism.card,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                <Typography variant="h6" align="center">
                                    {m.name}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
