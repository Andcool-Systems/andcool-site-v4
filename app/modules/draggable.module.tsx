'use client';

import { useEffect, useRef, useState } from "react";
import { useMotionValue, animate } from 'framer-motion';

interface DraggableDivProps {
    children: React.ReactNode;
    position: { x: number, y: number, duration: number }
}

const DraggableDiv = ({ children, position }: DraggableDivProps) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isCanDrag, setIsCanDrag] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [scrollStart, setScrollStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hitValue, setHitValue] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [speed, setSpeed] = useState<number>(0);

    useEffect(() => {
        if (!position) return;
        setHitValue(position);
        setSpeed(position.duration);
    }, [position])

    const handleMouseMove = (event: any) => {
        const canDrag = event.target instanceof HTMLElement && event.target === containerRef.current;
        if (canDrag !== isCanDrag) {
            setIsCanDrag(canDrag);
        }
        if (!isDragging || !containerRef.current) return;
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;
        setHitValue({ x: scrollStart.x - dx, y: scrollStart.y - dy });
    };

    const handleMouseDown = (event: any) => {
        if (event.target instanceof HTMLElement && event.target === containerRef.current) {
            setIsDragging(true);
            setSpeed(0);
            const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
            const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
            setDragStart({ x: clientX, y: clientY });
            if (!containerRef.current) return;
            setScrollStart({ x: containerRef.current?.scrollLeft, y: containerRef.current?.scrollTop });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };


    useEffect(() => {
        const controls = animate(x, Math.max(hitValue.x, 0), {
            duration: speed,
            ease: "easeInOut",
            onUpdate: (latest) => {
                if (!containerRef.current) return;
                containerRef.current.scrollLeft = latest;
            },
        });

        const controls_y = animate(y, Math.max(hitValue.y, 0), {
            duration: speed,
            ease: "easeInOut",
            onUpdate: (latest) => {
                if (!containerRef.current) return;
                containerRef.current.scrollTop = latest;
            },
        });

        return controls.stop, controls_y.stop;
    }, [hitValue]);


    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}

            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                cursor: isCanDrag ? isDragging ? 'grabbing' : 'grab' : 'auto',
                position: 'relative',
            }}
        >
            {children}

        </div>
    );
};

export default DraggableDiv;