import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Slider, Grid, Box } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { PrettoSlider } from "@/components/PrettoSlider";
import IsometricCube from "@/components/IsometricCube";

export default function RiceGame() {
  const [step, setStep] = useState(0); // 0=chọn canh tác, 1=chọn vụ mùa, 2=chơi
  const [method, setMethod] = useState(null);
  const [season, setSeason] = useState(null);
  // const [fertilizer, setFertilizer] = useState([0, 0, 0]);
  const [fertilizer1, setFertilizer1] = useState(0); 
  const [fertilizer1A, setfertilizer1A] = useState(0); 
  const [fertilizer2, setFertilizer2] = useState(0);
  const [fertilizer3, setFertilizer3] = useState(0);
  const [water, setWater] = useState(50);
  const [stage, setStage] = useState(0); // 0-3 giai đoạn
  const amendments = [
    { name: "Straw (<30d before cultivation)", cfoa: 1.00, range: "0.85 - 1.17" },
    { name: "Straw (>30d before cultivation)", cfoa: 0.19, range: "0.11 - 0.28" },
    { name: "Compost", cfoa: 0.17, range: "0.09 - 0.29" },
    { name: "Farm yard manure", cfoa: 0.21, range: "0.15 - 0.28" },
    { name: "Green manure", cfoa: 0.45, range: "0.36 - 0.57" },
  ];
  // Giả lập data mùa vụ
  const seasons = [
    { name: "Đông Xuân", time: "1/11/2023 - 20/2/2024" },
    { name: "Hè Thu", time: "15/4/2024 - 4/8/2024" },
    { name: "Thu Đông", time: "15/9/2024 - 4/1/2025" },
  ];

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(0, #63e0cfff, #2f5fabff)', minHeight: '100vh'
    }}>
      {/* Chọn hình thức canh tác */}
      {step === 0 && (
        <Box>
          <Typography variant="h4" gutterBottom mb={4} align="center">
            Choose cultivation method:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {['Alternate Wetting and Drying (AWD)', 'Traditional method', 'Direct seeding'].map((m, i) => (
              <Grid key={i} size={4} >
                <Card onClick={() => { setMethod(m); setStep(1); }} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } , height: '100%'}}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(0, #33b05dff, #008236ff)' }}>
                    <Typography variant="h6" align="center">{m}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Chọn vụ mùa */}
      {step === 1 && (
        <Grid container spacing={2} justifyContent="center" width={600}>
          {seasons.map((s,i) => (
              <Grid key={i} size={4} >
              <Card onClick={() => {setSeason(s); setStep(2);}} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 }, height: '100%'}}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                  <Typography variant="h6">{s.name}</Typography>
                  <Typography variant="body2">{s.time}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Chọn phân ban đầu */}
      {step === 2 && (
    <Box style={{ width: 700, margin: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Chọn loại phân hữu cơ
      </Typography>
          <Grid container spacing={2} justifyContent="center">
            {amendments.map((a, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card
                  onClick={() => setFertilizer1(a)}
                  sx={{
                    cursor: "pointer",
                    boxShadow: fertilizer1?.name === a.name ? 8 : 2,
                    border: fertilizer1?.name === a.name ? "2px solid #1976d2" : "none",  
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
                    <Typography variant="h6">{a.name}</Typography>
                    <Typography variant="body2">
                      CFOA: {a.cfoa} (± {a.range})
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box style={{ marginTop: 40 }}>
            <Typography gutterBottom>
              Lượng phân: {fertilizer1A} ton/ha
            </Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={20}
              value={fertilizer1A}
              min={0}
              max={20}
              step={0.5}
              onChange={(e, val) => setfertilizer1A(val)}
            />
          </Box>
          <Button variant="contained" style={{ marginTop: 20 }} onClick={() => setStep(3)} disabled={!fertilizer1}>
            NextStage 
          </Button>
        </Box>
      )}
        
        <IsometricCube>
        </IsometricCube>
      {/* Giao diện chính */}
      {step === 3 && (
        <Box display="flex" flexDirection="column" alignItems="center" gap={4} width="100%">
          <Typography variant="h5">{season.name} - Giai đoạn {stage+1}/4</Typography>
          <Box width={200} height={200} display="flex" alignItems="center" justifyContent="center" bgcolor="lightgreen" borderRadius={4} boxShadow={3}>
            <Typography variant="h4">🌾</Typography>
          </Box>

          {/* Slider phân bón */}
          <Box width={400}>
            <Typography gutterBottom>Chọn lượng phân bón (3 loại):</Typography>
            {/* <Slider
              value={fertilizer}
              onChange={(e,newVal)=>setFertilizer(newVal)}
              valueLabelDisplay="auto"
              max={100}
              step={10}
              disableSwap
            /> */}
            <Typography variant="body2">{JSON.stringify(fertilizer1)}</Typography>
          </Box>

          {/* Slider nước */}
          <Box width={400}>
            <Typography gutterBottom>Lượng nước tưới:</Typography>
            <Slider
              value={water}
              onChange={(e,newVal)=>setWater(newVal)}
              valueLabelDisplay="auto"
              max={100}
              step={5}
            />
            <Typography variant="body2">{water} Lít/m²</Typography>
          </Box>

          <Button variant="contained" onClick={() => setStage(stage+1)} disabled={stage===3}>
            {stage===3 ? "Hoàn thành mùa vụ" : "Qua giai đoạn tiếp theo"}
          </Button>

          {/* Timeline hiển thị tiến độ */}
          <Box position="absolute" left={0} width="100%" py={2}>
            <Timeline position="right">
              {[0,1,2,3].map((i) => (
                <TimelineItem key={i}>
                  <TimelineSeparator>
                    <TimelineDot color={i===stage ? "primary" : "grey"} />
                    {i < 3 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography>Giai đoạn {i+1}</Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        </Box>
      )}
    </Box>
  );
}
