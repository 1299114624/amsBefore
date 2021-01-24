import { NotFound } from '../import'
export default {
    path: '*',
    name: 'notFound',
    meta: {
        alias: '404'
    },
    hidden: true,
    component: NotFound
}