//数据转化  
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/


function formatTime(timestamp, format) {
  var date = new Date(timestamp);
  return formatDate(date, format);
}

function formatDate(date, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }

  return format;
}
/*校验电话码格式 */


function isTelCode(str) {
  var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return reg.test(str);
}

function showError(err) {
  var title = '出错了';

  if (typeof err === 'string') {
    title = err;
  } else if (err.errMsg) {
    title = err.errMsg;
  }

  setTimeout(() => {
    uni.showToast({
      duration: 2000,
      icon: 'none',
      title: title
    });
  }, 50);
}

function showSuccess(title) {
  setTimeout(() => {
    uni.showToast({
      title: title
    });
  }, 50);
}

function filterEmoji(text) {
  var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
  return text.replace(new RegExp(ranges.join('|'), 'g'), '');
}

function formatTimeSecond(s) {
  return formatTimeSecondWithSign(s, '分', '秒');
}

function formatTimeSecondWithSign(s, mSign, sSign) {
  s = s % 60000 / 1000;
  var t;

  if (s > -1) {
    var min = Math.floor(s / 60);
    var sec = Math.floor(s % 60);

    if (min <= 0) {
      return sec + sSign;
    } else {
      return min + mSign + sec + sSign;
    }
  }

  return 0 + sSign;
}

function getPreviousPage() {
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1]; //当前页面

  var prevPage = pages[pages.length - 2]; //上一个页面

  return prevPage;
} //去左空格


function ltrim(s) {
  return s.replace(/(^\s*)/g, "");
} //去右空格


function rtrim(s) {
  return s.replace(/(\s*$)/g, "");
} //去左右空格


function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports.formatTimeSecond = formatTimeSecond;
module.exports.formatTimeSecondWithSign = formatTimeSecondWithSign;
module.exports.formatTime = formatTime;
module.exports.formatDate = formatDate;
module.exports.isTelCode = isTelCode;
module.exports.showError = showError;
module.exports.showSuccess = showSuccess;
module.exports.filterEmoji = filterEmoji;
module.exports.getPreviousPage = getPreviousPage;
module.exports.trim = trim;