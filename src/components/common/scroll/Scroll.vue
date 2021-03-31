<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
        <slot>

        </slot>
    </div>
  </div>
</template>

<script>
    import BScroll from '@better-scroll/core'
    import Pullup from '@better-scroll/pull-up'
    import ObserveImage from '@better-scroll/observe-image'

    BScroll.use(Pullup)
    export default {
        name: 'Scroll',
        data() {
            return {
                scroll: null
            }
        },
        props: {
            probeType: {
                type: Number,
                default: 0
            },
            pullUpLoad: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            //1.创建BScroll对象
            this.scroll = new BScroll(this.$refs.wrapper, {
                observeDOM: true,
                ObserveImage: true,
                click: true,
                probeType: this.probeType,
                pullUpLoad: this.pullUpLoad
            })

            //2.监听滚动的位置
            this.scroll.on('scroll', (position) => {
                    // console.log(position);
                    this.$emit('scroll', position);

                })
                //   console.log(this.scroll);
                //  this.scroll.refresh();
                //3.监听上拉事件
            this.scroll.on('pullingUp', () => {
                // console.log('上拉加载更多');
                this.$emit('pullingUp')
            })
        },
        methods: {
            scrollTo(x, y, time = 300) {
                this.scroll && this.scroll.scrollTo(x, y, time)
            },
            finishPullUp() {
                this.scroll.finishPullUp()
            },
            refresh() {
                this.scroll && this.scroll.refresh()

            }
        },
    }
</script>

<style scoped>
    /* .wrapper {
        padding-top: 44px;
    } */
</style>