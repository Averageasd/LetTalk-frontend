import './App.css'
import {Route, Routes} from "react-router-dom";
import {RootPage} from "./page/RootPage.jsx";
import {LoginPage} from "./page/LoginPage.jsx";
import {SignupPage} from "./page/SignupPage.jsx";
import {ChatPage} from "./page/ChatPage.jsx";
import {Notification} from "./page/Notification.jsx";
import {ConnectFormPage} from "./page/ConnectFormPage.jsx";
import AppProvider from "./context/AppContext.jsx";
import {CreatGroupPage} from "./page/CreatGroupPage.jsx";

function App() {
    return (
        <AppProvider>
            <Routes>
                <Route path="/" element={<RootPage/>}>
                    <Route path="/login" element={<LoginPage/>}></Route>
                    <Route path="/signup" element={<SignupPage/>}></Route>
                    <Route path="/logout" element={<SignupPage/>}></Route>
                    <Route path="/chat" element={<ChatPage/>}></Route>
                    <Route path="/notification" element={<Notification/>}></Route>
                    <Route path="/connect" element={<ConnectFormPage/>}></Route>
                    <Route path="/create-group" element={<CreatGroupPage/>}></Route>
                </Route>
            </Routes>
        </AppProvider>
    )
}

export default App
