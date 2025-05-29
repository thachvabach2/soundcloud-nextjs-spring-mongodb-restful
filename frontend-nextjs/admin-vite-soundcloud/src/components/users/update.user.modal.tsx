import { Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (dataUpdate) {
            setName(dataUpdate?.name);
            setEmail(dataUpdate?.email);
            setPassword(dataUpdate?.password);
            setAge(dataUpdate?.age);
            setGender(dataUpdate?.gender);
            setAddress(dataUpdate?.address);
            setRole(dataUpdate?.role);
        }
    }, [dataUpdate])

    const handleOk = async () => {
        if (dataUpdate) {
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
                handleCloseCreateModal();
            } else {
                notificationApi.error({
                    message: "Có lỗi xảy ra",
                    description: JSON.stringify(d.message),
                })
            }
        }
    };

    const handleCloseCreateModal = () => {
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
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
                title="Update a user"
                open={isUpdateModalOpen}
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
                        disabled
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

export default UpdateUserModal;