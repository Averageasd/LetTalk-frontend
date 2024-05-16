import {useNavigate, useOutletContext} from "react-router-dom";
import {useEffect} from "react";

export function useProtectAuthRoute() {
    const {user, token} = useOutletContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
        }
    }, []);
}