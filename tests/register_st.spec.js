const { test, expect } = require('@playwright/test');
const path = require('path'); // นำเข้าโมดูล path

test.setTimeout(6000000);

let edu, degree

// วันที่เริ่มต้น (ตั้งค่าเป็นวันที่ที่คุณต้องการเริ่มนับ)
const startDate = '2024-09-01'; // รูปแบบ YYYY-MM-DD
const startingId = '100000000000'; // เลขบัตรประชาชนเริ่มต้น

// คำนวณจำนวนวันที่ผ่านไปตั้งแต่วันที่เริ่มต้น
const daysPassed = getDaysPassed(startDate);

// สร้างเลขบัตรประชาชนไม่ซ้ำกันจำนวน 200 หมายเลข
const uniqueIds = generateUniqueIds(startingId, (daysPassed + (399 * (daysPassed - 1))), 400);

//  แสดงหนมายเลขออกมาทาง  terminal
// console.log(`Today's Unique IDs: ${uniqueIds.join(', ')}`);

test('1. สมัครเรียน ปีการศึกษา 2568', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // ทดสอบสร้างบัญชีทุกสาขา
    edu = 'input[type="radio"][id="edu1"][value="1"]'
    degree = 'input[type="radio"][id="degree1"][value="1"]'

    await programcheck(page, uniqueIds[1], edu, degree, '2210111'); // พืชศาสตร์ (ม.6)
});

test('2. สมัครเรียน ภาคเรียนที่ 2 ปีการศึกษา 2567', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // ทดสอบสร้างบัญชีทุกสาขา
    edu = 'input[type="radio"][id="edu1"][value="1"]'
    degree = 'input[type="radio"][id="degree1"][value="1"]'

    await programcheck(page, uniqueIds[200], edu, degree, '2210111'); // พืชศาสตร์ (ม.6)

});

test('3.1 ตรวจสอบลิ้งค์หน้าแรก', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php'); // เปลี่ยนเป็น URL ของคุณ

    // หาลิงก์ "หน้าแรก"
    const homeLink = await page.locator('a#nav-home');
    // ตรวจสอบว่าลิงก์มีอยู่
    await expect(homeLink).toBeVisible();
    // คลิกที่ลิงก์ "หน้าแรก"
    await homeLink.click();
    // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
    await expect(page).toHaveURL('https://www.surin.rmuti.ac.th/Test/Quo/index.php'); // ตรวจสอบว่า URL ลงท้ายด้วย index.php
    await page.screenshot({ path: `${Date.now()}-ผลการตรวจสอบลิงค์หน้าแรก.png` });
});

test('3.2 ตรวจสอบลิ้งค์ คู่มือการสมัครเรียน', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php'); // เปลี่ยนเป็น URL ของคุณ

    // หาลิงก์ "คู่มือการสมัครเรียน"
    const manualLink = await page.locator("(//a[@id='btn-check-rights'])[1]");
    // ตรวจสอบว่าลิงก์มีอยู่
    await expect(manualLink).toBeVisible();
    // คลิกที่ลิงก์ "คู่มือการสมัครเรียน" และรอให้แท็บใหม่เปิดขึ้น
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        manualLink.click(), // คลิกที่ลิงก์
    ]);
    // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
    await expect(newPage).toHaveURL('https://www.youtube.com/watch?v=pwpXi0bUN84&feature=youtu.be');
    await page.screenshot({ path: `${Date.now()}-ผลการตรวจสอบลิ้งค์ คู่มือสมัครเรียน.png` });
});

test('3.3 ตรวจสอบภาพ QRcode', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    const img = page.locator("(//img)[6]")
    await expect(img).toBeVisible()
    await page.screenshot({ path: `${Date.now()}-ผลการตรวจสอบภาพ QRcode.png` });
});

test('3.4 ตรวจสอบลิงค์ line', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    const line = await page.locator("(//a[contains(text(),'คลิกเพื่อ รับข่าวสารนักศึกษาใหม่')])[1]")
    await expect(line).toBeVisible()

    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        line.click(), // คลิกที่ลิงก์
    ]);
    // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
    await expect(newPage).toHaveURL('https://line.me/ti/g2/E_Uqh-euKq-oHx6LxZHRuq8XKj6lkGpemTGAHw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default');
    await page.screenshot({ path: `${Date.now()}-ผลการตรวจสอบลิงค์ line.png` });
});

