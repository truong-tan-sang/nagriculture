import AnimationTrigger from "@/components/AnimationTrigger";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <AnimationTrigger /> {/* Chạy global */}
    <Component {...pageProps} />
  </>;
}
