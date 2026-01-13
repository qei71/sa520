
/**
 * 處理與 Google Apps Script 的通訊
 * 在開發環境中使用 Mock 資料，在 GAS 環境中調用 google.script.run
 */

// Fix: Add a global declaration for 'google' to satisfy TypeScript when calling GAS client-side APIs
declare const google: any;

export const fetchAppData = (): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler((err) => {
          console.error("GAS Error:", err);
          resolve(null);
        })
        .getAppData();
    } else {
      // 開發環境 Mock
      setTimeout(() => resolve(null), 500);
    }
  });
};

export const submitReservationToSheet = (reservationData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .submitReservation(reservationData);
    } else {
      // 開發環境 Mock
      console.log("Mock Submit:", reservationData);
      setTimeout(() => resolve({ success: true, id: 'MOCK-123' }), 1000);
    }
  });
};

export const updateStatusOnSheet = (resId: string, newStatus: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        .updateReservationStatus(resId, newStatus);
    } else {
      // 開發環境 Mock
      console.log(`Mock Update Status: ${resId} -> ${newStatus}`);
      setTimeout(() => resolve({ success: true }), 800);
    }
  });
};
