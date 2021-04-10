<template>
  <div class="detail">
      <detail-nav-bar class="detail-nav"></detail-nav-bar>
      <scroll class="content1" ref="scroll">
        <detail-swiper :top-images='topImages'></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo"></detail-param-info>
        <detail-comment-info :comment-info='commentInfo'></detail-comment-info>
        <goods-list :goods="recommends"></goods-list>
    </scroll>
      
  </div>
</template>

<script>
    import DetailNavBar from './childComps/DetailNavBar'
    import DetailSwiper from './childComps/DetailSwiper'
    import DetailBaseInfo from './childComps/DetailBaseInfo'
    import DetailShopInfo from './childComps/DetailShopInfo'
    import DetailGoodsInfo from './childComps/DetailGoodsInfo'
    import DetailParamInfo from './childComps/DetailParamInfo'
    import DetailCommentInfo from './childComps/DetailCommentInfo'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'
    import {
        getDetail,
        getRecommend,
        Goods,
        GoodsParam,
        Shop
    } from 'network/detail'

    import {
        itemListenerMixin
    } from 'common/mixin'

    export default {
        name: 'Detail',
        data() {
            return {
                iid: null,
                topImages: [],
                goods: {},
                shop: {},
                detailInfo: {},
                paramInfo: {},
                commentInfo: {},
                recommends: [],

            }
        },
        mixins: [itemListenerMixin],
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            Scroll,
            GoodsList
        },
        created() {
            //1.保存传入的id
            this.iid = this.$route.params.id;
            //2.根据ID请求详情数据
            getDetail(this.iid).then(res => {

                    const data = res.result;
                    //1.获取顶部轮播图数据
                    this.topImages = data.itemInfo.topImages
                        //this.$refs.scroll.refresh()
                        //  console.log(res);
                        //2.获取商品信息
                    this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
                        //3.获取店铺信息
                    this.shop = new Shop(data.shopInfo)
                        //4.保存商品的详情数据
                    this.detailInfo = data.detailInfo;
                    //5.获取参数的信息
                    this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
                        //6.取出评论信息
                    if (data.rate.cRate !== 0) {
                        this.commentInfo = data.rate.list[0]
                    }
                })
                //3.请求推荐数据
            getRecommend().then(res => {
                //console.log(res);
                this.recommends = res.data.list;
            })

        },
        mounted() {

        },
        destroyed() {
            this.$bus.$off('itemImageLoad', this.itemImgListener)
        },
        methods: {
            imageLoad() {
                this.$refs.scroll.refresh()
            }
        },
    }
</script>

<style scoped>
    .detail {
        height: 100vh;
    }
    
    .detail-nav {
        position: relative;
        z-index: 9;
        background-color: #fff;
    }
    
    .content1 {
        height: calc(100% - 44px);
        /* overflow: hidden; */
    }
</style>