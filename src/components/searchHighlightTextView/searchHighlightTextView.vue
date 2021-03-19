<template>
<view>
<!--components/searchHighlightTextView/searchHighlightTextView.wxml-->
<text v-for="(item, index) in textArr" :key="index" :class="item == skeyword ? 'highlight' : 'normal'">{{item}}</text>
</view>
</template>

<script>

export default {
  data() {
    return {
      textArr: [],
      skeyword: '',
      stext: ''
    };
  },

  components: {},
  props: {
    keyword: {
      type: String
    },
    text: {
      type: String
    }
  },
  watch: {
    keyword: {
      handler: 'keywordChanged',
      immediate: true
    },
    text: {
      handler: 'textChanged',
      immediate: true
    }
  },
  options: {
    addGlobalClass: true
  },
  externalClasses: ['highlight'],
  methods: {
    keywordChanged(newVal) {
      this.skeyword = newVal
      this.manage();
    },

    textChanged(newVal) {
      this.stext = newVal;
      this.manage();
    },

    manage: function () {
      if (!this.stext) {
        return;
      }

      this.manageText(this.stext, this.skeyword || "");
    },
    manageText: function (str, key) {
      if (key) {
        this.textArr = str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%')
      } else {
        this.textArr = str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%')
      }
    }
  }
};
</script>
<style>
@import "./searchHighlightTextView.css";
</style>
