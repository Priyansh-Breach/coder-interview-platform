import React, { useState } from "react";

const CodingArea: React.FC = () => {
    const [code, setCode] = useState("");

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(event.target.value);
    };

    return (
        <textarea value={code} onChange={handleCodeChange} rows={10} cols={50} />
    );
};

export default CodingArea;
