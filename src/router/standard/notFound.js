import { NotFound } from '../import'
export default {
    path: '*',
    name: 'notFound',
    meta: {
        alias: '404',
        bread: true
    },
    leaf: false,
    hidden: true,
    component: NotFound
}