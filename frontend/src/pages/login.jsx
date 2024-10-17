
'use client';
import React from 'react';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Label, TextInput, Alert } from 'flowbite-react';
import { signin, resetError } from '../features/userSlice'
import { HiInformationCircle } from "react-icons/hi";

function Login() {

    const navigate = useNavigate();

    const { user, error } = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            navigate('/search', { replace: true });
        }
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [])
    useEffect(() => {
        if (user) {
            navigate('/search', { replace: true });
        }
    }, [user]);
    // useEffect(() => {
    //     setTimeout(() => {
    //         dispatch(resetError());
    //     }, 3000);
    // }, [error])

    const submitForm = async (e) => {
        e.preventDefault();
        dispatch(signin({ username, password }))
    }

    return (
        <div className='w-lvw h-lvh pt-52 bg-gray-600 m-bg-color1'>
            <form className=" bg-white max-w-md flex flex-col gap-4 mx-auto my-0 mt-0 rounded-xl px-5 py-8  border" onSubmit={submitForm}>
                <div className='flex justify-center '>
                    <p className='text-[30px]'>ログイン</p>
                </div>
                {error === "is not allowed" &&
                    <Alert color="failure" icon={HiInformationCircle}>
                        <span className="font-bold -ml-2 mr-1">エラー!</span> 承認されていません。
                    </Alert>
                }
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="メールアドレス" />
                    </div>
                    <TextInput id="name1" type="email" placeholder="メールアドレスを入力" onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="パスワード" />
                    </div>
                    <TextInput id="password1" placeholder='パスワードを入力' type="password" onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="flex justify-between mt-5">
                    <Link className='' to='/register'><Button className='w-[200px]' type="button">会員登録</Button></Link>
                    <Button color='gray' className='w-[200px]' type="submit">ログイン</Button>
                </div>
            </form>
        </div>

    );
}

export default Login;
