import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095'; 

const sockets: { [key: string]: SocketIOClient.Socket } = {};
// 소켓에는 namespace와 room으로 나뉘어져있다.
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
    const disconnect = useCallback(() => {
        if (workspace) {
            sockets[workspace].disconnect();
            delete sockets[workspace];
        }
    }, [workspace]);

    if (!workspace) {
        return [undefined, disconnect];
    }
    
    // 주소는 항상 변수로 빼놓아야지 나중에 배포할 때 불편함을 덜 수 있다.
    // { transports: ['websocket'] } -> 처음부터 웹소켓만 쓰도록 지시해준다.
    if (!sockets[workspace]) {
        sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
            transports: ['websocket'],
        });
    }

    return [sockets[workspace], disconnect];

    // // hello 라는 이벤트명으로 world라는 데이터를 보낸다.
    // sockets[workspace].emit('hello', 'world');
    // // on은 서버에서 데이터 이벤트를 받아서 실행한다.
    // sockets[workspace].on('message', (data) => {
    //     console.log(data);
    // });    
};

export default useSocket;