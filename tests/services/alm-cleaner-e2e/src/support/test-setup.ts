/**
 * @fileoverview Setup môi trường test cho E2E tests của ALM Cleaner Service
 */

jest.setTimeout(20000); // Tăng thời gian timeout mặc định lên 20 giây

// Tải các biến môi trường cần thiết từ .env file (nếu có)
// Điều này giả định bạn đang sử dụng dotenv hoặc một thư viện tương tự
// require('dotenv').config();

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async function() {} 