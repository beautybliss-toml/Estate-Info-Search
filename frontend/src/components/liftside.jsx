
'use client';

import { Sidebar } from 'flowbite-react';
import { BiLogOut, BiWrench, BiCog, BiSearchAlt, BiUserCheck, BiKey  } from "react-icons/bi";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logOut } from '../features/userSlice'
import config from '../app/config';

function LiftSide(props) {

  const { user } = useSelector((store) => store.user);

  const dispatch = useDispatch()
  const navaigate = useNavigate()

  function logout() {
    dispatch(logOut())
    navaigate('/login')
  }


  return (
    <Sidebar className='m-bg-color2 height-700 rounded-none basis-1/7 px-6 py-6 bg-gray-50 dark:bg-gray-600'>
      <Sidebar.Items className='m-bg-color2  pt-5 dark:bg-gray-800'>
        <Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item key={0} href="/search" icon={BiSearchAlt} className={props.select === 0 ? "m-bg-color-3 m-bg-color-4 " : "m-bg-color-4 "}>
              賃貸物件調査
            </Sidebar.Item>
            { user.username === config.admin_name && <Sidebar.Item key={1} href="/userlist" icon={BiUserCheck} className={props.select === 1 ? "m-bg-color-3 m-bg-color-4 " : "m-bg-color-4 "}>
            ユーザー管理
            </Sidebar.Item>}
            <Sidebar.Item key={2} href="/profile" icon={BiKey } className={props.select === 2 ? "m-bg-color-3 m-bg-color-4 " : "m-bg-color-4 "}>
              パスワード変更
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup className='!mt-0'>
            {/* <Sidebar.Item href="/profile" icon={BiUser} className={props.select === 4 ? "bg-gray-200" : ""}>
              プロフィール
            </Sidebar.Item> */}
            <Sidebar.Item href="#" onClick={e => { e.preventDefault(); logout() }} icon={BiLogOut}>
              <span>退会</span>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default LiftSide
