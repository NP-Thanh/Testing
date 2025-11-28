"use strict";
const { chromium } = require("playwright");

const testCases =
    [
        {
            "id": "PRD_MGT_Display_1",
            "description": "Đăng nhập và chuyển đến trang Quản lý Sản phẩm (PM)",
            "module": "PRD_MGT",
            "steps": [
                { "action": "goto", "target": "http://localhost:8080/web_th_war/home" },
                { "action": "click", "target": ".bt_user .text" },
                { "action": "fill", "target": "#email", "value": "xhoang345@gmail.com" },
                { "action": "press", "target": "#email", "key": "Tab" },
                { "action": "fill", "target": "#password", "value": "123456" },
                { "action": "press", "target": "#password", "key": "Enter" },
                { "action": "goto", "target": "http://localhost:8080/web_th_war/ProductManagement" }
            ]
        },
        {
            "id": "PRD_MGT_Search_1",
            "description": "Tìm kiếm sản phẩm theo ID hợp lệ ('16')",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "[name='productID']" },
                { "action": "fill", "target": "[name='productID']", "value": "16" },
                { "action": "click", "target": "#findProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Search_2",
            "description": "Tìm kiếm sản phẩm theo tên hợp lệ ('Microsoft')",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "[name='productName']" },
                { "action": "fill", "target": "[name='productName']", "value": "Microsoft" },
                { "action": "click", "target": "#findProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Search_3",
            "description": "Tìm kiếm sản phẩm theo ID không tồn tại ('150')",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "[name='productID']" },
                { "action": "fill", "target": "[name='productID']", "value": "150" },
                { "action": "click", "target": "#findProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Search_4",
            "description": "Tìm kiếm sản phẩm theo trạng thái 'Còn hàng' và 'Hết hàng'",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "select[name='status']" },
                { "action": "selectOption", "target": "select[name='status']", "value": "Còn hàng" },
                { "action": "click", "target": "#findProductForm > button" },
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "select[name='status']" },
                { "action": "selectOption", "target": "select[name='status']", "value": "Hết hàng" },
                { "action": "click", "target": "#findProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Add_1",
            "description": "Thêm sản phẩm mới hợp lệ",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#addProductName" },
                { "action": "fill", "target": "#addProductName", "value": "Spotify" },
                { "action": "fill", "target": "#addProductPrice", "value": "100000" },
                { "action": "fill", "target": "#addProductDuration", "value": "2 tháng" },
                { "action": "fill", "target": "#addProductImg", "value": "C://anh" },
                { "action": "click", "target": "#addProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Add_2",
            "description": "Thêm sản phẩm mới thiếu giá",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#addProductName" },
                { "action": "fill", "target": "#addProductName", "value": "Spotify" },
                { "action": "fill", "target": "#addProductDuration", "value": "12 tháng" },
                { "action": "fill", "target": "#addProductImg", "value": "C://anh" },
                { "action": "click", "target": "#addProductForm > button" }
            ]
        },
        {
            "id": "PRD_MGT_Update_1",
            "description": "Cập nhật giá sản phẩm",
            "module": "PRD_MGT",
            "steps": [
                { "action": "waitForSelector", "target": "[data-name='Vieon gói all access 6 tháng'] [onclick='editProduct(this)']" },
                { "action": "click", "target": "[data-name='Vieon gói all access 6 tháng'] [onclick='editProduct(this)']" },
                { "action": "fill", "target": "#editProductPrice", "value": "100000.0" },
                { "action": "press", "target": "#editProductPrice", "key": "Enter" }
            ]
        },
        {
            "id": "PRD_MGT_Delete_1",
            "description": "Xóa sản phẩm vừa thêm",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#addProductName" },
                { "action": "fill", "target": "#addProductName", "value": "Spotify_to_delete" },
                { "action": "fill", "target": "#addProductPrice", "value": "1000000" },
                { "action": "fill", "target": "#addProductDuration", "value": "12 tháng" },
                { "action": "fill", "target": "#addProductImg", "value": "http://localhost:8080/web/img/sample.jpg" },
                { "action": "click", "target": "#addProductForm > button" },
                { "action": "waitForSelector", "target": "[data-name='Spotify_to_delete'] [fill='currentColor']" },
                { "action": "click", "target": "[data-name='Spotify_to_delete'] [fill='currentColor']" }
            ]
        },
        {
            "id": "PRD_MGT_AddKey_1",
            "description": "Thêm Key vào sản phẩm 'Galaxy Play'",
            "module": "PRD_MGT",
            "steps": [
                { "action": "waitForSelector", "target": "[data-name='Galaxy Play Gói Cao Cấp'] [onclick='loadProductKeyInfo(this)']" },
                { "action": "click", "target": "[data-name='Galaxy Play Gói Cao Cấp'] [onclick='loadProductKeyInfo(this)']" },
                { "action": "fill", "target": "#keys", "value": "KHFS-391J-GLXY" },
                { "action": "click", "target": "[id='addKey'] [type='submit']" }
            ]
        },
        {
            "id": "PRD_MGT_Search_5",
            "description": "Tìm kiếm sản phẩm theo ID không hợp lệ ('@')",
            "module": "PRD_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "[name='productID']" },
                { "action": "fill", "target": "[name='productID']", "value": "@" },
                { "action": "click", "target": "#findProductForm > button" }
            ]
        },
        {
            "id": "KEY_MGT_Display_1",
            "description": "Đăng nhập và chuyển đến trang Quản lý Key (KM)",
            "module": "KEY_MGT",
            "steps": [
                { "action": "goto", "target": "http://localhost:8080/web_th_war/home" },
                { "action": "click", "target": ".bt_user .text" },
                { "action": "fill", "target": "#email", "value": "xhoang345@gmail.com" },
                { "action": "fill", "target": "#password", "value": "123456" },
                { "action": "press", "target": "#password", "key": "Enter" },
                { "action": "goto", "target": "http://localhost:8080/web_th_war/KeyManagement" }
            ]
        },
        {
            "id": "KEY_MGT_Search_1",
            "description": "Tìm kiếm Key theo ID hợp lệ ('66')",
            "module": "KEY_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "#searchKeyID" },
                { "action": "fill", "target": "#searchKeyID", "value": "66" },
                { "action": "click", "target": "#searchBtn" },
                { "action": "fill", "target": "#searchKeyID", "value": "" },
                { "action": "click", "target": ".btn-find" }
            ]
        },
        {
            "id": "KEY_MGT_Search_2",
            "description": "Tìm kiếm Key ID đã dùng ('59')",
            "module": "KEY_MGT",
            "steps": [
                { "action": "click", "target": ".btn-find" },
                { "action": "waitForSelector", "target": "#searchKeyID" },
                { "action": "fill", "target": "#searchKeyID", "value": "59" },
                { "action": "click", "target": "#searchBtn" },
                { "action": "click", "target": ".btn-find" }
            ]
        },
        {
            "id": "KEY_MGT_Add_1",
            "description": "Thêm Key mới hợp lệ",
            "module": "KEY_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#pid" },
                { "action": "fill", "target": "#pid", "value": "69" },
                { "action": "fill", "target": "#addKeyName", "value": "KHFS-391J-SF45" },
                { "action": "click", "target": "#saveBtn" },
                { "action": "click", "target": ".btn-add" }
            ]
        },
        {
            "id": "KEY_MGT_Add_2",
            "description": "Thêm Key thiếu tên",
            "module": "KEY_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#pid" },
                { "action": "fill", "target": "#pid", "value": "69" },
                { "action": "click", "target": "#saveBtn" },
                { "action": "click", "target": ".btn-add" }
            ]
        },
        {
            "id": "KEY_MGT_Add_3",
            "description": "Thêm Key PID không hợp lệ ('@')",
            "module": "KEY_MGT",
            "steps": [
                { "action": "click", "target": ".btn-add" },
                { "action": "waitForSelector", "target": "#pid" },
                { "action": "fill", "target": "#pid", "value": "@" },
                { "action": "click", "target": ".btn-add" }
            ]
        },
        {
            "id": "KEY_MGT_Update_1",
            "description": "Cập nhật tên Key đầu tiên",
            "module": "KEY_MGT",
            "steps": [
                { "action": "waitForSelector", "target": "[id='keyTable'] > :nth-child(1) .edit-btn" },
                { "action": "click", "target": "[id='keyTable'] > :nth-child(1) .edit-btn" },
                { "action": "fill", "target": "#editNameKey", "value": "KHFS-391J-SF56K" },
                { "action": "click", "target": "[id='editKeyDetails'] [type='submit']" }
            ]
        },
        {
            "id": "KEY_MGT_Delete_1",
            "description": "Xóa Key đầu tiên",
            "module": "KEY_MGT",
            "steps": [
                { "action": "waitForSelector", "target": "[id='keyTable'] > :nth-child(1) .delete-btn" },
                { "action": "click", "target": "[id='keyTable'] > :nth-child(1) .delete-btn" }
            ]
        }
    ]