test('3.5 ตรวจสอบลิ้งค์ขัั้นตอนการลงทะเบียนนักศึกษา', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    const link = page.locator("(//a[contains(text(),'ขึ้นทะเบียน')])[1]")
    await expect(link).toBeVisible()

    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        link.click(), // คลิกที่ลิงก์
    ]);
    // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
    await expect(newPage).toHaveURL('https://surin-ess.rmuti.ac.th/RMUTI/Registration/webform/EnrollmentLogin.aspx');
    await page.screenshot({ path: `${Date.now()}-ผลการตรวจสอบลิ้งค์ขัั้นตอนการลงทะเบียนนักศึกษา.png` });
});

test('4.1 ประกาศรับสมัครนักศึกษา', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // หาลิงก์
    let manualLink = await page.locator("(//a[contains(text(),'ดูรายละเอียดสมัครเรียนออนไลน์')])[1]");
    // ตรวจสอบว่าลิงก์มีอยู่
    await expect(manualLink).toBeVisible();
    // คลิกที่ลิงก์ และรอให้แท็บใหม่เปิดขึ้น
    let [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        manualLink.click(), // คลิกที่ลิงก์
    ]);
    // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
    await expect(newPage).toHaveURL('https://www.surin.rmuti.ac.th/staff/index.php');

    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');

    // เข้าถึง iframe ที่มี class 'xuser' และ id 'headline'
    const iframeElement = await page.frameLocator("//div[@class='xuser']//iframe[@id='headline']");

    // ตรวจสอบ element ภายใน iframe (ตัวอย่าง img)
    const linkElement = iframeElement.locator("(//a[contains(text(),'ประกาศรับสมัครนักศึกษา')])[1]"); // ดึง div แรกที่มี class 'container'
    await expect(linkElement).toBeVisible();

    [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        linkElement.click(), // คลิกที่ลิงก์
    ]);

    // ตรวจสอบว่า URL ของแท็บใหม่เป็น URL ที่คาดหวัง
    await expect(newPage).toHaveURL(/68\.pdf$/); // ตรวจสอบว่า URL จบด้วย 68.pdf
    await page.screenshot({ path: `${Date.now()}-เปิดหน้าประกาศรับสมัครนักศึกษา.png` });
});

test('4.2 ค่าใช้จ่าย', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');

    // เข้าถึง iframe
    const iframeElement = await page.frameLocator("//div[@class='xuser']//iframe[@id='headline']");

    // เข้าถึงลิงก์ <a> ที่ครอบ <img> ไว้
    const linkElement = iframeElement.locator("(//a[contains(text(),'ค่าใช้จ่าย')])[1]"); // ดึง <a> ที่มี href อันที่ 2
    await expect(linkElement).toBeVisible();
    // ดึงค่า href จาก <a> element
    await linkElement.click();

    await expect(page).toHaveURL('https://www.surin.rmuti.ac.th/staff/index.php?main=courses');
    await page.screenshot({ path: `${Date.now()}-ผลการเช็คลิ้งค่าใช้จ่าย.png` });
});


test('4.3 แจ้งชำระเงิน', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');

    // เข้าถึง iframe
    const iframeElement = await page.frameLocator("//div[@class='xuser']//iframe[@id='headline']");

    // เข้าถึงลิงก์ <a> ที่ครอบ <img> ไว้
    const linkElement = iframeElement.locator("(//a[contains(text(),'แจ้งการชำระเงิน')])[1]"); // ดึง <a> ที่มี href อันที่ 2
    await expect(linkElement).toBeVisible();
    // ดึงค่า href จาก <a> element
    await linkElement.click();

    await expect(page).toHaveURL('https://payment.surin.rmuti.ac.th/2023/');
    await page.screenshot({ path: `${Date.now()}-ผลการเช็คลิ้ง.png` });

    await page.pause();
});

test('4.4 แผนที่มหาลัย', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');

    const link = await page.locator("(//a[contains(text(),'แผนที่มหาวิทยาลัย')])[1]")

    await expect(link).toBeVisible()

    await link.click()

    await expect(page).toHaveURL('https://www.surin.rmuti.ac.th/staff/index.php?main=con')
    await page.screenshot({ path: `${Date.now()}-ผลการเช็คลิ้งค์ แผนที่มหาลัย.png` });
});

