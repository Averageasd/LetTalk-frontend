import {useContext, useEffect} from "react";
import {socket} from "../api/socket.js";
import {get} from "../api/apiService.js";
import {baseUrl} from "../shared/basedUrl.js";
import {AppData} from "../context/AppContext.jsx";

export function useChatHook() {
    const {
        user,
        token,
        setSelectedRoom,
        selectedRoom,
        setRooms,
        invitations,
        setInvitations,
        rooms,
        requests,
        setRequests,
        editingMessage,
        setEditingMessage,
        inputMessage,
        setInputMessage
    } = useContext(AppData);

    useEffect(() => {
            if (user && token) {
                socket.on('message', async (userId, message, roomId) => {
                    console.log('cur selected room ', selectedRoom);
                    const fetchAllRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
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

                socket.on('send-connect-request', async (from, to) => {
                    if (from === user._id || to === user._id) {
                        const getAllInvitations = await get({param: user._id}, `${baseUrl}/chat/all-invitations`);
                        const allInvitations = [...getAllInvitations['allInvitations']];
                        const invitations = allInvitations.filter((invitation) => invitation.to._id === user._id);
                        const requests = allInvitations.filter((invitation) => invitation.from._id === user._id);
                        setInvitations([...invitations]);
                        setRequests([...requests]);
                    }
                })

                socket.on('connection-request-response', async (userId, toUserId, accept, invitationId) => {
                    if (userId === user._id || toUserId === user._id) {
                        const getAllInvitations = await get({param: user._id}, `${baseUrl}/chat/all-invitations`);
                        const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
                        const allInvitations = [...getAllInvitations['allInvitations']];
                        const invitations = allInvitations.filter((invitation) => invitation.to._id === user._id);
                        const requests = allInvitations.filter((invitation) => invitation.from._id === user._id);
                        setInvitations([...invitations]);
                        setRequests([...requests]);
                        setRooms([...allRooms['allUserRooms']]);
                        socket.emit('join-rooms', user._id);
                    }
                });

                socket.on('delete-message', async (messageId, roomId) => {
                    const getAllInvitations = await get({param: user._id}, `${baseUrl}/chat/all-invitations`);
                    const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
                    const allInvitations = [...getAllInvitations['allInvitations']];
                    const invitations = allInvitations.filter((invitation) => invitation.to._id === user._id);
                    const requests = allInvitations.filter((invitation) => invitation.from._id === user._id);
                    setInvitations([...invitations]);
                    setRequests([...requests]);
                    setRooms([...allRooms['allUserRooms']]);
                    for (const room of allRooms['allUserRooms']) {
                        if (room._id === selectedRoom._id) {
                            console.log('selected room after delete message ', messageId, ' is ', room);
                            setSelectedRoom({...room});
                            break;
                        }
                    }
                });

                socket.on('change-message-to-edit', async (messageId, roomId, userId) => {
                    if (user._id === userId) {
                        const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
                        setRooms([...allRooms['allUserRooms']]);
                        for (const room of allRooms['allUserRooms']) {
                            if (room._id === selectedRoom._id) {
                                setSelectedRoom({...room});
                                for (const message of room.messages) {
                                    if (message._id === messageId) {
                                        setEditingMessage({...message});
                                        console.log(message.message);
                                        setInputMessage(message.message);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                });

                socket.on('edit-message', async (newMessage, messageId, roomId, userId) => {
                    const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
                    setRooms([...allRooms['allUserRooms']]);
                    console.log('edited message for ', messageId, ' is ', newMessage);
                    for (const room of allRooms['allUserRooms']) {
                        if (room._id === selectedRoom._id) {
                            setSelectedRoom({...room});
                            break;
                        }
                    }
                });

                socket.on('remove-edit-status', async (messageId, roomId, userId) => {
                    const allRooms = await get({param: user._id}, `${baseUrl}/chat/all-rooms`);
                    setRooms([...allRooms['allUserRooms']]);
                    for (const room of allRooms['allUserRooms']) {
                        if (room._id === selectedRoom._id) {
                            setSelectedRoom({...room});
                            break;
                        }
                    }
                });
            }
            return () => {
                socket.off('message');
                socket.off('send-connect-request');
                socket.off('connection-request-response');
                socket.off('delete-message');
                socket.off('change-message-to-edit');
                socket.off('edit-message');
                socket.off('remove-edit-status');
            }
        }
        , [user, rooms, selectedRoom, invitations, requests]);
}
