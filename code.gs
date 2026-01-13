
/**
 * 薩諾瓦義式廚房 - SANOVA Backend (Ver 1.00)
 * 試算表分頁名稱: "常見問題", "菜單", "訂位資訊", "POS數據", "會員資料", "活動優惠"
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('薩諾瓦義式廚房')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 獲取所有初始資料，若分頁不存在則初始化
function getAppData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  checkAndInitSheets(ss);
  
  return {
    menu: getSheetData(ss.getSheetByName("菜單")),
    faqs: getSheetData(ss.getSheetByName("常見問題")),
    promotions: getSheetData(ss.getSheetByName("活動優惠")),
    members: getSheetData(ss.getSheetByName("會員資料")),
    pos: getSheetData(ss.getSheetByName("POS數據")),
    reservations: getSheetData(ss.getSheetByName("訂位資訊"))
  };
}

function checkAndInitSheets(ss) {
  const sheets = ["常見問題", "菜單", "訂位資訊", "POS數據", "會員資料", "活動優惠"];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      const sheet = ss.insertSheet(name);
      if (name === "菜單") initMenuData(sheet);
      if (name === "常見問題") initFaqData(sheet);
      if (name === "訂位資訊") sheet.appendRow(["ID", "日期", "時間", "人數", "姓名", "電話", "預點", "狀態", "總額", "時間戳", "桌號"]);
    }
  });
}

function initFaqData(sheet) {
  sheet.appendRow(["問題", "回答"]);
  sheet.appendRow(["請問有提供素食嗎？", "有的，我們提供多款蛋奶素商品，菜單上標註 (蛋奶素) 即是。"]);
  sheet.appendRow(["每週一有營業嗎？", "薩諾瓦每週一公休，其餘時間正常營業。"]);
}

function initMenuData(sheet) {
  const headers = ["id", "name", "description", "price", "category", "image", "isPopular"];
  sheet.appendRow(headers);
  
  const menuList = [
    // PIZZA 7吋
    ["p1", "蕃茄田園時蔬披薩 (蛋奶素)", "清爽時蔬搭配特製蕃茄醬汁", 170, "PIZZA", "", ""],
    ["p2", "南瓜田園時蔬披薩 (蛋奶素)", "香甜南瓜泥底座", 160, "PIZZA", "", ""],
    ["p3", "義式肉醬野菇披薩 (含牛肉)", "濃郁肉醬與精選野菇", 160, "PIZZA", "", ""],
    ["p4", "燻雞綜合菌菇披薩", "煙燻雞肉與鮮美菌菇", 160, "PIZZA", "", ""],
    ["p5", "(辣)墨西哥辣味香腸披薩", "微辣夠味", 180, "PIZZA", "", ""],
    ["p6", "夏威夷蝦仁披薩", "經典組合", 200, "PIZZA", "", ""],
    ["p7", "煙燻鴨胸肉披薩", "質感煙燻鴨胸", 200, "PIZZA", "", ""],
    ["p8", "B.B.Q海鮮披薩", "特製燒烤醬", 200, "PIZZA", "", ""],
    ["p9", "法式醬海鮮披薩", "香濃法式奶香", 200, "PIZZA", "", ""],
    ["p10", "黑松露野菇披薩", "頂級奢華享受", 240, "PIZZA", "", "TRUE"],
    // 白醬
    ["w1", "奶油培根義大利麵", "經典濃郁白醬", 170, "白醬", "", ""],
    ["w2", "奶油時蔬義大利麵 (蛋奶素)", "健康輕食首選", 170, "白醬", "", ""],
    ["w3", "西西里奶油嫩雞義大利麵", "香嫩雞肉", 170, "白醬", "", ""],
    ["w4", "(辣)墨西哥辣味嫩雞義大利麵", "勁辣白醬", 180, "白醬", "", ""],
    ["w5", "黃芥末鄉村嫩雞義大利麵", "獨特黃芥末風味", 180, "白醬", "", ""],
    ["w6", "(辣)奶油香辣燻鴨義大利麵", "中西合併", 190, "白醬", "", ""],
    ["w7", "奶油蛤蜊義大利麵", "海味十足", 220, "白醬", "", ""],
    ["w8", "奶油海鮮總匯義大利麵", "澎湃海鮮", 220, "白醬", "", ""],
    ["w9", "(辣)奶油辣味花枝墨魚麵", "Q彈花枝與黑麵", 260, "白醬", "", ""],
    ["w10", "奶油香燻鮭魚義大利麵", "精選燻鮭魚", 270, "白醬", "", ""],
    ["w11", "奶油香烤雞腿排義大利麵", "重量級雞腿排", 280, "白醬", "", "TRUE"],
    // 茄汁
    ["t1", "波隆那肉醬義大利麵(含牛肉)", "職人慢燉肉醬", 170, "茄汁", "", ""],
    ["t2", "(辣)茄汁辣味培根義大利麵", "培根焦香搭配辣度", 170, "茄汁", "", ""],
    ["t3", "茄汁鄉村嫩雞義大利麵", "清爽紅醬", 170, "茄汁", "", ""],
    ["t4", "(辣)茄汁辣味德式香腸義大利麵", "彈牙香腸", 190, "茄汁", "", ""],
    ["t5", "(辣)茄汁辣味雪花牛義大利麵", "精選雪花牛", 220, "茄汁", "", ""],
    ["t6", "粉紅漁沃海鮮義大利麵", "奶香與茄汁的完美融合", 220, "茄汁", "", ""],
    ["t7", "茄汁香烤雞腿排義大利麵", "外酥內嫩", 280, "茄汁", "", ""],
    // 青醬
    ["g1", "羅勒野菇義大利麵", "手作青醬香氣", 180, "青醬", "", ""],
    ["g2", "羅勒鄉村嫩雞義大利麵", "人氣熱銷", 190, "青醬", "", ""],
    ["g3", "羅勒雪花牛義大利麵", "層次豐富", 220, "青醬", "", ""],
    ["g4", "羅勒唐揚炸雞義大利麵", "酥脆炸雞", 230, "青醬", "", ""],
    ["g5", "羅勒多利魚義大利麵", "魚肉細緻", 240, "青醬", "", ""],
    ["g6", "羅勒海鮮總匯義大利麵", "海鮮拼盤", 240, "青醬", "", ""],
    ["g7", "羅勒香燻鮭魚義大利麵", "精選燻鮭", 270, "青醬", "", ""],
    ["g8", "(辣)羅勒辣味鮮蝦墨魚麵", "鮮蝦與辛辣青醬", 280, "青醬", "", "TRUE"],
    // 義式燉飯
    ["r1", "波隆那肉醬燉飯", "米粒吸收精華", 160, "義式燉飯", "", ""],
    ["r2", "奶油燻雞燉飯", "奶香滑順", 160, "義式燉飯", "", ""],
    ["r3", "奶油培根燉飯", "鹹香培根", 170, "義式燉飯", "", ""],
    ["r4", "咖哩鄉村嫩雞燉飯", "風味獨特", 170, "義式燉飯", "", ""],
    ["r5", "南瓜時蔬燉飯 (蛋奶素)", "蔬食推薦", 170, "義式燉飯", "", ""],
    ["r6", "南瓜德式香腸燉飯", "甜味平衡", 190, "義式燉飯", "", ""],
    ["r7", "墨魚汁花枝燉飯", "黑金鮮甜", 230, "義式燉飯", "", "TRUE"],
    ["r8", "夏季黑松露野菇燉飯", "當季鮮選", 290, "義式燉飯", "", "TRUE"],
    // 單點
    ["s1", "麥克雞塊", "酥脆點心", 80, "單點", "", ""],
    ["s2", "美式脆薯", "唰嘴首選", 90, "單點", "", ""],
    ["s3", "紐澳良香辣烤雞翅", "勁辣多汁", 140, "單點", "", ""],
    ["s4", "酥皮濃湯", "香脆酥皮", 100, "單點", "", "TRUE"]
  ];
  
  menuList.forEach(item => sheet.appendRow(item));
}

function submitReservation(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("訂位資訊");
  
  const dateObj = new Date(data.date);
  if (dateObj.getDay() === 1) throw new Error("每週一為餐廳公休日，請選擇其他日期。");
  
  const id = "SA-" + Math.floor(Math.random() * 9000 + 1000);
  const timestamp = new Date();
  const assignedTable = allocateTable(data.guests);
  
  sheet.appendRow([
    id, data.date, data.time, data.guests, data.name, data.phone,
    JSON.stringify(data.preOrders), '待確認', data.totalAmount, timestamp, assignedTable
  ]);
  
  return { success: true, id: id, table: assignedTable };
}

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

function allocateTable(guests) {
  let p = guests >= 5 ? "C" : (guests >= 3 ? "B" : "A");
  return `${p}${Math.floor(Math.random() * 10) + 1}`;
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
