import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Slider, Grid, Box } from "@mui/material";
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from "@mui/lab";
import { PrettoSlider } from "@/components/PrettoSlider";
import IsometricCube from "@/components/IsometricCube";
import dynamic from "next/dist/shared/lib/dynamic";
import ChartOverlay from "@/components/ChartOverlay";
import { BevelButton, neumorphism } from "@/components/ThemeProvider";
const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function RiceGame() {
  const [step, setStep] = useState(0); // 0=chọn canh tác, 1=chọn vụ mùa, 2=chơi
  const [method, setMethod] = useState(null);
  const [season, setSeason] = useState(null);
  // const [fertilizer, setFertilizer] = useState([0, 0, 0]);
  const [chartOpen, setChartOpen] = React.useState(false);
  // const [selectedChart, setSelectedChart] = React.useState(0);
  const [fertilizer1, setFertilizer1] = useState(null);
  const [fertilizer1A, setfertilizer1A] = useState(0);
  const [fertilizer2, setFertilizer2] = useState(0);
  const [fertilizer3, setFertilizer3] = useState(0);
  const [water, setWater] = useState(5);
  const [stage, setStage] = useState(0); // 0-3 giai đoạn
  const methods = ['Alternate Wetting and Drying (AWD)', 'Traditional method', 'Regular rainfed'];
  const stages = ["Seeding", "Growth", "Flowering", "Harvest"];
  const stageColors = ["#FFF59D", "#FFD54F", "#FFB300", "#FF8F00"];
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
      minHeight: '100vh'
    }}>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}>
        <MapView />
      </Box>

      <Box
        sx={{
          position: 'absolute', // Ensures it's above the map container
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(230, 230, 255, 0.8)',
          borderRadius: 3,
          fontSize: 12,
          zIndex: 1000, // Make sure it's above the map tiles
          width: '95%',
          height: '95%',
          display: 'flex', // Centering content inside the overlay
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(2px)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            overflow: 'visible',
          }}
        >
          {/* Shadow behind the cube */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: 360,        // width of shadow
              height: 120,        // height of shadow
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '50%',
              transform: 'translate(-25%,-100%)',
              filter: 'blur(32px)',
              zIndex: 0,
            }}
          />

          {/* Floating cube */}
          <Box
            sx={{
              animation: 'floatUpDown 6s ease-in-out infinite',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <IsometricCube
              overlay={{
                enabled: true,
                thickness: water / 200,
                colors: { top: water ? '#77dcf5b0' : 'transparent', left: '#5ecefea3', right: '#3496afc3' },
              }}
              growthStage={stage}
            />
          </Box>
        </Box>

        {/* Chọn hình thức canh tác */}
        {step === 0 && (
          <Box sx={{
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', height: '30%', width: '100%', overflow: 'auto', p: 2,
          }}>
            <Typography variant="h4" gutterBottom mb={4} align="center">
              Choose cultivation method:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {methods.map((m, i) => (
                <Grid key={i} size={4} >
                  <Box onClick={() => { setMethod(m); setStep(1); }}
                    className='neumorphic'
                    sx={{
                      ...BevelButton,
                      cursor: 'pointer', '&:hover': { boxShadow: 6 },
                      height: '100%',
                      backgroundColor: neumorphism.card,
                    }}>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="h6" align="center">{m}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Chọn vụ mùa */}
        {step === 1 && (
          <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', height: '30%', width: '50%', overflow: 'auto', p: 2,
          }}>
            <Grid container spacing={2} justifyContent="center"
              sx={{
                width: '80%',
              }}>
              {seasons.map((s, i) => (
                <Grid key={i} size={4} >
                  <Box
                    className='neumorphic'
                    onClick={() => { setSeason(s); setStep(2) }}
                    sx={{
                      ...BevelButton,
                      cursor: 'pointer', height: '100%',
                      boxShadow: season?.name === s.name ? 8 : 2,
                    }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography variant="h6">{s.name}</Typography>
                      <Typography variant="body2">{s.time}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {/* <Button variant="contained" style={{ marginTop: 20 }} onClick={() => setStep(2)} disabled={!season}>
            NextStage
          </Button> */}
          </Box>
        )}

        {/* Chọn phân ban đầu */}
        {step === 2 && (
          <Box>
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', height: '30%', width: '100%', overflow: 'auto', p: 2,
            }}>
              <Typography variant="h5" gutterBottom>
                Chọn loại phân hữu cơ
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                {amendments.map((a, i) => (
                  <Grid size={2} key={i}>
                    <Button
                      onClick={() => setFertilizer1(a)}
                      sx={{
                        ...BevelButton,
                        cursor: "pointer",
                        width: '100%',
                        height: "100%",
                        // allow wrapping
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        textAlign: "center",
                        boxShadow: fertilizer1?.name === a.name ? neumorphism.hover : neumorphism.outline,
                      }}
                    >
                      <Box
                        sx={{
                          textAlign: "center",
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
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
            <Box sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', height: '30%', width: '50%', overflow: 'auto', p: 2,
            }}>
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
              <Button variant="contained" style={{ marginTop: 20 }} onClick={() => setStep(3)} disabled={!fertilizer1}>
                NextStage
              </Button>
            </Box>
          </Box>
        )}


        {/* Giao diện chính */}
        {step === 3 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2, width: '100%' }}>
            {/* Thông tin mùa vụ ở trên cùng */}
            <Box>
              <Typography variant="h5">
                {season.name} - Giai đoạn {stage + 1}/4
              </Typography>
            </Box>

            {/* Vùng chính */}
            <Box sx={{ flex: 1, position: 'relative', width: '100%' }}>
              {/* Timeline bên phải */}
              <Box sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-40%)' }}>
                <Timeline position="right" sx={{ minWidth: 400 }}>
                  {stages.map((label, i) => (
                    <TimelineItem key={i}>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            bgcolor: stageColors[i],
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
                              backgroundColor: stageColors[i + 1],
                              height: 40,
                            }}
                          />
                        )}
                      </TimelineSeparator>

                      <TimelineContent>
                        <Typography>{label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {/* {i % 2 === 0 ? 'Watering' : 'Fertilizing'} */}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Box>

              <Box
                className="neumorphic"
                sx={{
                  ...BevelButton,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'left',
                  justifyContent: 'center',
                  width: 'auto',
                  height: 'auto',
                  position: "absolute",
                  top: "50%",
                  left: 40,
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  p: 4,
                }}
              >
                <Typography variant="h6">📈</Typography>
                <Typography variant="h6">temp: 123</Typography>
                <Typography variant="h6">moist: 123</Typography>
                <Typography variant="h6">light: 123</Typography>
              </Box>
            </Box>

            {/* Controls ở dưới */}
            <Box sx={{ mt: 2 }}>
              // Slider nước
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                }}
              >
                <Typography gutterBottom>Điều chỉnh mực nước:</Typography>
                <Slider
                  value={water}
                  onChange={(e, newVal) => setWater(newVal)}
                  valueLabelDisplay="auto"
                  max={15}
                  step={0.1}
                  sx={{ width: 400 }}
                />
                <Typography variant="body2">{water} cm</Typography>
              </Box>
              ) : (
              // Slider phân bón
              <Box
                sx={{
                  position: "absolute",
                  bottom: 10,            // hạ toàn bộ cụm xuống (tùy chỉnh 40-80 cho đẹp)
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Typography gutterBottom>Chọn loại phân bón:</Typography>
                <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 600 }}>
                  {amendments.map((a, i) => (
                    <Grid key={i} size={4}>
                      <Card
                        onClick={() => setFertilizer1(a)}
                        sx={{
                          cursor: "pointer",
                          boxShadow: fertilizer1?.name === a.name ? 8 : 2,
                          height: "100%",
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 1 }}>
                          <Typography variant="body2" fontWeight="bold">{a.name}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {fertilizer1 && (
                  <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography gutterBottom>
                      Lượng phân: {fertilizer1A} ton/ha
                    </Typography>
                    <Slider
                      value={fertilizer1A}
                      onChange={(e, val) => setfertilizer1A(val)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                      step={0.5}
                      sx={{ width: 300 }}   // slider nhỏ gọn ở giữa
                    />
                  </Box>
                )}
              </Box>

              {/* Nút điều hướng */}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (stage < 4) setStage(stage + 1);
                    else setStep(4);
                  }}
                >
                  {stage === 4 ? 'Hoàn thành mùa vụ' : 'Qua giai đoạn tiếp theo'}
                </Button>
              </Box>
            </Box>
            {chartOpen && (<ChartOverlay {...{ chartOpen, setChartOpen }} />)}
          </Box>

        )}

      </Box>
    </Box>
  );
}
