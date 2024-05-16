import {Outlet, useNavigate} from "react-router-dom";
import {IconMenu2, IconSquareX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {baseUrl} from "../shared/basedUrl.js";
import {ToastContainer} from "react-toastify";
import {get, post} from "../api/apiService.js";
import {showToast} from "../api/toastService.js";
import {AuthLinks} from "../components/AuthLinks.jsx";
import {LoggedInUserLinks} from "../components/LoggedInUserLinks.jsx";
import {socket} from "../api/socket.js";

export function RootPage() {
    const navigate = useNavigate();
    const [showNavBar, setShowNavBar] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [invitations, setInvitations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [userNameConnect, setUserNameConnect] = useState('');
    const [invalidRequest, setInvalidRequest] = useState(false);
    const [invalidRequestErrorMessage, setInvalidRequestErrorMessage] = useState('');

    console.log('selected room in root page ', selectedRoom);
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

    useEffect(() => {
            if (user && token) {
                socket.on('message', async (userId, message, roomId) => {
                    console.log('cur selected room ', selectedRoom);
                    const fetchAllRooms = await get({param: userId}, `${baseUrl}/chat/all-rooms`);
                    const updatedRooms = [...fetchAllRooms['allUserRooms']];
                    console.log('roomId of message ', message, ' is ', roomId);
                    for (const room of updatedRooms) {
                        if (room._id === selectedRoom._id) {
                            console.log(room._id, selectedRoom._id);
                            console.log('this is updated room ', room);
                            setSelectedRoom({...room});
                            break;
                        }
                    }
                    setRooms([...updatedRooms]);
                });

                socket.on('send-connect-request')
            }
            return () => {
                socket.off('message');
            }
        }
        , [user, rooms, selectedRoom]);

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
        return requests.find((request) => request.to._id === userId);
    }

    return (
        <>
            <ToastContainer/>
            {showNavBar &&
                (
                    <section
                        className="fixed bg-white left-0 top-0 shadow-lg z-[1000] h-[100vh] w-[90%] md:w-[450px]">
                        <div className="flex justify-end p-4">
                            <IconSquareX className="cursor-pointer" onClick={() => {
                                setShowNavBar(false);
                            }}/>
                        </div>
                        {user ?
                            <LoggedInUserLinks
                                user={user}
                                closeBarAndNavigate={closeBarAndNavigate}
                                logout={logout}
                                rooms={rooms}
                                selectedRoom={selectedRoom}
                                chooseRoom={chooseRoom}/> :
                            <AuthLinks closeBarAndNavigate={closeBarAndNavigate}/>}
                    </section>
                )
            }

            <header className="relative">
                <nav className="flex sticky w-full top-0 left-0 justify-between items-center px-4 py-2 bg-blue-500">
                    <IconMenu2 className="text-white cursor-pointer" onClick={() => {
                        setShowNavBar(true);
                    }}/>

                    <h3 className="text-white text-2xl">LetTalk</h3>
                </nav>
            </header>
            <main className="grow h-1 flex overflow-y-auto">
                <Outlet context={
                    {
                        signupHandler: signupHandler,
                        loginHandler: loginHandler,
                        sendMessage: sendMessage,
                        sendConnectRequest: sendConnectRequest,
                        user: user,
                        userNameConnect: userNameConnect,
                        setUserNameConnect: setUserNameConnect,
                        selectedRoom: selectedRoom,
                        token: token,
                        requests: requests,
                        invalidRequest: invalidRequest,
                        setInvalidRequest: setInvalidRequest,
                        invalidRequestErrorMessage: invalidRequestErrorMessage,
                        setInvalidRequestErrorMessage: setInvalidRequestErrorMessage,
                        invitations: invitations,
                        inputMessage: inputMessage,
                        setInputMessage: setInputMessage,
                        isRequestSentToUser: isRequestSentToUser,
                    }
                }/>
            </main>
        </>
    )
}