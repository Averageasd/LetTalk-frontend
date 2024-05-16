import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";
import {useOutletContext} from "react-router-dom";

export function ChatPage() {
    useProtectAuthRoute();
    const {sendMessage, selectedRoom, inputMessage, setInputMessage, user} = useOutletContext();

    console.log('selected room user is in now ', selectedRoom);
    return (
        <section className="grow flex flex-col">
            {selectedRoom && (
                <ul className="grow overflow-y-auto flex flex-col gap-4 p-4">
                    {selectedRoom.messages.map((message) => {
                        if (message.user.name === user.name) {
                            return <li className="flex flex-col gap-1 self-start w-[100%] text-black max-w-[400px]"
                                       key={message._id}>
                                <p className="font-semibold">You</p>
                                <p className="shadow-md bg-white p-2 rounded text-black">{message.message}</p>
                            </li>
                        } else {
                            return <li className="flex flex-col gap-1 self-end w-[100%] rounded text-black max-w-[400px]"
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
                <input placeholder="Enter your message here (10000 chars max)..." name="message" value={inputMessage} maxLength={10000} type="text" onChange={(e) => {
                    setInputMessage(e.target.value);
                }} required={true}></input>
            </form>

        </section>

    )
}