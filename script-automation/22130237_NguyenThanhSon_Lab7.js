"use strict";

const { Builder, By, until, Key } = require("selenium-webdriver");

// --- CẤU HÌNH ---
const SLEEP_TIME = 800; // Thời gian nghỉ giữa các bước (ms)
const URL_BASE = "http://localhost:8080"; // Base URL nếu cần thay đổi

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- HÀM HỖ TRỢ XỬ LÝ ALERT ---
async function handleAlert(driver) {
    try {
        await driver.wait(until.alertIsPresent(), 1000);
        const alert = await driver.switchTo().alert();
        console.log("⚠️ Alert detected:", await alert.getText());
        await alert.accept();
        await sleep(500);
        console.log("✅ Alert accepted");
    } catch (e) {
        // Không có alert thì bỏ qua
    }
}

// --- HÀM TRÍCH XUẤT LOCATOR TỪ JSON ---
function getLocator(target) {
    if (!target || !target.locators || target.locators.length === 0) return null;

    const locatorData = target.locators[0];
    const type = locatorData.type;
    const value = locatorData.value;

    if (type === "css") {
        return By.css(value);
    }

    // Xử lý trường hợp "dom" chứa lệnh document.evaluate (XPath)
    if (type === "dom" && value.includes("document.evaluate")) {
        // Trích xuất chuỗi XPath nằm giữa dấu ' '
        // VD: document.evaluate('//div[@id=\'abc\']', ...) -> Lấy: //div[@id='abc']
        const match = value.match(/evaluate\('((?:[^'\\]|\\.)+)'/);
        if (match && match[1]) {
            // Unescape dấu \' thành '
            const xpath = match[1].replace(/\\'/g, "'");
            return By.xpath(xpath);
        }
    }

    // Fallback cho các trường hợp XPath đơn giản
    if (value.startsWith("//") || value.startsWith("(")) {
        return By.xpath(value);
    }

    return By.css(value); // Mặc định thử CSS
}

