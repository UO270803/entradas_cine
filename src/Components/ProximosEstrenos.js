import React from 'react';
import { Link } from "react-router-dom"
import { Card, Col, Button, Row, Tabs, Typography, Radio, Form } from 'antd';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import '../css/style.css';


class ProximosEstrenos extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            sesiones: []
        }

    }

    componentDidMount() {
        this.getSesiones();
    }

    getSesiones = async () => {
        const { data, error } = await this.props.supabase.from('pelicula').select('*').eq('is_proximo_estreno', true);
        let tempSesiones = {};
        data.map(async (pelicula) => {
            tempSesiones[pelicula.titulo] = {
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

            var result = [];

            for (var i in tempSesiones)
                result.push([i, tempSesiones[i]]);

            if (error == null) {
                this.setState({
                    sesiones: result
                })
            }
        });



    }


    render() {
        const colors = generate('#1890ff', {
            theme: 'dark',
            backgroundColor: '#141414'
        });

        const { Text } = Typography;




        return (
            <div>
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
                                                <Col span={24}>
                                                    <h2 className='title2'>Estreno:</h2><h3 className='title3'>{sesion.fecha_estreno}</h3>
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

export default ProximosEstrenos;
