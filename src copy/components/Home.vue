<template>
  <div id="page-wrapper">
    <!-- banner -->
    <section id="banner">
      <div class="content">
        <header>
          <h2>logo</h2>
          <p>记录美好生活</p>
        </header>
      </div>
      <!-- <a href="#" class="goto-next">next</a> -->
    </section>
    <!-- one -->
    <section id="one">
      <span>
        <!-- <img src="../../public/images/Charlotte_1.png" alt=""> -->
      </span>
      <div class="content">
        1212
      </div>
    </section>
    <!-- two -->
    <section id="two">
      <div class="content">
        <span>12312</span>
      </div>
    </section>
    <!-- three -->
    <section id="three">
      <div class="content">
        1212
      </div>
    </section>
    <!-- footer -->
    <footer id="footer">
    </footer>
  </div>
</template>

<style lang="scss" scoped>
#page-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #e88;
  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: center;
  transform-style: preserve-3d;

  #banner {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-image: url('../../public/images/Charlotte_5.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    box-shadow: 0 0.25em 0.5em 0 $bgc-color;
    position: relative;
    left: 0;
    bottom: 0;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 95%;
      height: 100vh;
      padding: 4.5em;


      &:before {
        background-image: -moz-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
        background-image: -webkit-linear-gradient(top, rgba(23, 24, 32, 0.75), rgb(85 85 85 / 65%));
        background-image: -ms-linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
        background-image: linear-gradient(top, rgba(23, 24, 32, 0.95), rgba(23, 24, 32, 0.95));
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        box-shadow: 0 12px 150px 10px $bgc-color;
      }

      .wave-svg {
        position: relative;
        top: 150px;
      }
    }

    .goto-next {
      border: 0;
      bottom: 0;
      display: block;
      height: 5em;
      left: 50%;
      margin: 0 0 0 -5em;
      overflow: hidden;
      position: absolute;
      text-indent: 10em;
      white-space: nowrap;
      width: 10em;
      z-index: 1;
    }
  }

  #one {
    width: 100%;
    height: 100vh;
    background-image: url('../../public/images/Charlotte_1.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    box-shadow: 0 0.25em 0.5em 0 $bgc-color;
    position: relative;
    top: 0;
    left: -10px;
    z-index: -1;
    transform: translateZ(-1px) translateY(10px) scale(2);
    background-attachment: fixed;

    .content {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 30%;
      background-attachment: fixed;
      background-color: $bgc-color;
      border-top: 10px solid $bgc-color2;
    }
  }

  #two {
    width: 100%;
    height: 100vh;
    background-image: url('../../public/images/Charlotte_2.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: relative;
    left: 0;
    bottom: 0;
    box-shadow: 0 0.25em 0.5em 0 $bgc-color;

    .content {
      height: 100%;
      width: 30%;
      background-color: $bgc-color;
      position: absolute;
      right: 0;
      bottom: 0;
      border-left: 10px solid $bgc-color2;
    }
  }

  #three {
    width: 100%;
    height: 100vh;
    background-image: url('../../public/images/Charlotte_3.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    box-shadow: 0 0.25em 0.5em 0 $bgc-color;
    position: relative;
    z-index: -2;
    transform: translateZ(-1px) scale(2.1);
    // background-attachment: fixed;

    .content {
      height: 100%;
      width: 30%;
      background-color: $bgc-color;
      position: absolute;
      left: 0;
      bottom: 0;
      border-right: 10px solid $bgc-color2;
    }
  }

  #footer {
    width: 100%;
    height: 100vh;
    position: relative;
    top: 0;
    left: 0px;
    // transform: translateZ(-1px) translateY(10px) scale(2);

    background-image: url('../../public/images/Charlotte_4.png');
  }
}
</style>
