import { Descriptions, Modal } from "antd";
import { useEffect, useState } from "react";
import { options } from "./Edit";
import Utils from "./common/Utils";
import Api from "./utils/Api";

const UserDetail = (props: { userId?: string, container: HTMLElement }) => {

    const { userId = '', container } = props;

    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<USER.User>();
    const loadUser = async () => {
        if (!!userId) {
            setLoading(true);
            try {
                const ret = await Api.myPost('getuser', { id: userId }) as USER.User;
                setUser(ret);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUser();
    }, [])

    // code码转地址
    const codeToAddress = (code: string) => {
        const a1 = options?.find(i => i.value == code.substring(0, 2));
        const a2 = a1?.children?.find(i => i.value == code.substring(0, 4));
        const a3 = a2?.children?.find(i => i.value == code);
        return `${a1?.label} ${a2?.label} ${a3?.label}`
    }

    const close = () => {
        Utils.common.closeModalContainer(container.getAttribute('id') || '0');
    }

    return <Modal
        title={'用户详情'}
        getContainer={container}
        open={true}
        footer={null}
        width={'600px'}
        onCancel={close}>
        {(!userId || !!user?.id) && <Descriptions bordered column={1} labelStyle={{ width: 100, textAlign: 'center' }} >
            <Descriptions.Item label='名字' >
                {user?.name}
            </Descriptions.Item>

            <Descriptions.Item label='性别'>
                {user?.gender == 1 ? "男" : "女"}
            </Descriptions.Item>

            <Descriptions.Item label='年龄'>
                {user?.age}
            </Descriptions.Item>

            <Descriptions.Item label='手机号'>
                {user?.mobile}
            </Descriptions.Item>
            <Descriptions.Item label='地址'>
                {`${codeToAddress(user?.code?.[2] || '000000')} ${user?.detail}`}
            </Descriptions.Item>
        </Descriptions>
        }
    </Modal >
}

export default UserDetail;