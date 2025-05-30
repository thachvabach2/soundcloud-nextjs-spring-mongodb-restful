import { Form, Input, InputNumber, Modal, notification, Select } from "antd";
interface IPops {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
    setIsLoading: (v: boolean) => void;
}

const CreateUserModal = (props: IPops) => {

    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen, setIsLoading } = props;

    const [notificationApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setIsLoading(true);

        const { name, email, password, age, gender, role, address } = values;
        const data = { name, email, password, age, gender, role, address };

        const res = await fetch('http://localhost:8080/api/v1/users',
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(data)
            }
        )

        const d = await res.json();
        if (d.data) {
            await getData();
            notificationApi.success({
                message: "Tạo mới user thành công",
            })
            handleCloseCreateModal();
            form.resetFields();
        } else {
            notificationApi.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(d.message),
            })
        }

        setIsLoading(false);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        form.resetFields();
    }

    return (
        <>
            {contextHolder}

            <Modal
                title="Add new user"
                open={isCreateModalOpen}
                onOk={() => form.submit()}
                onCancel={() => handleCloseCreateModal()}
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
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
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

export default CreateUserModal;