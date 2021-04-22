import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'

export default {
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            let oldproduct = context.state.cartList.find(item => item.iid === payload.iid)
            if (oldproduct) {
                context.commit(ADD_COUNTER, oldproduct)
                resolve('当前的商品数量加1')
            } else {
                payload.count = 1;
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品')
            }

        })

    }
}