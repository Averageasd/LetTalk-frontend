import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";
import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {IconEdit, IconTrash} from "@tabler/icons-react";
import {socket} from "../api/socket.js";

export function ChatPage() {
    useProtectAuthRoute();
    const {sendMessage, selectedRoom, inputMessage, setInputMessage, user} = useContext(AppData);
    return (
        <section className="grow flex flex-col">
            {selectedRoom && (
                <ul className="grow overflow-y-auto flex flex-col gap-4 p-4">
                    {selectedRoom.messages.map((message) => {
                        if (message.user.name === user.name) {
                            return <li
                                className="relative flex flex-col gap-1 self-start w-[100%] text-black max-w-[400px]"
                                key={message._id}>
                                <p className="font-semibold">You</p>
                                <p className="shadow-md bg-white p-2 rounded text-black">{message.message}</p>
                                <div
                                    className="flex justify-between p-1 rounded-sm border-solid border-0  border-b border-gray-100 w-[50px] bg-white/30 backdrop-blur-xl absolute left-[calc(100%-50px)] top-[5%] h-auto">
                                    <IconEdit className="w-[18px]"/>
                                    <IconTrash className="w-[18px] text-red-500" onClick={() => {
                                        console.log('delete message ', message._id);
                                        socket.emit('delete-message', message._id, selectedRoom._id);
                                    }}/>
                                </div>
                            </li>
                        } else {
                            return <li
                                className="flex flex-col gap-1 self-end w-[100%] rounded text-black max-w-[400px]"
                                key={message._id}>
                                <p className="font-semibold">{message.user.name}</p>
                                <p className="shadow-md bg-white p-2 rounded text-black">{message.message}</p>
                            </li>
                        }

                    })}
                </ul>
            )}

            <form
                method="POST"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedRoom) {
                        sendMessage(inputMessage, selectedRoom._id);
                        setInputMessage('');
                    }
                }}>
                <input placeholder="Enter your message here (10000 chars max)..." name="message" value={inputMessage}
                       maxLength={10000} type="text" onChange={(e) => {
                    setInputMessage(e.target.value);
                }} required={true}></input>
            </form>

        </section>

    )
}