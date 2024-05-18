import {Outlet} from "react-router-dom";
import {IconMenu2, IconSquareX} from "@tabler/icons-react";
import {ToastContainer} from "react-toastify";
import {AuthLinks} from "../components/AuthLinks.jsx";
import {LoggedInUserLinks} from "../components/LoggedInUserLinks.jsx";
import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";
import {useChatHook} from "../hook/chatHook.js";
import {useInitializeUserDataHook} from "../hook/initializeUserDataHook.js";

// import useChatHook from "../hook/chatHook.js";

export function RootPage() {
    const {
        user,
        selectedRoom,
        closeBarAndNavigate,
        chooseRoom,
        logout,
        showNavBar,
        setShowNavBar,
        rooms,
    } = useContext(AppData);

    useInitializeUserDataHook();
    useChatHook();

    return (
        <>
            <ToastContainer/>
            {showNavBar &&
                (
                    <section
                        className="fixed bg-white left-0 top-0 shadow-lg z-[1000] h-[100vh] w-[90%] md:w-[450px]">
                        <div className="flex justify-end p-4">
                            <IconSquareX className="cursor-pointer" onClick={() => {
                                setShowNavBar(false);
                            }}/>
                        </div>
                        {user ?
                            <LoggedInUserLinks
                                user={user}
                                closeBarAndNavigate={closeBarAndNavigate}
                                logout={logout}
                                rooms={rooms}
                                selectedRoom={selectedRoom}
                                chooseRoom={chooseRoom}/> :
                            <AuthLinks closeBarAndNavigate={closeBarAndNavigate}/>}
                    </section>
                )
            }

            <header className="relative">
                <nav className="flex sticky w-full top-0 left-0 justify-between items-center px-4 py-2 bg-blue-500">
                    <IconMenu2 className="text-white cursor-pointer" onClick={() => {
                        setShowNavBar(true);
                    }}/>

                    <h3 className="text-white text-2xl">LetTalk</h3>
                </nav>
            </header>
            <main className="grow h-1 flex overflow-y-auto">
                <Outlet/>
            </main>
        </>
    )
}