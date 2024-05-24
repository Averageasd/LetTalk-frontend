import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {socket} from "../api/socket.js";
import {baseUrl} from "../shared/basedUrl.js";
import {get} from "../api/apiService.js";

export function InvitePage() {
    const {
        user,
        friendList,
        setFriendList,
        getFriendList,
        getRoomsOfFriendNotIn,
        roomsFriendNotIn,
        showInviteRoomModal,
        setShowInviteRoomModal,
        roomToInvite,
        setRoomToInvite,
        isRequestBtnActive,
        setIsRequestBtnActive,
        selectedFriend,
        setSelectedFriend,
        invalidInvitation,
        setInvalidInvitation,
    } = useContext(AppData);

    if (friendList) {
        console.log('rooms of friends', roomsFriendNotIn);
        return (
            <section className="grow p-4 relative">
                {showInviteRoomModal && <div
                    className="bg-white shadow-lg max-w-[450px] p-4 w-full absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                    <ul className="flex flex-col gap-2">
                        {roomsFriendNotIn.map((room) => {
                            return (
                                <li className={`p-3 ${(roomToInvite && roomToInvite._id === room._id) ? `text-white bg-blue-500` : `bg-gray-100`}`}
                                    key={room._id} onClick={() => {
                                    if (roomToInvite) {
                                        console.log(roomToInvite._id, room._id, roomToInvite._id === room._id);
                                    }
                                    setRoomToInvite({...room});
                                    setIsRequestBtnActive(true);
                                }}>
                                    {room.name}
                                </li>
                            )
                        })}
                    </ul>
                    <div className="mt-2">
                        <button disabled={!isRequestBtnActive} className="bg-blue-500 p-1 text-white border-0 "
                                onClick={async () => {
                                    setIsRequestBtnActive(false);
                                    const getAllInvitationForFriend = await get({param: selectedFriend._id}, `${baseUrl}/chat/all-invitations`);
                                    const allInvitations = getAllInvitationForFriend['allInvitations'];
                                    const isRoomInvitationCreated = allInvitations.find((invitation) => invitation.room._id === roomToInvite._id);
                                    if (!isRoomInvitationCreated) {
                                        socket.emit('send-invitation-request', user._id, selectedFriend._id, roomToInvite._id);
                                        setInvalidInvitation(false);
                                        setShowInviteRoomModal(false);
                                        setSelectedFriend(null);
                                        setRoomToInvite(null);
                                    } else {
                                        setInvalidInvitation(true);
                                    }
                                }}>Confirm
                        </button>
                        <button className="border-0 p-1 ml-1" onClick={() => {
                            setIsRequestBtnActive(false);
                            setShowInviteRoomModal(false);
                            setSelectedFriend(null);
                            setRoomToInvite(null);
                            setInvalidInvitation(false);
                        }}>Cancel
                        </button>
                        {invalidInvitation && <p>User is in room already</p>}
                    </div>

                </div>}
                <ul className="flex flex-col gap-2 mx-auto max-w-[850px] py-4 bg-white">
                    {friendList.map((friend) => {
                        return (
                            <li className="p-2" key={friend._id}>
                                <div className="flex justify-between">
                                    {friend.name}
                                    <button className="bg-blue-500 text-white border-0 px-2" onClick={() => {
                                        getRoomsOfFriendNotIn(friend._id);
                                        setShowInviteRoomModal(true);
                                        setSelectedFriend({...friend});
                                    }}>Invite
                                    </button>
                                </div>
                                <hr className="mt-2"/>
                            </li>
                        )
                    })}
                </ul>
            </section>
        )
    }
}