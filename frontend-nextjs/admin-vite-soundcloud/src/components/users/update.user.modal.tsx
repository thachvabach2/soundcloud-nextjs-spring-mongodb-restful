import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
import { useEffect } from "react";
import { IUsers } from "./users.table";

interface IPops {
    access_token: string;
    getData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    setIsLoading: (v: boolean) => void;
    dataUpdate: null | IUsers;
    setDataUpdate: (v: null | IUsers) => void;
}

const UpdateUserModal = (props: IPops) => {

    const { access_token, getData, isUpdateModalOpen, setIsUpdateModalOpen, setIsLoading, dataUpdate, setDataUpdate } = props;

    const [notificationApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue(dataUpdate);
        }
    }, [dataUpdate])

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
        form.resetFields();
    }

    const onFinish = async (values: any) => {
        if (dataUpdate) {
            const { name, email, age, gender, role, address } = values;
            const data = {
                _id: dataUpdate._id, name, email, age, gender, role, address
            }

            const res = await fetch('http://localhost:8080/api/v1/users',
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify(data)
                }
            )

            const d = await res.json();
            if (d.data) {
                setIsLoading(true);
                await getData();
                setIsLoading(false);
                notificationApi.success({
                    message: "Cập nhật user thành công",
                })
                handleCloseUpdateModal();
            } else {
                notificationApi.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(d.message),
                })
            }
        }
    }

    return (
        <>
            {contextHolder}

            <Modal
                title="Update a user"
                open={isUpdateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseUpdateModal()}
                maskClosable={false}
            >
                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Password"
                        name="password"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Age"
                        name="age"
                        rules={[{ required: true, message: 'Please input your age!' }]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        style={{ marginBottom: 5 }}
                        label="Gender"
                        name="gender"
                        rules={[{ required: true, message: 'Please input your gender!' }]}
                    >
                        <Select placeholder="Select a option" allowClear>
                            <Select.Option value="MALE">Male</Select.Option>
                            <Select.Option value="FEMALE">Female</Select.Option>
                            <Select.Option value="OTHER">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please input your role!' }]}
                    >
                        <Select placeholder="Select a option" allowClear>
                            <Select.Option value="ADMIN">Admin</Select.Option>
                            <Select.Option value="USER">User</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UpdateUserModal;