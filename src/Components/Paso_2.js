import React from 'react';
import { Link } from "react-router-dom";
import { Card, Form, Col, Row, Space, Typography, Table, Button } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from './withRouter';

class Paso_2 extends React.Component {

    constructor(props) {
        super(props);
        this.id = this.props.params.id;
        this.state = {
            menus: [],
            carrito_menus: []
        };


    }

    componentDidMount() {
        this.getmenusSummary();
    }

    getmenusSummary = async () => {
        const { data, error } = await this.props.supabase
            .from('menu')
            .select('*');


        if (error == null) {
            this.setState({
                menus: data
            });
        }
    }

    siguientePaso = async () => {
        this.props.siguientePaso(this.state.carrito_menus);
    }

    addMenu = async (values) => {
        let id = values.id;
        let carrito_menus = this.state.carrito_menus;
        let menu = this.state.menus.filter(menu => menu.id == id)[0]
        let menu_repetido = carrito_menus.filter(menu_comprado => menu_comprado.nombre == menu.nombre)
        if (menu_repetido.length > 0){
            let new_menu ={
                'nombre': menu.nombre,
                'cantidad': menu_repetido[0].cantidad + 1,
                'id': id,
                'precio': menu.precio
            }
            let index = carrito_menus.indexOf(menu_repetido[0]);
            delete carrito_menus[index];
            carrito_menus[index] = new_menu;
        }
        else {
            let new_menu ={
                'nombre': menu.nombre,
                'cantidad': 1,
                'id': id,
                'precio': menu.precio
            }
            carrito_menus.push(new_menu)
        }

        this.setState({
            carrito_menus: carrito_menus
        })
    }


    render() {
        let columns = [
            {
                title: 'Fila',
                dataIndex: 'fila',
            },
            {
                title: 'Columna',
                dataIndex: 'columna',
            },
        ]
        let data = this.props.carrito.map(element => {
            element.key = "table" + element.fila + element.columna;
            return element;
        })

        let menu_columns = [
            {
                title: 'Menu',
                dataIndex: 'nombre'
            },
            {
                title: 'Cantidad',
                dataIndex: 'cantidad'
            }
        ]

        let menus_data = this.state.carrito_menus.map(element => {
            element.key = "table" + element.nombre;
            return element;
        })

        const { Text } = Typography;
        const { Meta } = Card;
        return (
            <Row justify='space-between' gutter={[16, 16]} >
                {this.state.menus.map(menu => {
                    let imagen =
                        <img src={"https://bquafopvwextnjbwhevt.supabase.co/storage/v1/object/public/images/" + menu.imagen} />


                    return (
                        <Col span={4} >
                            <Card
                                cover={imagen
                                }
                                actions={[
                                    <Form name="basic"
                                        size="Large"
                                        onFinish={values => this.addMenu(values)} >
                                        <Form.Item name='id' initialValue={menu.id} hidden>

                                        </Form.Item>
                                        <Form.Item >
                                            <Button htmlType="submit">
                                                <ShoppingCartOutlined />
                                            </Button>

                                        </Form.Item>
                                    </Form>,
                                ]}
                            >
                                <Meta
                                    title={menu.nombre + " - " + menu.precio + "€"}
                                    description={menu.descripcion}
                                />
                            </Card>
                        </Col>
                    )
                })}
                <Col className='title2' span={8}>
                    <Row>
                        <Col span={24}>
                            <Space>
                                <ShoppingCartOutlined />
                                <Text style={{ color: 'white' }} className='title3'>Carrito</Text>
                            </Space>
                        </Col>
                        <Col span={24}>
                            <Table columns={columns} dataSource={data} />
                        </Col>
                        <Col span={24}>
                            <Table columns={menu_columns} dataSource={menus_data} />
                        </Col>
                        <Col span={24}>
                            <Button type='primary' size='large' onClick={this.siguientePaso}>
                                Continuar
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default withRouter(Paso_2);
