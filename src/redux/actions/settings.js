import { SETTINGS } from '../type';

export const settings = (vibrate, beep) => {
    return {
        type: SETTINGS,
        vibrate: vibrate,
        beep: beep
    };
}