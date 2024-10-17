from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from sapp.models import Sapp
from sapp.serializers import SappSerializer

#selenium
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.options import Options

from time import sleep

def getHtml():
    html = ''
    return html

@csrf_exempt
def Sapp_list(request):
    """
    List all code sapp, or create a new Sapp.
    """
    if request.method == 'POST':
        url0 = JSONParser().parse(request)['url']
        print(url0)

        chrome_options = webdriver.ChromeOptions()

        # get url
        chrome_options.add_experimental_option("mobileEmulation", { "deviceName": "iPhone X" })

        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')

        driver = webdriver.Chrome(options=chrome_options)
        # driver.maximize_window()

        ###################################################
        # suumo url
        driver.get(url0)
        sleep(1.5)

        if len(driver.find_elements(By.CLASS_NAME, "page-title__text")) > 0 :
            apartment_name = driver.find_element(By.CLASS_NAME, "page-title__text").text[ 0 : driver.find_element(By.CLASS_NAME, "page-title__text").text.find('(') ]
            apartment_price = driver.find_element(By.CLASS_NAME, "bukken-summary__price__getsugaku")
            apartment_address01 = driver.find_element(By.CLASS_NAME , 'breadcrumb-list').find_elements(By.TAG_NAME, "span")[2]
            apartment_address02 = driver.find_element(By.CLASS_NAME , 'breadcrumb-list').find_elements(By.TAG_NAME, "span")[3]
            apartment_address = driver.find_element(By.CLASS_NAME, 'bukken-summary__list__item__text--jusho')
            apartment_size = driver.find_element(By.CLASS_NAME, 'bukken-summary__list').find_elements(By.CLASS_NAME, 'bukken-summary__list__item__text')[2]
            print(apartment_size.text)
            apartment_info = {'name': apartment_name, 'price': apartment_price.text, 'address01': apartment_address01.text, 'address02': apartment_address02.text, 'address': apartment_address.text, 'size': apartment_size.text}
            # sleep(1)

            driver.quit()

            options = webdriver.ChromeOptions()
            options.add_argument('--headless')
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")

            driver = webdriver.Chrome(options=options)
            driver.maximize_window()

            #####################################################
            # rein url
            driver.get("https://system.reins.jp/login/main/KG/GKG001200")
            sleep(2)
            room_infos = [] #room info

            if len(driver.find_elements(By.CSS_SELECTOR, '.btn.p-button.p-3.large.btn-primary.btn-block.px-0')) > 0:
                ## login
                actions = ActionChains(driver)
                username_input = driver.find_element(By.ID, "__BVID__13")
                username_input.send_keys("160337706020")
                sleep(0.8)
                password_input = driver.find_element(By.ID, "__BVID__16")
                password_input.send_keys("194968")
                sleep(0.8)
                signin_check = driver.find_element(By.ID, "__BVID__20")
                actions.move_to_element(signin_check).click().perform()
                signin_button = driver.find_element(By.CSS_SELECTOR, '.btn.p-button.p-3.large.btn-primary.btn-block.px-0')
                actions.move_to_element(signin_button).click().perform()
                sleep(2)
                ## next button
                
                print(len(driver.find_elements(By.CSS_SELECTOR, '.card-body.p-card-body')))
                next_button1 = driver.find_elements(By.CSS_SELECTOR, '.card-body.p-card-body')[1].find_elements(By.CSS_SELECTOR, '.btn.p-button.btn-primary.btn-block.px-0')[1]
                # next_button1 = driver.find_element(By.XPATH, '//button[text()="賃貸 物件検索"]')
                actions.move_to_element(next_button1).click().perform()
                sleep(2)
                ## research info

                # print(len(driver.find_elements(By.CLASS_NAME, 'card-body p-card-body')))
                option1 = Select(driver.find_elements(By.CSS_SELECTOR, '.card-body.p-card-body')[2].find_elements(By.CLASS_NAME, 'col-sm-4')[1].find_element(By.CSS_SELECTOR, '.p-selectbox-input.custom-select'))
                option1.select_by_visible_text("賃貸マンション")
                # option2 = Select(driver.find_element(By.ID, '__BVID__266'))
                # option2.select_by_visible_text("マンション")
                # option3 = Select(driver.find_element(By.ID, '__BVID__269'))
                # option3.select_by_visible_text("マンション")

                address_01 = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="10"]')[0]
                address_01.send_keys(apartment_info['address01']) #"東京都"
                address_02 = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="20"]')[0]
                address_02.send_keys(apartment_info['address02'])#"港区"
                address_03 = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="20"]')[1]
                address_03.send_keys(apartment_info['address'][apartment_info['address'].find(apartment_info['address02']) + len(apartment_info['address02']): len(apartment_info['address'])])#"浜松町2丁目"

                # info_name = driver.find_element(By.ID, '__BVID__307')
                # info_name.send_keys(apartment_info['name'])

                info_price1 = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="8"]')[0]
                # info_price1.send_keys("2.3")
                info_price1.send_keys(apartment_info['price'][0: apartment_info['price'].find('万')].replace(" ", ""))
                info_price2 = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="8"]')[1]
                # info_price2.send_keys("2.3")
                info_price2.send_keys(apartment_info['price'][0: apartment_info['price'].find('万')].replace(" ", ""))

                info_size = driver.find_elements(By.CSS_SELECTOR, 'input[maxlength="10"]')[8]
                info_size.send_keys(apartment_info['size'][0: apartment_info['size'].find('m')].replace(" ", ""))
                sleep(1)
                ### research button
                research_button = driver.find_element(By.CSS_SELECTOR, '.btn.p-button.btn-primary.btn-block.px-0')
                actions.move_to_element(research_button).click().perform()
                sleep(1.5)

                ## research result page
                if len(driver.find_elements(By.CSS_SELECTOR, ".text-dark.ml-3:nth-of-type(1)")) > 0:
                    all_count = driver.find_element(By.CSS_SELECTOR, ".text-dark.ml-3:nth-of-type(1)")
                    cnt = 0

                    for x in range(len(driver.find_elements(By.CLASS_NAME, "p-table-body-row"))): 

                        nein_info = driver.find_elements(By.CLASS_NAME, "p-table-body-row")[cnt].find_elements(By.CLASS_NAME, "p-table-body-item")

                        # sleep(1000)

                        room_infos.append({ 'name': apartment_info['name'], 'origin-address': apartment_info['address'], 'number': nein_info[3].text, 'address': nein_info[6].text, 'price': apartment_info['price'], 'size': nein_info[5].text })

                        cnt = cnt + 1


                driver.quit()
                return JsonResponse({ "summoinfo": apartment_info, "reinsinfo": room_infos}, safe=False)
        
            driver.quit()
            return JsonResponse({ "summoinfo": apartment_info, "reinsinfo": []}, safe=False)
        
        driver.quit()
        return JsonResponse({ "summoinfo": [], "reinsinfo": []}, safe=False)


    elif request.method == 'GET':
        return JsonResponse([], safe=False)

@csrf_exempt
def Sapp_detail(request, pk):
    """
    Retrieve, update or delete a code Sapp.
    """
    try:
        Sapp = Sapp.objects.get(pk=pk)
    except Sapp.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SappSerializer(Sapp)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = SappSerializer(Sapp, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        Sapp.delete()
        return HttpResponse(status=204)