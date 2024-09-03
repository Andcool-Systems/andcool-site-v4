'use client';

import style from '@/app/styles/bezier.module.css';
import { useState } from 'react';

interface BezierLineInterface {
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    vertical?: boolean,
    setHitValue({ x, y }: { x: number, y: number }): void
}

const BezierLine = ({ startX, startY, endX, endY, vertical, setHitValue }: BezierLineInterface) => {
    const [hovered, setHovered] = useState(false);

    const width = Math.abs(endX - startX) || 1;
    const height = Math.abs(endY - startY) || 1;

    const pointStartX = startX < endX ? 0 : width;
    const pointEndX = startX < endX ? width : 0;

    const pointStartY = startY < endY ? 0 : height;
    const pointEndY = startY < endY ? height : 0;

    const controlX1 = !vertical ? pointEndX - Math.abs(pointEndX - pointStartX) * 0.33 : pointStartX;
    const controlY1 = !vertical ? pointStartY : pointEndY - Math.abs(pointEndY - pointStartY) * 0.33;
    const controlX2 = !vertical ? pointStartX + Math.abs(pointEndX - pointStartX) * 0.33 : pointEndX;
    const controlY2 = !vertical ? pointEndY : pointStartX + Math.abs(pointEndY - pointStartY) * 0.33;

    return (
        <>
            <svg
                width={width}
                height={height}
                style={{
                    overflow: 'visible',
                    position: 'absolute',
                    top: Math.min(startY, endY),
                    left: Math.min(startX, endX),
                    pointerEvents: 'none'
                }}

            >
                <path
                    d={`M ${pointStartX} ${pointStartY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${pointEndX} ${pointEndY}`}
                    stroke="gray"
                    fill="transparent"
                    style={{ overflow: 'visible' }}
                    strokeWidth="2"
                />
            </svg>
            <div
                className={`${style.bezier} ${hovered && style.hovered}`}
                style={{ top: startY, left: startX }}
                onClick={() => {
                    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                    setHitValue({ x: endX - (vw / 2), y: endY - (vh / 2) });
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
            <div
                className={`${style.bezier} ${hovered && style.hovered}`}
                style={{ top: endY, left: endX }}
                onClick={() => {
                    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                    setHitValue({ x: startX - (vw / 2), y: startY - (vh / 2) });
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
        </>
    )
}

export default BezierLine;