// ==========================================
// 1. HÀM KIỂM CHUẨN (VALIDATOR FUNCTION)
// ==========================================
const isValidDevice = (dev) => {
  if (!dev || typeof dev !== 'object') return false;
  const { name, room, power } = dev;
  
  // Kiểm tra tên thiết bị hợp lệ (chuỗi không rỗng)
  if (!name || typeof name !== 'string' || name.trim() === '') return false;
  
  // Kiểm tra tên phòng hợp lệ (chuỗi không rỗng)
  if (!room || typeof room !== 'string' || room.trim() === '') return false;
  
  // Kiểm tra công suất phải là số và lớn hơn 0
  if (typeof power !== 'number' || power <= 0 || isNaN(power)) return false;
  
  return true;
};

// Hàm phụ trợ tự sinh mã ID tăng dần (DEV_xxx)
const generateId = (list) => {
  if (!Array.isArray(list) || list.length === 0) return 'DEV_001';
  const maxNum = list.reduce((max, d) => {
    const num = parseInt(d.id.replace('DEV_', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `DEV_${String(maxNum + 1).padStart(3, '0')}`;
};

// ==========================================
// 2. CÁC HÀM CRUD CHÍNH (ARROW FUNCTIONS)
// ==========================================

/**
 * 1. createDevice: Thêm thiết bị mới
 */
const createDevice = (list, newDev) => {
  if (!isValidDevice(newDev)) {
    console.error('Thất bại: Dữ liệu thiết bị không hợp lệ (Tên/Phòng trống hoặc Công suất <= 0)!');
    return null;
  }

  const newId = generateId(list);
  const deviceToAdd = {
    id: newId,
    name: newDev.name.trim(),
    room: newDev.room.trim(),
    power: newDev.power,
    status: newDev.status ?? false // Mặc định tắt thiết bị nếu không truyền
  };

  list.push(deviceToAdd);
  console.log(` Đã thêm thiết bị mới thành công: [${newId}] ${deviceToAdd.name} tại phòng ${deviceToAdd.room}`);
  return deviceToAdd;
};

/**
 * 2. readDevicesByRoom: Lọc và trả về danh sách thiết bị theo phòng
 */
const readDevicesByRoom = (list, roomName) => {
  if (!Array.isArray(list)) return [];
  if (!roomName || typeof roomName !== 'string') {
    console.warn(' Cảnh báo: Tên phòng không hợp lệ khi lọc.');
    return [];
  }

  const result = list.filter(d => d.room.toLowerCase() === roomName.trim().toLowerCase());
  console.log(` Tìm thấy ${result.length} thiết bị trong phòng "${roomName}".`);
  return result;
};

/**
 * 3. updateDevice: Cập nhật thông tin/trạng thái an toàn (tránh lỗi Falsy)
 */
const updateDevice = (list, id, updateData) => {
  if (!Array.isArray(list)) return false;
  const index = list.findIndex(d => d.id === id);
  
  // Phòng vệ trường hợp ID không tồn tại
  if (index === -1) {
    console.warn(` Cảnh báo: Không tìm thấy thiết bị với mã ID "${id}" để cập nhật.`);
    return false;
  }

  if (!updateData || typeof updateData !== 'object') {
    console.error(' Thất bại: Dữ liệu cập nhật không hợp lệ.');
    return false;
  }

  // Lọc bỏ các thuộc tính undefined để tránh ghi đè sai lệch, 
  // đồng thời bảo vệ các giá trị Falsy hợp lệ (như status: false hoặc power: 0 nếu có logic đặc biệt)
  const safeUpdates = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );

  // Nếu có cập nhật công suất, kiểm tra lại tính hợp lệ
  if (safeUpdates.power !== undefined && (typeof safeUpdates.power !== 'number' || safeUpdates.power <= 0)) {
    console.error(' Thất bại: Công suất cập nhật phải lớn hơn 0.');
    return false;
  }

  list[index] = {
    ...list[index],
    ...safeUpdates
  };

  console.log(` Đã cập nhật thành công thiết bị ID: ${id}`);
  return list[index];
};

/**
 * 4. deleteDevice: Gỡ bỏ thiết bị khỏi danh sách theo mã ID
 */
const deleteDevice = (list, id) => {
  if (!Array.isArray(list)) return false;
  const index = list.findIndex(d => d.id === id);

  // Phòng vệ trường hợp ID không tồn tại
  if (index === -1) {
    console.warn(` Cảnh báo: Không thể xóa. Không tìm thấy thiết bị với mã ID "${id}".`);
    return false;
  }

  const removedDevice = list.splice(index, 1)[0];
  console.log(`🗑️ Đã gỡ bỏ thiết bị: [${removedDevice.id}] ${removedDevice.name} khỏi hệ thống.`);
  return true;
};


// ==========================================
// 3. KIỂM THỬ HỆ THỐNG (CONSOLE TEST)
// ==========================================
console.log('--- BẮT ĐẦU KIỂM THỬ HỆ THỐNG SMART HOME ---');
const smartHomeDevices = [];

// Kiểm thử 1: Thêm thiết bị hợp lệ & không hợp lệ
console.log('\n[TEST 1: Thêm thiết bị]');
createDevice(smartHomeDevices, { name: 'Đèn LED phòng khách', room: 'Phòng Khách', power: 15, status: true });
createDevice(smartHomeDevices, { name: 'Điều hòa nhiệt độ', room: 'Phòng Ngủ', power: 1200 });
createDevice(smartHomeDevices, { name: 'Quạt treo tường', room: 'Phòng Khách', power: 45 });
createDevice(smartHomeDevices, { name: 'Thiết bị lỗi', room: '', power: -5 }); // Test validator từ chối

// Kiểm thử 2: Đọc danh sách theo phòng
console.log('\n[TEST 2: Lọc thiết bị theo phòng]');
const livingRoomDevices = readDevicesByRoom(smartHomeDevices, 'Phòng Khách');
console.log('Danh sách phòng khách:', livingRoomDevices);

// Kiểm thử 3: Cập nhật thiết bị (Kiểm tra phòng vệ ID và chống lỗi Falsy)
console.log('\n[TEST 3: Cập nhật thiết bị]');
updateDevice(smartHomeDevices, 'DEV_001', { power: 20, status: false }); // Cập nhật hợp lệ
updateDevice(smartHomeDevices, 'DEV_999', { power: 100 });                // Test ID không tồn tại

// Kiểm thử 4: Xóa thiết bị
console.log('\n[TEST 4: Xóa thiết bị]');
deleteDevice(smartHomeDevices, 'DEV_002'); // Xóa thành công
deleteDevice(smartHomeDevices, 'DEV_888'); // Test ID không tồn tại khi xóa

// Kiểm tra trạng thái cuối cùng của danh sách
console.log('\n[Trạng thái cuối cùng của hệ thống Smart Home]:');
console.log(smartHomeDevices);
console.log('--- KẾT THÚC KIỂM THỬ ---');
