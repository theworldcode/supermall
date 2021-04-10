import Vue from 'vue'
import VueRouter from 'vue-router'

//懒加载
const Home = () =>
    import ('views/home/Home')
const Category = () =>
    import ('views/category/Category')
const Cart = () =>
    import ('views/cart/Cart')
const Profile = () =>
    import ('views/profile/Profile')
const Detail = () =>
    import ('views/detail/Detail')
    //1.安装插件
Vue.use(VueRouter)

//2.创建router
const routes = [{
        path: '',
        redirect: '/home',
        meta: { showTab: true }
    },
    {
        path: '/home',
        component: Home,
        meta: { showTab: true }
    },
    {
        path: '/category',
        component: Category,
        meta: { showTab: true }
    },
    {
        path: '/cart',
        component: Cart,
        meta: { showTab: true }
    },
    {
        path: '/profile',
        component: Profile,
        meta: { showTab: true }
    },
    {
        path: '/detail/:id',
        component: Detail,
        meta: { showTab: false }
    }
]
const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router