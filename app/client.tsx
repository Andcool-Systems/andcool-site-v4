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
import contacts_node_style from '@/app/styles/nodes/contacts.module.css';
import stack_node_style from '@/app/styles/nodes/stack.module.css';
import { fullYearsDifference, getTime } from './modules/time.module';
import axios from 'axios';
import Link from 'next/link';
import {
    IconBrandCpp,
    IconBrandCss3,
    IconBrandDocker,
    IconBrandGithubFilled,
    IconBrandHtml5,
    IconBrandNextjs,
    IconBrandNodejs,
    IconBrandPrisma,
    IconBrandPython,
    IconBrandReact,
    IconBrandTelegram,
    IconBrandTypescript,
    IconDeviceDesktop,
    IconServer,
    IconTerminal2
} from '@tabler/icons-react';

const fira = Fira_Code({ subsets: ['cyrillic', 'latin'] });

interface Weather {
    status: string,
    message: string,
    temp: number,
    condition: string,
    icon: string
}


const HomeClient = ({ birthday }: { birthday: boolean }) => {
    const [hitValue, setHitValue] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [time, set_time] = useState('');
    const [weather, setWeather] = useState<Weather | null>(null);
    const [wakatime, setWakatime] = useState([<span key={-1}>loading...</span>]);
    const age = fullYearsDifference(new Date('2007-09-07'), new Date());

    const traces = data.map((trace, index) => {
        if (trace.special === 'birthday' && !birthday) return;
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
        document.querySelector('meta[name="viewport"]')?.setAttribute('content', `width=device-width, initial-scale=${scale}, user-scalable=no`)

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

    return (
        <>
            <Loader />
            <DraggableDiv position={hitValue}>
                <Node x={950} y={1100} width={450} height={180} header='main.node'>
                    <div className={main_node_style.main}>
                        <Image src='/static/andcool.jpg' alt='' width={100} height={100} />
                        <div className={main_node_style.nick}>
                            <h1>AndcoolSystems</h1>
                            <p>Человек, программист, электронщик</p>
                        </div>
                    </div>
                </Node>
                <Node x={975} y={1370} width={400} height={163} header='info.node'>
                    <h1>Привет👋</h1>
                    <p style={{ marginBottom: 0, marginTop: '.4rem' }}>Меня зовут Андрей, мне {age} лет. Я Full Stack TypeScript && Python разработчик.
                        Занимаюсь разработкой сайтов, а так же пишу Телеграм ботов на заказ <span style={{ color: 'gray', fontSize: '.9rem' }}>(и для себя тоже).</span></p>
                </Node>

                <Node x={924} y={1600} width={102} header='time.node'>
                    <div className={fira.className}>
                        <p style={{ marginTop: '.5rem' }}>{time}</p>
                        <p style={{ marginTop: '.1rem', color: 'gray', fontSize: '.9rem' }}>UTC+3</p>
                    </div>
                </Node>
                {birthday &&
                    <Node x={912} y={1750} header='birthday.node'>
                        <></>
                    </Node>
                }
                <Node x={1324} y={1600} header='weather.node'>
                    <div className={fira.className}>
                        {weather &&
                            <p className={weather_node_style.p}>
                                {Math.round(weather?.temp)}°C, <img alt="" src={`https://weather.andcool.ru/static/icons/${weather.icon}.svg`} />
                                {weather?.condition}
                            </p>
                        }
                    </div>
                </Node>
                <Node x={1110} y={1600} width={130} header='wakatime.node'>
                    <div className={fira.className} style={{ marginTop: '.5rem' }}>
                        {wakatime &&
                            <Link href='https://wakatime.com/@AndcoolSystems'>{wakatime}</Link>
                        }
                    </div>
                </Node>

                <Node x={883} y={891} height={118} header='github.node'>
                    <Link className={contacts_node_style.container} href={'https://github.com/Andcool-Systems'} target='_blank'>
                        <IconBrandGithubFilled width={40} height={40} />
                        <p className={fira.className}>Andcool-Systems</p>
                    </Link>
                </Node>
                <Node x={1107} y={891} width={136} height={118} header='discord.node'>
                    <Link className={contacts_node_style.container} href={'https://discord.com/users/812990469482610729'} target='_blank'>
                        <Image src='/static/discord.svg' width={40} height={40} alt='' />
                        <p className={fira.className}>AndcoolSystems</p>
                    </Link>
                </Node>
                <Node x={1332} y={891} width={136} height={118} header='telegram.node'>
                    <Link className={contacts_node_style.container} href={'https://t.me/andcool_systems'} target='_blank'>
                        <IconBrandTelegram width={40} height={40} />
                        <p className={fira.className}>andcool_systems</p>
                    </Link>
                </Node>

                <Node x={1650} y={891} width={411} height={77} header='stack.node'>
                    <div className={stack_node_style.container}>
                        <IconDeviceDesktop />
                        <IconServer />
                        <IconTerminal2 />
                    </div>
                </Node>

                <Node x={1650} y={1000} width={112} height={115} header='nextjs.node'>
                    <Link className={stack_node_style.container_stack} href='https://nextjs.org'>
                        <IconBrandNextjs width={40} height={40} />
                        <p>NextJS</p>
                    </Link>
                </Node>

                <Node x={1650} y={1147} width={112} height={115} header='react.node'>
                    <Link className={stack_node_style.container_stack} href='https://react.dev'>
                        <IconBrandReact width={40} height={40} />
                        <p>ReactJS</p>
                    </Link>
                </Node>

                <Node x={1650} y={1294} width={112} height={115} header='ts.node'>
                    <Link className={stack_node_style.container_stack} href='https://www.typescriptlang.org'>
                        <IconBrandTypescript width={40} height={40} />
                        <p>TypeScript</p>
                    </Link>
                </Node>

                <Node x={1650} y={1441} width={112} height={115} header='html5.node'>
                    <Link className={stack_node_style.container_stack} href='https://ru.wikipedia.org/wiki/HTML'>
                        <IconBrandHtml5 width={40} height={40} />
                        <p>HTML5</p>
                    </Link>
                </Node>

                <Node x={1650} y={1588} width={112} height={115} header='css3.node'>
                    <Link className={stack_node_style.container_stack} href='https://ru.wikipedia.org/wiki/CSS'>
                        <IconBrandCss3 width={40} height={40} />
                        <p>CSS3</p>
                    </Link>
                </Node>


                <Node x={1800} y={1000} width={112} height={115} header='nestjs.node'>
                    <Link className={stack_node_style.container_stack} href='https://nestjs.com'>
                        <Image src='/static/nest.svg' alt='' width={40} height={40} />
                        <p>NestJS</p>
                    </Link>
                </Node>

                <Node x={1800} y={1147} width={112} height={115} header='nodejs.node'>
                    <Link className={stack_node_style.container_stack} href='https://nodejs.org'>
                        <IconBrandNodejs width={40} height={40} />
                        <p>NodeJS</p>
                    </Link>
                </Node>

                <Node x={1800} y={1294} width={112} height={115} header='prisma.node'>
                    <Link className={stack_node_style.container_stack} href='https://www.prisma.io'>
                        <IconBrandPrisma width={40} height={40} />
                        <p>PrismaORM</p>
                    </Link>
                </Node>

                <Node x={1800} y={1441} width={112} height={115} header='python.node'>
                    <Link className={stack_node_style.container_stack} href='https://www.python.org'>
                        <IconBrandPython width={40} height={40} />
                        <p>Python</p>
                    </Link>
                </Node>


                <Node x={1949} y={1000} width={112} height={115} header='cpp.node'>
                    <Link className={stack_node_style.container_stack} href='https://ru.wikipedia.org/wiki/C%2B%2B'>
                        <IconBrandCpp width={40} height={40} />
                        <p>C++</p>
                    </Link>
                </Node>

                <Node x={1949} y={1147} width={112} height={115} header='docker.node'>
                    <Link className={stack_node_style.container_stack} href='https://www.docker.com/'>
                        <IconBrandDocker width={40} height={40} />
                        <p>Docker</p>
                    </Link>
                </Node>

                {traces}
            </DraggableDiv >
        </>
    );
};

export default HomeClient;

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