// --- DỮ LIỆU JSON GỘP (CART + OM) ---
const fullScenario = {
    "info": "Full_Flow_JSON_CART_and_OM",
    "events": [
        // --- CART_DISPLAY 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a[2]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/login" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#email" }] } },
        { "type": "keystrokes", "textValue": "22130259@st.hcmuaf.edu.vn", "target": { "locators": [{ "type": "css", "value": "#email" }] } },
        { "type": "keystrokes", "textValue": "111", "target": { "locators": [{ "type": "css", "value": "#password" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#loginForm" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//input[@value=\\'Đăng nhập\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- CART_DISPLAY 2 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section1\\']/div[2]/a/div[2]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=26" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },

        // --- CART_UPDATE 1 (Tăng số lượng) ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        {
            "type": "click",
            "description": "Click button +",
            "target": {
                "locators": [{ "type": "dom", "value": "//a[contains(text(), '+')]" }]
            }
        },

        // --- CART_UPDATE 2 (Giảm số lượng lần 1) ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        {
            "type": "click",
            "description": "Click button - (lan 1)",
            "target": {
                "locators": [{ "type": "dom", "value": "//a[contains(text(), '-')]" }]
            }
        },

        // --- CART_UPDATE 3 (Giảm số lượng lần 2) ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        {
            "type": "click",
            "description": "Click button - (lan 2)",
            "target": {
                "locators": [{ "type": "dom", "value": "//a[contains(text(), '-')]" }]
            }
        },
        // --- CART_DELETE 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section1\\']/div[2]/a/div[2]/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=26" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'body_page\\']/div/div[2]/div/div[2]/a/div/div/i', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },

        // --- CART_DELETE 2 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=26" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/i', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "a:contains(\"Giải trí\")" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/products?category=Gi%E1%BA%A3i%20tr%C3%AD" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//img[@alt=\\'Tài khoản Nhaccuatui Vip 12 Tháng\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=15" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#add-to-cart-btn" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'body_page\\']/div/div[2]/div/div[2]/a/div/div/i', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- CART_COUPON 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "a:contains(\"Học tập\")" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/products?category=H%E1%BB%8Dc%20t%E1%BA%ADp" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//img[@alt=\\'Tài khoản Coursera Plus 6 Tháng\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=18" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/i', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#discount-input" }] } },
        { "type": "keystrokes", "textValue": "101", "target": { "locators": [{ "type": "css", "value": "#discount-input" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#apply-button" }] } },

        // --- CART_COUPON 2 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=26" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/i', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "#discount-input" }] } },
        { "type": "keystrokes", "textValue": "934", "target": { "locators": [{ "type": "css", "value": "#discount-input" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@id=\\'apply-button\\']/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- CART_COUPON 3 ---
        { "type": "navigate", "url": "http://localhost:8080/web/home" },
        { "type": "navigate", "url": "http://localhost:8080/web/products?category=Gi%E1%BA%A3i%20tr%C3%AD" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//img[@alt=\\'Tài khoản Nhaccuatui Vip 12 Tháng\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/ProductDetail?id=15" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//a[@id=\\'add-to-cart-btn\\']/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//div[@id=\\'section_normal_1\\']/div/div[2]/div[3]/a/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/Cart" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@id=\\'apply-button\\']/span', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM START ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },

        // --- OM SEARCH 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"orderID\"]" }] } },
        { "type": "keystrokes", "textValue": "37", "target": { "locators": [{ "type": "css", "value": "[name=\"orderID\"]" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 2 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"productName\"]" }] } },
        { "type": "keystrokes", "textValue": "Tài khoản Google Drive Vĩnh viễn", "target": { "locators": [{ "type": "css", "value": "[name=\"productName\"]" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 3 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"orderID\"]" }] } },
        { "type": "keystrokes", "textValue": "999999", "target": { "locators": [{ "type": "css", "value": "[name=\"orderID\"]" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 4 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"status\"]" }] } },
        {
            "type": "javascript",
            "javaScript": "let x = document.querySelector('[name=\"status\"]'); for (i = 0; i < x.options.length; i++) { if (x.options[i].text === \"Đã thanh toán\") { x.options.selectedIndex = i; } }"
        },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 5 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"status\"]" }] } },
        {
            "type": "javascript",
            "javaScript": "let x = document.querySelector('[name=\"status\"]'); for (i = 0; i < x.options.length; i++) { if (x.options[i].text === \"Chưa thanh toán\") { x.options.selectedIndex = i; } }"
        },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 6 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"status\"]" }] } },
        {
            "type": "javascript",
            "javaScript": "let x = document.querySelector('[name=\"status\"]'); for (i = 0; i < x.options.length; i++) { if (x.options[i].text === \"Chờ xử lý\") { x.options.selectedIndex = i; } }"
        },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM SEARCH 7 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('(.//*[normalize-space(text()) and normalize-space(.)=\\'Tìm kiếm\\'])[2]/following::button[1]', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM PROCESS 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@onclick=\\'toggleEditForm()\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "[name=\"productName\"]" }] } },
        { "type": "keystrokes", "textValue": "Tài khoản Nhaccuatui Vip 12 Tháng", "target": { "locators": [{ "type": "css", "value": "[name=\"productName\"]" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//button[@type=\\'submit\\']', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//tbody[@id=\\'bankTable\\']/tr/td[7]/form/button', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },

        // --- OM PROCESS 2 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "dom", "value": "document.evaluate('//tbody[@id=\\'bankTable\\']/tr[10]/td[7]/form/button', document, null, XPathResult.ANY_TYPE, null).iterateNext()" }] } },
        { "type": "navigate", "url": "http://localhost:8080/web/sendKey?oid=26" },

        // --- OM DELETE 1 ---
        { "type": "navigate", "url": "http://localhost:8080/web/orderManagement" },
        { "type": "click", "target": { "locators": [{ "type": "css", "value": "path" }] } }
    ]
};

// --- HÀM MAIN THỰC THI ---
(async () => {
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        console.log("🚀 Starting Automation for Full CART & OM Scenario...");
        let stepCount = 0;

        // Lặp qua từng event trong mảng events
        for (const event of fullScenario.events) {
            stepCount++;
            console.log(`\n🔹 Step ${stepCount}: ${event.type} | ${event.description || ''}`);

            try {
                // 1. NAVIGATE
                if (event.type === "navigate") {
                    console.log(`   🌐 Navigating to: ${event.url}`);
                    await driver.get(event.url);
                    await sleep(SLEEP_TIME);
                }

                // 2. CLICK
                else if (event.type === "click") {
                    const locator = getLocator(event.target);
                    if (locator) {
                        console.log("   🖱️ Clicking element...");
                        const element = await driver.wait(until.elementLocated(locator), 5000);
                        await driver.wait(until.elementIsVisible(element), 5000);
                        await element.click();
                        await sleep(SLEEP_TIME);
                    } else {
                        console.log("   ❌ No locator found for click event.");
                    }
                }

                // 3. KEYSTROKES (Nhập liệu)
                else if (event.type === "keystrokes") {
                    const locator = getLocator(event.target);
                    if (locator) {
                        console.log(`   ⌨️ Typing: "${event.textValue}"`);
                        const element = await driver.wait(until.elementLocated(locator), 5000);
                        await element.clear(); // Xóa nội dung cũ trước khi nhập
                        await element.sendKeys(event.textValue);

                        // Nếu cần blur (mô phỏng click ra ngoài)
                        if (event.simulateBlurEvent) {
                            await element.sendKeys(Key.TAB);
                        }
                        await sleep(SLEEP_TIME);
                    }
                }

                // 4. JAVASCRIPT
                else if (event.type === "javascript") {
                    console.log("   📜 Executing JavaScript...");
                    await driver.executeScript(event.javaScript);
                    await sleep(SLEEP_TIME);
                }

                // Xử lý Alert sau mỗi hành động (nếu có)
                await handleAlert(driver);

            } catch (stepError) {
                console.error(`   ❌ Failed at step ${stepCount}:`, stepError.message);
                // Nếu muốn dừng ngay khi lỗi thì bỏ comment dòng dưới:
                // throw stepError;
            }
        }

        console.log("\n🎉 Automation COMPLETED successfully!");

    } catch (err) {
        console.error("\n❌ Critical Error:", err);
    } finally {
        // Uncomment dòng dưới nếu muốn đóng trình duyệt sau khi chạy xong
        // await driver.quit();
    }
})();