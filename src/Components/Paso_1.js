import React from 'react';
import withRouter from './withRouter';
import { Typography, PageHeader, Table, Card, InputNumber, Space, Descriptions, Image, Row, Col, Form } from 'antd';
import { Button, notification } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { generate, presetDarkPalettes } from '@ant-design/colors';



class Paso_1 extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
            sesion: {},
            pelicula: {},
            carrito: []
        };
    }

    componentDidMount() {
        this.sesionDetails();
    }

    sesionDetails = async () => {

        const { data, error } = await this.props.supabase
            .from('sesion')
            .select()
            .eq('id', this.id);



        if (error == null && data.length > 0) {
            let sesion = data[0];
            let pelicula_id = data[0].pelicula_id;

            const { data: pelicula, error } = await this.props.supabase
                .from('pelicula')
                .select()
                .eq('id', pelicula_id);

            if (error == null && data.length > 0) {

                // Data is a list
                this.setState({
                    sesion: sesion,
                    pelicula: pelicula[0]
                });
            }
        }

    }

    async addEntrada(values) {
        let carrito = this.state.carrito;
        let entrada = {
            'fila': values.fila,
            'columna': values.columna
        }
        let repetidas = this.state.carrito
            .filter(entrada_en_lista => entrada_en_lista.fila == entrada.fila && entrada_en_lista.columna == entrada.columna);
        let id = parseInt(this.id, 10);
        if (repetidas.length == 0) {
            const { data, error } = await this.props.supabase
                .from('entrada')
                .select('id')
                .eq('sesion_id', id)
                .eq('fila', entrada.fila)
                .eq('columna', entrada.columna);

            if (data.length == 0) {
                carrito.push(entrada);
                this.setState({
                    carrito: carrito
                });

            }

            else {
                notification.error({
                    message: 'Asiento ocupado',
                    description:
                        'Este asiento ya está ocupado. Por favor escoge otro',
                });
            }
        }
        else {
            notification.error({
                message: 'Asiento ya seleccionado',
                description:
                    'Ya has seleccionado este asiento. Por favor escoge otro.',
            });
        }

    }

    siguientePaso = async () => {
        if (this.state.carrito.length == 0) {
            notification.error({
                message: 'Ningun asiento seleccionado',
                description:
                    'Por favor escoge un asiento como mínimo.',
            });
        }
        else {
            this.props.siguientePaso(this.state.carrito);
        }

    }


    render() {
        const { Text } = Typography;
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

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
        let data = this.state.carrito.map(element => {
            element.key = "table" + element.fila + element.columna;
            return element;
        })




        return (
            <Card className='myCard' style={{ background: '#001529', color: "white" }} bordered={false} >
                <Row justify='space-around' gutter={[16, 32]}>
                    <Col className='title2' span={24 / 3}>
                        <Row gutter={[16, 32]}>
                            <Col span={24}>
                                {this.state.pelicula.titulo}
                            </Col>
                            <Form name="basic" labelCol={{ span: 18 }} wrapperCol={{ span: 6 }}
                                size="Large"
                                onFinish={values => this.addEntrada(values)} autoComplete="off">
                                <Form.Item label="Fila" name="fila">
                                    <InputNumber style={{ height: '50%' }} min={1} max={12} />
                                </Form.Item>
                                <Form.Item label="Columna" name="columna">
                                    <InputNumber style={{ height: '50%' }} min={1} max={23} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ sm: { offset: 8, span: 24 / 3 } }}  >
                                    <Button htmlType="submit" size='large' type='primary'>
                                        Añadir a carrito
                                    </Button>
                                </Form.Item>
                            </Form>
                            <Col span={24}>
                                <Button size='large' type='primary' onClick={this.siguientePaso}>
                                    Continuar
                                </Button>
                            </Col>

                        </Row>
                    </Col>
                    <Col className='title2' span={24 / 3}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                {this.state.sesion.hora}
                            </Col>
                            <Col span={24}>
                                <Space>
                                    <ShoppingCartOutlined />
                                    <Text style={{ color: 'white' }} className='title3'>Carrito</Text>
                                </Space>
                            </Col>
                            <Col span={24}>
                                <Table columns={columns} dataSource={data} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className='title2' span={24 / 3}>
                        {this.state.sesion.dia}
                    </Col>
                </Row>
            </Card>
        )

    }
}

export default withRouter(Paso_1);