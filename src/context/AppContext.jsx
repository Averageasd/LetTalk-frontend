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
    const [editingMessage, setEditingMessage] = useState(null);
    const [newRoomName, setNewRoomName] = useState('');
    const [invalidRoomName, setInvalidRoomName] = useState(false);
    const [friendList, setFriendList] = useState([]);
    const [roomsFriendNotIn, setRoomsFriendNotIn] = useState([]);
    const [showInviteRoomModal, setShowInviteRoomModal] = useState(false);
    const [roomToInvite, setRoomToInvite] = useState(null);
    const [isRequestBtnActive, setIsRequestBtnActive] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [invalidInvitation, setInvalidInvitation] = useState(false);

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
            for (const message of publicRoom.messages) {
                if (message.isEditing && message.user._id === user._id) {
                    setEditingMessage({...message});
                    setInputMessage(message.message);
                }
            }
            const getAllInvitations = await get({param: auth['user']._id}, `${baseUrl}/chat/all-invitations`);
            const allInvitations = [...getAllInvitations['allInvitations']];
            const invitations = allInvitations.filter((invitation) => invitation.to._id === auth['user']._id);
            const requests = allInvitations.filter((invitation) => invitation.from._id === auth['user']._id);
            setInvitations([...invitations]);
            setRequests([...requests]);
            const getAllFriends = await get({param: auth['user']._id}, `${baseUrl}/chat/all-friends`);
            setFriendList([...getAllFriends['allFriends']]);
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

    async function getRoomsOfFriendNotIn(friendId) {
        const allRoomsOfFriend = await get({param: friendId}, `${baseUrl}/chat/all-rooms`);
        const roomsOfFriend = allRoomsOfFriend['allUserRooms'];
        const roomsOfCurUser = [...rooms];
        const roomNamesOfFriend = new Set(roomsOfFriend.map((room) => room.name));
        const roomsOfFriendNotIn = roomsOfCurUser.filter((room) => room.roomType === 'MULTIUSER' && !roomNamesOfFriend.has(room.name));
        console.log(roomsOfFriendNotIn);
        setRoomsFriendNotIn([...roomsOfFriendNotIn].filter((room) => room.roomType === "MULTIUSER"));
    }

    async function chooseRoom(id) {
        const chosenRoom = rooms.find((room) => room._id === id);
        setSelectedRoom({...chosenRoom});
        navigate('/chat');

        const fetchRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
        setRooms([...fetchRooms['allUserRooms']]);
        const newSelectedRoom = fetchRooms['allUserRooms'].find((room) => room._id === id);
        setSelectedRoom({...newSelectedRoom});
        let foundEditingMessageInRoom = false;
        for (const message of newSelectedRoom.messages) {
            if (message.isEditing && message.user._id === user._id) {
                setEditingMessage({...message});
                setInputMessage(message.message);
                foundEditingMessageInRoom = true;
                break;
            }
        }

        if (!foundEditingMessageInRoom) {
            setEditingMessage(null);
            setInputMessage('');
        }
    }

    async function getFriendList() {
        const allFriends = await get({param: user._id}, `${baseUrl}/chat/all-friends`);
        setFriendList([...allFriends['allFriends']]);
    }

    function isRequestSentToUser(userId) {
        return requests.find((request) => request.to._id === userId && request.status === 'PENDING' || request.status === 'ACCEPTED');
    }

    async function createNewGroup(data) {
        const createGroup = await post({formData: data}, `${baseUrl}/chat/create-room`);
        const {status, message} = createGroup;
        showToast(status, message);
        if (status === 200) {
            setInvalidRoomName(false);
            setNewRoomName('');
            const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
            setRooms([...allRooms['allUserRooms']]);
            for (const room of allRooms['allUserRooms']) {
                if (selectedRoom && selectedRoom._id === room._id) {
                    setSelectedRoom({...room});
                    break;
                }
            }
            socket.emit('join-rooms', user._id);
        } else {
            setInvalidRoomName(true);
        }
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
            editingMessage: editingMessage,
            setEditingMessage: setEditingMessage,
            newRoomName: newRoomName,
            setNewRoomName: setNewRoomName,
            invalidRoomName: invalidRoomName,
            setInvalidRoomName: setInvalidRoomName,
            createNewGroup: createNewGroup,
            friendList: friendList,
            setFriendList: setFriendList,
            getFriendList: getFriendList,
            getRoomsOfFriendNotIn: getRoomsOfFriendNotIn,
            roomsFriendNotIn: roomsFriendNotIn,
            setRoomsFriendNotIn: setRoomsFriendNotIn,
            showInviteRoomModal: showInviteRoomModal,
            setShowInviteRoomModal: setShowInviteRoomModal,
            roomToInvite: roomToInvite,
            setRoomToInvite: setRoomToInvite,
            isRequestBtnActive: isRequestBtnActive,
            setIsRequestBtnActive: setIsRequestBtnActive,
            selectedFriend: selectedFriend,
            setSelectedFriend: setSelectedFriend,
            invalidInvitation: invalidInvitation,
            setInvalidInvitation: setInvalidInvitation,
        }}>
            {children}
        </AppData.Provider>
    );
}

export default AppProvider;