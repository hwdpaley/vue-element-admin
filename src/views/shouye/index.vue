<template>
  <div class="shouye">
    <div class="index-wrap">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(slide, index) in slides" :key="index">
          <img :src="slide.src" style="width:100%;" >
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
        <div slot="button-prev" class="swiper-button-prev" />
        <div slot="button-next" class="swiper-button-next" />
      </swiper>
    </div>
  </div>
</template>

<script>
// import SlideShow from "../subcomponents/SlideShow";
export default {
  data() {
    return {
      swiperOption: {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      slides: [
        {
          src: require("../../assets/shouye/shouye3.jpg"),
          title: "xxx1"
        },
        {
          src: require("../../assets/shouye//shouye4.jpg"),
          title: "xxx2"
        },
        {
          src: require("../../assets/shouye//shouye1.png"),
          title: "xxx3"
        },
        {
          src: require("../../assets/shouye//shouye2.png"),
          title: "xxx4"
        }
        // {
        //   src: require('../assets/5.jpg'),
        //   title: 'xxx5'
        // }
      ]
    };
  },

  mounted() {
    // setInterval(() => {
    //   console.log("simulate async data");
    //   if (this.swiperSlides.length < 10) {
    //     this.swiperSlides.push(this.swiperSlides.length + 1);
    //   }
    // }, 3000);
  }
};
</script>
<style scoped>
.shouye {
  padding: 30px;
}
.index-wrap {
  overflow: hidden;
  border-radius: 30px;
  /* height: 500px; */
}
</style>
