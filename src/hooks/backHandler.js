import react from 'react';
import {useEffect} from 'react';
import {BackHandler} from 'react-native';

export const usebackbutton = (props, handler) => {
    useEffect(() => {
        props.navigation.addListener('focus', () => {
            BackHandler.addEventListener('hardwarebackpress', handler);
        });
        props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener('hardwarebackpress', handler);
        });
    }, [handler]);
};