/**
 * SANOVA 薩諾瓦義式廚房 - GAS Backend
 * 試算表連結: https://docs.google.com/spreadsheets/d/1E0QcwroFHAZ0zr8oWBCytxE0iucRkqxHveNBvMsOYn8/edit
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('薩諾瓦義式廚房')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 獲取所有初始資料
function getAppData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    menu: getSheetData(ss.getSheetByName("菜單")),
    faqs: getSheetData(ss.getSheetByName("常見問題")),
    reservations: getSheetData(ss.getSheetByName("訂位資訊")),
    pos: getSheetData(ss.getSheetByName("POS數據"))
  };
}

// 提交訂位
function submitReservation(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("訂位資訊");
  const id = "SA-" + Math.floor(Math.random() * 9000 + 1000);
  const timestamp = new Date();
  
  // 分配桌號邏輯
  const table = (data.guests >= 5 ? "C" : (data.guests >= 3 ? "B" : "A")) + (Math.floor(Math.random() * 10) + 1);
  
  sheet.appendRow([
    id, 
    data.date, 
    data.time, 
    data.guests, 
    data.name, 
    data.phone,
    JSON.stringify(data.preOrders || []), 
    '待確認', 
    data.totalAmount || 0, 
    timestamp, 
    table
  ]);
  
  return { success: true, id: id, table: table };
}

// POS 狀態更新
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
  return { success: false };
}

function getSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}