export default {
    menu_routers: state => state.routers.filter(route => route.isMenu),
    permission_routers: state => state.routers,
    addRouters: state => state.addRouters
}