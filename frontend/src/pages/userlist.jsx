import React from "react";
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { HiOutlineCheck, HiOutlineXCircle } from 'react-icons/hi';
import { Flowbite, Table, Button, FloatingLabel, Modal, Select, Label, TextInput, Alert, ToggleSwitch } from 'flowbite-react';

import lang from "../lang/lang";

import config from "../app/config";

import Header from '../components/header'
import LiftSide from "../components/liftside"

import axios from "axios";

function Userlist() {

  const [userlist, setUserlist] = useState([])

  //datas
  const [keyword, setKeyword] = useState('')
  const [pageno, setPageNo] = useState(1)
  const [allCount, setAllCount] = useState(0)
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    view()
  }, [])

  useEffect(() => {
    view()
  }, [pageno])

  const view = () => {
    axios.post(`${config.server_url}/userlist`, {
      keyword,
      pageno
    })
      .then(function (response) {
        setUserlist(response.data.userlist)
        setAllCount(response.data.allCount)
        setMatchCount(response.data.matchCount)
        if((pageno - 1) * 15 > response.data.matchCount) setPageNo(1)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const changeState = (id, state) => {
    try {
      axios.post(`${config.server_url}/changeState`, { id, state })
        .then(function (response) {
          view()
        })
        .catch(err => {
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const renderPagination = () => {

    let s_no = Math.floor(pageno / 5) + 1

    let end_no = Math.ceil(matchCount / 15)

    let temp = []

    if ((s_no + 5) <= end_no) {
      for (let i = s_no; i < (s_no + 6); i++) {
        if (i === pageno)
          temp.push(<a key={i} onClick={(e) => { e.preventDefault(); setPageNo(i) }} href="#" className="pagenatione-active relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{i}</a>)
        else temp.push(<a key={i} onClick={(e) => { e.preventDefault(); setPageNo(i) }} href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{i}</a>)
      }
    }
    else {
      for (let i = s_no; i < (end_no + 1); i++)
        if (i === pageno)
          temp.push(<a key={i} onClick={(e) => { e.preventDefault(); setPageNo(i) }} href="#" className="pagenatione-active relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{i}</a>)
        else temp.push(<a key={i} onClick={(e) => { e.preventDefault(); setPageNo(i) }} href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{i}</a>)

    }

    return temp;

  }

  return (
    <Flowbite>
      <Header></Header>
      <main className="flex flex-row width-1200 mx-auto my-0">
        <LiftSide select={1}></LiftSide>

        <div className="basis-6/7 px-10 py-12 flex flex-col grow">
          <div className="mt-5 flex flex-col">
            <div className="px-5 dark:bg-gray-800">
              <div className="flex flex-row gap-4 items-center">
                <TextInput onChange={(e) => { setKeyword(e.target.value) }} type="text" className="text-3xl width-50-rem" name="" id="" />
                <Button className="" type="button" onClick={() => { view() }}>検索</Button>
              </div>
            </div>
            <div className="overflow-x-auto w-full  rounded-none">

              <table className="mt-2 ml-5 border-collapse w-10/12">
                <thead>
                  <tr className="border border-slate-300 border-l-0 border-r-0">
                    <th className="text-sm px-1 py-4">No</th>
                    <th className="text-sm px-1 py-4">メール</th>
                    <th className="text-sm px-1 py-4">名前</th>
                    <th className="text-sm px-1 py-4">承認状態</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (userlist === null || userlist.length === 0) ?
                      <tr className="py-5 border border-slate-300 border-l-0 border-r-0">
                        <td className="px-2 py-3 text-sm " colSpan={10}>{lang("japan", "no_data")}</td>
                      </tr>
                      : userlist.map((item, index) => (
                        <tr key={item.id} className="border  border-slate-300 border-l-0 border-r-0">
                          <td className="px-1 pd-y-6 text-sm text-center ">{ (pageno - 1) * 15 + index + 1 }</td>
                          <td className="px-1 pd-y-6 text-sm text-center">{item.username}</td>
                          <td className="px-1 pd-y-6 text-sm text-center">{item.username1}</td>
                          <td className="text-sm pd-y-6 text-center flex justify-center">
                            <ToggleSwitch checked={item.allow} onChange={() => { changeState(item.id, item.allow) }} />
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Next</a>
              </div>

              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a href="#" onClick={e => { e.preventDefault(); if (pageno !== 1) setPageNo(pageno - 1) }} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </a>
                    {renderPagination()}
                    <a href="#" onClick={e => { e.preventDefault(); if (pageno < (Math.ceil(matchCount / 15))) setPageNo(pageno + 1) }} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <div className="search_result pt-2 pl-3">
                      {matchCount === 0 ? 0 : (pageno - 1) * 15 + 1} ~ {(pageno - 1) * 15 + 15 > matchCount ? matchCount : (pageno - 1) * 15 + 15} / {allCount}
                    </div>
                  </nav>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </Flowbite>
  );
}

export default Userlist

