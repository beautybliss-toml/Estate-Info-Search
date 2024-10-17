
'use client';
import { Avatar, Dropdown, Navbar, DarkThemeToggle, Button } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logOut } from '../features/userSlice'
import { BsBell } from "react-icons/bs";


function Header() {

  const dispatch = useDispatch()
  const navaigate = useNavigate()

  const { user } = useSelector((store) => store.user);

  function logout() {
    dispatch(logOut())
    navaigate('/login')
  }

  return (
    <Navbar fluid className='navbar bg-stone-200 px-2 m-bg-color1'>
      <Navbar.Brand href="/search">
        <h1 className='c-brand font-semibold m-text-color1'>調査</h1>
      </Navbar.Brand>
      <div className="flex items-center">

        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar className=' p-1 ring-2 ring-gray-300 dark:ring-gray-500 rounded-full w-10 h-10 relative overflow-hidden bg-gray-100 dark:bg-gray-600' />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{user.username1}</span>
            <span className="block truncate text-sm font-medium">{ }</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={ () => { navaigate('/profile') }}>プロフィール設定</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>退会</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>

    </Navbar>
  );
}

export default Header

