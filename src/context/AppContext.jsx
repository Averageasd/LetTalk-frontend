import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {get, post} from "../api/apiService.js";
import {baseUrl} from "../shared/basedUrl.js";
import {socket} from "../api/socket.js";
import {showToast} from "../api/toastService.js";

export const AppData = createContext();

function AppProvider({children}) {
    const navigate = useNavigate();
    const [showNavBar, setShowNavBar] = useState(false);
    const [user, setUser] = useState(undefined);
    const [token, setToken] = useState(undefined);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(undefined);
    const [inputMessage, setInputMessage] = useState('');
    const [invitations, setInvitations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [userNameConnect, setUserNameConnect] = useState('');
    const [invalidRequest, setInvalidRequest] = useState(false);
    const [invalidRequestErrorMessage, setInvalidRequestErrorMessage] = useState('');

    async function sendMessage(data, roomId) {
        socket.emit('message', user._id, data, roomId);
    }

    function sendConnectRequest(toUserId) {
        socket.emit('send-connect-request', user._id, toUserId);
    }


    async function loginHandler(data) {
        const auth = await post({
            formData: data
        }, `${baseUrl}/login`);
        const {status, message} = auth;
        showToast(status, message);
        if (status === 200) {
            setUser(auth['user']);
            setToken(auth['token']);
            const fetchRooms = await get({param: auth['user']._id}, `${baseUrl}/chat/all-rooms`)
            sessionStorage.setItem('userId', JSON.stringify(auth['user']._id));
            sessionStorage.setItem('token', JSON.stringify(auth['token']));
            setRooms(fetchRooms['allUserRooms']);
            const publicRoom = fetchRooms['allUserRooms'].find((room) => room.name === 'public');
            setSelectedRoom(publicRoom);
            const getAllInvitations = await get({param: auth['user']._id}, `${baseUrl}/chat/all-invitations`);
            const allInvitations = [...getAllInvitations['allInvitations']];
            const invitations = allInvitations.filter((invitation) => invitation.to._id === auth['user']._id);
            const requests = allInvitations.filter((invitation) => invitation.from._id === auth['user']._id);
            setInvitations([...invitations]);
            setRequests([...requests]);
            navigate('/chat');
            socket.connect();
            socket.emit('join-rooms', auth['user']._id);
        }
    }

    async function signupHandler(data) {
        const auth = await post({
            formData: data,
        }, `${baseUrl}/signup`);
        const {status, message} = auth;
        showToast(status, message);
        if (status === 200) {
            navigate('/login');
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('token');
    }

    function closeBarAndNavigate(location) {
        setShowNavBar(false);
        navigate(location);
    }

    function chooseRoom(id) {
        const chosenRoom = rooms.find((room) => room._id === id);
        setSelectedRoom({...chosenRoom});
        navigate('/chat');
    }

    function isRequestSentToUser(userId) {
        return requests.find((request) => request.to._id === userId && request.status === 'PENDING' || request.status === 'ACCEPTED');
    }

    return (
        <AppData.Provider value={{
            signupHandler: signupHandler,
            loginHandler: loginHandler,
            sendMessage: sendMessage,
            sendConnectRequest: sendConnectRequest,
            user: user,
            setUser: setUser,
            userNameConnect: userNameConnect,
            setUserNameConnect: setUserNameConnect,
            selectedRoom: selectedRoom,
            setSelectedRoom: setSelectedRoom,
            token: token,
            setToken: setToken,
            requests: requests,
            setRequests: setRequests,
            invalidRequest: invalidRequest,
            setInvalidRequest: setInvalidRequest,
            invalidRequestErrorMessage: invalidRequestErrorMessage,
            setInvalidRequestErrorMessage: setInvalidRequestErrorMessage,
            invitations: invitations,
            setInvitations: setInvitations,
            inputMessage: inputMessage,
            setInputMessage: setInputMessage,
            isRequestSentToUser: isRequestSentToUser,
            closeBarAndNavigate: closeBarAndNavigate,
            chooseRoom: chooseRoom,
            logout: logout,
            rooms: rooms,
            setRooms: setRooms,
            showNavBar: showNavBar,
            setShowNavBar: setShowNavBar,
        }}>
            {children}
        </AppData.Provider>
    );
}

export default AppProvider;