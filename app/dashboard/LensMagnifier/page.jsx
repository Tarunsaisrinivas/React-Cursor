"use client";
import React from "react";
import LensMagnifier from "./component";

const page = () => {
    return (
        <div>
            <LensMagnifier
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7BRHkZkKtxImLCfrO1Nlb_bvdoqepGEQRuw&s"
                zoom={2}
                lensSize={70}
            />
        </div>
    );
};

export default page;
