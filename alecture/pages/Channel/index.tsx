import React, { useCallback } from "react";
import Workspace from "@layouts/Workspace";
import { Container, Header } from '@pages/Channel/styles';
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";

const Channel = () => {
    const [chat, onChangeChat, setChat] = useInput('');
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log('submit');
        setChat('');
    }, []);
    
    return (
        <Container>
            <Header>채널!</Header>
            {/* <ChatList chatSections={chatSections} /> */}
            <ChatBox chat={chat} onSubmitForm={onSubmitForm} onChangeChat={onChangeChat} />
        </Container>
    )
}

export default Channel;