import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal, Form, Input, DatePicker } from 'antd';
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
            title: 'Appointment Date',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        {
            title: 'Appointment Slot',
            dataIndex: 'appointmentSlot',
            key: 'appointmentSlot',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => (
                <Tag color={status === 'Approved' ? 'green' : 'orange'} key={status}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                if (record.status !== 'Waiting for Approval') {
                    return null;
                }

                return (
                    <Button type="default" onClick={() => { setVisible(true); setCurrentRecord(record); }}>Approve</Button>
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
            appointmentSlot: '10:00 - 11:00',
            status: 'Approved',
        },
        {
            key: '2',
            no: '2',
            bookingId: 'BID122',
            fullName: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            appointmentDate: '2022-01-02',
            appointmentSlot: '11:00 - 12:00',
            status: 'Waiting for Approval',
        },
        {
            key: '3',
            no: '3',
            bookingId: 'BID123',
            fullName: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            appointmentDate: '2022-01-03',
            appointmentSlot: '12:00 - 13:00',
            status: 'Approved',
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
                    <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%', borderRight: 0 }}>
                        <SubMenu key="sub1" title="Service">
                            <Menu.Item key="1">
                                <Link to="/hospital">Booking Management</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title="Data">
                            <Menu.Item key="3">
                                <Link to="/hospital/managerecord">Record Management</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Service</Breadcrumb.Item>
                        <Breadcrumb.Item>Booking Management</Breadcrumb.Item>
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
                            <Title level={4} style={{ margin: 0 }}>Booking Management</Title>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Booking Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={[
                                <Button key="Back" type="default" onClick={() => setVisible(false)}>Back</Button>,
                                <Button key="Approve" type="primary" onClick={() => setVisible(false)}>Approve</Button>,
                                <Button key="Reject" danger type="primary" onClick={() => setVisible(false)}>Reject</Button>
                            ]}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 7' }}><strong>Booking ID</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.bookingId}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Full Name</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.fullName}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.age}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Address</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.address}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Appointment Date</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.appointmentDate}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Appointment Slot</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.appointmentSlot}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Status</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.status}</div>
                            </div>
                        </Modal>

                        <Modal
                            title="Create New Booking"
                            visible={createVisible}
                            onCancel={() => setCreateVisible(false)}
                            footer={null}
                        >
                            <Form layout="vertical" onFinish={() => setCreateVisible(false)}>
                                <Form.Item label="Full Name">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="Age">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="Address">
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="Appointment Date">
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="Appointment Slot">
                                    <Select style={{ width: '100%' }}>
                                        <Option value="10:00 - 11:00">10:00 - 11:00</Option>
                                        <Option value="11:00 - 12:00">11:00 - 12:00</Option>
                                        <Option value="12:00 - 13:00">12:00 - 13:00</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Create Booking</Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;