<template>
  <div class="detail">
      <detail-nav-bar class="detail-nav" @titleClick='titleClick' ref="nav"></detail-nav-bar>
      <scroll class="content1" ref="scroll" @scroll='contentScroll'
      :probe-type="3">
        <detail-swiper :top-images='topImages'></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info :param-info="paramInfo" ref="param"></detail-param-info>
        <detail-comment-info :comment-info='commentInfo' ref="comment"></detail-comment-info>
        <goods-list :goods="recommends" ref="recommend"></goods-list>    
    </scroll>
        <detail-bottom-bar @addCart='addToCart'></detail-bottom-bar>
        <back-top @click.native='backClick' v-show='isShowBackTop'></back-top>
        <!-- <toast :message="message" :show='show'></toast> -->
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
    import DetailBottomBar from './childComps/DetailBottomBar'

    import Scroll from 'components/common/scroll/Scroll'
    import GoodsList from 'components/content/goods/GoodsList'

    // import Toast from 'components/common/toast/Toast'
    import {
        getDetail,
        getRecommend,
        Goods,
        GoodsParam,
        Shop
    } from 'network/detail'

    import {
        itemListenerMixin,
        backTopMixin,
    } from 'common/mixin'
    import {
        debounce
    } from 'common/utils'

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
                themeTopYs: [],
                getThemeTopY: null,
                currentIndex: 0,
                // message: '',
                // show: false

            }
        },
        mixins: [itemListenerMixin, backTopMixin],
        components: {
            DetailNavBar,
            DetailSwiper,
            DetailBaseInfo,
            DetailShopInfo,
            DetailGoodsInfo,
            DetailParamInfo,
            DetailCommentInfo,
            DetailBottomBar,
            Scroll,
            GoodsList,
            // Toast
        },
        created() {


        },
        mounted() {
            //1.保存传入的id
            this.iid = this.$route.params.id;
            //2.根据ID请求详情数据
            getDetail(this.iid).then(res => {
                    const data = res.result;
                    //1.获取顶部轮播图数据
                    this.topImages = data.itemInfo.topImages
                        //this.$refs.scroll.refresh()
                        // console.log(data);
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
                    this.$nextTick(() => {

                    })
                })
                //3.请求推荐数据
            getRecommend().then(res => {
                    //console.log(res);
                    this.recommends = res.data.list;
                })
                //4.给getThemeTopY赋值
            this.getThemeTopY = debounce(() => {
                this.themeTopYs = [];
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.param.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
                this.themeTopYs.push(Number.MAX_VALUE);
                //console.log(this.themeTopYs);
            })
        },
        destroyed() {
            this.$bus.$off('itemImageLoad', this.itemImgListener)
        },
        methods: {
            imageLoad() {
                this.$refs.scroll.refresh()
                this.getThemeTopY();
            },
            titleClick(index) {
                this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44, 200)
            },
            // 标题和内容的联动效果
            contentScroll(position) {
                const positionY = -position.y;
                let length = this.themeTopYs.length - 1;
                for (let i = 0; i < length; i++) {
                    if (this.currentIndex !== i && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
                        this.currentIndex = i;
                        this.$refs.nav.currentindex = this.currentIndex;
                        break;
                    }
                }
                this.isShowBackTop = positionY > 1000
            },
            addToCart() {
                //1.获取购物车需要展示的信息
                const product = {};
                product.image = this.topImages[0];
                product.title = this.goods.title;
                product.desc = this.detailInfo.desc;
                product.price = this.goods.realPrice;
                product.iid = this.iid;
                //2.将商品添加到购物车
                // this.$store.commit('addCart', product)
                this.$store.dispatch('addCart', product).then(res => {
                    // this.message = res;
                    // this.show = true;
                    // setTimeout(() => {
                    //     this.show = false;
                    // }, 1500)
                    this.$toast.show(res, 2000);
                })
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
        height: calc(100% - 44px - 55px);
        /* overflow: hidden; */
    }
</style>