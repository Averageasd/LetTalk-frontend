import {baseUrl} from "../shared/basedUrl.js";
import {useContext} from "react";
import {AppData} from "../context/AppContext.jsx";

export function SignupPage() {
    const {signupHandler} = useContext(AppData);
    console.log('based be url ', import.meta.env.VITE_BE_URL);
    return (
        <section className="p-4 grow">
            <form
                method="POST"
                action={`${baseUrl}/signup`}
                className="min-h-[15rem] flex flex-col p-4 bg-white max-w-[450px] shadow-lg mx-auto"
                onSubmit={(e) => {
                    e.preventDefault();
                    signupHandler(e.target.elements);
                }}>
                <h2 className="text-center">Create your account</h2>
                <div className="grow my-2 flex flex-col gap-4">
                    <input name="name" type="text" required minLength={3} maxLength={20}
                           placeholder="Enter your name"></input>
                    <input name="password" type="password" required minLength={8}
                           placeholder="Enter your password"></input>
                </div>
                <button type="submit" className="block w-full bg-blue-500 text-white border-none py-2 px-4">Sign up
                </button>
            </form>
        </section>

    )
}