import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";

const ScrollTopButton = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.pageYOffset > 300);
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {visible && (
                <Button
                    type="primary"
                    shape="circle"
                    icon={<UpOutlined />}
                    size="large"
                    onClick={scrollToTop}
                    style={{
                        position: "fixed",
                        bottom: 30,
                        right: 30,
                        zIndex: 1000,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    }}
                />
            )}
        </>
    );
};

export default ScrollTopButton;
