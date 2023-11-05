import React from "react";
import Loading from "./Loading";

const VerticalCenterLoading = () => {
    return (
        <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Loading />
        </div>
    );
}
export default VerticalCenterLoading;