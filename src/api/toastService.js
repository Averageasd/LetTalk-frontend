import {toast} from "react-toastify";


const toastObject = {
    position: 'top-right',
    autoClose: 2000,
    draggable: false
}

export function showToast(status, message) {
    if (status === 200) {
        toast.success(message, toastObject);
        return;
    }
    toast.error(message, toastObject);
}