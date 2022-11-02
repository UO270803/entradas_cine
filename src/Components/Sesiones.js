import React from 'react';
import { Link } from "react-router-dom"
import { Card, Col, Button, Row, Tabs, Typography, Radio, Form } from 'antd';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import '../css/style.css';


class Sesiones extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sesiones: [],
            sesiones_dia: '',
            all_sesiones: []
        }

    }

    componentDidMount() {
        this.getSesiones();
    }

    getSesiones = async () => {
        const { data, error } = await this.props.supabase.from('pelicula').select('*').eq('is_proximo_estreno', false).order('id');
        let tempSesiones = {};
        data.map(async (pelicula) => {
            tempSesiones[pelicula.titulo] = {
                "sesiones": {},
                "horas_duracion": pelicula.horas_duracion,
                "minutos_duracion": pelicula.minutos_duracion,
                "is_estreno": pelicula.is_estreno,
                "cartel": pelicula.cartel,
                "directores": pelicula.directores,
                "actores": pelicula.actores,
                "tipos": pelicula.tipos,
                "fecha_estreno": pelicula.fecha_estreno,
                "edad_minima": pelicula.edad_minima,
                "edad_minima_imagen": pelicula.edad_minima_imagen,
                "sinopsis": pelicula.sinopsis
            }
            const { data, error } = await this.props.supabase.from('sesion_con_sala_y_pelicula_id').select('*').eq('pelicula_id', pelicula.id);
            data.map(async (sesion) => {
                if (!(sesion.dia in tempSesiones[pelicula.titulo]["sesiones"])) {
                    tempSesiones[pelicula.titulo]["sesiones"][sesion.dia] = [];
                }

                tempSesiones[pelicula.titulo]["sesiones"][sesion.dia].push({
                    "hora": sesion.hora,
                    "sala": sesion.numero,
                    "id": sesion.id
                });
            });
            var result = [];

            for (var i in tempSesiones)
                result.push([i, tempSesiones[i]]);

            if (error == null) {
                this.setState({
                    sesiones: result,
                    sesiones_dia: '2022-11-02',
                    all_sesiones: result
                })
            }
        });



    }

    changeSesionesDia = async (dia) => {
        this.setState({
            sesiones: this.state.sesiones,
            sesiones_dia: dia
        });
    }

    filtrarPor = async (values) => {
        let sesiones = this.state.all_sesiones;

        if (values.target.value != 'todos') {
            sesiones = sesiones.filter(pelicula => pelicula[1].tipos.tipos.includes(values.target.value));
            this.setState({
                sesiones: sesiones
            })
        }
        else {
            this.setState({
                sesiones: this.state.all_sesiones
            })
        }
    }

    render() {
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

        const { Text } = Typography;



        let items = this.state.sesiones.map(sesion_tupla => {
            let sesiones = sesion_tupla[1].sesiones;

            var result = [];

            for (var i in sesiones)
                result.push({ label: new Date(i).toLocaleDateString(), key: i });

            return result;
        });



        return (
            <div>
                <Row>
                    <Col span={16} offset={4}>
                        <Tabs
                            size='large'
                            style={{ color: 'white' }}
                            centered
                            defaultActiveKey="1"
                            items={items[0]}
                            onChange={this.changeSesionesDia}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Text style={{ color: 'white' }} className='title3'>Filtrar: </Text>
                        <Radio.Group size='medium' onChange={e => this.filtrarPor(e)}>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="todos">
                                Todos</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Acción">
                                Acción</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Superhéroes">Superhéroes</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Ciencia Ficción">Ciencia Ficción</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Drama">Drama</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Historia">Historia</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Comedia">Comedia</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Romance">Drama</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Infantil">Infantil</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Terror">Terror</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Thriller">Thriller</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Familiar">Familiar</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Aventura">Aventura</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Animación">Animación</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Crimen">Crimen</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Fantasía">Drama</Radio.Button>
                            <Radio.Button style={{ background: 'none', color: '#1890ff' }} value="Misterio">Drama</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={[32, 32]} >
                    {this.state.sesiones.map(sesion_tupla => {
                        let sesion = sesion_tupla[1];
                        let titulo = sesion_tupla[0];
                        let sesiones = sesion.sesiones;
                        var sesionesArray = [];

                        for (var i in sesiones)
                            sesionesArray.push([i, sesiones[i]]);

                        let imagen = <img src={"/imageMockup.png"} />
                        if (sesion.cartel != null) {
                            imagen =
                                <img style={{ width: '20em' }} src={"https://bquafopvwextnjbwhevt.supabase.co/storage/v1/object/public/images/" + sesion.cartel} />
                        }

                        return (
                            <Col xs={20} offset={2} >
                                <Card bordered={false} className='myCard' style={{ background: '#001529', color: "white" }} key={sesion.id} >
                                    <Row gutter={[32, 32]}>
                                        <Col span={6}>
                                            {imagen}
                                        </Col>
                                        <Col span={18}>
                                            <Row>
                                                <Col span={22}>
                                                    <h1 className='title'>{titulo}</h1>
                                                </Col><Col>
                                                    <img style={{ width: '2em' }} src={"https://bquafopvwextnjbwhevt.supabase.co/storage/v1/object/public/images/" + sesion.edad_minima_imagen} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <p>{sesion.sinopsis}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                            </Row>
                                            <Row gutter={[16, 16]}>
                                                <Col span={24}>
                                                    <Card style={{ background: '#001529', color: "white" }} bordered={false} >
                                                        {sesionesArray
                                                            .filter(sesion => sesion[0] == this.state.sesiones_dia)
                                                            .map(sesiones_dia_seleccionado => {
                                                                return sesiones_dia_seleccionado[1]
                                                                    .map(sesion_dia => {
                                                                        const gridStyle = {
                                                                            textAlign: 'center',
                                                                            backgroundColor: '#001529',
                                                                            border: 'none',
                                                                            margin: '0.5em'
                                                                        };
                                                                        return (

                                                                            <Card.Grid style={gridStyle}>
                                                                                <Link to={"/sesion/" + sesion_dia.id}>
                                                                                    <div>
                                                                                        <h2 className='title2'>{sesion_dia.hora}</h2>
                                                                                        Sala {sesion_dia.sala}
                                                                                    </div>
                                                                                </Link>
                                                                            </Card.Grid>

                                                                        );
                                                                    })
                                                            })
                                                        }
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col >
                        )
                    })
                    }
                </Row >
            </div >
        )
    }
}

export default Sesiones;
