<template>
  <div class="loader">
    <div class="loader__circle"></div>
  </div>
</template>

<style lang="scss" scoped>
  // TODO временно

  .loader {
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;

    &__circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 20px dashed green;
      border-top-color: green;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      transform-origin: 0 0;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg) translate(-50%, -50%);
    }
    100% {
      transform: rotate(360deg) translate(-50%, -50%);
    }
  }
</style>