test('4.5 ติดต่อเรา', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');
    const link = await page.locator("(//a[contains(text(),'ติดต่อเรา')])[1]")
    await expect(link).toBeVisible()
    await link.click()
    await expect(page).toHaveURL('https://www.surin.rmuti.ac.th/staff/index.php?main=con')
    await page.screenshot({ path: `${Date.now()}-ผลการเช็คลิ้งติดต่อเรา.png` });
});

test('4.6 facebook', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php');
    const link = await page.locator("(//a[@class='my-facebook'])[1]")
    await expect(link).toBeVisible()
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        link.click(), // คลิกที่ลิงก์
    ]);
    await expect(newPage).toHaveURL('https://www.facebook.com/people/%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2-%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%AA%E0%B8%B8%E0%B8%A3%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C/100063876259619/');
    await page.screenshot({ path: `${Date.now()}-ผลการเช็คลิ้ง facebook.png` });
});

test('5. ดูรายละเอียดสมัครเรียนออนไลน์', async ({ page }) => {
    // ไปที่หน้าเว็บที่ต้องการทดสอบ
    await page.goto('https://www.surin.rmuti.ac.th/staff/index.php'); // หรือ URL จริงของหน้าเว็บ

    const element = page.locator("(//div[@class='modal-body'])[1]")
    await expect(element).toBeVisible()
    // await page.locator("(//div[@class='modal-body'])[1]").click()

    await page.screenshot({ path: `${Date.now()}-ผลการดุรายละเอียดสมัครเรียนออนไลน์.png` });
});

test('6. ขึ้นทะเบียนนักศึกษา', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php'); // เปลี่ยนเป็น URL ของคุณ

    const link = await page.locator("(//a[contains(text(),'ขึ้นทะเบียน')])[1]");

    await expect(link).toBeVisible()
    const [newPage] = await Promise.all([
        page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
        link.click(), // คลิกที่ลิงก์
    ]);
    await expect(newPage).toHaveURL('https://surin-ess.rmuti.ac.th/RMUTI/Registration/webform/EnrollmentLogin.aspx');

    await page.goto('https://surin-ess.rmuti.ac.th/RMUTI/Registration/webform/EnrollmentLogin.aspx')
    await page.locator("(//input[@id='ctl00_ContentPlaceHolderMain_txtUser'])[1]").fill('555')
    await page.locator("(//input[@id='ctl00_ContentPlaceHolderMain_txtPassword'])[1]").fill('1000000000335')
    await page.locator("(//input[@id='ctl00_ContentPlaceHolderMain_btnLogin'])[1]").click()
    await page.screenshot({ path: `${Date.now()}-ผลการขึ้้นทะเบียนนักศึกษา.png` });
});

// นี่มันเว็บจริงไอน้อง
// test('7. แจ้งยืนยันการชำระเงิน', async ({ page }) => {
//     await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

//     // หาลิงก์ "คู่มือการสมัครเรียน"
//     const link = await page.locator("(//a[contains(text(),'แจ้งยืนยันการชำระเงิน')])[1]");
//     // ตรวจสอบว่าลิงก์มีอยู่
//     await expect(link).toBeVisible();
//     // คลิกที่ลิงก์ "คู่มือการสมัครเรียน" และรอให้แท็บใหม่เปิดขึ้น
//     const [newPage] = await Promise.all([
//         page.waitForEvent('popup'), // รอให้แท็บใหม่เปิดขึ้น
//         link.click(), // คลิกที่ลิงก์
//     ]);
//     // ตรวจสอบว่า URL ที่ถูกนำไปหลังจากคลิกเป็น URL ที่คาดหวัง
//     await expect(newPage).toHaveURL('https://payment.surin.rmuti.ac.th/2023/');

