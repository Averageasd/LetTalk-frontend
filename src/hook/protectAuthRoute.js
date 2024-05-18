import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AppData} from "../context/AppContext.jsx";

export function useProtectAuthRoute() {
    const {user, token} = useContext(AppData);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        }
    }, []);
}