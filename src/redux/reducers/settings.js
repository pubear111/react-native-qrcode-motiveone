import { SETTINGS } from '../type';

const defaultState = {
    vibrate: true,
    beep: true
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case SETTINGS:
            return Object.assign({}, state, {
                vibrate: action.vibrate,
                beep: action.beep
            });
        default:
            return state;
    }
}
