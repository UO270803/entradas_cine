import React from 'react';
import withRouter from './withRouter';
import { Typography, PageHeader, Table, Card, InputNumber, Space, Descriptions, Image, Row, Col, Form } from 'antd';
import { Button, notification } from 'antd';
import { ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { generate, presetDarkPalettes } from '@ant-design/colors';
import Paso_1 from './Paso_1';
import Paso_2 from './Paso_2';
import Paso_3 from './Paso_3';
import Paso_4 from './Paso_4';
import Paso_5 from './Paso_5';



class Sesion extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
            paso: 1,
            carrito: []
        };
    }

    siguientePaso = async (carrito) => {
        let paso = this.state.paso;
        let state_carrito = this.state.carrito;

        Array.prototype.push.apply(state_carrito, carrito);

        paso = paso + 1;
        this.setState({
            paso: paso,
            carrito: state_carrito
        });
    }

    render() {
        if (this.state.paso == 1){
            return (
                <Paso_1 supabase={this.props.supabase} siguientePaso={this.siguientePaso} />
            )
        }
        else if (this.state.paso == 2) {
            return (
                <Paso_2 supabase={this.props.supabase} siguientePaso={this.siguientePaso} carrito={this.state.carrito} />
            )
        }
        else if (this.state.paso == 3){
            return <Paso_3 supabase={this.props.supabase} siguientePaso={this.siguientePaso} />
        }
        else if (this.state.paso == 4){
            return <Paso_4 supabase={this.props.supabase} siguientePaso={this.siguientePaso} carrito={this.state.carrito} />
        }
        else if (this.state.paso == 5){
            return <Paso_5 />
        }
    }
}

export default withRouter(Sesion);