import { ChangeEvent, Dispatch, SetStateAction, UIEvent, useCallback, useState } from 'react';


// generic을 사용할 경우

type ReturnTypes<T = ChangeEvent<HTMLInputElement>>= [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = < T = ChangeEvent<HTMLInputElement> >(
    initialData: T,
): ReturnTypes<T> => {
    const [value, setValue] = useState(initialData);
    const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as unknown as T);
    }, []);
    return [value, handler, setValue];
};

// const useInput = (initialValue: any) => {
//     const [value, setValue] = useState(initialValue);
//     const handler = useCallback((e) => {
//         setValue(e.target.value);
//     }, []);
//     return [value, handler, setValue];
// };

export default useInput;