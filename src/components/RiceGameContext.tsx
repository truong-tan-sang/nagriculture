import { createContext, useContext, useState } from "react";

// 1️⃣ Định nghĩa kiểu dữ liệu context (tùy chọn, để có gợi ý code)
interface RiceGameContextType {
    step: number;
    setStep: (v: number) => void;
    method: string | null;
    setMethod: (v: string | null) => void;
    season: any;
    setSeason: (v: any) => void;
    fertilizers: { name: string; amount: number }[];
    setFertilizers: (v: { name: string; amount: number }[]) => void;
    water: number;
    setWater: (v: number) => void;
    stage: number;
    setStage: (v: number) => void;
    chartOpen: boolean;
    setChartOpen: (v: boolean) => void;
    methods: string[];
    stages: string[];
    stageColors: string[];
    amendments: { name: string; cfoa: number; range: string }[];
    seasons: { name: string; duration: number }[];
    weatherData: {
        season: string;
        stages: {
            stage: number;
            weeks: { week: number; temp: number; rain: number; humidity: number }[];
        }[];
    }[];
}

// 2️⃣ Truyền vào giá trị mặc định (đủ để tránh lỗi TS)
export const RiceGameContext = createContext<RiceGameContextType | null>(null);

// 3️⃣ Custom hook để dùng tiện hơn
export const useRiceGame = () => {
    const context = useContext(RiceGameContext);
    if (!context) {
        throw new Error("useRiceGame must be used within a RiceGameProvider");
    }
    return context;
};

// 4️⃣ Provider (dùng bao quanh toàn game)
export function RiceGameProvider({ children }: { children: React.ReactNode }) {
    const [step, setStep] = useState(0);
    const [method, setMethod] = useState<string | null>(null);
    const [season, setSeason] = useState<any>(null);
    const [fertilizers, setFertilizers] = useState([
        { name: "", amount: 0 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },
    ]);
    const [water, setWater] = useState(5);
    const [stage, setStage] = useState(0);
    const [chartOpen, setChartOpen] = useState(false);

    return (
        <RiceGameContext.Provider
            value={{
                step, setStep,
                method, setMethod,
                season, setSeason,
                fertilizers, setFertilizers,
                water, setWater,
                stage, setStage,
                chartOpen, setChartOpen,
            }}
        >
            {children}
        </RiceGameContext.Provider>
    );
}
