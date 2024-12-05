import HomeClient from "./client";
import axios from "axios";

export interface DiscordUser {
    id: string,
    username: string,
    avatar: string,
    discriminator: string,
    public_flags: number,
    flags: number,
    banner: string | null,
    accent_color: number,
    global_name: string | null,
    avatar_decoration_data: string | null,
    banner_color: string
}

const Home = async () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const birthday = day === 7 && month === 9;

    return (
        <HomeClient birthday={birthday}/>
    )
}

export default Home;
export const dynamic = 'force-dynamic';