
'use client';
import React from 'react';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { HiInformationCircle } from "react-icons/hi";
import { Button, Checkbox, Label, TextInput, Alert } from 'flowbite-react';
import { signin, resetError } from '../features/userSlice'
import axios from 'axios';
import config from '../app/config';

function Register() {

    const navigate = useNavigate();

    const { user, error } = useSelector((store) => store.user);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");

    //error
    const [signupError, setSignupError] = useState(0);

    useEffect(() => {
        if (user) {
            navigate('/search', { replace: true });
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
        setSignupError(0)
        e.preventDefault();

        if (password !== password1) {
            return;
        }

        axios.post(`${config.server_url}/register`, {
            email,
            username,
            password
        })
            .then(function (response) {
                if (response.data.message === "created") {
                    setSignupError(3)
                    // setTimeout(() => {
                    //     navigate('/login', { replace: true });
                    // }, 1000)
                }
                else if (response.data.message === "user alreay exist") {
                    setSignupError(1)
                }
            })
            .catch(err => {
                setSignupError(2)
                console.log(err)
            })

    }

    return (
        <div className='w-lvw h-lvh pt-52 m-bg-color1'>
        <form className=" bg-white flex max-w-md flex-col gap-4 mx-auto my-0 rounded-xl px-5 py-8 dark:bg-gray-900 border" onSubmit={submitForm}>
            <div className='flex justify-center '>
                <p className='text-[30px]'>会員登録</p>
            </div>
            {signupError === 1 && <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-bold -ml-2 mr-1">エラー!</span> 名前またはメールが登録されています。
            </Alert>
            }
            {signupError === 2 && <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-bold -ml-2 mr-1">エラー!</span> 登録できませんでした。
            </Alert>
            }
            {signupError === 3 && <Alert color="info" icon={HiInformationCircle}>
                <span className="font-bold  -ml-2 mr-1">成功!</span> 登録が成功しました。
            </Alert>
            }
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="name" value="名前" />
                </div>
                <TextInput type="name" placeholder="名前入力" onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="email" value="メールアドレス" />
                </div>
                <TextInput type="email" placeholder="メールアドレスを入力" onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password" value="パスワード" />
                </div>
                <TextInput placeholder='パスワードを入力' type="password" onChange={e => setPassword(e.target.value)} required />
            </div>
            {password !== password1 && <span className='text-red-600 -mb-3 -mt-2 font-medium	text-xs	'>パスフレーズが一致しません。</span>}
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="password1" value="パスフレーズの確認" />
                </div>
                <TextInput placeholder='パスフレーズの確認' type="password" onChange={e => setPassword1(e.target.value)} required />
            </div>
            <div className="flex justify-between mt-5">
                <Link className='' to='/login'>
                    <Button className='w-[200px]' type="button">ログイン</Button>
                </Link>
                <Button color='gray' className='w-[200px]' type="submit">会員登録</Button>
            </div>
        </form>
        </div>

    );
}

export default Register;
