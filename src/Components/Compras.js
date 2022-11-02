import React from 'react';
import { Button } from 'antd';
import { Table } from 'antd';
import { notification } from 'antd';

class Compras extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            entradas: [],
            menus: []
        }

    }

    componentDidMount = async () => {
        this.getEntradas();
        this.getMenus();
    }

    deleteEntrada = async (id) => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        if (user != null) {
            const { data, error } = await this.props.supabase
                .from('entrada')
                .delete()
                .match({ compra_id: id })

            if (error == null) {
                this.getEntradas();

                notification.success({
                    message: "Entrada devuelta",
                    duration: 3,
                    description:
                        'Tu entrada ha sido devuelta con éxito',
                });

            }
        }
    }

    deleteMenu = async (id) => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        if (user != null) {
            const { data, error } = await this.props.supabase
                .from('compra_menu')
                .delete()
                .match({ compra_id: id.compra_id, menu_id: id.menu_id })

            if (error == null) {
                this.getMenus();

                notification.success({
                    message: "Menú devuelto",
                    duration: 3,
                    description:
                        'El menu se ha eliminado con exito',
                });
            }
        }
    }


    getEntradas = async () => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        let result = []

        if (user != null) {
            const { data: compras, error } = await this.props.supabase
                .from('compra')
                .select('id')
                .eq('comprador', user.email);
            if (error == null) {
                compras.map(async (compra) => {
                    const { data: entradas, error } = await this.props.supabase
                        .from('entrada')
                        .select('id, fila, columna, sesion_id')
                        .eq('compra_id', compra.id);
                    if (error == null) {
                        entradas.map(async (entrada) => {
                            const { data: sesion, error } = await this.props.supabase
                                .from('sesion')
                                .select('dia, hora, pelicula_id')
                                .eq('id', entrada.sesion_id);
                            if (error == null && sesion.length > 0) {
                                const { data: pelicula, error } = await this.props.supabase
                                    .from('pelicula')
                                    .select('titulo')
                                    .eq('id', sesion[0].pelicula_id);
                                if (error == null && pelicula.length > 0) {
                                    result.push({
                                        'pelicula': pelicula[0].titulo,
                                        'dia': sesion[0].dia,
                                        'hora': sesion[0].hora,
                                        'fila': entrada.fila,
                                        'columna': entrada.columna,
                                        'id': entrada.id
                                    })
                                    this.setState({
                                        entradas: result
                                    })
                                }

                            }
                        })
                    }
                })




            }


        }
    }

    getMenus = async () => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        let result = []

        if (user != null) {
            const { data: compras, error } = await this.props.supabase
                .from('compra')
                .select('id')
                .eq('comprador', user.email);
            if (error == null) {
                compras.map(async (compra) => {
                    const { data: menus_comprados, error } = await this.props.supabase
                        .from('compra_menu')
                        .select('menu_id')
                        .eq('compra_id', compra.id);
                    if (error == null && menus_comprados.length > 0) {
                        menus_comprados.map(async (menu_comprado) => {
                            const { data: menu, error } = await this.props.supabase
                                .from('menu')
                                .select('*')
                                .eq('id', menu_comprado.menu_id);
                            if (error == null && menu.length > 0) {
                                let menu_existe = result.filter(element => element.menu == menu[0].nombre);
                                if (menu_existe.length > 0) {
                                    let updated_menu = {
                                        'menu': menu[0].nombre,
                                        'precio': menu[0].precio,
                                        'cantidad': menu_existe[0].cantidad + 1,
                                        'id': compra.id
                                    }

                                    let index = result.indexOf(menu_existe[0]);
                                    delete result[index];
                                    result[index] = updated_menu;
                                }
                                else {
                                    result.push({
                                        'menu': menu[0].nombre,
                                        'precio': menu[0].precio,
                                        'cantidad': 1,
                                        'id': {'compra_id': compra.id, 'menu_id': menu[0].id}
                                    })

                                }
                                this.setState({
                                    menus: result
                                })
                            }
                        })
                    }
                    else {
                        this.setState({
                            menus: []
                        })
                    }
                })
            }
        }
    }


    render() {
        let columns_entradas = [
            {
                title: 'Pelicula',
                dataIndex: 'pelicula',
            },
            {
                title: 'Dia',
                dataIndex: 'dia',
            },
            {
                title: 'Hora',
                dataIndex: 'hora'
            },
            {
                title: 'Fila',
                dataIndex: 'fila',
            },
            {
                title: 'Columna',
                dataIndex: 'columna',
            },
            {
                title: 'Actions',
                dataIndex: 'id',
                render: id =>
                    <div>
                        <Button type="link" onClick={() => this.deleteEntrada(id)} >Delete</Button>
                    </div>,

            },

        ]
        let data_entradas = this.state.entradas.map(element => {
            element.key = "table" + element.id
            return element;
        })

        let columns_menus = [
            {
                title: 'Menu',
                dataIndex: 'menu',
            },
            {
                title: 'Precio',
                dataIndex: 'precio',
            },
            {
                title: 'Cantidad',
                dataIndex: 'cantidad'
            },/*
            {
                title: 'Actions',
                dataIndex: 'id',
                render: id =>
                    <div>
                        <Button type="link" onClick={() => this.deleteMenu(id)} >Delete</Button>
                    </div>,

            },*/

        ]
        let data_menus = this.state.menus.map(element => {
            element.key = "table" + element.id
            return element;
        })


        return (
            <div>
                <Table columns={columns_entradas} dataSource={data_entradas} />
                <Table columns={columns_menus} dataSource={data_menus} />
            </div>
        )
    }
}

export default Compras;
