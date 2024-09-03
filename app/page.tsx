'use client';

import React, { useEffect, useState } from 'react';
import data from '@/app/traces.json';
import DraggableDiv from './modules/draggable.module';
import BezierLine from './modules/bezier.module';
import main_style from '@/app/styles/main.module.css';
import { IconHome2 } from '@tabler/icons-react';


const Home = () => {
    const main_cords = { x: 1250, y: 1150 };
    const [hitValue, setHitValue] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

    const traces = data.map((trace, index) => {
        return <BezierLine
            key={index}
            startX={trace.startX}
            startY={trace.startY}
            endX={trace.endX}
            endY={trace.endY}
            vertical={trace.vertical ?? false}
            setHitValue={setHitValue}
        />
    });

    useEffect(() => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        setHitValue({ x: main_cords.x - (vw / 2), y: main_cords.y - (vh / 2) });
    }, [])

    return (
        <>
            <DraggableDiv position={{ ...hitValue, duration: 1 }}>
                <Node x={1100} y={1100} width={300} height={100}>
                    <h1>AndcoolSystems</h1>
                </Node>
                <Node x={1600} y={1250} width={300} height={100}>
                    <h1>Контакты</h1>
                </Node>
                <Node x={1600} y={950} width={300} height={100}>
                    <h1>вфывв</h1>
                </Node>
                {traces}
                <div style={{ width: '300vw', height: '300vh', pointerEvents: 'none' }} />
            </DraggableDiv>
            <button
                onClick={() => {
                    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
                    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
                    setHitValue({ x: main_cords.x - (vw / 2), y: main_cords.y - (vh / 2) })
                }
                }
                className={main_style.home_btn}>
                <IconHome2 width={24} height={24} color='white' />
            </button>
        </>
    );
};

export default Home;

const Node = ({ children, x, y, width, height }: { children: React.ReactNode, x: number, y: number, width?: number, height?: number }) => {
    return (
        <div className={main_style.node}
            style={{
                left: x,
                top: y,
                width: width,
                height: height
            }}>
            {children}
        </div>
    );
}