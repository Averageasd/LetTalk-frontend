import {IconLogin2, IconUserPlus} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {LinkContainer} from "./LinkContainer.jsx";

export function AuthLinks({closeBarAndNavigate}) {
    return (
        <LinkContainer>
            <li
                className="flex gap-2 py-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                    closeBarAndNavigate('/login');
                }}>
                <IconLogin2/>
                <Link to='/login'>Login</Link>
            </li>
            <li
                className="flex gap-2 py-2 hover:bg-blue-500 cursor-pointer"
                onClick={() => {
                    closeBarAndNavigate('/signup');
                }}
            >
                <IconUserPlus/>
                <Link to='/signup'>Signup</Link>
            </li>
        </LinkContainer>
    )
}