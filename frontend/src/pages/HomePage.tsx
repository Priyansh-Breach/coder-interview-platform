import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Interview Simulator</h1>
            <Link to="/interview">Start Interview</Link>
        </div>
    );
};

export default HomePage;
