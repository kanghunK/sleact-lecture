import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import { IChat, IDM } from '@typings/db';
import dayjs from 'dayjs';
import { useParams } from 'react-router';
import regexifystring from 'regexify-string';
import { Link } from 'react-router-dom';

interface Props {
  data: (IDM | IChat);
}
const Chat: VFC<Props> = memo(({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  // 데이터에 Sender가 있으면 dm에서 보낸 것이고 없으면 채널에서 한 채팅으로 구분한다.
  const user = 'Sender' in data ? data.Sender : data.User;

  // hooks 안에서 개별 값을 캐싱하고 싶다면 useMemo() 활용

  // 맨션 문구를 뽑아서 링크로 만들기
  // \d 숫자, +는 1개 이상, ?는 0개나 1개, *이 0개 이상
  // g는 모두찾기 
  const result = useMemo(() => regexifystring({
    input: data.content,
    pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    decorator(match, index) {
      const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
      if (arr) {
        return (
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
        )
      }
      return <br key={index} />;
    },
  }), [workspace, data.content]);

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;
