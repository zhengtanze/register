import { DownOutlined, ExclamationCircleOutlined, PlusCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, MenuProps, Modal, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { options } from './Edit';
import UserDetail from './UserDetail';
import Utils from './common/Utils';
import './mock';
import Api from './utils/Api';


const { confirm } = Modal;

const App = () => {

  const dayjs = require('dayjs');

  const nav = useNavigate();

  const [userList, setUserList] = useState<USER.User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const list = await Api.myPost('getlist') as USER.User[];
    setUserList(list);
  }


  const edit = (userId: string) => {
    nav(`/edit/${userId}`);
  }

  //删除
  const remove = (userId: string) => {
    confirm({
      title: '确认删除用户吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        Api.myPost('deleteuser', { id: userId }).then(() => {
          console.log(userId)
          message.success('操作成功');
          loadData();
        })
      }
    })
  };

  // code码转地址
  const codeToAddress = (code: string) => {
    const a1 = options?.find(i => i.value == code.substring(0, 2));
    const a2 = a1?.children?.find(i => i.value == code.substring(0, 4));
    const a3 = a2?.children?.find(i => i.value == code);
    return `${a1?.label} ${a2?.label} ${a3?.label}`
  }

  const userDetail = async (userId: string) => {
    Utils.common.renderReactDOM(<UserDetail userId={userId} container={Utils.common.createModalContainer("user-detail")} />);
  }
  return <Card
    extra={<Button type='primary' icon={<PlusCircleOutlined />} onClick={() => { nav('/edit/0') }}>用户注册</Button>}>
    <Table
      dataSource={userList}
      bordered={true}
      columns={[{
        title: '序号',
        dataIndex: 'id',
        align: 'center',
        width: '60px',
        render: (_, __, i) => i + 1
      }, {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '80px',
        render: (value, item: USER.User) => <a onClick={() => { userDetail(item.id || '0') }}>{value}</a>
      }, {
        title: '性别',
        dataIndex: 'gender',
        align: 'center',
        width: '60px',
        render: (value) => value == 1 ? '男' : '女'
      }, {
        title: '年龄',
        dataIndex: 'age',
        align: 'center',
        width: '50px',
        sorter: (a, b) => (a.age || 0) - (b.age || 0),
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        align: 'center',
        width: '100px',
      }, {
        title: '区域',
        dataIndex: 'code',
        align: 'center',
        width: '200px',
        ellipsis: true,
        render: (_,item:USER.User) => {
          return codeToAddress(item?.code?.[2] || '000000')
        }
      }, {
        title: '创建时间',
        dataIndex: 'createdAt',
        align: 'center',
        width: '100px',
        render: (t: number | undefined) => t ? dayjs(t).format('YYYY-MM-DD HH:mm') : '-/-',
      }, {
        title: '操作',
        dataIndex: 'option',
        align: 'center',
        width: '80px',
        render: (_, user: USER.User, index) => {
          const { id = '' } = user;

          const items: MenuProps["items"] = [{
            key: 'edit',
            label: <a onClick={() => { edit(id) }}>编辑</a>,
          }, {
            key: 'delete',
            label: <a onClick={() => { remove(id) }}>删除</a>,
          }];

          return <Dropdown
            menu={{ items }}>
            <a onClick={e => e.preventDefault()}>
              <Space>
                操作 <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        }
      }]}
    />
  </Card>
}

export default App;

