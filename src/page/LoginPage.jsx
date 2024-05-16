import {baseUrl} from "../shared/basedUrl.js";
import {useOutletContext} from "react-router-dom";

export function LoginPage() {
    const {loginHandler} = useOutletContext();
    return (
        <section className="p-4 grow">
            <form
                method="POST"
                action={`${baseUrl}/login`}
                className="min-h-[15rem] flex flex-col p-4 bg-white max-w-[450px] shadow-lg mx-auto"
                onSubmit={(e) => {
                    e.preventDefault();
                    loginHandler(e.target.elements);
                }}>
                <h2 className="text-center">Login</h2>
                <div className="grow my-2 flex flex-col gap-4">
                    <input name="name" type="text" placeholder="Enter your name"></input>
                    <input name="password" type="password" placeholder="Enter your password"></input>
                </div>
                <button type="submit" className="block w-full bg-blue-500 text-white border-none py-2 px-4">Login</button>
            </form>
        </section>

    )
}