//     await page.goto('https://payment.surin.rmuti.ac.th/2023/');
//     await page.locator('#login').click();
//     await page.locator('#login').fill('1000000000017');
//     await page.getByRole('button', { name: 'LOGIN' }).click();
//     await page.getByRole('link', { name: 'คลิก' }).click();
//     await page.getByLabel('บัญชีธนาคารของมหาลัยฯ').selectOption('1');
//     await page.locator('#payment_type_id').selectOption('10');
//     await page.locator('#payment_number').fill('0');
//     await page.getByLabel('โอนจากธนาคาร').selectOption('1');
//     await page.getByLabel('วันที่ชำระ').fill('2024-10-24');
//     await page.fill('#payment_time', '14:30');
//     await page.getByLabel('ยอดโอน(บาท)').click();
//     await page.getByLabel('ยอดโอน(บาท)').fill('9999');
//     await page.locator('#PaymentForm div').filter({ hasText: 'โอนจากธนาคาร - กรุงเทพ' }).first().click();

//     // // Click input[name="file-upload"]
//     // await page.locator("(//input[@id='payment_files'])[1]").click();
//     // // Upload fixture.pdf
//     // await page.locator("(//input[@id='payment_files'])[1]").setInputFiles('wll.png');
//     // // Click text=fixture.pdf
//     // await page.locator('text=wll.png').click();

//     const handle = page.locator('input[type="file"]');
//     await handle.setInputFiles("D:/coding/miniproject/wll.png");

//     page.once("dialog", (dialog) => {
//         console.log(dialog.message());
//         dialog.accept();
//     });


// // await page.getByRole('button', { name: 'แจ้งชำระ' }).click();
// await page.pause();
// await page.screenshot({ path: `${Date.now()}-ผลการแจ้งชำระเงิน.png` });
// });

test('8. สามารถ logout ได้', async ({ page }) => {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // เข้าหน้า  register
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").click()
    await page.locator("(//a[@id='btn-register-people'])[1]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='btn-register-people'])[1]").click()

    await page.fill('#iDCard2', '1000000000017')
    await page.click('#loginbtn')

    await page.waitForSelector('#dropdownMenuLink', { state: 'visible' });
    await page.click('#dropdownMenuLink');
    await page.waitForSelector('#btn-register-merchant', { state: 'visible' });
    await page.click('#btn-register-merchant');
    await page.locator("(//img[@class='img-fluid y'])[1]").click()
    await page.screenshot({ path: `${Date.now()}-ผลการล็อกเอาท์.png` });
});

// ฟังก์ชันลงทะเบียนแต่ละสาขา เทอม  2 2567
async function programcheck2(page, id, edu, degree, program) {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // เข้าหน้า  register
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").click()
    await page.locator("(//a[@id='btn-register-people'])[2]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='btn-register-people'])[2]").click()

    // กรอกหมายเลขบัตรประชาชน
    await page.fill('#iDCard2', id)
    await page.click('#loginbtn')

    // เช็ค radio คำนำหน้าชื่อ
    await page.check('input[type="radio"][id="sex1"][value="นาย"]')

    // กรอกข้อมูล
    await page.fill('#reg_fname', 'กรกนก')
    await page.fill('#reg_sname', 'กนกรก')
    await page.fill('#mobile', '0123456789')
    await page.fill('#end_deu', 'วิทคณิต')
    await page.fill('#shool', 'โรงเรียนเกษตรศาสตร์')

    // เช็คจังหวัด
    const province = '#ddlProvince'
    await dropdownCheck(page, province, 'สุรินทร์');

    // เลือกการศึกษา
    await page.check(edu)
    await page.check(degree)
    await dropdownCheck(page, '#program', program);
    await page.click('#register_submit')

    await page.screenshot({ path: `${Date.now()}-ผลการสมัครเรียน.png` });

    // คลิกเพื่ออัพเดทตอนขีด --ui
    await page.waitForSelector('#dropdownMenuLink', { state: 'visible' });
    await page.click('#dropdownMenuLink');
    await page.waitForSelector('#btn-register-merchant', { state: 'visible' });
    await page.click('#btn-register-merchant');
    await page.locator("(//img[@class='img-fluid y'])[1]").click()
    // await page.close();
}

