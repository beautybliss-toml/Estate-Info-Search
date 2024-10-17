'use client';
import React from 'react';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Checkbox, Label, TextInput, Alert } from 'flowbite-react';
import { signin, resetError } from '../features/userSlice'
import { HiInformationCircle } from "react-icons/hi";

function InvalidRoute() {

    const navigate = useNavigate();

    const { user, error } = useSelector((store) => store.user);

    useEffect(() => {
        if (!user) {
            setTimeout(() => {
              navigate('/Login', { replace: true });
            }, 1500)
        }
    }, [])


    return (
      <></>
    );
}

export default InvalidRoute;
