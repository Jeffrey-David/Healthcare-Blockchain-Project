import React, { useState , useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal, Form, Input } from 'antd';
import logo from './logo-main.svg';
import { PlusOutlined } from '@ant-design/icons';
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
            title: 'Patient Address',
            dataIndex: 'walletAddress',
            key: 'walletAddress',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
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
            render: status => {
                let color;
                switch (status) {
                    case 'Approved':
                        color = 'green';
                        break;
                    case 'Waiting for Approval':
                        color = 'orange';
                        break;
                    case 'Access Revoked':
                        color = 'red';
                        break;
                    default:
                        color = 'gray';
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
                if (record.status === 'Not Requested' || record.status === 'No Access') {
                    return (
                        <Button type="default" onClick={() => { setCurrentRecord(record); handleRequestAccess(record.walletAddress);}}>Request Access</Button>
                    );
                }
                if (record.status === 'Approved') {
                    return (
                        <Button type="default" onClick={() => { setCurrentRecord(record); handleGetMedicalRecords(record.walletAddress);}}>View</Button>
                    );
                }
                if (record.status === 'Waiting for Approval') {
                    return null;
                }

                return null;
            },
        },
    ];

    // const data = [
    //     {
    //         key: '1',
    //         no: '1',
    //         walletAddress: '0x5e57D8b7aa3891d168916EbE034EB0BaEadFfAa0',
    //         requestDate: '2022-01-01',
    //         approvedDate: '2022-02-02',
    //         fullName: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //         appointmentDate: '2022-01-01',
    //         recordDetail: 'This is a dummy medical record for John Doe.',
    //         status: 'Approved',
    //     },
    //     {
    //         key: '2',
    //         no: '2',
    //         walletAddress: '0x045C0273290C409D55d92594df4fc109637234fd',
    //         requestDate: '2022-01-02',
    //         approvedDate: '2022-03-03',
    //         fullName: null,
    //         age: null,
    //         address: null,
    //         appointmentDate: null,
    //         recordDetail: null,
    //         status: 'Waiting for Approval',
    //     },
    //     {
    //         key: '1',
    //         no: '1',
    //         walletAddress: '0x532dd338cD6b1505Ca13d22C6e44dd96b6284C9a',
    //         requestDate: '2022-01-03',
    //         approvedDate: '2022-03-03',
    //         fullName: null,
    //         age: null,
    //         address: null,
    //         appointmentDate: null,
    //         recordDetail: null,
    //         status: 'Access Revoked',
    //     },
    // ];

    let address;
    const [check, setCheck] = useState(false);
    const [data, setData] = useState([]); // Initialize data state with an empty array
    const [refresh, setRefresh] = useState(true); // State to trigger data refresh
    

                        
    const fetchAddress = async () => { try {
        address = await getAddress();
        //console.log(address);
        const tcheck = await isThirdParty(address)
        //console.log(tcheck)
        if(tcheck && !check){
            setCheck(true);
            handleRefresh();
            console.log(tcheck)
        }
    } catch (error) {
        console.log(error);
    } }
    fetchAddress();


    useEffect(() => {
        const fetchData = async () => {
            if (refresh) {
                try {
                    if(check){
                        const contractData = await callGetAccessRequests();
                        console.log(contractData);
                        const addresses = contractData[0];
                        const age = contractData[1];
                        const date = contractData[2];
                        const names = contractData[3];
                        const statuses = contractData[4];
                        const formattedData = contractData[0].map((item, index) => ({
                                    key: index + 1,
                                    no: index + 1,
                                    walletAddress: addresses[index],
                                    requestDate: '2022-01-03',
                                    approvedDate: '2022-03-03',
                                    fullName: names[index],
                                    age: age[index],
                                    address: null,
                                    appointmentDate: date[index],
                                    recordDetail: null,
                                    status: statuses[index],
                                }));
                        setData(formattedData); // Update the state with the formatted data
                    }
    
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

    async function handleRegister(){
        try{
        const taddress = await getAddress();
        await callAddThirdParty(taddress);
        handleRefresh();
        }
        catch(error){
            console.log(error);
        }
    }

    

    async function handleRequestAccess(taddress){
        await callRequestAccess(taddress);
        handleRefresh();
    }
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [recordDate, setRecordDate] = useState([]);
    const [recordName, setRecordName] = useState('');
    const [recordAge, setRecordAge] = useState(0);
    async function handleGetMedicalRecords(taddress){
        const output = await callGetMedicalRecords(taddress);
        setRecordName(output[1])
        setRecordAge(output[2].toNumber())
        setMedicalRecords(output[4]);
        setRecordDate(output[3])
        setVisible(true);
        handleRefresh();
    }
    




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
                        <Option value="Role 3">Third Party</Option>
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
                            {!check && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => handleRegister()}>
                                    Register Account
                                </Button>
                            )}
                        </div>
                        <Table columns={columns} dataSource={data} />
                        <Modal
                            title={<div style={{ textAlign: 'center' }}>Record Detail</div>}
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                        >

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'center' }}>                               
                                    <React.Fragment>
                                        <div>
                                        <div style={{ fontWeight: 'bold' }}>Name</div>
                                        <div>{recordName}</div>
                                        </div>
                                    </React.Fragment>
                                    
                                    <React.Fragment>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Age</div>
                                        <div>{recordAge}</div>
                                        </div>
                                    </React.Fragment>
                            </div>

                            <br />
                                    <br />
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {recordDate.map((value, index) => (
                                    <React.Fragment key={index}>
                                        <div style={{ fontWeight: 'bold' }}>{value}</div>
                                        <div>{medicalRecords[index]}</div>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button type="default" onClick={() => setVisible(false)}>Close</Button>
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