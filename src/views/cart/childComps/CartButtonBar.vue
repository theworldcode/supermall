<template>
  <div class="button-bar">
      <div class="check-content">
        <check-button class="select-all" :is-checked='isSelectAll' @click.native='SelectAll'></check-button>
        <span>全选</span>
      </div>
        <div class="price">合计：{{totalPrice}}</div>
        <div class="calculate" @click='calcClick'>去结算({{checkLength}})</div>
  </div>
</template>

<script>
    import CheckButton from './CheckButton'
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'CartButtonBar',
        components: {
            CheckButton
        },
        computed: {
            ...mapGetters(['cartList']),
            totalPrice() {
                return '¥ ' + this.$store.state.cartList.filter(item => {
                    return item.checked
                }).reduce((preValue, item) => {
                    return preValue + item.price * item.count
                }, 0).toFixed(2)
            },
            checkLength() {
                //$store.state.
                return this.cartList.filter(item => item.checked).length
            },
            isSelectAll() {
                if (this.cartList.length === 0) {
                    return false
                }
                return this.cartList.every(item => item.checked)
            }
        },
        methods: {
            SelectAll() {
                if (this.isSelectAll) {
                    for (let item of this.cartList) {
                        item.checked = false;
                    }
                } else {
                    for (let item of this.cartList) {
                        item.checked = true;
                    }
                }

            },
            calcClick() {
                if (!this.checkLength) {
                    this.$toast.show('请选择购买的商品', 2000);
                }
            }
        },
    }
</script>

<style scoped>
    .button-bar {
        /* height: 40px;
        background-color: rgba(17, 130, 236, 0.753);
        position: relative; */
        width: 100%;
        height: 40px;
        background-color: #eee;
        position: fixed;
        bottom: 50px;
        left: 0;
        box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
        font-size: 14px;
        color: #888;
        line-height: 40px;
        box-sizing: border-box;
        display: flex;
    }
    
    .select-all {
        height: 20px;
        width: 20px;
        line-height: 20px;
        margin-right: 5px;
    }
    
    .check-content {
        display: flex;
        align-items: center;
        margin-left: 10px;
        width: 60px;
        align-items: 40px;
    }
    
    .price {
        margin-left: 20px;
        flex: 1;
    }
    
    .calculate {
        width: 90px;
        background-color: rgb(255, 104, 4);
        color: #fff;
        text-align: center;
    }
</style>