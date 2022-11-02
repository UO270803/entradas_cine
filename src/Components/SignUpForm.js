import React from 'react';
import { Button, Form, Input } from 'antd';
import { Card, notification } from 'antd';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import SignUpSuccess from './SignUpSuccess';
import Fail from './Fail';

class SignUpForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ready: false
        }
    }

    async sendLogin(values) {
        const { data, error } = await this.props.supabase.auth.signUp({
            email: values.email,
            password: values.password,
          })
        if (error == null){
            this.setState({
                ready: true
            })
        }
        else {
            notification.error({
                message: 'Datos incorrectos',
                description:
                  'Los datos introducidos no son correcto, por favor compruébalos',
              });
        }
    }

    render() {
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });
        if (this.state.ready) {
            return <SignUpSuccess />
        }
        else {
            return (
                <div>
                    <Card bordered={false} className='myCard' style={{ background: '#001529', color: "white" }}>
                        <Form name="basic" labelCol={{ span: 24 / 3 }} wrapperCol={{ span: 24 / 3 }}
                            initialValues={{ remember: true, }}
                            onFinish={values => this.sendLogin(values)} autoComplete="off">

                            <Form.Item label="Email" name="email"
                                rules={[
                                    { required: true, message: 'Please input your username!', },
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Password" name="password"
                                rules={[
                                    { required: true, message: 'Please input your password!', },
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            <Form.Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}  >
                                <Button type="primary" htmlType="submit" block>Submit</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>

            )
        }

    }
}

export default SignUpForm;
