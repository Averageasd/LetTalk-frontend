import {useOutletContext} from "react-router-dom";
import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";

export function Notification() {
    useProtectAuthRoute();
    const {requests, invitations} = useOutletContext();
    console.log(requests, invitations);
    return (
        <section className="grow p-4 max-w-[600px] mx-auto">
            {requests && <ul className="mt-4 h-full overflow-y-auto">
                {requests.map((request) => {
                    const status = request.status.toLowerCase();
                    let statusColor = 'text-amber-500';
                    if (status === 'accepted'){
                        statusColor = 'text-green-500';
                    }
                    else if (status === 'declined'){
                        statusColor = 'text-red-500';
                    }
                    return (
                        <li className="bg-white p-4 rounded" key={request._id}>
                            {request.room.type==='MULTIUSER' ?  <p>You invited {request.to.name} to join {request.room.name}</p> : <p>You sent a connection request to {request.to.name}</p>}
                            <p className={`${statusColor} font-semibold mt-2`}>{request.status.toLowerCase()}</p>
                        </li>
                    )
                })}
            </ul>}


        </section>
    )
}