// ฟังก์ชันลงทะเบียนแต่ละสาขา 2568
async function programcheck(page, id, edu, degree, program) {
    await page.goto('https://www.surin.rmuti.ac.th/Test/Quo/index.php');

    // เข้าหน้า  register
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='dropdownMenuLink'])[1]").click()
    await page.locator("(//a[@id='btn-register-people'])[1]").waitFor({ state: 'visible' });
    await page.locator("(//a[@id='btn-register-people'])[1]").click()

    // กรอกหมายเลขบัตรประชาชน
    await page.fill('#iDCard2', id)
    await page.click('#loginbtn')

    // เช็ค radio คำนำหน้าชื่อ
    await page.check('input[type="radio"][id="sex1"][value="นาย"]')

    // กรอกข้อมูล
    await page.fill('#reg_fname', 'กรกนก')
    await page.fill('#reg_sname', 'กนกรก')
    await page.fill('#mobile', '0123456789')
    await page.fill('#end_deu', 'วิทคณิต')
    await page.fill('#shool', 'โรงเรียนเกษตรศาสตร์')

    // เช็คจังหวัด
    const province = '#ddlProvince'
    await dropdownCheck(page, province, 'สุรินทร์');

    // เลือกการศึกษา
    await page.check(edu)
    await page.check(degree)
    await dropdownCheck(page, '#program', program);
    await page.click('#register_submit')

    await page.screenshot({ path: `${Date.now()}-ผลการสมัครเรียน.png` });

    // คลิกเพื่ออัพเดทตอนขีด --ui
    await page.waitForSelector('#dropdownMenuLink', { state: 'visible' });
    await page.click('#dropdownMenuLink');
    await page.waitForSelector('#btn-register-merchant', { state: 'visible' });
    await page.click('#btn-register-merchant');
    await page.locator("(//img[@class='img-fluid y'])[1]").click()
    // await page.close();
}

// ฟังก์ชันเช็ค dropdown
async function dropdownCheck(page, id, value) {
    await page.waitForSelector(id, { state: 'visible' });
    await page.click(id);
    await page.screenshot({ path: 'ตัวเลือกจังหวัด.png' });
    await page.selectOption(id, value);
    const selectedValue = await page.$eval(id, el => el.value);
    expect(selectedValue).toBe(value);
    // const selectedText = await page.$eval(id, el => el.options[el.selectedIndex].text);
    // expect(selectedText.trim()).toBe(value);
}

// ฟังก์ชันคำนวณ Checksum
function calculateChecksum(id12Digits) {
    const weights = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    let total = 0;

    // คูณเลขแต่ละตำแหน่งด้วย weight ที่กำหนด
    for (let i = 0; i < 12; i++) {
        total += parseInt(id12Digits[i]) * weights[i];
    }

    // คำนวณเศษจากการหารด้วย 11 และนำมาใช้ในการหาค่า checksum
    const remainder = total % 11;
    const checksum = (11 - remainder) % 10; // ถ้าเป็น 10 ให้ใช้ 0
    return checksum;
}

// ฟังก์ชันเพิ่มเลขบัตรประชาชนตามจำนวนวันที่ผ่านไปตั้งแต่วันที่เริ่มต้น
function generateNextId(startingId, daysPassed) {
    // เพิ่มเลขจากเลขบัตร 12 หลักแรก
    let currentNumber = parseInt(startingId);
    currentNumber += daysPassed; // เพิ่มค่าตามจำนวนวัน
    const nextId = currentNumber.toString().padStart(12, '0'); // เติมเลข 0 ด้านหน้าให้ครบ 12 หลัก
    const checksum = calculateChecksum(nextId); // คำนวณ Checksum ใหม่
    return nextId + checksum; // รวมเลขบัตร 12 หลักกับ Checksum
}

// ฟังก์ชันคำนวณจำนวนวันที่ผ่านไปนับจากวันที่เริ่มต้นจนถึงวันนี้
function getDaysPassed(startDate) {
    const today = new Date(); // วันที่ปัจจุบัน
    const start = new Date(startDate); // วันที่เริ่มต้น
    const diffTime = Math.abs(today - start); // เวลาที่ผ่านไปในหน่วยมิลลิวินาที
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // แปลงมิลลิวินาทีเป็นวัน
    return diffDays;
}

// ฟังก์ชันสร้างเลขบัตรไม่ซ้ำกัน 200 หมายเลข
function generateUniqueIds(startingId, daysPassed, count) {
    const ids = new Set(); // ใช้ Set เพื่อเก็บเลขบัตรไม่ซ้ำกัน

    while (ids.size < count) {
        const newId = generateNextId(startingId, daysPassed + ids.size); // เพิ่มเลขบัตร
        ids.add(newId); // เพิ่มเลขบัตรลงใน Set
    }

    return Array.from(ids); // แปลง Set เป็น Array
}