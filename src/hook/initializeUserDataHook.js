import {useContext, useEffect} from "react";
import {get} from "../api/apiService.js";
import {baseUrl} from "../shared/basedUrl.js";
import {socket} from "../api/socket.js";
import {useNavigate} from "react-router-dom";
import {AppData} from "../context/AppContext.jsx";

export function useInitializeUserDataHook() {
    const {
        setRooms,
        setUser,
        setToken,
        setSelectedRoom,
        setInvitations,
        setRequests
    } = useContext(AppData);

    const navigate = useNavigate();
    useEffect(() => {
        console.log('run use Effect');

        async function setAuth() {
            const savedUserId = JSON.parse(sessionStorage.getItem('userId'));
            const token = await JSON.parse(sessionStorage.getItem('token'));
            if (savedUserId && token) {
                const userWithId = await get({param: savedUserId}, `${baseUrl}/getUser`);
                const tempRooms = await get({param: savedUserId}, `${baseUrl}/chat/all-rooms`);
                setRooms(tempRooms['allUserRooms']);
                setUser(userWithId['user']);
                setToken(token);
                const publicRoom = tempRooms['allUserRooms'].find((room) => room.name === 'public');
                setSelectedRoom({...publicRoom});
                const getAllInvitations = await get({param: savedUserId}, `${baseUrl}/chat/all-invitations`);
                const allInvitations = [...getAllInvitations['allInvitations']];
                const invitations = allInvitations.filter((invitation) => invitation.to._id === savedUserId);
                const requests = allInvitations.filter((invitation) => invitation.from._id === savedUserId);
                setInvitations([...invitations]);
                setRequests([...requests]);
                socket.connect();
                socket.emit('join-rooms', savedUserId);
                navigate('/chat');
            } else {
                navigate('/login');
            }
        }
        setAuth();
    }, []);
}