import { LOGIN, LOGOUT } from '../type';

const defaultState = {
    logged: false,
    name: '',
    role: '',
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, state, {
                logged: true,
                name: action.name,
                role: action.role
            });
        case LOGOUT:
            return Object.assign({}, state, {
                logged: false,
                name: '',
                role: ''
            });
        default:
            return state;
    }
}