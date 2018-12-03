function stopevent(event) {
  event = event ? event : window.event;
  if (event.preventDefault) {
    event.preventDefault();
  }
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
  return false;
}

function htmlDecode(str, html) {
  str = str.replace(/&(\w*);/gi, function (match) {
    return $('<div>').html(match).text();
  });
  if (html) return str;
  return str.replace(/&#([0-9]{1,10});/gi, function (match, numStr) {
    var num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}

function htmlEncode(str, params) {
  if (str == null) return '';
  str = htmlDecode(str, true);
  params = params || {};
  var double = params.double;
  var tags = params.tags;
  var basic = params.basic;

  var result = "";
  var i;
  var temp;
  for (i = 0; i < str.length; i++) {
    var char = str.charAt(i);
    var code = str.charCodeAt(i);
    if (!double && code == 38 && str.charCodeAt(i + 1) == 35) {
      result += char;
    } else if (!double && code == 35 && str.charCodeAt(i - 1) == 38) {
      result += char;
      temp = true;
    } else if (!double && code == 59 && temp) {
      result += char;
    } else if (/[a-z0-9]/i.test(char)) {
      result += char;
      if (/[a-z]/i.test(char)) {
        temp = false;
      }
    } else {
      temp = false;
      result += "&#" + code + ";";
    }
  }
  if (basic) {
    var basicList = {
      '&#32;': ' ',
      '&#33;': '!',
      '&#34;': '"',
      '&#35;': '#',
      '&#36;': '$',
      '&#37;': '%',
      '&#38;': '&',
      '&#39;': "'",
      '&#40;': '(',
      '&#41;': ')',
      '&#42;': '*',
      '&#43;': '+',
      '&#44;': ',',
      '&#45;': '-',
      '&#46;': '.',
      '&#47;': '/',
      '&#58;': ':',
      '&#59;': ';',
      '&#60;': '<',
      '&#61;': '=',
      '&#62;': '>',
      '&#63;': '?',
      '&#64;': '@',
      '&#91;': '[',
      '&#92;': '\\',
      '&#93;': ']',
      '&#94;': '^',
      '&#95;': '_',
      '&#96;': '`',
      '&#123;': '{',
      '&#124;': '|',
      '&#125;': '}',
      '&#126;': '~'
    };
    for (i in basicList) {
      result = result.split(i).join(basicList[i]);
    }
  }
  if (tags) {
    var tagsList = {
      '&#60;': '<',
      '&#62;': '>',
      '&#47;': '/',
      '&#61;': '=',
      '&#34;': '"',
      '&#32;': ' ',
      '&#39;': "'"
    };
    for (i in tagsList) {
      result = result.split(i).join(tagsList[i]);
    }
  }
  return result;
}



function getDataForm(form) {
  if (!form) return;

  var postdata = {};
  $(form).find('input,select,textarea').each(function (index, obj) {
    if ($(obj).attr('name')) {
      if ($(obj).get(0).tagName == 'INPUT') {
        if ($(obj).attr('crypt') && $(obj).val()) {
          if ($(obj).attr('crypt') != 'none') {
            var crypt = $(obj).attr('crypt').replace('|S1|', $(obj).val());
            eval('postdata[$(obj).attr(\'name\')] = ' + crypt.toString());
          } else {
            postdata[$(obj).attr('name')] = $(obj).val();
          }
        } else if ($(obj).attr('type') == 'password' && $(obj).val()) {
          postdata[$(obj).attr('name')] = $().crypt({
            method: 'md5',
            source: $(obj).val()
          });
        } else if ($(obj).attr('type') == 'radio') {
          if ($(obj).is(':checked')) {
            postdata[$(obj).attr('name')] = $(obj).val();
          } else if (!postdata[$(obj).attr('name')]) {
            postdata[$(obj).attr('name')] = '';
          }
        } else if ($(obj).attr('type') == 'checkbox') {
          if (/[\[]]/i.test($(obj).attr('name'))) {
            var name = $(obj).attr('name').replace('[]', '');
            if ($(obj).is(':checked')) {
              postdata[name + '[' + $(obj).val() + ']'] = $(obj).val();
            }
          } else if ($(obj).is(':checked')) {
            postdata[$(obj).attr('name')] = $(obj).val();
          }
        } else if ($(obj).attr('type') == 'text') {
          postdata[$(obj).attr('name')] = $(obj).attr('placeholder') != $(obj).val() ? htmlEncode($(obj).val(), {
            basic: true
          }) : '';
        }
      } else if ($(obj).get(0).tagName == 'SELECT') {
        postdata[$(obj).attr('name')] = $(obj).children('option:selected').val();
      } else if ($(obj).get(0).tagName == 'TEXTAREA') {
        postdata[$(obj).attr('name')] = $(obj).attr('placeholder') != $(obj).val() ? htmlEncode($(obj).val(), {
          tags: true
        }) : '';
      } else {
        postdata[$(obj).attr('name')] = $(obj).val();
      }

    }
  });
  return postdata;
}
