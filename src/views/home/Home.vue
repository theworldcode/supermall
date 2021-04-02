<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
         @tabClick='tabClick' ref='tabControl1' 
         class="tab-control" v-show='isTabFixed'></tab-control>
    <scroll class="content" ref="scroll"
             :probe-type='3' @scroll='contentScroll'
             :pull-up-load='true'
             @pullingUp='loadMore' >
        <home-swiper :banners='banners' @swiperImageLoad='swiperImageLoad'></home-swiper>
        <recommend-view :recommends='recommends'></recommend-view>
        <feature-view></feature-view>
        <tab-control :titles="['流行','新款','精选']" 
         @tabClick='tabClick' ref='tabControl2'></tab-control>
        <goods-list :goods="showGoods"></goods-list>
        
    </scroll>
    <back-top @click.native='backClick' v-show='isShowBackTop'></back-top>
   
  </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import Scroll from 'components/common/scroll/Scroll'
    import TabControl from 'components/content/tabControl/TabControl'
    import GoodsList from 'components/content/goods/GoodsList'
    import BackTop from 'components/content/backTop/BackTop'

    import HomeSwiper from './childComps/HomeSwiper'
    import RecommendView from './childComps/RecommendView'
    import FeatureView from './childComps/FeatureView'
    import {
        debounce
    } from 'common/utils'

    import {
        getHomeMultidata,
        getHomeGoods
    } from 'network/home'




    export default {
        name: "Home",
        components: {
            NavBar,
            Scroll,
            TabControl,
            GoodsList,
            BackTop,
            HomeSwiper,
            RecommendView,
            FeatureView
        },
        data() {
            return {
                banners: [],
                recommends: [],
                goods: {
                    'pop': {
                        page: 0,
                        list: []
                    },
                    'new': {
                        page: 0,
                        list: []
                    },
                    'sell': {
                        page: 0,
                        list: []
                    }
                },
                currentType: 'pop',
                isShowBackTop: false,
                tabOffsetTop: 0,
                isTabFixed: false,
                saveY: 0
            }

        },
        computed: {
            showGoods() {
                return this.goods[this.currentType].list
            }
        },
        created() {
            //1.请求多个数据
            this.getHomeMultidata();
            //2.请求商品数据
            this.getHomeGoods('pop');
            this.getHomeGoods('new');
            this.getHomeGoods('sell');

        },
        mounted() {
            //1.监听item中图片加载完成
            const refresh = debounce(this.$refs.scroll.refresh, 200)
            this.$bus.$on('itemImageLoad', () => {
                // console.log('------');
                refresh()
            })

            //2.获取tabControl的offsettop
            //  this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop

        },
        activated() {
            this.$refs.scroll.scrollTo(0, this.saveY, 0)
            this.$refs.scroll.refresh()
        },
        deactivated() {
            this.saveY = this.$refs.scroll.getScrollY()
        },
        methods: {


            /*事件监听相关方法*/
            tabClick(index) {
                switch (index) {
                    case 0:
                        this.currentType = 'pop'
                        break
                    case 1:
                        this.currentType = 'new'
                        break
                    case 2:
                        this.currentType = 'sell'
                        break
                }
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;
            },
            backClick() {
                // console.log('topback');
                this.$refs.scroll.scrollTo(0, 0);
            },
            contentScroll(position) {
                //1.判断BackTop是否显示
                this.isShowBackTop = Math.abs(position.y) > 1000

                //2.决定tabControl是否吸顶
                this.isTabFixed = Math.abs(position.y) > this.tabOffsetTop
            },
            loadMore() {
                // console.log('shangla');
                this.getHomeGoods(this.currentType)
            },
            swiperImageLoad() {
                this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
            },

            /*网络请求相关方法*/
            //1.请求多个数据
            getHomeMultidata() {
                getHomeMultidata().then(res => {
                    this.banners = res.data.banner.list;
                    this.recommends = res.data.recommend.list;
                    //  console.log(res);

                })
            },
            //2.请求商品数据
            getHomeGoods(type) {
                const page = this.goods[type].page + 1;
                getHomeGoods(type, page).then(res => {
                    this.goods[type].list.push(...res.data.list);
                    this.goods[type].page += 1;
                    this.$refs.scroll.finishPullUp()
                })
            }


        },

    }
</script>

<style scoped>
    #home {
        height: 100vh;
    }
    
    .home-nav {
        background-color: var(--color-tint);
        color: #fff;
        /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 9; */
    }
    
    .tab-control {
        position: relative;
        z-index: 9;
    }
    
    .content {
        position: absolute;
        top: 44px;
        bottom: 49px;
        left: 0;
        right: 0;
        overflow: hidden;
        /* height: calc(100%-93px);
        
        margin-top: 44px; */
    }
</style>