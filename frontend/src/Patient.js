import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal, Form, DatePicker } from 'antd';
import logo from './logo-main.svg';
import { PlusOutlined } from '@ant-design/icons';

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
            title: 'Fee',
            dataIndex: 'bookingFee',
            key: 'bookingFee',
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
                let buttonText = 'Detail';
                let buttonAction = () => { setVisible(true); setCurrentRecord(record); };
                if (record.status === 'Waiting for Confirmation') {
                    buttonText = 'Confirm Treatment';
                    buttonAction = () => {
                        Modal.confirm({
                            title: 'Confirm Treatment',
                            content: 'Are you sure you want to confirm this treatment?',
                            onOk() {
                                // Handle the confirmation action here
                            },
                            onCancel() {
                                // Handle the cancellation action here
                            },
                        });
                    };
                }

                return (
                    <Button type="default" onClick={buttonAction}>{buttonText}</Button>
                );
            },
        },
    ];

    const data = [
        {
            key: '1',
            no: '1',
            bookingId: 'BID123',
            bookingFee: '20 DEH',
            appointmentDate: '2022-01-01',
            appointmentSlot: '10:00 - 11:00',
            status: 'Approved',
        },
        {
            key: '2',
            no: '2',
            bookingId: 'BID231',
            bookingFee: '20 DEH',
            appointmentDate: '2022-01-02',
            appointmentSlot: '11:00 - 12:00',
            status: 'Waiting for Approval',
        },
        {
            key: '1',
            no: '1',
            bookingId: 'BID332',
            bookingFee: '20 DEH',
            appointmentDate: '2022-01-03',
            appointmentSlot: '12:00 - 13:00',
            status: 'Waiting for Confirmation',
        },
    ];

    const [visible, setVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [createVisible, setCreateVisible] = useState(false);
    const identity = {
        fullName: 'John Doe',
        age: '35',
        address: 'Orchard Street 69',
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" className="logo" style={{ height: '40px' }} />
                    <Title level={3} style={{ color: '#fff', marginLeft: '30px' }}>Patient</Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#fff', marginRight: '10px' }}>Select your role:</span>
                    <Select defaultValue="Role 1" style={{ width: 120 }} onChange={value => {
                        if (value === 'Role 2') {
                            navigate('/hospital');
                        } else if (value === 'Role 3') {
                            navigate('/thirdparty');
                        }
                    }}>
                        <Option value="Role 1">Patient</Option>
                        <Option value="Role 2">Hospital</Option>
                        <Option value="Role 3">Third Party</Option>
                    </Select>
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%', borderRight: 0 }}>
                        <SubMenu key="sub1" title="Service">
                            <Menu.Item key="1">
                                <Link to="/patient">Booking</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title="Data">
                            <Menu.Item key="3">
                                <Link to="/patient/medicalrecord">Medical Record</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/patient/accessrequest">Access Request</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Service</Breadcrumb.Item>
                        <Breadcrumb.Item>Booking</Breadcrumb.Item>
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
                            <Title level={4} style={{ margin: 0 }}>Booking</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>
                                Create Booking
                            </Button>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Booking Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                        >

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 7' }}><strong>Booking ID</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.bookingId}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Full Name</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{identity?.fullName}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{identity?.age}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Address</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{identity?.address}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Appointment Date</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.appointmentDate}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Appointment Slot</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.appointmentSlot}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Fee</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.bookingFee}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Status</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{currentRecord?.status}</div>

                                <div style={{ gridColumn: 'span 24', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button type="default" onClick={() => setVisible(false)}>Close</Button>
                                </div>
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
                                    <Typography.Text>{identity.fullName}</Typography.Text>
                                </Form.Item>
                                <Form.Item label="Age">
                                    <Typography.Text>{identity.age}</Typography.Text>
                                </Form.Item>
                                <Form.Item label="Address">
                                    <Typography.Text>{identity.address}</Typography.Text>
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