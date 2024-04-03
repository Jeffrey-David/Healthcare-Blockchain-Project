import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal } from 'antd';
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
import { callGetAllAppointments } from './contractAPIs/MedicalAppointment.js';

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
            title: 'Wallet Address',
            dataIndex: 'walletAddress',
            key: 'walletAddress',
        },

        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => {
                let color;
                if (status === 'Approved') {
                    color = 'green';
                } else if (status === 'Waiting for Approval') {
                    color = 'orange';
                } else if (status === 'Rejected') {
                    color = 'red';
                }

                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                let buttonText = '';
                let buttonAction = () => {
                    setCurrentRecord(record);
                    Modal.confirm({
                        title: 'Do you want to revoke this access?',
                        content: 'When clicked the OK button, this access will be revoked',
                        onOk() {
                            handleRevokeAccess(record.walletAddress)
                        },
                        onCancel() {
                            // Optional cancel logic here
                        },
                    });
                };

                if (record.status === 'Approved') {
                    <Button type="default" onClick={() =>  {setCurrentRecord(record); handleRevokeAccess(record.walletAddress) }}>Revoke Access</Button>
                    
                } else if (record.status === 'Requested') {
                    return (
                        <div>
                        <Button type="default" style={{ marginRight: '10px' }}  onClick={() =>  {setCurrentRecord(record); handleApproveAccess(record.walletAddress) }}>Approve Access</Button>
                        <Button type="default" onClick={() =>  { setCurrentRecord(record); handleRevokeAccess(record.walletAddress) }}>Reject</Button>
                        </div>
                        );
                    // buttonText = 'Approve';
                    // buttonAction = () => { setVisible(true); setCurrentRecord(record); handleApproveAccess(record.walletAddress) };

                } else if (record.status === 'Rejected') {
                    return null;
                }

                return null ;
            },
        },
    ];

    // const data = [
    //     {
    //         key: '1',
    //         no: '1',
    //         walletAddress: '0x5e57D8b7aa3891d168916EbE034EB0BaEadFfAa0',
    //         requestedDate: '2022-01-01',
    //         approvedDate: new Date().toISOString(),
    //         status: 'Approved',
    //     },
    //     {
    //         key: '2',
    //         no: '2',
    //         walletAddress: '0x045C0273290C409D55d92594df4fc109637234fd',
    //         requestedDate: '2022-01-02',
    //         approvedDate: null,
    //         status: 'Waiting for Approval',
    //     },
    //     {
    //         key: '3',
    //         no: '3',
    //         walletAddress: '0x532dd338cD6b1505Ca13d22C6e44dd96b6284C9a',
    //         requestedDate: '2022-01-03',
    //         approvedDate: null,
    //         status: 'Rejected',
    //     },
    // ];


    const [data, setData] = useState([]); // Initialize data state with an empty array
    const [refresh, setRefresh] = useState(true); // State to trigger data refresh
    
    useEffect(() => {
        const fetchData = async () => {
            if (refresh && data.length>0) {
                try {

                    const contractData = await callListAccessList();
                    console.log(contractData);
                    // patient.patientAddress, patient.name, patient.age, patient.date, patient.medicalRecords
                    const formattedData = contractData.map((item, index) => ({
                        no: index+1,
                        walletAddress: item[0],
                        status: getStatus(item[1])
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
    function handleApproveAccess(address) {
        callGrantAccess(address).then(handleRefresh);
    }
    function handleRevokeAccess(address) {
        callRevokeAccess(address).then(handleRefresh);
    }
    
      
      function getStatus(statusCode) {
        switch (statusCode) {
            case 0:
                return 'Not Requested';
            case 1:
                return 'Requested';
            case 2:
                return 'Approved';
            case 3:
                return 'Revoked';          

          // Add more cases if needed
          default:
            return 'Unknown';
        }
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
                        <Option value="Role 3">Third Party</Option>
                    </Select>
                </div>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                    <Menu mode="inline" defaultSelectedKeys={['3']} defaultOpenKeys={['sub2']} style={{ height: '100%', borderRight: 0 }}>
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
                        <Breadcrumb.Item>Access Request</Breadcrumb.Item>
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
                            <Title level={4} style={{ margin: 0 }}>Access Request</Title>
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title="Request Detail"
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={[
                                <Button key="Cancel" type="default" onClick={() => setVisible(false)}>Cancel</Button>,
                                <Button key="Approve" type="primary" onClick={() => setVisible(false)}>Approve</Button>,
                                <Button key="Reject" danger type="primary" onClick={() => setVisible(false)}>Reject</Button>
                            ]}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', height: '100%', gap: '10px' }}>
                                <div style={{ gridColumn: 'span 6' }}><strong>Wallet Address</strong></div>
                                <div style={{ gridColumn: 'span 18', marginLeft: '8px' }}>{currentRecord?.walletAddress}</div>

                                <div style={{ gridColumn: 'span 6' }}><strong>Requested Date</strong></div>
                                <div style={{ gridColumn: 'span 18', marginLeft: '8px' }}>{currentRecord?.requestedDate}</div>

                                <div style={{ gridColumn: 'span 6' }}><strong>Status</strong></div>
                                <div style={{ gridColumn: 'span 18', marginLeft: '8px' }}>{currentRecord?.status}</div>
                            </div>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default App;