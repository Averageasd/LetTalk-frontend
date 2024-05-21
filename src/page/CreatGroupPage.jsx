import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {baseUrl} from "../shared/basedUrl.js";
import {useProtectAuthRoute} from "../hook/protectAuthRoute.js";

export function CreatGroupPage() {
    useProtectAuthRoute();

    const {
        user,
        createNewGroup,
        newRoomName,
        setNewRoomName,
        invalidRoomName,
        setInvalidRoomName
    } = useContext(AppData);

    return (
        <section className="grow p-4">
            <form
                className="max-w-[600px] rounded-sm shadow-md p-4 mx-auto bg-white text-black"
                method="POST"
                action={`${baseUrl}/chat/create-room`}
                onSubmit={(e) => {
                    e.preventDefault();
                    createNewGroup(e.target.elements);
                }}
            >
                <input
                    name="userId"
                   defaultValue = {user ? user._id: ''}
                    className="hidden"
                />
                <input
                    name="roomName"
                    placeholder="Enter name for new group..."
                    className="border-solid border-blue-500"
                    value={newRoomName}
                    onChange={(e) => {
                        setNewRoomName(e.target.value);
                    }}
                ></input>
                {invalidRoomName && <p className="text-red-500">Room already exists!</p>}
                <button
                    className="mt-4 border-0 bg-blue-500 text-white p-2 min-w-[150px]"
                    type="submit"
                >Create
                </button>
            </form>
        </section>
    )
}