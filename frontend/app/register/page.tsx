"use client";
import React, { useState, useEffect } from 'react';
import globalStyles from '@/app/styles/myGlobals.module.css'
import axios from 'axios';
import { ValidateEmailResult, ValidateUsernameResult, 
    RegisterUserResult, UserRegistrationData, 
    ValidateEmailWithMessage, ValidateUsernameWithMessage } from '../types/User';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/navigation';

import styles from '@/app/styles/registerUser.module.css';

type FieldError = {
    error: string,
    userTyped: boolean,
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [usernameError, setUsernameError] = useState<ValidateUsernameWithMessage>();
  const [emailError, setEmailError] = useState<ValidateEmailWithMessage>();

  const [first, setFirst] = useState<string>("");
  const [firstError, setFirstError] = useState<FieldError>({error:"",userTyped:false} as FieldError);
  const [last, setLast] = useState<string>("");
  const [lastError, setLastError] = useState<FieldError>({error:"",userTyped:false} as FieldError);

  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [password1Error, setPassword1Error] = useState<FieldError>({error:"",userTyped:false} as FieldError);
  const [password2Error, setPassword2Error] = useState<FieldError>({error:"",userTyped:false} as FieldError);
  
  const [registerError, setRegisterError] = useState<boolean>(false);

  const validationWaitTime = 500; // half a second

  const router = useRouter(); // Nextjs router object

  const validateUsername = () => {
    if(username) {
        axios.get<ValidateUsernameResult>(`http://localhost:8000/api/users/validate-username/${username}/`)
        .then((res) => setUsernameError(
                {
                    valid:res.data.valid,
                    message: "Username taken",
                } as ValidateUsernameWithMessage))
        .catch((err) => console.log(err));
    }
  };

  const validateEmail = () => {
    if(email) {
        axios.get<ValidateEmailResult>(`http://localhost:8000/api/users/validate-email/${email}/`)
        .then((res) => setEmailError(
            {
                valid:res.data.valid,
                message: "Email taken",
            } as ValidateEmailWithMessage))
        .catch((err) => console.log(err));
    }
  };

  // wait 1 second before validating username or email
  useEffect(() => {
    if(username === "" && usernameError) {
        setUsernameError(
            {
                valid: false,
                message: "Please input your username."
            } as ValidateUsernameWithMessage)
    } else {
        const timerId = setTimeout(() => {
            validateUsername();
        }, validationWaitTime);

        return () => clearTimeout(timerId);
    }
  }, [username]);

  useEffect(() => {
    if(email === "" && emailError) {
        setEmailError(
            {
                valid: false,
                message: "Please input your email."
            } as ValidateEmailWithMessage)
    } else {
        console.log("add validation") // TODO
        const timerId = setTimeout(() => {
            validateEmail();
        }, validationWaitTime);

        return () => clearTimeout(timerId);
    }
  }, [email]);

  const handleFirstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirst(e.target.value);
    setFirstError({error:firstError.error, userTyped:true} as FieldError)
  }
  const handleLastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLast(e.target.value);
    setLastError({error:lastError.error, userTyped:true} as FieldError)
  }
  const handlePassword1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword1(e.target.value);
    setPassword1Error({error:password1Error.error, userTyped:true} as FieldError)
  }
  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword2(e.target.value);
    setPassword2Error({error:password2Error.error, userTyped:true} as FieldError)
  }

  useEffect(() => {
    if(first === "") {
        setFirstError({error:"Please input your first name.",userTyped:firstError.userTyped} as FieldError)
    } else {
        setFirstError({error:"",userTyped:firstError.userTyped} as FieldError)
    }
  }, [first]);

  useEffect(() => {
    if(last === "") {
        setLastError({error:"Please input your last name.",userTyped:lastError.userTyped} as FieldError);
    } else {
        setLastError({error:"",userTyped:lastError.userTyped} as FieldError)
    }
  }, [last]);

  useEffect(() => {
    if(password1 === "") {
        setPassword1Error({error:"Please input your password.",userTyped:password1Error.userTyped} as FieldError);
    } else {
        setPassword1Error({error:"",userTyped:password1Error.userTyped} as FieldError)
    }
  }, [password1]);
  useEffect(() => {
    const timerId = setTimeout(() => {
        if(password2 === "") {
            if(password2Error.userTyped) {
                setPassword2Error({error:"Please re-type your password.",userTyped:true} as FieldError)
            }
        } else if(password1 != password2) {
            setPassword2Error({error:"Your passwords don't match :(",userTyped:password2Error.userTyped} as FieldError);
        } else {
            setPassword2Error({error:"",userTyped:password2Error.userTyped} as FieldError)
        }
    }, validationWaitTime);

    return () => clearTimeout(timerId);
  }, [password2]);

  const hideErrors = () => {
    setRegisterError(false);
  }

  const showErrors = () => {
    setRegisterError(true);
    const timerId = setTimeout(() => {
        const timerId = setTimeout(() => {
            hideErrors();
        }, 200);
    
        return () => clearTimeout(timerId);
    }, 400);

    return () => clearTimeout(timerId);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(usernameError === null || usernameError !== null && !usernameError?.valid);

    if(
        (usernameError === null || usernameError !== null && !usernameError?.valid) || 
        (emailError === null || emailError !== null && !emailError?.valid) || 
        firstError.error !== "" || 
        lastError.error !== "" || 
        password1Error.error !== "" ||
        password2Error.error !== ""
    ){
        if(username === "") {
            setUsernameError
            (
                {
                    valid: false,
                    message: "Please input your username."
                } as ValidateEmailWithMessage
            )
        }
        if(email === "") {
            setEmailError
            (
                {
                    valid: false,
                    message: "Please input your email."
                } as ValidateEmailWithMessage
            )
        }
        setFirstError(
            {error:firstError.error,userTyped:true} as FieldError
        )
        setLastError(
            {error:lastError.error,userTyped:true} as FieldError
        )
        setPassword1Error(
            {error:password1Error.error,userTyped:true} as FieldError
        )
        setPassword2Error(
            {error: (password2 === "" ? "Please re-type your password." : password2Error.error) ,userTyped:true} as FieldError
        )
        showErrors();
        return;
    }

    // Registration data to submit
    const registrationData: UserRegistrationData = {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
      first: first,
      last: last,
    };

    axios.post<RegisterUserResult>('http://localhost:8000/api/users/', registrationData)
      .then(response => {
        // Handle successful registration (redirect, show a success message, etc.)
        if(response.data.status === "success") {
            router.push('/login'); // Send user to login
        } else {
            console.log("Registration error");
        }
      })
      .catch(error => {
        // Handle registration error (display error message, etc.)
        console.error('Registration failed:', error);
      });
  };

  return (
    <div>
        <Navbar />
        <main className={`${styles.borderContainer} mt-5`}>
            <div className={globalStyles.text1}>
                <h1 className="m-4">Register</h1>
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <div className={`${styles.row} row`}>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Username
                            <input type="text" value={username} 
                                className={`
                                    ${styles.registerInput} 
                                    ${registerError ? styles.registerError : ""}
                                    ${usernameError && (!usernameError.valid ? styles.error : styles.valid)}`}
                                onChange={(e) => setUsername(e.target.value)} />
                            {
                                usernameError &&
                                !usernameError.valid && 
                                <span className={styles.errorMessage}>{usernameError.message}</span>
                            }
                        </div>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Email
                            <input type="text" value={email} 
                                className={`
                                    ${styles.registerInput}
                                    ${registerError ? styles.registerError : ""}
                                    ${emailError && (
                                        !emailError.valid ? styles.error : styles.valid)}`}
                                onChange={(e) => setEmail(e.target.value)} />
                            {
                                emailError && 
                                !emailError.valid && 
                                <span className={styles.errorMessage}>{emailError.message}</span>
                            }
                        </div>
                    </div>

                    <div className={`${styles.row} row`}>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            First name
                            <input type="text" value={first} 
                                className={`${styles.registerInput}
                                    ${registerError ? styles.registerError : ""} 
                                    ${firstError.userTyped && 
                                        (firstError.error === "" ? styles.valid : styles.error)}`}
                                onChange={(e) => handleFirstChange(e)} />
                            {
                                firstError.userTyped && firstError.error !== "" && 
                                    <span className={styles.errorMessage}>{firstError.error}</span>
                            }
                        </div>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Last name
                            <input type="text" value={last} 
                                className={`${styles.registerInput}
                                    ${registerError ? styles.registerError : ""}
                                    ${lastError.userTyped && 
                                        (lastError.error === "" ? styles.valid : styles.error)}`}
                                onChange={(e) => handleLastChange(e)} />
                            {
                                lastError.userTyped && lastError.error !== "" && 
                                    <span className={styles.errorMessage}>{lastError.error}</span>
                            }
                        </div>
                    </div>

                    <div className={`${styles.row} row`}>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Password
                            <input type="password" value={password1} 
                                className={`${styles.registerInput}
                                    ${registerError ? styles.registerError : ""}
                                    ${password1Error.userTyped && 
                                        (password1Error.error === "" ? styles.valid : styles.error)}`}
                                onChange={(e) => handlePassword1Change(e)} />
                            {
                                password1Error.userTyped && password1Error.error !== "" && 
                                    <span className={styles.errorMessage}>{password1Error.error}</span>
                            }
                        </div>
                        <div className='col me-2'>
                            <label className={styles.registerLabel} />
                            Re-type password
                            <input type="password" value={password2}
                                className={`${styles.registerInput}
                                    ${registerError ? styles.registerError : ""}
                                    ${password2Error.userTyped && 
                                        (password2Error.error === "" ? styles.valid : styles.error)}`}
                                onChange={(e) => handlePassword2Change(e)} />
                            {
                                password2Error.userTyped && password2Error.error !== "" && 
                                    <span className={styles.errorMessage}>{password2Error.error}</span>
                            }
                        </div>
                    </div>
                
                    <button type="submit" className={`${styles.registerButton} mb-5`}>
                        Register
                    </button>
                </form>
            </div>
        </main>
    </div>
  );
}