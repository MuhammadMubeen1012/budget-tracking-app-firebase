import {useEffect , React} from "react";
import { LockOutlined, UserOutlined, GoogleOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { auth, googleProvider } from "../firebase/firebase";
import { signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/authSlice";

export default function SignIn() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  
  const signIn = (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          dispatch(
            authActions.signIn({
              uid: userCredential.user.uid,
              name: userCredential.user.displayName,
              email: userCredential.user.email,
            })
          );
          navigate("/dashboard");
        }
      );
    } catch (err) {
      console.error(err);
    }
  };
  
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((userCredential) => {
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
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
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
        <Button type="primary" onClick={signIn} className="login-form-button">
          Sign in
        </Button>
        <br />
        or
        <br />
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          onClick={signInWithGoogle}
        >
          SignIn with Google
        </Button>
      </Form.Item>
    </Form>
  );
}
