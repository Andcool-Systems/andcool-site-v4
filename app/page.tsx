import HomeClient from "./client";

const Home = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const birthday = day == 7 && month == 9;
    return (
        <HomeClient birthday={birthday} />
    )
}

export default Home;