import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {socket} from "../api/socket.js";

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
                                <li className={`p-3 bg-gray-100 ${(roomToInvite && roomToInvite._id === room._id) && `text-white bg-blue-400`}`}
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
                    <button disabled={!isRequestBtnActive} className="bg-blue-500" onClick={() => {
                        setIsRequestBtnActive(false);
                        socket.emit('send-invitation-request', user._id, selectedFriend._id,roomToInvite._id);
                    }}>Confirm
                    </button>
                    <button onClick={() => {
                        setIsRequestBtnActive(false);
                    }}>Cancel
                    </button>
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