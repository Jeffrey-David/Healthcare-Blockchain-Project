import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme, Select, Typography, Table, Tag, Button, Modal, Form, DatePicker, Input } from 'antd';
import logo from './logo-main.svg';
import { PlusOutlined } from '@ant-design/icons';
import { 
    callRequestAppointment,
    callPayAppointmentfee,
    callConfirmAppointment,
    callProvideService,
    callAcknowledgeService,
    callReleaseMedicalRecord,
    callGetAllAppointments,
    callGetPatientAppointments,
    callGetPatientDetails,
    getAddress
  } from './contractAPIs/MedicalAppointment.js';

  import { callRechargeTokens } from './contractAPIs/TokenInitializer.js';
  import { callBalanceOf } from './contractAPIs/DEHToken.js';

const { Title } = Typography;
const { Option } = Select;
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;


const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    let identity = {
        fullName: 'John Doe',
        age: '35',
        address: 'Orchard Street 69',
    };
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
                if (record.status === 'Pending Payment') {
                    buttonText = 'Pay Appointment Fee';
                    buttonAction = () => {
                        Modal.confirm({
                            title: 'Pay Appointment Fee',
                            content: 'Are you sure you want to pay?\nDouble the fee will be paid and the remaining will get back along with medical record',
                            onOk() {
                                callPayAppointmentfee().then(() => {
                                    // Call the refresh function after the payment is done
                                    handleRefresh();
                                }).catch(error => {
                                    console.error("Error paying appointment fee:", error);
                                });
                            },
                            onCancel() {
                                // Handle the cancellation action here
                            },
                        });
                    };
                }
                else if (record.status === 'Service Provided') {
                    buttonText = 'Acknowledge Service';
                    buttonAction = () => {
                        Modal.confirm({
                            title: 'Acknowledge Service',
                            content: 'Are you sure you want to acknowledge that service was provided?',
                            onOk() {
                                callAcknowledgeService().then(() => {
                                    // Call the refresh function after the payment is done
                                    handleRefresh();
                                }).catch(error => {
                                    console.error("Error Acknowledging Service:", error);
                                });
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
    const [data, setData] = useState([]); // Initialize data state with an empty array
    const [refresh, setRefresh] = useState(true); // State to trigger data refresh
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);

    // useEffect(() => {
    //     const fetchPatientDetails = async () => {
    //         try {
    //             const contractData = await callGetPatientAppointments();
    //             const address = contractData[0][0];
    //             const details = await callGetPatientDetails(address);
    //             setName(details[0]);
    //             setAge(details[1].toNumber());
    //             console.log(details[0],details[1]);
    //         } catch (error) {
    //             console.error('Error fetching patient details:', error);
    //         }
    //     };
    //     fetchPatientDetails();
    //     console.log(name, age);
    //             // Cleanup function if needed
    //             return () => {
    //                 // Any cleanup code
    //             };
    //         }, [[refresh]]);

        

    let address;
    useEffect(() => {
        const fetchData = async () => {
            if (refresh) {
                try {
                    const contractData = await callGetPatientAppointments();
                    const add = await getAddress().then(thisaddress => {
                        address = thisaddress;
                    });
                    console.log(address);
                    const formattedData = contractData.map((item, index) => ({
                        key: (index + 1).toString(),
                        no: (index + 1).toString(),
                        bookingId: item[2], // Assuming this is the patient address
                        bookingFee: item[3] + ' DEH', // Assuming this is the fee
                        appointmentDate: item[4], // Assuming this is the appointment date
                        appointmentSlot: item[5], // Assuming this is the appointment slot
                        status: getStatus(item[6]) // Assuming this is the status code
                    }));
                    setData(formattedData); // Update the state with the formatted data

                    const fetchPatientDetails = async () => {
                        try {
                            const contractData = await callGetPatientAppointments();
                            const address = contractData[0][0];
                            const details = await callGetPatientDetails(address);
                            setName(details[0]);
                            setAge(details[1].toNumber());
                            console.log(details[0],details[1]);
                        } catch (error) {
                            console.error('Error fetching patient details:', error);
                        }
                    };
                    fetchPatientDetails();
    
                    // Fetch balance only if address is available
                    if (address) {
                        const balance = await callBalanceOf(address);
                        setBalance(balance); // Update the balance state with the fetched balance value
                        // const details = await callGetPatientDetails(address);
                        // name =  details[0];
                        // age = details[1].toNumber();
                        // console.log(identity.fullName);
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
    function handleRechargeTokens() {
        callRechargeTokens().then(handleRefresh);
    }
    function handleRefresh() {
        // Set the refresh state to true to trigger data fetching
        setRefresh(true);
    }


      
      function getStatus(statusCode) {
        switch (statusCode) {
            case 0:
                return 'Pending Payment';
            case 1:
                return 'Paid';
            case 2:
                return 'Confirmed';
            case 3:
                return 'Service Provided';          
            case 4:
                return 'Acknowledged Service';
            case 5:
                return 'Record Released';
          // Add more cases if needed
          default:
            return 'Unknown';
        }
      }

    // const data = [
    //     {
    //         key: '1',
    //         no: '1',
    //         bookingId: 'BID123',
    //         bookingFee: '20 DEH',
    //         appointmentDate: '2022-01-01',
    //         appointmentSlot: '10:00 - 11:00',
    //         status: 'Approved',
    //     },
    //     {
    //         key: '2',
    //         no: '2',
    //         bookingId: 'BID231',
    //         bookingFee: '20 DEH',
    //         appointmentDate: '2022-01-02',
    //         appointmentSlot: '11:00 - 12:00',
    //         status: 'Waiting for Approval',
    //     },
    //     {
    //         key: '1',
    //         no: '1',
    //         bookingId: 'BID332',
    //         bookingFee: '20 DEH',
    //         appointmentDate: '2022-01-03',
    //         appointmentSlot: '12:00 - 13:00',
    //         status: 'Waiting for Confirmation',
    //     },
    // ];

    const [visible, setVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [createVisible, setCreateVisible] = useState(false);
    
    const CreateBooking = async (formData) => {
        try {
            // Access the form data
            const { fullName, age, address, appointmentDate, appointmentSlot } = formData;
            console.log(appointmentDate);
            const formattedDate = (appointmentDate["$D"]).toString().padStart(2, '0') + '-' +
                      (appointmentDate["$M"] + 1).toString().padStart(2, '0') + '-' +
                      appointmentDate["$y"].toString();
            console.log(formattedDate);
            // Call the asynchronous function callRequestAppointment
            const tx = await callRequestAppointment(20, formattedDate, appointmentSlot, fullName, age);
            
            // Once the appointment request is successful, update the state and UI
            setCreateVisible(false);
            handleRefresh();
        } catch (error) {
            // Handle any errors that occur during the booking creation process
            console.error('Error creating booking:', error);
        }
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
                            <div>
                                {balance === null ? (
                                    <div>Loading balance...</div>
                                ) : (
                                    <div>Balance: {balance} DEH</div>
                                )}
                            </div>
                            <div>
                                <Button type="primary" style={{ marginRight: '10px' }} onClick={handleRechargeTokens}>
                                    Recharge Tokens
                                </Button>
                                <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateVisible(true)}>
                                    Create Booking
                                </Button>
                            </div>
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
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{name}</div>

                                <div style={{ gridColumn: 'span 7' }}><strong>Age</strong></div>
                                <div style={{ gridColumn: 'span 17', marginLeft: '8px' }}>{age}</div>

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
                            <Form layout="vertical" onFinish={(formData) => CreateBooking(formData)}>
                            <Form.Item label="Full Name" name="fullName">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Age" name="age">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Address" name="address">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Appointment Date" name="appointmentDate">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Appointment Slot" name="appointmentSlot">
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