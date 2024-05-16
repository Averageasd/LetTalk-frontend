import {v4 as uuid4} from 'uuid';

const messageModel = {
    id: null,
    message: '',
    user: '',
    room: '',
    date: null,
}

function newMessage(message, username, room) {
    return {
        ...messageModel,
        id: uuid4(),
        message: message,
        user: username,
        date: new Date(),
        room: room
    };
}

export {newMessage};