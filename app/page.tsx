'use client';

import React, { useEffect, useState } from 'react';
import { Fira_Code } from 'next/font/google';
import data from '@/app/traces.json';
import DraggableDiv, { main_cords } from './modules/draggable.module';
import BezierLine from './modules/bezier.module';
import main_style from '@/app/styles/main.module.css';
import Image from 'next/image';
import main_node_style from '@/app/styles/nodes/main.module.css';
import weather_node_style from '@/app/styles/nodes/weather.module.css';
import { fullYearsDifference, getTime } from './modules/time.module';
import axios from 'axios';
import Link from 'next/link';

const fira = Fira_Code({ subsets: ['cyrillic', 'latin'] });

interface Weather {
    status: string,
    message: string,
    temp: number,
    condition: string,
    icon: string
}


const Home = () => {
    const [hitValue, setHitValue] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [trigger, setTrigger] = useState(false);
    const [time, set_time] = useState('');
    const [weather, setWeather] = useState<Weather | null>(null);
    const [wakatime, setWakatime] = useState([<span key={-1}>loading...</span>]);
    const age = fullYearsDifference(new Date('2007-09-07'), new Date());

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
        const siteWidth = 700;
        const scale = screen.width / siteWidth;
        document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=' + scale + ',user-scalable=no')

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        setHitValue({ x: -(main_cords.x - (vw / 2)), y: -(main_cords.y - (vh / 2)) });

        set_time(getTime());
        setInterval(() => {
            set_time(getTime());
        }, 1000);

        axios.get('https://weather.andcool.ru/api?place=andcool&json=true').then((response) => {
            if (response.status !== 200) return;
            setWeather(response.data as Weather);
        });

        axios.get("https://wakatime.com/share/@AndcoolSystems/c20041f4-a965-47c3-ac36-7234e622a980.json").then(response => {
            if (response.status !== 200) return;
            const data = response.data.data.grand_total.human_readable_total_including_other_language as string;
            const split = data.split(' ');
            const result_arr = [
                <span key={0}>{split[0]} {split[1]}</span>,
                <br key={1} />,
                <span key={2}>{split[2]} {split[3]}</span>
            ];
            setWakatime(result_arr);
        });

        const loader = document.getElementById('loading');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none' }, 500);
        }
    }, []);

    useEffect(() => {
        setTrigger(true);
    }, [hitValue]);

    return (
        <>
            <Loader />
            <DraggableDiv position={{ ...hitValue, duration: 1 }} trigger={trigger} onUpdate={() => setTrigger(false)}>
                <Node x={950} y={1100} width={450} height={180} header='main.node'>
                    <div className={main_node_style.main}>
                        <Image src='/static/andcool.jpg' alt='' width={100} height={100} />
                        <div className={main_node_style.nick}>
                            <h1>AndcoolSystems</h1>
                            <p>Человек, программист, электронщик</p>
                        </div>
                    </div>
                </Node>
                <Node x={450} y={950} width={300} height={100} header='contacts.node'>
                    <></>
                </Node>
                <Node x={1600} y={950} width={400} header='info.node'>
                    <h1>Привет👋</h1>
                    <p style={{ marginBottom: 0, marginTop: '.4rem' }}>Меня зовут Андрей, мне {age} лет. Я Full Stack TypeScript && Python разработчик.
                        Занимаюсь разработкой сайтов, а так же пишу Телеграм ботов на заказ <span style={{ color: 'gray', fontSize: '.9rem' }}>(и для себя тоже).</span></p>
                </Node>

                <Node x={1550} y={780} width={102} height={92} header='time.node'>
                    <div className={fira.className}>
                        <p style={{ marginTop: '.5rem' }}>{time}</p>
                        <p style={{ marginTop: '.1rem', color: 'gray', fontSize: '.9rem' }}>UTC+3</p>
                    </div>
                </Node>

                <Node x={1954} y={797} height={75} header='weather.node'>
                    <div className={fira.className}>
                        {weather &&
                            <p className={weather_node_style.p}>
                                {Math.round(weather?.temp)}°C, <img alt="" src={`https://weather.andcool.ru/static/icons/${weather.icon}.svg`} />
                                {weather?.condition}
                            </p>
                        }
                    </div>
                </Node>

                <Node x={1735} y={780} width={130} height={92} header='wakatime.node'>
                    <div className={fira.className} style={{ marginTop: '.5rem' }}>
                        {wakatime &&
                            <Link href='https://wakatime.com/@AndcoolSystems'>{wakatime}</Link>
                        }
                    </div>
                </Node>
                {traces}
            </DraggableDiv>
        </>
    );
};

export default Home;

interface NodeProps {
    children: React.ReactNode,
    x: number,
    y: number,
    width?: number,
    height?: number,
    header: string
}

const Node = ({ children, x, y, width, height, header }: NodeProps) => {
    return (
        <div className={main_style.node}
            style={{
                left: x,
                top: y,
                width: width,
                height: height
            }}>
            <h3 className={`${main_style.node_header} ${fira.className}`}>{header}</h3>
            {children}
        </div>
    );
}

const Loader = () => {
    return (
        <div className={main_style.loader} id='loading'>
            <div />
            <div />
            <div />
        </div>
    );
}