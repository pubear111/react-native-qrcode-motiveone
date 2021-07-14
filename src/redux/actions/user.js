import { LOGIN, LOGOUT } from '../type';

export const login = (name, role) => {
    return {
        type: LOGIN,
        name: name,
        role: role
    };
};

export const logout = () => {
    return {
        type: LOGOUT
    };
};