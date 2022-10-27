import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, VFC } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  // 상태를 저장할 수 있는 공간이 주소에도 있다고 생각하고 param의 정보를 이용한다.
  // 이렇게 하면 현재 내가 있는 채널과 워크스페이스를 주소에서 정보를 얻을 수 있다.
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>(
    `/api/users`,
    fetcher,
    {
      dedupingInterval: 2000,
    }
  )
  const { data: channelData, revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  )

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    axios
      .post(
        `/api/workspaces/${workspace}/channels`,
        {
          name: newChannel,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setShowCreateChannelModal(false);
        // 채널이 추가되면 채널리스트를 다시 가져옴
        revalidateChannel();
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newChannel]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
