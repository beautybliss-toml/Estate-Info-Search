import React from "react";
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Flowbite, Select, Spinner, Table, Button, Checkbox, FloatingLabel, Modal, Label, TextInput, Alert } from 'flowbite-react';

import { useNavigate } from 'react-router-dom'

import config from "../app/config";

import Header from '../components/header'
import LiftSide from "../components/liftside"

import axios from "axios";

function Search() {

  const { user, error } = useSelector((store) => store.user);

  const [loading, setLoading] = useState(0)

  const [inputCount, setInputCount] = useState(5);
  const [inputDatas, setInputDatas] = useState({"name1": ""})


  const [summoInfo, setSummoInfo] = useState([])
  const [reinsInfo, setReinsInfo] = useState([])

  useEffect(() => {
    // setSummoInfo([
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米"},
    // ])

    // setReinsInfo([
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    //   {name: "メイクスデザイン参宮橋", address: "東京都渋谷区代々木45716", price: "12.7万円", size: "28.8平米", number: "31321312312"},
    // ])
  }, [])

  const search1 = () => {
    for(let i in inputDatas) {
      if(!inputDatas[i].includes('https://suumo.jp/chintai/')) {
        return;
      }
    }

    let cnt1 = 0, cnt2 = 0;
    for(let i in inputDatas) {
      if(inputDatas[i] === '') cnt1++
      cnt2++
    }

    if(cnt1 === cnt2) return;

    setReinsInfo([])
    setSummoInfo([])
    setLoading(1)

    let promiseArray = []
    for(let i in inputDatas) {
      promiseArray.push(new Promise((resolve, reject) => {
        axios.post(`${config.server_url1}/getApartmentInfo`, { url: inputDatas[i] })
        .then(function (response) {
          resolve(response.data)
        })
        .catch(err => {
          reject(new Error(err))
          console.log(err)
        })
      }))
    }

    Promise.all(promiseArray).then(response => {
      console.log(response)

      let re1 = [], re2 = [];

      for(let i in response) {
          re1.push(response[i]["summoinfo"])
          re2 = re2.concat(response[i]["reinsinfo"])
          // re2.push(response[i]["reinsinfo"])
      }
      console.log(re2)

      setSummoInfo(re1)
      setReinsInfo(re2)

      setLoading(2)
    }).catch(err => {
      console.log(err)
      setLoading(2);
    })


  }

  const renderInput = () => {
    let re = [];
    for(let i = 0; i < inputCount; i++) {
      re.push(
        <div key={i} className="flex flex-row w-9/12 items-center mt-7">
          <label className=" w-14" htmlFor="">{i + 1}軒目</label>
          <TextInput onChange={(e) => { setInputDatas({ ...inputDatas, [e.target.name]: e.target.value }) }} type="text" className="text-2xl rounded-full w-96" name={"name" + (i + 1)} id="" />
          { (i + 1) === inputCount ? <Button className="rounded-full ml-6 m-bg-gray border-gray-400" type="button" color="gray" onClick={() => { setInputCount(inputCount + 1) }}>+</Button> : <Button className="rounded-full ml-6 m-bg-gray border-gray-400 opacity-0 hover:opacity-100 m-dur-8" type="button" color="gray" onClick={() => { setInputCount(inputCount - 1) }}>-</Button>}
      </div>
      )
    }

    return re;
  }

  const beforeSearch = () => {
    return (
      <div className="basis-6/7 px-10 py-12 flex flex-col grow">
        <div className="mt-5 flex flex-col">
          <div className="px-5 dark:bg-gray-800">
            <div className="">
                <h1>検索画面</h1>
            </div>
            {renderInput()}
          </div>
          <div className="pt-10 grid grid-cols-4 gap-4 pl-10">
            <button onClick={search1} className=" rounded-full bg-gradient-to-r outline-none focus:outline-none hover:outline-none hover:border-transparent from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500  w-64 text-white" type="button">検索する</button>
          </div>
        </div>
      </div>
    )
  }

  const serarching = () => {
    return (
      <div className="basis-6/7 px-10 py-12 flex flex-col grow">
        <div className="mt-5 flex flex-col">
          <div className="px-5 dark:bg-gray-800">
            <div className="">
                <h1>検索中</h1>
            </div>
          </div>
          <div className="pt-10 grid grid-cols-4 gap-4 pl-10">
            <Spinner aria-label="Extra large spinner example" size="xl" />
          </div>
        </div>
      </div>
    )
  }

  const afterSearch = () => {
    return (
      <div className="basis-6/7 px-10 py-12 flex flex-col grow m-max-width">
        <div className="mt-5 flex flex-col">
          <div className="px-5 dark:bg-gray-800">
            <div className="">
                <h1>検索結果画面</h1>
            </div>
          </div>
          <div className="pt-10 pl-10">
            <div className="">
              <div className=" text-2xl flex flex-row items-center">
                <span className="circle-symbol"></span>
                <h3>検索画面</h3>
              </div>
              <div className="pt-3">
                {(summoInfo === null || summoInfo.length === 0) ?
                    <div className="text-red-500 pl-5 pt-5 text-xl col-span-2">登録された資料はありません。</div> : summoInfo.map((item, index) => (
                  <p className="pl-3 py-1 text-xl" key={index}>{index + 1}物件目: {item.name + " / " + item["address"] + " / " + item.price + " / " + item.size}</p>
                ))}
              </div>
              <div className=" flex flex-col pt-10">
                <div className="logo">
                  <img src="./reins.jpg" alt="" width={250} />
                </div>
                <div className=" grid grid-cols-5 gap-1">
                {(reinsInfo === null || reinsInfo.length === 0) ?
                    <div className="text-red-500 pl-5 text-xl col-span-2 pt-7">登録された資料はありません。</div> :
                    reinsInfo.map((item, index) => (
                      <div className="bg-gray-100 px-6 py-5 rounded-md w-60  my-3">
                        <div key={index} className="">
                          <label className="font-medium text-gray-700">物件名:</label>
                          <span className="ml-3 text-gray-700">{item.name}</span>
                        </div>
                        <div className="">
                          <label className="font-medium text-gray-700">物件番号:</label>
                          <span className="ml-3 text-gray-700">{item.number}</span>
                        </div>
                        <div className="">
                          <label className="font-medium text-gray-700">住所:</label>
                          <span className="ml-3 text-gray-700">{item.address}</span>
                        </div>
                        <div className="">
                          <label className="font-medium text-gray-700">家賃:</label>
                          <span className="ml-3 text-gray-700">{item.price}</span>
                        </div>
                        <div className="">
                          <label className="font-medium text-gray-700">平⽶数:</label>
                          <span className="ml-3 text-gray-700">{item.size}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Flowbite>
      <Header></Header>
      <main className="flex flex-row width-1200 mx-auto my-0">
        <LiftSide select={0}></LiftSide>
        {loading === 0 && beforeSearch()}
        {loading === 1 && serarching()}
        {loading === 2 && afterSearch()}
      </main>
    </Flowbite>
  );


}

export default Search

