
let devices = [
    {
        id: "DEV_001",
        name: "Điều hòa",
        room: "Phòng khách",
        powerWatts: 1500,
        isActive: true
    },
    {
        id: "DEV_002",
        name: "Đèn ngủ",
        room: "Phòng ngủ",
        powerWatts: 10,
        isActive: true
    }
];

const validateDevice = (newDev) => {
    if (!newDev.name || !newDev.room) {
        return false;
    }

    if (newDev.powerWatts <= 0 ||
        typeof newDev.powerWatts !== "number") {
        return false;
    }

    return true;
};

const createDevice = (list, newDev) => {
    if (!validateDevice(newDev)) {
        console.log("Dữ liệu thiết bị không hợp lệ!");
        return false;
    }

    let maxId = 0;

    for (let i = 0; i < list.length; i++) {
        let numberId = Number(list[i].id.replace("DEV_", ""));

        if (numberId > maxId) {
            maxId = numberId;
        }
    }

    let id = "DEV_" + String(maxId + 1).padStart(3, "0");

    let device = {
        id: id,
        name: newDev.name,
        room: newDev.room,
        powerWatts: newDev.powerWatts,
        isActive: newDev.isActive === undefined
            ? true
            : newDev.isActive
    };

    list.push(device);

    console.log("Đã thêm thiết bị:", id);
    return true;
};

const readDevicesByRoom = (list, roomName) => {
    let result = [];

    for (let i = 0; i < list.length; i++) {
        if (list[i].room === roomName) {
            result.push(list[i]);
        }
    }

    return result;
};

const updateDevice = (list, id, updateData) => {
    let targetDevice = null;

    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            targetDevice = list[i];
            break;
        }
    }

    if (targetDevice === null) {
        console.log("Không tìm thấy thiết bị:", id);
        return false;
    }

    if (updateData.name !== undefined) {
        if (updateData.name === "") {
            console.log("Tên thiết bị không được để trống!");
            return false;
        }
        targetDevice.name = updateData.name;
    }

    if (updateData.room !== undefined) {
        if (updateData.room === "") {
            console.log("Tên phòng không được để trống!");
            return false;
        }
        targetDevice.room = updateData.room;
    }

    if (updateData.powerWatts !== undefined) {
        if (typeof updateData.powerWatts !== "number" ||
            updateData.powerWatts <= 0) {
            console.log("Công suất phải lớn hơn 0!");
            return false;
        }
        targetDevice.powerWatts = updateData.powerWatts;
    }

    if (updateData.isActive !== undefined) {
        if (typeof updateData.isActive !== "boolean") {
            console.log("Trạng thái phải là true hoặc false!");
            return false;
        }
        targetDevice.isActive = updateData.isActive;
    }

    console.log("Đã cập nhật thiết bị:", id);
    return true;
};

const deleteDevice = (list, id) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            list.splice(i, 1);
            console.log("Đã xóa thiết bị:", id);
            return true;
        }
    }

    console.log("Không tìm thấy thiết bị:", id);
    return false;
};
