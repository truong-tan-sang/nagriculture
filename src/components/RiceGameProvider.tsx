"use client";
import React, { useState } from "react";
import { RiceGameContext } from "./RiceGameContext";

export default function RiceGameProvider({ children }) {
    const [step, setStep] = useState(0);
    const [method, setMethod] = useState(null);
    const [season, setSeason] = useState(null); 
    const [fertilizers, setFertilizers] = useState([
        { name: "", amount: 0 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },
        { name: "", amount: 0 },    
    ]);
    const [water, setWater] = useState(5);
    const [stage, setStage] = useState(0);
    const [chartOpen, setChartOpen] = useState(false);

    const methods = [
        "Alternate Wetting and Drying (AWD)",
        "Traditional method",
        "Regular rainfed",
    ];

    const stages = ["Seeding", "Growth", "Flowering", "Harvest"];
    const stageColors = ["#FFF59D", "#FFD54F", "#FFB300", "#FF8F00"];

    const amendments = [
        { id: 1, name: "Straw (<30d before cultivation)", cfoa: 1.00, range: "0.85 - 1.17" },
        { id: 2, name: "Straw (>30d before cultivation)", cfoa: 0.19, range: "0.11 - 0.28" },
        { id: 3, name: "Compost", cfoa: 0.17, range: "0.09 - 0.29" },
        { id: 4, name: "Farm yard manure", cfoa: 0.21, range: "0.15 - 0.28" },
        { id: 5, name: "Green manure", cfoa: 0.45, range: "0.36 - 0.57" },
    ];
    const weatherData = [
        {
            season: "Winter–Spring",
            stages: [
                {
                    stage: 1,
                    weeks: [
                        { week: 1, temp: 27.30428571, rain: 66.28, humidity: 88.66428571 },
                        { week: 2, temp: 27.22571429, rain: 56.47, humidity: 89.80285714 },
                        { week: 3, temp: 25.83428571, rain: 33.76, humidity: 88.61 },
                        { week: 4, temp: 25.96, rain: 12.86, humidity: 87.45142857 },
                    ],
                },
                {
                    stage: 2,
                    weeks: [
                        { week: 5, temp: 26.82857143, rain: 15.9, humidity: 87.78857143 },
                        { week: 6, temp: 27.02857143, rain: 15.32, humidity: 86.14857143 },
                        { week: 7, temp: 27.15285714, rain: 3.83, humidity: 84.85571429 },
                        { week: 8, temp: 24.67142857, rain: 0.73, humidity: 83.09714286 },
                    ],
                },
                {
                    stage: 3,
                    weeks: [
                        { week: 9, temp: 27.07142857, rain: 2.65, humidity: 82.22285714 },
                        { week: 10, temp: 26.66285714, rain: 0.47, humidity: 80.64571429 },
                        { week: 11, temp: 26.49714286, rain: 0, humidity: 77.79 },
                        { week: 12, temp: 26.99, rain: 0, humidity: 76.00857143 },
                    ],
                },
                {
                    stage: 4,
                    weeks: [
                        { week: 13, temp: 26.90714286, rain: 0, humidity: 69.50428571 },
                        { week: 14, temp: 27.91428571, rain: 0, humidity: 73.34285714 },
                        { week: 15, temp: 28.75571429, rain: 0, humidity: 64.48571429 },
                        { week: 16, temp: 29.56428571, rain: 0, humidity: 62.97285714 },
                    ],
                },
            ],
        },
        {
            season: "Summer–Autumn",
            stages: [
                {
                    stage: 1,
                    weeks: [
                        { week: 1, temp: 33.27571429, rain: 0, humidity: 51.01428571 },
                        { week: 2, temp: 34.87571429, rain: 0, humidity: 47.98142857 },
                        { week: 3, temp: 34.29714286, rain: 10.83, humidity: 51.60285714 },
                        { week: 4, temp: 31.33571429, rain: 40.54, humidity: 68.79 },
                    ],
                },
                {
                    stage: 2,
                    weeks: [
                        { week: 5, temp: 29.89714286, rain: 64.33, humidity: 79.24142857 },
                        { week: 6, temp: 30.35428571, rain: 29.38, humidity: 76.16428571 },
                        { week: 7, temp: 29.62285714, rain: 55.73, humidity: 80.34 },
                        { week: 8, temp: 29.16142857, rain: 39.37, humidity: 81.24142857 },
                    ],
                },
                {
                    stage: 3,
                    weeks: [
                        { week: 9, temp: 28.90285714, rain: 21.25, humidity: 81.24285714 },
                        { week: 10, temp: 28.06714286, rain: 111.45, humidity: 86.97571429 },
                        { week: 11, temp: 27.43142857, rain: 44.97, humidity: 87.14857143 },
                        { week: 12, temp: 27.78857143, rain: 41.08, humidity: 85.59 },
                    ],
                },
                {
                    stage: 4,
                    weeks: [
                        { week: 13, temp: 27.21428571, rain: 139.64, humidity: 89.01857143 },
                        { week: 14, temp: 26.93285714, rain: 137.18, humidity: 91.40285714 },
                        { week: 15, temp: 27.35, rain: 83.06, humidity: 90.55142857 },
                        { week: 16, temp: 27.37, rain: 42.75, humidity: 89.43571429 },
                    ],
                },
            ],
        },
        {
            season: "Autumn–Winter",
            stages: [
                {
                    stage: 1,
                    weeks: [
                        { week: 1, temp: 26.76857143, rain: 105.97, humidity: 92.14428571 },
                        { week: 2, temp: 27.15285714, rain: 46.14, humidity: 88.62 },
                        { week: 3, temp: 27.51, rain: 35.58, humidity: 87.41714286 },
                        { week: 4, temp: 27.31, rain: 66.05, humidity: 87.73428571 },
                    ],
                },
                {
                    stage: 2,
                    weeks: [
                        { week: 5, temp: 27.37571429, rain: 94.16, humidity: 88.63571429 },
                        { week: 6, temp: 26.99571429, rain: 51.16, humidity: 88.85285714 },
                        { week: 7, temp: 26.89857143, rain: 74.79, humidity: 89.62571429 },
                        { week: 8, temp: 26.93285714, rain: 74.58, humidity: 88.08857143 },
                    ],
                },
                {
                    stage: 3,
                    weeks: [
                        { week: 9, temp: 27.66285714, rain: 23.71, humidity: 85.85 },
                        { week: 10, temp: 27.32714286, rain: 10.46, humidity: 85.92428571 },
                        { week: 11, temp: 26.54571429, rain: 3.63, humidity: 84.91571429 },
                        { week: 12, temp: 26.08714286, rain: 21.97, humidity: 87.17285714 },
                    ],
                },
                {
                    stage: 4,
                    weeks: [
                        { week: 13, temp: 26.05428571, rain: 32.33, humidity: 89.11714286 },
                        { week: 14, temp: 24.94428571, rain: 2.55, humidity: 84.86285714 },
                        { week: 15, temp: 24.75714286, rain: 17.99, humidity: 83.82428571 },
                        { week: 16, temp: 24.95285714, rain: 0.31, humidity: 82.39 },
                    ],
                },
            ],
        },
    ];
    const seasons = [
        { name: "Winter–Spring", time: "Nov 1, 2023 – Feb 20, 2024" },
        { name: "Summer–Autumn", time: "Apr 15, 2024 – Aug 4, 2024" },
        { name: "Autumn–Winter", time: "Sep 15, 2024 – Jan 4, 2025" },
    ];

    const value = {
        step, setStep,
        method, setMethod,
        season, setSeason,
        fertilizers, setFertilizers,
        water, setWater,
        stage, setStage,
        chartOpen, setChartOpen,
        methods, stages, stageColors, amendments, seasons, weatherData,
    };

    return (
        <RiceGameContext.Provider value={value}>
            {children}
        </RiceGameContext.Provider>
    );
}
