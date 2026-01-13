
/**
 * Bella Vita Italian Kitchen - GAS Backend (繁體中文版)
 * 試算表分頁名稱: "常見問題", "菜單", "訂位資訊", "POS數據", "會員資料", "活動優惠", "顧客評論"
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Bella Vita Italian Kitchen')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 獲取所有初始資料
function getAppData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    menu: getSheetData(ss.getSheetByName("菜單")),
    faqs: getSheetData(ss.getSheetByName("常見問題")),
    promotions: getSheetData(ss.getSheetByName("活動優惠")),
    members: getSheetData(ss.getSheetByName("會員資料")),
    pos: getSheetData(ss.getSheetByName("POS數據")),
    reservations: getSheetData(ss.getSheetByName("訂位資訊")) // 管理員需要
  };
}

// 智能分配桌位
function allocateTable(guests) {
  let tablePrefix = "A"; // 1-2人
  if (guests >= 3 && guests <= 4) tablePrefix = "B"; // 3-4人
  if (guests >= 5) tablePrefix = "C"; // 5人以上
  
  const randomNum = Math.floor(Math.random() * 10) + 1;
  return `${tablePrefix}${randomNum < 10 ? '0' : ''}${randomNum}`;
}

// 提交訂位
function submitReservation(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("訂位資訊");
  
  const dateObj = new Date(data.date);
  if (dateObj.getDay() === 1) {
    throw new Error("每週一為餐廳公休日，請選擇其他日期。");
  }
  
  const id = "BV-" + Math.floor(Math.random() * 9000 + 1000);
  const timestamp = new Date();
  const assignedTable = allocateTable(data.guests);
  
  sheet.appendRow([
    id,
    data.date,
    data.time,
    data.guests,
    data.name,
    data.phone,
    JSON.stringify(data.preOrders),
    '待確認',
    data.totalAmount,
    timestamp,
    assignedTable // 智能分配桌位
  ]);
  
  return { success: true, id: id, table: assignedTable };
}

// 更新訂位狀態 (管理員功能)
function updateReservationStatus(resId, newStatus) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("訂位資訊");
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === resId) {
      sheet.getRange(i + 1, 8).setValue(newStatus);
      return { success: true };
    }
  }
  return { success: false, message: "找不到該訂位編號" };
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => { obj[header] = row[i]; });
    return obj;
  });
}
