import React from 'react';
import { Link } from "react-router-dom";
import { Card, Divider, Radio, Descriptions, Form, Col, Input, Row, Space, Typography, Table, Button } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from './withRouter';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import { grey } from '@ant-design/colors';

class Paso_4 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;
        this.state = {
        };
        this.entradas = this.props.carrito.filter(item =>
            item.hasOwnProperty('fila'));
        this.menus = this.props.carrito.filter(item =>
            item.hasOwnProperty('precio'));

    }

    siguientePaso = async (values) => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        console.log(user)
        const { data, error } = await this.props.supabase
            .rpc('add_compra', {
                comprador: user.email,
                metodo_pago: values.metodo_pago
            });
        console.log(error)
        const { data: entrada, error: error_entrada } = await this.props.supabase
            .from('entrada')
            .insert(this.entradas.map(entrada => {
                return {
                    fila: entrada.fila,
                    columna: entrada.columna,
                    sesion_id: this.id,
                    compra_id: data
                }
            }));
        const { data: menu, error: erro_menu } = await this.props.supabase
            .from('compra_menu')
            .insert(this.menus.map(menu => {
                return {
                    menu_id: menu.id,
                    compra_id: data
                }
            }));
        this.props.siguientePaso([]);
    }

    render() {
        const { Text } = Typography;
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

        let entradas_string =
            this.entradas.map(entrada =>
                entrada.fila + '-' + entrada.columna)
                .reduce((stringPre, stringAct) => stringAct + ', ' + stringPre, '')
                .slice(0, -2);

        let total = 7.50 * this.entradas.length + this.menus.map(menu => menu.precio).reduce((curr, acc) => acc + curr, 0)
        return (
            <Row justify='space-between' gutter={[16, 16]}>
                <Col offset={1} span={11}>
                    <Descriptions labelStyle={{ color: "white" }} contentStyle={{ color: "white" }} title={<Text style={{ color: 'white' }} className='title2'>Resumen</Text>}>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} labelStyle={{ color: 'white', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} label="Entradas">{entradas_string + ' (' + 7.50 * this.entradas.length + '€)'}</Descriptions.Item>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} labelStyle={{ color: 'white', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} label="Menus">
                            <Space>
                                {this.menus.map(menu => {
                                    return (
                                        <div>
                                            <div>
                                                {menu.nombre + " (" + menu.precio + "€): " + menu.cantidad + " "}
                                            </div>
                                        </div>
                                    )
                                })}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item span={24} contentStyle={{ color: grey[2], fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} labelStyle={{ color: 'white', fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif", fontSize: ' 2em' }} label="Total">{total + '€'}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col offset={1} span={11}>
                    <Form name="basic" size="Large"
                        onFinish={values => this.siguientePaso(values)} autoComplete="off">
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Form.Item name='metodo_pago' initialValue="efectivo">
                                    <Radio.Group defaultValue="efectivo" buttonStyle="solid">
                                        <Radio.Button value="efectivo">Efectivo</Radio.Button>
                                        <Radio.Button value="credito">Tarjeta de credito</Radio.Button>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Form.Item>
                                <Col span={24}>
                                    <Button type='primary' size='large' htmlType='submit'>
                                        Finalizar compra
                                    </Button>
                                </Col>
                            </Form.Item>
                        </Row>
                    </Form>
                </Col>
            </Row >

        )
    }
}

export default withRouter(Paso_4);
