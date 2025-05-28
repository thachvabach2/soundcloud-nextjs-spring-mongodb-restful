import { Input, Modal, notification } from "antd";
import { useState } from "react";

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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    const handleOk = async () => {
        setIsLoading(true);
        const data = {
            name, email, password, age, gender, role, address
        }

        const res = await fetch('http://localhost:8080/api/v1/users',
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ ...data })
            }
        )

        const d = await res.json();
        if (d.data) {
            await getData();
            notificationApi.success({
                message: "Tạo mới user thành công",
            })
            handleCloseCreateModal();
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
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
    }

    return (
        <>
            {contextHolder}

            <Modal
                title="Add new user"
                open={isCreateModalOpen}
                onOk={handleOk}
                onCancel={() => handleCloseCreateModal()}
                maskClosable={false}
            >
                <div>
                    <label>Name: </label>
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                </div>
                <div>
                    <label>Email: </label>
                    <Input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                    <label>Password: </label>
                    <Input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div>
                    <label>Age: </label>
                    <Input
                        value={age}
                        onChange={(event) => setAge(event.target.value)} />
                </div>
                <div>
                    <label>Gender: </label>
                    <Input
                        value={gender}
                        onChange={(event) => setGender(event.target.value)} />
                </div>
                <div>
                    <label>Address: </label>
                    <Input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)} />
                </div>
                <div>
                    <label>Role: </label>
                    <Input
                        value={role}
                        onChange={(event) => setRole(event.target.value)} />
                </div>
            </Modal>
        </>
    )
}

export default CreateUserModal;