import React from "react";
import TopBar from "../parts/TopBar";
import Footer from "../parts/footer/Footer";

const BasePage = ({children}) => {
    return (
        <div style={{marginBottom: "50px"}}>
            <TopBar />

            <div style={{marginTop: "20px"}}>
                {children}
            </div>

            <Footer />
        </div>
    );
}
export default BasePage;