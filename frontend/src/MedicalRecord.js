import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Button, Modal} from 'antd';
import logo from './logo-main.svg';

import {
    callStoreRecord,
    callGrantAccess,
    callRequestAccess,
    callRevokeAccess,
    callListAccessList,
    callGetAccessRequests,
    callGetMedicalRecords,
    callAddThirdParty,
    isThirdParty,
    getAddress
} from './contractAPIs/MedicalRecordAccess.js';

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
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
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
                <Button type="default" onClick={() => { setCurrentRecord(record); console.log(record); setVisible(true); }}>Detail</Button>
            ),
        },
    ];

    // const data = [
    //     {
    //         key: '1',
    //         no: '1',
    //         fullName: 'John Doe',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //         latestAppointmentDate: '2022-01-04',
    //         detailMedicalRecord: 'This is a dummy medical record for John Doe.',
    //     },
    //     {
    //         key: '2',
    //         no: '2',
    //         fullName: 'John Doe',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //         latestAppointmentDate: '2022-01-03',
    //         detailMedicalRecord: 'This is another dummy medical record for John Doe.',
    //     },
    //     {
    //         key: '3',
    //         no: '3',
    //         fullName: 'John Doe',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //         latestAppointmentDate: '2022-01-02',
    //         detailMedicalRecord: 'This is yet another dummy medical record for John Doe.',
    //     },
    // ];





    const [data, setData] = useState([]); // Initialize data state with an empty array
    const [refresh, setRefresh] = useState(true); // State to trigger data refresh
    
    useEffect(() => {
        const fetchData = async () => {
            if (refresh) {
                try {
                    let patientAddress = 0;
                    const add = await getAddress().then(address => {
                        patientAddress = address;
                    });
                    const contractData = await callGetMedicalRecords(patientAddress);
                    console.log(contractData);
                    const dates = contractData[3];
                    console.log(dates);
                    const medicalRecords = contractData[4];
                    // patient.patientAddress, patient.name, patient.age, patient.date, patient.medicalRecords
                    const formattedData = medicalRecords.map((item, index) => ({
                        key: index+1,
                        No: index + 1,
                        fullName: contractData[1],
                        age: contractData[2].toNumber(),
                        address: patientAddress,
                        date: dates[index],
                        detailMedicalRecord: item
                    }));
                    setData(formattedData); // Update the state with the formatted data

    
                   setRefresh(false); // Reset the refresh state
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };

    
        fetchData(); // Call the fetchData function
        setRefresh(false);
    }, [refresh]); 

    function handleRefresh() {
        // Set the refresh state to true to trigger data fetching
        setRefresh(true);
    }
    




    const [visible, setVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);

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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 8' }}><strong>Full Name</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.fullName}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.age}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Address</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.address}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Date</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.date}</div>

                                <div style={{ gridColumn: 'span 8' }}><strong>Detail</strong></div>
                                <div style={{ gridColumn: 'span 16', marginLeft: '8px' }}>{currentRecord?.detailMedicalRecord}</div>

                                <div style={{ gridColumn: 'span 24', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                    <Button type="default" onClick={() => setVisible(false)}>Close</Button>
                                </div>
                            </div>
                        </Modal>

                       
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;