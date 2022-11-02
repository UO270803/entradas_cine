import React from 'react';
import { Link } from "react-router-dom";
import { Card, Result, Divider, Radio, Descriptions, Form, Col, Input, Row, Space, Typography, Table, Button } from 'antd';


class Fail extends React.Component {
    render() {
        const {Text} = Typography;

        return (<Result
            status="error"
            title={<Text style={{ color: 'white' }} className='title2'>Vaya... algo no ha ido bien</Text>}
            subTitle={<Text style={{ color: 'white' }} className='title3'>Comprueba los datos introducidos y vuelve a intentarlo</Text>}
            extra={[
                <Link to="/compras">
                    <Button type="primary" key="console">
                        Go Console
                    </Button>
                </Link>
            ]}
        />

        )
    }
}

export default Fail;
