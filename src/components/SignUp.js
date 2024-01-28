import { React } from "react";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Result} from "antd";
import { auth, googleProvider } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {authActions} from '../store/authSlice'

export default function SignUp() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (user) => {
          if (user != null) {
            updateProfile(auth.currentUser, {
              displayName: email.split("@")[0],
            })
              .then(() => {
                console.log("Profile updated successfully")
                setIsRegistered(true)
              })
              .catch((error) => {
                console.log("Profile updated failed");
                setIsRegistered(false)
              });
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((userCredential) => {
          // console.log("Google signed in successfully");
          // console.log("ID", userCredential.user.uid);
          // console.log("Name", userCredential.user.displayName);
          // console.log("Email", userCredential.user.email);

          dispatch(
            authActions.signIn({
              uid: userCredential.user.uid,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
            })
          );
          
          navigate("/dashboard");
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <>
      {isRegistered === true ? <SignupFeedback />: 
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={signUp} className="login-form-button">
            Sign up
          </Button>
          <br />
          or
          <br />
          <Button
            type="primary"
            icon={<GoogleOutlined />}
            onClick={signUpWithGoogle}
          >
            SignUp with Google
          </Button>
        </Form.Item>
      </Form>}
    </>
  );
}

function SignupFeedback(){
  const navigate = useNavigate();
  const handleSignIn = () => {
    window.location.reload();
  }
  return (
    <Result
      status="success"
      title="Successfully Registered!"
      subTitle=""
      extra={[
        <Button type="primary" key="console" onClick={handleSignIn}>
          Signin
        </Button>,
      ]}
    />
  );
}