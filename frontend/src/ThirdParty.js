import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal, Form, Input } from 'antd';
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
            title: 'Request to',
            dataIndex: 'walletAddress',
            key: 'walletAddress',
        },
        {
            title: 'Request Date',
            dataIndex: 'requestDate',
            key: 'requestDate',
        },
        {
            title: 'Approved Date',
            dataIndex: 'approvedDate',
            key: 'approvedDate',
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
                if (record.status !== 'Approved') {
                    return null;
                }

                return (
                    <Button type="default" onClick={() => { setVisible(true); setCurrentRecord(record); }}>Detail</Button>
                );
            },
        },
    ];

    const data = [
        {
            key: '1',
            no: '1',
            walletAddress: '0x5e57D8b7aa3891d168916EbE034EB0BaEadFfAa0',
            requestDate: '2022-01-01',
            approvedDate: '2022-02-02',
            fullName: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            appointmentDate: '2022-01-01',
            recordDetail: 'This is a dummy medical record for John Doe.',
            status: 'Approved',
        },
        {
            key: '2',
            no: '2',
            walletAddress: '0x045C0273290C409D55d92594df4fc109637234fd',
            requestDate: '2022-01-02',
            approvedDate: '2022-03-03',
            fullName: null,
            age: null,
            address: null,
            appointmentDate: null,
            recordDetail: null,
            status: 'Waiting for Approval',
        },
        {
            key: '1',
            no: '1',
            walletAddress: '0x532dd338cD6b1505Ca13d22C6e44dd96b6284C9a',
            requestDate: '2022-01-03',
            approvedDate: '2022-03-03',
            fullName: null,
            age: null,
            address: null,
            appointmentDate: null,
            recordDetail: null,
            status: 'Waiting for Approval',
        },
    ];

    const [visible, setVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [createVisible, setCreateVisible] = useState(false);
    const identity = {
        thirdPartyName: 'John Doe',
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" className="logo" style={{ height: '40px' }} />
                    <Title level={3} style={{ color: '#fff', marginLeft: '30px' }}>Third Party</Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#fff', marginRight: '10px' }}>Select your role:</span>
                    <Select defaultValue="Role 3" style={{ width: 120 }} onChange={value => {
                        if (value === 'Role 1') {
                            navigate('/patient');
                        } else if (value === 'Role 2') {
                            navigate('/hospital');
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
                                <Link to="/thirdparty">Record Access</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Service</Breadcrumb.Item>
                        <Breadcrumb.Item>Record Access</Breadcrumb.Item>
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
                            <Title level={4} style={{ margin: 0 }}>Record Access</Title>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>
                                Create Request
                            </Button>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Record Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                        >

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 8' }}><strong>Request to</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.walletAddress}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Full Name</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.fullName}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.age}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Address</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.address}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Latest Appointment</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.appointmentDate}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Record Detail</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.recordDetail}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Status</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.status}</div>

                                <div style={{ gridColumn: 'span 24', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button type="primary" onClick={() => setVisible(false)}>Close</Button>
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
                                    <Typography.Text>{identity.thirdPartyName}</Typography.Text>
                                </Form.Item>
                                <Form.Item label="Wallet Address">
                                    <Input placeholder="Enter wallet address" />
                                </Form.Item>
                                <Form.Item style={{ marginBottom: 0 }}>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Create Request</Button>
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