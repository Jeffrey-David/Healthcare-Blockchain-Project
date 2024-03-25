import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal } from 'antd';
import logo from './logo-main.svg';

const { Title } = Typography;
const { Option } = Select;
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;



const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
        },
        {
            title: 'Booking ID',
            dataIndex: 'bookingId',
            key: 'bookingId',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Latest Appointment Date',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        {
            title: 'Detail',
            dataIndex: 'recordDetail',
            key: 'recordDetail',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Tag color={status === 'Released' ? 'green' : 'orange'} key={status}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                if (record.status !== 'Not Released') {
                    return null;
                }

                return (
                    <Button type="default" onClick={() => { setVisible(true); setCurrentRecord(record); }}>Release</Button>
                );
            },
        },
    ];

    const data = [
        {
            key: '1',
            no: '1',
            bookingId: 'BID121',
            fullName: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            appointmentDate: '2022-01-01',
            recordDetail: 'This is a dummy medical record for John Doe.',
            status: 'Released',
        },
        {
            key: '2',
            no: '2',
            bookingId: 'BID122',
            fullName: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            appointmentDate: '2022-01-02',
            recordDetail: 'This is another dummy medical record for John Doe.',
            status: 'Not Released',
        },
        {
            key: '3',
            no: '3',
            bookingId: 'BID123',
            fullName: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            appointmentDate: '2022-01-03',
            recordDetail: 'This is yet another dummy medical record for John Doe.',
            status: 'Released',
        },
    ];

    const [visible, setVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [createVisible, setCreateVisible] = useState(false);

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" className="logo" style={{ height: '40px' }} />
                    <Title level={3} style={{ color: '#fff', marginLeft: '30px' }}>Hospital</Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#fff', marginRight: '10px' }}>Select your role:</span>
                    <Select defaultValue="Role 2" style={{ width: 120 }} onChange={value => {
                        if (value === 'Role 1') {
                            navigate('/patient');
                        } else if (value === 'Role 3') {
                            navigate('/thirdparty');
                        }
                    }}>
                        <Option value="Role 1">Patient</Option>
                        <Option value="Role 2">Hospital</Option>
                        <Option value="Role 3">Thirt Party</Option>
                    </Select>
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu mode="inline" defaultSelectedKeys={['2']} defaultOpenKeys={['sub2']} style={{ height: '100%', borderRight: 0 }}>
                        <SubMenu key="sub1" title="Service">
                            <Menu.Item key="1">
                                <Link to="/hospital">Booking Management</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title="Data">
                            <Menu.Item key="2">
                                <Link to="/hospital/managerecord">Record Management</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Data</Breadcrumb.Item>
                        <Breadcrumb.Item>Record Management</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        style={{
                            padding: 24,
                            margin: 20,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <Title level={4} style={{ margin: 0 }}>Record Management</Title>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Record Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={[
                                <Button key="Back" type="default" onClick={() => setVisible(false)}>Back</Button>,
                                <Button key="Approve" type="primary" onClick={() => setVisible(false)}>Release</Button>,
                                // <Button key="Reject" danger type="primary" onClick={() => setVisible(false)}>Reject</Button>
                            ]}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 8' }}><strong>Booking ID</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.bookingId}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Full Name</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.fullName}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.age}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Address</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.address}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Latest Appointment</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.appointmentDate}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Detail</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.recordDetail}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Status</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.status}</div>
                            </div>
                        </Modal>

                        <Modal
                            title="Create New Booking"
                            visible={createVisible}
                            onCancel={() => setCreateVisible(false)}
                            footer={null}
                        >
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;