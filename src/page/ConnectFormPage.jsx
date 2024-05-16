import {useOutletContext} from "react-router-dom";
import {get} from "../api/apiService.js";
import {baseUrl} from "../shared/basedUrl.js";

export function ConnectFormPage() {

    const
        {
            user,
            sendConnectRequest,
            userNameConnect,
            setUserNameConnect,
            invalidRequest,
            setInvalidRequest,
            invalidRequestErrorMessage,
            setInvalidRequestErrorMessage,
            isRequestSentToUser,
        } = useOutletContext();
    return (
        <section className="grow p-4">
            <form
                className="max-w-[600px] rounded-sm shadow-md p-4 mx-auto bg-white text-black"
                method="POST"
                onSubmit={(e) => {
                    e.preventDefault();

                    async function getName(e) {
                        const userWithName = await get({param: userNameConnect}, `${baseUrl}/getUser/getUserWithName`);
                        console.log(userWithName);
                        if (userWithName['status'] === 404) {
                            setInvalidRequest(true);
                            setInvalidRequestErrorMessage(`${userNameConnect} does not exist`);
                        } else if (user.connections.includes(userWithName['user']._id)) {
                            setInvalidRequest(true);
                            setInvalidRequestErrorMessage(`${userNameConnect} is already in your friend list`);
                        } else if (userNameConnect === user.name) {
                            setInvalidRequest(true);
                            setInvalidRequestErrorMessage(`You cannot send request to yourself`);
                        }else if (isRequestSentToUser(userWithName['user']._id)) {
                            setInvalidRequest(true);
                            console.log('sent already');
                            setInvalidRequestErrorMessage(`Waiting for response from ${userNameConnect}`);
                        }
                        else {
                            setInvalidRequest(false);
                            setInvalidRequestErrorMessage('');
                        }
                    }

                    getName(e);
                }}>
                <input value={userNameConnect} onChange={(e) => {
                    setUserNameConnect(e.target.value);
                }} placeholder="User you want to connect with..." className="border-solid border-blue-500"/>

                {invalidRequest && <p className="text-red-500">{invalidRequestErrorMessage}</p>}
                <button
                    className="mt-4 border-0 bg-blue-500 text-white p-2 min-w-[150px]" type="submit"
                >Connect
                </button>
            </form>
        </section>
    )
}