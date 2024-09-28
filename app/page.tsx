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

    const data = await axios.get(`https://discord.com/api/v10/users/812990469482610729`,
        {
            headers: { Authorization: `Bot ${process.env.TOKEN}` },
            validateStatus: () => true
        }
    );

    return (
        <HomeClient birthday={birthday} discord_data={data.data} status={data.status} />
    )
}

export default Home;
export const dynamic = 'force-dynamic';