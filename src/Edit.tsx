import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Cascader, Form, Input, InputNumber, Radio, Space, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "./utils/Api";

const Edit = () => {
    const [form] = Form.useForm();
    const nav = useNavigate();

    const routeParams = useParams();
    const userId = routeParams.id || '0';

    const [user, setUser] = useState<USER.User>({});
    const [loading, setLoading] = useState<boolean>(false);

    const loadUser = async () => {
        if (userId != '0') {
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

    const saveUser = async (values: USER.User) => {
        setLoading(true);
        if (userId == '0') {
            await Api.myPost('adduser', { user: { ...user, ...values } });
            message.success('注册成功');
        } else {
            await Api.myPost('updateuser', { user: { ...user, ...values } });
            message.success('修改成功');
        }
        nav('/')
        setLoading(false);
    }





    return <Card
        title={userId != '0' ? '编辑用户' : '新建用户'}
        headStyle={{ paddingLeft: '200px', fontSize: '25px' }}
    >
        {(userId == '0' || !!user.id) && <Form
            form={form}
            name="form"
            onFinish={saveUser}
            initialValues={user}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
        >
            <Form.Item
                name='name'
                label='姓名'
                rules={[{ required: true }]}>
                <Input placeholder="请输入姓名" maxLength={20} showCount style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
                name='gender'
                initialValue={1}
                label='性别'
                rules={[{ required: true, message: '请选择性别' }]}>
                <Radio.Group>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item
                name='age'
                label='年龄'
                rules={[{ required: true, message: '请输入年龄' }]}>
                <InputNumber min={1} max={99} />
            </Form.Item>

            <Form.Item
                name='mobile'
                label='手机号'
                // 手机号正则验证   pattern: /^1[345678]\d{9}$/
                rules={[{ required: true }, { pattern: /^1[345678]\d{9}$/, message: '请输入合法手机号' }]}>
                <InputNumber style={{ width: '300px' }} controls={false} maxLength={11} placeholder="请输入手机号" />
            </Form.Item>

            <Form.Item
                name='psw'
                label='密码'
                rules={[{ required: userId === '0', message: '请输入密码，必须以字母开头，且只包含数字和字母，在8-18位之间', pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/ }]}
                hasFeedback>
                <Input.Password style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
                name='confirm'
                label="确认密码"
                dependencies={['psw']}
                hasFeedback
                rules={[{ required: userId === '0', message: '请输入确认密码！' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('psw') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次密码输入不一致！'))
                    }
                })]}>
                <Input.Password style={{ width: '300px' }} />
            </Form.Item>

            <Form.Item
                name='code'
                label='区域'
                rules={[{ required: true }]}>
                <Cascader options={options} style={{ width: 300 }} />
            </Form.Item>

            <Form.Item
                rules={[{ required: true, message: '请输入地址。' }]}
                name='detail'
                label='详细地址'>
                <TextArea showCount placeholder="详细地址" maxLength={100} style={{ width: '500px' }}></TextArea>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6 }}>
                <Space>
                    <Button type="primary" icon={<SaveOutlined />} onClick={form.submit} >保存</Button>
                    <Button type="primary" icon={<RollbackOutlined />} onClick={() => nav('/')} >返回</Button>
                </Space>
            </Form.Item>
        </Form>
        }
    </Card >
}
export default Edit;

export interface Option {
    value: string | number;
    label: string;
    children?: Option[];
}

export const options: Option[] = [
    {
        value: '11',
        label: '北京',
        children: [
            {
                value: '1101',
                label: '市辖区',
                children: [
                    {
                        value: '110101',
                        label: '东城区',
                    }, {
                        value: '110102',
                        label: '西城区',
                    }, {
                        value: '110105',
                        label: '朝阳区',
                    }, {
                        value: '110106',
                        label: '丰台区',
                    },
                ],
            },
        ],
    },
    {
        value: '33',
        label: '浙江省',
        children: [
            {
                value: '3301',
                label: '杭州市',
                children: [
                    {
                        value: '330102',
                        label: '上城区',
                    }, {
                        value: '330103',
                        label: '下城区',
                    }, {
                        value: '330104',
                        label: '江干区',
                    }, {
                        value: '330105',
                        label: '拱墅区',
                    },
                ],
            },
        ],
    },
];