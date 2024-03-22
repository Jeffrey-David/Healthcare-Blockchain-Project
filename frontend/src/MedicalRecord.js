import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Button, Modal, Form, Input, DatePicker } from 'antd';
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
            dataIndex: 'latestAppointmentDate',
            key: 'latestAppointmentDate',
        },
        {
            title: 'Detail',
            dataIndex: 'detailMedicalRecord',
            key: 'detailMedicalRecord',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="default" onClick={() => { setVisible(true); setCurrentRecord(record); }}>Detail</Button>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            no: '1',
            fullName: 'John Doe',
            age: 32,
            address: 'New York No. 1 Lake Park',
            latestAppointmentDate: '2022-01-04',
            detailMedicalRecord: 'This is a dummy medical record for John Doe.',
        },
        {
            key: '2',
            no: '2',
            fullName: 'John Doe',
            age: 32,
            address: 'New York No. 1 Lake Park',
            latestAppointmentDate: '2022-01-03',
            detailMedicalRecord: 'This is another dummy medical record for John Doe.',
        },
        {
            key: '3',
            no: '3',
            fullName: 'John Doe',
            age: 32,
            address: 'New York No. 1 Lake Park',
            latestAppointmentDate: '2022-01-02',
            detailMedicalRecord: 'This is yet another dummy medical record for John Doe.',
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
                    {/* <Title level={3} style={{ color: '#fff', marginLeft: '30px' }}>Homepage</Title> */}
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
                        <Option value="Role 3">Thirt Party</Option>
                    </Select>
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu mode="inline" defaultSelectedKeys={['2']} defaultOpenKeys={['sub2']} style={{ height: '100%', borderRight: 0 }}>
                        <SubMenu key="sub1" title="Service">
                            <Menu.Item key="1">
                                <Link to="/patient">Booking</Link>
                            </Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title="Data">
                            <Menu.Item key="2">
                                <Link to="/patient/medicalrecord">Medical Record</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/patient/accessrequest">Access Request</Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px', minHeight: '100vh' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>Data</Breadcrumb.Item>
                        <Breadcrumb.Item>Medical Record</Breadcrumb.Item>
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
                            <Title level={4} style={{ margin: 0 }}>Medical Record</Title>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Booking Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                        >
                            <p><strong>Full Name:</strong> {currentRecord?.fullName}</p>
                            <p><strong>Age:</strong> {currentRecord?.age}</p>
                            <p><strong>Address:</strong> {currentRecord?.address}</p>
                            <p><strong>Latest Appointment Date:</strong> {currentRecord?.latestAppointmentDate}</p>
                            <p><strong>Detail:</strong> {currentRecord?.detailMedicalRecord}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button type="primary" onClick={() => setVisible(false)}>Close</Button>
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