async function sendSpecialCharacter(page, selector, key) {
    const el = await page.$(selector);
    await el.press(key);
}

async function runStep(page, step) {
    switch (step.action) {
        case "goto":
            return page.goto(step.target);
        case "click":
            await page.waitForSelector(step.target, { state: "visible" });
            return page.click(step.target);
        case "fill":
            await page.waitForSelector(step.target, { state: "visible" });
            return page.fill(step.target, step.value);
        case "press":
            await page.waitForSelector(step.target, { state: "visible" });
            return sendSpecialCharacter(page, step.target, step.key);
        case "selectOption":
            await page.waitForSelector(step.target, { state: "visible" });
            return page.selectOption(step.target, step.value);
        case "waitForSelector":
            return page.waitForSelector(step.target, { state: step.value || "visible" });
        default:
            console.log(`Unknown action: ${step.action}`);
    }
}

async function runTestCase(page, testCase) {
    try {
        for (const step of testCase.steps) {
            await runStep(page, step);
        }
        console.log(`PASS: ${testCase.id} | ${testCase.description}`);
    } catch (err) {
        console.log(`FAIL: ${testCase.id} | ${testCase.description}`);
        console.error(err);
    }
}

(async () => {
    // === Chạy ProductManagement ===
    const browserPM = await chromium.launch({ headless: false, slowMo: 500 });
    const contextPM = await browserPM.newContext();
    const pagePM = await contextPM.newPage();

    const pmTestCases = testCases.filter(tc => tc.module === "PRD_MGT");
    for (const tc of pmTestCases) {
        await runTestCase(pagePM, tc);
    }

    await browserPM.close();

    // === Chạy KeyManagement ===
    const browserKM = await chromium.launch({ headless: false, slowMo: 500 });
    const contextKM = await browserKM.newContext();
    const pageKM = await contextKM.newPage();

    const kmTestCases = testCases.filter(tc => tc.module === "KEY_MGT");
    for (const tc of kmTestCases) {
        await runTestCase(pageKM, tc);
    }

    await browserKM.close();
})();
