export default {
    menu_routers: state => state.router.filter(route => route.isMenu),
    permission_routers: state => state.routers,
    addRouters: state => state.addRouters
}