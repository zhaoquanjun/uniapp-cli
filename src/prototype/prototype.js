var utils = require("../utils/utils.js");

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);

  if (index > -1) {
    this.splice(index, 1);
  }
};

String.prototype.hiddenCardId = function (frontLen, endLen) {
  var len = this.length - frontLen - endLen;
  var xing = '';

  for (var i = 0; i < len; i++) {
    xing += '*';
  }

  return this.substr(0, frontLen) + xing + this.substr(this.length - endLen);
}; //获取字符串首字母（兼容length==2表情情况）


String.prototype.firstLogicChar = function () {
  var s = this;
  if (!s || s.length === 0) return '#';
  if (s.length === 1) return s;
  var filterS = utils.filterEmoji(s);
  var index = s.indexOf(filterS);

  if (filterS.length !== 0 && index === 0) {
    //首字母不是表情
    return s.slice(0, 1).toUpperCase();
  } else {
    return s.slice(0, 2);
  }
};