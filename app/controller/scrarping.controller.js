var webdriver = require('selenium-webdriver')
const { Builder, By, Key, until, Select } = require('selenium-webdriver')

const suumo = async (driver, url) => {
    driver.get(url);
    await driver.manage().window().maximize();
    await driver.actions().pause(6000).perform()

    let apartment_name = await driver.findElement(By.className('section_h1-header-title'))
    let apartment_price = await driver.findElement(By.className("property_view_note-emphasis"))
    let apartment_address = await driver.findElement(By.css('.l-property_view_table .property_view_table-body:nth-of-type(1)'))
    let apartment_size = await driver.findElement(By.css('.l-property_view_table tr:nth-of-type(3) .property_view_table-body:nth-of-type(2)'))
    await driver.actions().pause(1000).perform()

    return { name: apartment_name.getText(), price: apartment_price.getText(), address: apartment_address.getText(), size: apartment_size.getText() }
}

const reins = async (driver, apartment_info) => {
    driver.get('https://system.reins.jp/login/main/KG/GKG001200')
    await driver.actions().pause(10000).perform()

    let body = await driver.findElement(By.id("__BVID__13"))
    console.log(body)
    
    // login
    let username_input = await driver.findElements(By.xpath('//input'))
    console.log(username_input)
    await username_input[0].sendKeys('160337706020')
    await driver.actions().pause(1000).perform()
    // let password_input = await driver.findElement(By.id("__BVID__16"))
    await username_input[1].sendKeys('194968')
    await driver.actions().pause(1000).perform()
    // let signin_check = await driver.findElement(By.id("__BVID__20"))
    await username_input[2].click()

    let signin_button = await driver.findElement(By.css('.btn.p-button.p-3.large.btn-primary.btn-block.px-0'))
    await signin_button.click()
    await driver.actions().pause(4000).perform()

    let next_button1 = await driver.findElement(By.xpath('//button[text()="賃貸 物件検索"]'))
    await driver.actions().move({ origin: next_button1 }).press().perform()
    await driver.actions().pause(4000).perform()

    //research
    let option1_element = await driver.findElement(By.id('__BVID__263'))
    let option1 = new Select(option1_element)
    await option1.selectByVisibleText('賃貸マンション')
    let option2_element = await driver.findElement(By.id('__BVID__266'))
    let option2 = new Select(option2_element)
    await option2.selectByVisibleText('賃貸マンション')
    let option3_element = await driver.findElement(By.id('__BVID__269'))
    let option3 = new Select(option3_element)
    await option3.selectByVisibleText('賃貸マンション')

    let address_01 = await driver.findElement(By.id('__BVID__295'))
    await address_01.send_keys(apartment_info.address.slice(0, apartment_info.address.indexOf("都") + 1)) //"東京都"
    let address_02 = await driver.findElement(By.id('__BVID__299'))
    await address_02.send_keys(apartment_info.address.slice(apartment_info.address.indexOf('都'), apartment_info.address.indexOf('区') + 1)) //"港区"
    let address_03 = await driver.findElement(By.id('__BVID__302'))
    await address_03.send_keys(apartment_info.address.slice(apartment_info.address.indexOf('区'), apartment_info.address.length)) //"浜松町2丁目"

    let info_name = await driver.findElement(By.id('__BVID__307'))
    await info_name.send_keys(apartment_info.name)

    let info_price1 = await driver.findElement(By.id('__BVID__426'))
    await info_price1.send_keys(Math.ceil(parseFloat(apartment_info.price))) 
    let info_price2 = await  driver.findElement(By.id('__BVID__428'))
    await info_price2.send_keys(Math.floor(parseFloat(apartment_info.price)))

    let info_size = await driver.findElement(By.id('__BVID__456'))
    await info_size.send_keys(apartment_info.price)
    await driver.actions().pause(1000).perform()

    let research_button = await driver.findElement(By.css('.btn.p-button.btn-primary.btn-block.px-0'))
    await research_button.click()
    await driver.actions().pause(6000).perform()


    //result page
    let all_count = await driver.findElement(By.css(".text-dark.ml-3:nth-of-type(1)")).getText();
    let len = parseInt(all_count.slice(all_count.indexOf('／') + 1, all_count.length - 1).replace(" ", ""))
    let room_infos = []

    for(let i = 0, cnt = 0; i < len; i++, cnt += 2) {
        let detail_button = await driver.findElements(By.css(".btn.p-button.m-0.py-0.btn-outline.btn-block.px-0"))[cnt]
        await driver.actions().move({ origin: detail_button }).press().perform()
        await driver.actions().pause(2000).perform()

        //room_number
        let room_number = await driver.findElement(By.css(".col-auto:nth-of-type(1)"))
        //room_address4
        let room_address4 = await driver.findElement(By.xpath("//*[contains(text(), '－')]"))
        room_infos.append({ 'name': apartment_info.name, 
                            'number': room_number.getText(), 
                            'address': apartment_info.address + room_address4.getText(), 
                            "price": apartment_info.price,
                            "size": apartment_info.size })

        await driver.back()
        await driver.actions().pause(1000).perform()
    }

    //insert html element
    // let body = await driver.findElement(By.xpath("//body"))
    // await driver.executeScript(`arguments[0].innerHTML += '<div style="z-index: 9999;padding: 16px 12px; background-color: rgb(247, 129, 129); border-radius: 10px; position: fixed; right: 200px; bottom: 200px; width: 200px; height: 189px; padding-top: 20px;"><div class="" style="line-height: 2;"><span style="color: white;">物件名:</span><span style="color: white;">ガリシア浜松町</span></div><div class="" style="line-height: 2;"><span style="color: white;">物件番号:</span><span style="color: white;">100128478524</span></div><div class="" style="line-height: 2;"><span style="color: white;">住所:</span><span style="color: white;">東京都港区浜松町２丁⽬６−４ガリシア浜松町303</span></div><div class="" style="line-height: 2;"><span style="color: white;">家賃:</span><span style="color: white;">9.7万円</span></div><div class="" style="line-height: 2;"><span style="color: white;">平⽶数:</span><span style="color: white;">22.93㎡</span></div></div>'`, body)
    

    driver.quit();

    return room_infos


    return []

}

exports.getApartmentInfo = async (req, res) => {
    try {
        let url = req.body.url

        var driver = new Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
        
        //suumo url
        let apartment_info = await suumo(driver, url)

        //reins url
        let result = await reins(driver, apartment_info)

        res.json(result)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message })
    }


}