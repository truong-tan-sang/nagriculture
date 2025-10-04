// app/components/AnimationTrigger.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnimationTrigger() {
    const pathname = usePathname();

    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        e.target.classList.add("animated-neumorphism");
                    } 
                        else {
                            e.target.classList.remove("animated-neumorphism");
                        }
                }
            },
        );

        const observeAll = () => {
            document.querySelectorAll<HTMLElement>(".neumorphic").forEach((el) => io.observe(el));
        };

        // Observe current nodes
        observeAll();

        // Also observe nodes added later (e.g., after navigation/render)
        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof HTMLElement)) return;
                    if (node.matches(".neumorphic")) io.observe(node);
                    node.querySelectorAll?.(".neumorphic").forEach((el) => io.observe(el as HTMLElement));
                });
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, [pathname]); // re-run when route changes

    return null;
}
