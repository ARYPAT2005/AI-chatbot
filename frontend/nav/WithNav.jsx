import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router"
const WithNav = () => {
    return (
        <>
            <Header />
            <Outlet/>
            <Footer />
        </>
    )
}
export default WithNav;