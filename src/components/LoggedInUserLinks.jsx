import {LinkContainer} from "./LinkContainer.jsx";
import {IconBell, IconLogout, IconServer, IconUser, IconUserPlus, IconUsersGroup} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export function LoggedInUserLinks({user, closeBarAndNavigate, logout, rooms, selectedRoom, chooseRoom}) {
    const directMessageRooms = rooms.filter((room) => room.roomType === 'DIRECT-MESSAGE');
    const multiUserRooms = rooms.filter((room) => room.roomType === 'MULTIUSER');
    return (
        <LinkContainer>
            <li className="flex gap-2 py-2">
                <IconUser size={32}></IconUser>
                <h3 className="text-2xl">{user.name}</h3>
            </li>
            <li
                className="flex gap-2 py-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                    closeBarAndNavigate('/notification');
                }}
            >
                <IconBell/>
                <Link to='/notification'>Notification</Link>
            </li>
            <li
                className="flex gap-2 py-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                    closeBarAndNavigate('/connect');
                }}
            >
                <IconUserPlus/>
                <Link to='/connect'>Connect</Link>
            </li>
            <li
                className="flex gap-2 py-2 cursor-pointer text-red-500"
                onClick={() => {
                    closeBarAndNavigate('/signup');
                    logout();
                }}
            >
                <IconLogout/>
                <Link className="text-red-500" to='/signup'>Logout</Link>
            </li>
            <li className="py-2">
                <div className="flex gap-2">
                    <IconUsersGroup/>
                    <p>Direct message</p>
                </div>
                <hr className="my-1"/>
                <ul className="flex flex-col gap-3">
                    {directMessageRooms.map((room) => {
                        let roomName = '';
                        if (room.users[0]._id === user._id) {
                            roomName = room.users[1].name;
                        } else {
                            roomName = room.users[0].name;
                        }
                        if (selectedRoom && selectedRoom._id === room._id) {
                            return <li className='p-2 bg-blue-500' key={room._id} onClick={() => {
                                chooseRoom(room._id);
                            }}>{roomName}</li>
                        }
                        return <li className='p-2 bg-slate-50' onClick={() => {
                            chooseRoom(room._id);
                        }} key={room._id}>{roomName}</li>

                    })}
                </ul>
            </li>
            <li className="py-2">
                <div className="flex gap-2">
                    <IconServer/>
                    <p>Groups</p>
                </div>
                <hr className="my-1"/>
                <ul className="flex flex-col gap-3">
                    {multiUserRooms.map((room) => {
                        if (selectedRoom && selectedRoom._id === room._id) {
                            return <li className='p-2 bg-blue-500' key={room._id} onClick={() => {
                                chooseRoom(room._id);
                            }}>{room.name}</li>
                        }
                        return <li className='p-2 bg-slate-50' key={room._id} onClick={() => {
                            chooseRoom(room._id);
                        }}>{room.name}</li>

                    })}
                </ul>
            </li>

        </LinkContainer>
    )
}