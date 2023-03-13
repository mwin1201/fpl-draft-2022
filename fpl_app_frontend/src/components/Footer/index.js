import React from "react";

const Footer = () => {

    const getYear = () => {
        const dateVar = new Date();
        return (dateVar.getFullYear());
    };

    return (
        <footer>
            <div>
                &copy;{getYear()} Made by football fans, for football fans.
            </div>
        </footer>
    );
};

export default Footer;