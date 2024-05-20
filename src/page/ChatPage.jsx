import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";
import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {IconEdit, IconSquareX, IconTrash} from "@tabler/icons-react";
import {socket} from "../api/socket.js";

export function ChatPage() {
    useProtectAuthRoute();
    const {
        sendMessage,
        selectedRoom,
        inputMessage,
        setInputMessage,
        user,
        editingMessage,
        setEditingMessage
    } = useContext(AppData);
    return (
        <section className="grow flex flex-col">
            {selectedRoom && (
                <ul className="grow overflow-y-auto flex flex-col gap-4 p-4">
                    {selectedRoom.messages.map((message) => {
                        if (message.user.name === user.name) {
                            return <li
                                className={`relative flex flex-col gap-1 self-start w-[100%] text-black ${editingMessage && editingMessage.room === selectedRoom._id && `bg-slate-200 p-2`}`}
                                key={message._id}>
                                <div className="relative max-w-[400px]">
                                    <p className="font-semibold">You</p>
                                    <p className="shadow-md bg-white p-2 rounded text-black">{message.message}</p>
                                    <div
                                        className="flex justify-between p-1 rounded-sm border-solid border-0  border-b border-gray-100 w-[50px] bg-white/30 backdrop-blur-xl absolute left-[calc(100%-50px)] top-[5%] h-auto">
                                        <IconEdit className="w-[18px]" onClick={() => {
                                            socket.emit('change-message-to-edit', message._id, selectedRoom._id, user._id);
                                        }}/>
                                        <IconTrash className="w-[18px] text-red-500" onClick={() => {
                                            console.log('delete message ', message._id);
                                            socket.emit('delete-message', message._id, selectedRoom._id);
                                        }}/>
                                    </div>
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

            {editingMessage && <div className="flex justify-between px-2 bg-white backdrop-blur-xl">
                <p>Editing message...</p>
                <IconSquareX className="w-[18px]" onClick={() => {
                    socket.emit('remove-edit-status', editingMessage._id, selectedRoom._id, user._id);
                    setEditingMessage(null);
                    setInputMessage('');
                }}/>
            </div>}

            <form
                method="POST"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedRoom) {
                        if (editingMessage) {
                            console.log(editingMessage.room);
                        }
                        if (editingMessage && editingMessage.room === selectedRoom._id) {
                            socket.emit('edit-message', inputMessage, editingMessage._id, selectedRoom._id, user._id);
                            setEditingMessage(null);
                            setInputMessage('');
                        } else {
                            sendMessage(inputMessage, selectedRoom._id);
                            setInputMessage('');
                        }
                    }
                }
                }>
                <input placeholder="Enter your message here (10000 chars max)..." name="message" value={inputMessage}
                       maxLength={10000} type="text" onChange={(e) => {
                    setInputMessage(e.target.value);
                }} required={true}></input>
            </form>

        </section>

    )
}