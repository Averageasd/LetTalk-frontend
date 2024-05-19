import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";
import {socket} from "../api/socket.js";
import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";

export function Notification() {
    useProtectAuthRoute();
    const {requests, invitations, user} = useContext(AppData);
    console.log(requests, invitations);
    return (
        <section className="grow p-4 max-w-[600px] mx-auto">
            {requests && <ul className="mt-4 overflow-y-auto flex flex-col gap-2">
                {requests.map((request) => {
                    const status = request.status.toLowerCase();
                    let statusColor = 'text-amber-500';
                    if (status === 'accepted') {
                        statusColor = 'text-green-500';
                    } else if (status === 'declined') {
                        statusColor = 'text-red-500';
                    }
                    return (
                        <li className="bg-white p-4 rounded" key={request._id}>
                            {request.room.roomType === 'MULTIUSER' ?
                                <p>You invited {request.to.name} to join {request.room.name}</p> :
                                <p>You sent a connection request to {request.to.name}</p>}
                            <p className={`${statusColor} font-semibold mt-2`}>{request.status.toLowerCase()}</p>
                        </li>
                    )
                })}
            </ul>}

            {invitations && <ul className="mt-4 overflow-y-auto flex flex-col gap-4">
                {invitations.map((invitation) => {
                    const status = invitation.status.toLowerCase();
                    return (
                        <li className="bg-white p-4 rounded" key={invitation._id}>
                            {invitation.room.roomType === 'MULTIUSER' ?
                                <p>{invitation.to.name} invited you to join {invitation.room.name}</p> :
                                <p>{invitation.from.name} sent a connection request to you</p>}
                            {status === 'pending'
                                && <div className="flex gap-2 mt-2">
                                    <button className="bg-blue-500 p-1 border-0 text-white" onClick={() => {
                                        socket.emit('connection-request-response', user._id, invitation.from._id, true, invitation._id);
                                    }}>Accept
                                    </button>
                                    <button className="border-1 p-1 bg-white border-solid border-blue-500">Decline
                                    </button>
                                </div>}
                        </li>
                    )
                })}
            </ul>}
        </section>
    )
}