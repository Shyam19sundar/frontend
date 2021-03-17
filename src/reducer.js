export const initialState = {
    receiver: null,
    room: null,
    roomDetails: null,
    uploaded: false,
    user: null,
    allMembers: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAT_RECEIVER": {
            return {
                ...state,
                receiver: action.receiver,
            };
        }

        case "SET_ROOM": {
            return {
                ...state,
                room: action.room,
            };
        }
        case "SET_ROOM_MEMBERS": {
            return {
                ...state,
                roomDetails: action.roomDetails,
            };
        }

        case 'SET_UPLOAD': {
            return {
                ...state,
                uploaded: action.uploaded
            }
        }

        case 'SET_ALL_MEMBERS': {
            return {
                ...state,
                allMembers: action.allMembers
            }
        }

        case "SET_USER": {
            return {
                ...state,
                user: action.user,
            };
        }

        default:
            return state;
    }
}