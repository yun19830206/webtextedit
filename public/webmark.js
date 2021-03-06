(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.webmark = {}));
}(this, (function (exports) {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

  var CustomTagName = 'span';
  var HighLightClass = 'qoxop_highlight';
  /**
   * ???????????????????????????????????????????????????????????????
   * @param start
   * @param end 
   */

  function countStartEndChunk(start, end) {
    return "".concat(start.nodeValue).concat(end.nodeValue).trim();
  }
  /**
   * ??????node????????????????????????
   * @param {Node} node 
   */


  function QueryAllTextNodes(node) {
    var texts = [];

    if (node) {
      if (window.selfIframe.createNodeIterator) {
        var textIterator = window.selfIframe.createNodeIterator(node, NodeFilter.SHOW_TEXT);
        var textNode = textIterator.nextNode();

        while (textNode) {
          texts.push(textNode);
          textNode = textIterator.nextNode();
        }

        return texts;
      } else {
        for (var i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].hasChildNodes()) {
            texts.push.apply(texts, _toConsumableArray(QueryAllTextNodes(node.childNodes[i])));
          } else if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
            texts.push(node.childNodes[i]);
          }
        }
      }
    }

    return texts;
  }
  /**
   * ???????????????????????????????????????
   */


  function countSelectionInfo(id) {
    var selection = window.selfWindow.getSelection();

    if (!selection.isCollapsed) {
      var range = selection.getRangeAt(0);
      var startOffset = range.startOffset,
        endOffset = range.endOffset;
      var selectionInfo = {
        id: id,
        container: {
          index: -1,
          tagname: ''
        },
        textNodes: {
          start: null,
          end: null,
          startEndChunk: ''
        },
        text: selection.toString()
      }; // ??????????????????

      var containerElem = range.commonAncestorContainer;

      while (true) {
        if (containerElem.nodeType === Node.ELEMENT_NODE || !containerElem) {
          break;
        }

        containerElem = containerElem.parentElement;
      } // ??????node??????            


      var allTextNodes = QueryAllTextNodes(containerElem);

      for (var i = 0; i < allTextNodes.length; i++) {
        if (allTextNodes[i] === range.startContainer) {
          selectionInfo.textNodes.start = {
            index: i,
            split: startOffset
          };
        }

        if (allTextNodes[i] === range.endContainer) {
          selectionInfo.textNodes.end = {
            index: i,
            split: endOffset
          };
          break;
        }
      }

      selectionInfo.textNodes.all = allTextNodes;
      selectionInfo.textNodes.startEndChunk = countStartEndChunk(range.startContainer, range.endContainer); // ??????????????????

      var tags = window.selfIframe.getElementsByTagName(containerElem.nodeName);

      for (var _i = 0; _i < tags.length; _i++) {
        if (tags.item(_i) === containerElem) {
          selectionInfo.container.index = _i;
          selectionInfo.container.tagname = containerElem.nodeName;
          selectionInfo.container.elem = containerElem;
          break;
        }
      }

      selection.removeAllRanges();
      return selectionInfo;
    }

    return false;
  }
  /**
   * ??????????????????
   * @param MarkInfo 
   */

  function render(mark) {
    var _mark$container = mark.container,
      tagIndex = _mark$container.index,
      tagname = _mark$container.tagname,
      _mark$textNodes = mark.textNodes,
      start = _mark$textNodes.start,
      end = _mark$textNodes.end;
    var elem = mark.container.elem,
      allTexts = mark.textNodes.all;
    var Wrp = window.selfIframe.createElement(CustomTagName);
    var className = "".concat(HighLightClass, " ").concat(mark.className ? mark.className : '');
    Wrp.setAttribute('class', "".concat(mark.unused ? '' : className, " ").concat(mark.id));
    Wrp.setAttribute('data-markid', mark.id);

    if (mark.style) {
      Object.keys(mark.style).forEach(function (key) {
        // @ts-ignore
        Wrp.style[key] = mark.style[key];
      });
    }

    if (mark.meta) {
      Wrp.setAttribute('meta_data', JSON.stringify(mark.meta));
    }

    if (!allTexts || allTexts.length < 1) {
      if (!(elem instanceof Element)) {
        var elems = window.selfIframe.getElementsByTagName(tagname);
        elem = elems.item(tagIndex);
      }

      allTexts = QueryAllTextNodes(elem); // check chunk

      if (allTexts && allTexts[start.index] && allTexts[end.index]) {
        var startEndChunk = countStartEndChunk(allTexts[start.index], allTexts[end.index]);

        if (mark.textNodes.startEndChunk !== startEndChunk) {
          return false;
        }
      } else {
        return false;
      }
    }

    var WrpFn = function WrpFn(text) {
      var wrp = Wrp.cloneNode();
      wrp.innerHTML = text.nodeValue;
      text.parentNode.replaceChild(wrp, text);
    };

    try {
      if (start.index === end.index) {
        var nextText = allTexts[start.index].splitText(start.split).splitText(end.split - start.split);
        WrpFn(nextText.previousSibling);
        return true;
      }

      for (var i = start.index + 1; i < end.index; i++) {
        WrpFn(allTexts[i]);
      }

      var startText = allTexts[start.index].splitText(start.split);
      var endText = allTexts[end.index].splitText(end.split).previousSibling;
      WrpFn(startText);
      WrpFn(endText);
      return true;
    } catch (error) {
      // console.error(error);
      return false;
    }
  }

  var _ref = function () {
    var afns = [];
    return {
      setAfterMark: function setAfterMark(fn) {
        afns.push(fn);
      },
      runAfters: function runAfters(mi) {
        afns.reduce(function (old, fn) {
          return fn(mi, old);
        }, null);
      }
    };
  }(),
    setAfterMark = _ref.setAfterMark,
    runAfters = _ref.runAfters;

  var setMarkTagName = function setMarkTagName(tagname) {
    return CustomTagName = tagname;
  };

  var setDefaultClass = function setDefaultClass(className) {
    return HighLightClass = className;
  };
  function core() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;

    var info = countSelectionInfo(options.id);
    var success = false;

    if (info !== false) {
      var _mi = _objectSpread({}, info, {}, options);

      success = render(_mi);

      if (success) {
        runAfters(_mi);
      }

      if (typeof callback === 'function') {
        callback(_mi, success);
      }
    }

    return success;
  }

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var pageHashPrefix = 'marksData';
  var config = {
    pageHashPrefix: pageHashPrefix,
    pageHash: function pageHash() {
      return pageHashPrefix;
      // return pageHashPrefix + href.replace(location.origin, '');

    },
    getPageInfo: function getPageInfo() {
      return {
        title: document.title
      };
    }
  };
  var MarkStore = {};
  /**
   *  ?????????????????????
   * @param marks 
   */

  function clearDomSideEffect(marks) {
    marks.reverse().forEach(function (item) {
      var domArray = Array.from(window.selfIframe.getElementsByClassName(item.id) || []);
      domArray.forEach(function (elem) {
        return elem.replaceWith(elem.firstChild);
      });
    });
    window.selfIframe.normalize();
  }
  /**
   * ?????????????????????????????????
   */


  function getCurrentPageMarks() {
    var pageHash = config.pageHash,
      getPageInfo = config.getPageInfo;
    var hash = pageHash(window.location.href);

    if (!MarkStore[hash]) {
      MarkStore[hash] = JSON.parse(window.localStorage.getItem(hash)) || {
        marks: [],
        pageInfo: getPageInfo()
      };
    }

    return MarkStore[hash];
  }
  /**
   * ???????????????
   * @param options 
   */


  function setConfig() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var obj = Object.assign({
      markTagName: 'span',
      defaultClassName: 'qoxop_highlight'
    }, options);
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];

      if (key === 'markTagName') {
        setMarkTagName(value);
      } else if (key === 'defaultClassName') {
        setDefaultClass(value);
      } else {
        config[key] = value;
      }
    });
    pageHashPrefix = config.pageHashPrefix;
    return config;
  }
  /**
   * ??????????????????????????????
   */


  function renderAll() {
    window.selfIframe.normalize();
    var allmarks = getCurrentPageMarks();

    if (!allmarks || !allmarks.marks || allmarks.marks.length === 0) {
      return true;
    }

    var elems = window.selfIframe.getElementsByClassName(allmarks.marks[0].id);

    if (elems && elems.length > 0) {
      return true;
    }

    if (!allmarks.marks.every(function (item) {
      return render(item);
    })) {
      removeAll({
        domain: false,
        retainTexts: true
      });
    }

    return true;
  }
  /**
   * ????????????
   * @param id 
   * @param allRmHandler 
   */


  function remove(id, allRmHandler) {
    var allMarks = getCurrentPageMarks();
    allMarks.marks.some(function (item) {
      if (id === item.id && !item.unused) {
        var elems = window.selfIframe.getElementsByClassName(id); // ??????class

        var elemArr = Array.prototype.slice.call(elems);
        elemArr.forEach(function (elem) {
          return elem.setAttribute('class', id);
        });
        item.unused = true;
        return true;
      }
    });

    if (allMarks.marks.every(function (item) {
      return item.unused;
    })) {
      if (allRmHandler) {
        allRmHandler(function () {
          allMarks.marks = [];
          removeAll({
            domain: false,
            retainTexts: false
          });
        }, allMarks.marks);
      } else {
        removeAll({
          domain: false,
          retainTexts: false
        });
      }
    } else {
      var pageHash = config.pageHash;
      var hash = pageHash(window.location.href);
      window.localStorage.setItem(hash, JSON.stringify(allMarks));
    }
  }

  /**
   * ??????????????????
   */
  var query = {
    marks: function marks() {
      return Object.keys(localStorage).filter(function (key) {
        return key.indexOf(pageHashPrefix) === 0;
      }).reduce(function (dateset, key) {
        return _objectSpread$1({}, dateset, _defineProperty({}, key, JSON.parse(localStorage[key])));
      }, {});
    },
    texts: function texts(includeHistory) {
      var historys = {};

      if (includeHistory) {
        historys = Object.keys(localStorage).filter(function (key) {
          return key.indexOf("history_".concat(pageHashPrefix, "_")) === 0;
        }).reduce(function (dateset, key) {
          return _objectSpread$1({}, dateset, _defineProperty({}, key, JSON.parse(localStorage[key])));
        }, {});
      }

      var marks = query.marks();
      return Object.keys(marks).reduce(function (dataset, key) {
        return _objectSpread$1({}, dataset, _defineProperty({}, key, marks[key].marks.map(function (m) {
          return m.text;
        })));
      }, historys);
    }
  };

  /**
   * ??????????????????
   * @param params 
   */
  function removeAll() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _domain$retainTexts$o = _objectSpread$1({
      domain: false,
      retainTexts: false
    }, options),
      domain = _domain$retainTexts$o.domain,
      retainTexts = _domain$retainTexts$o.retainTexts;

    var pageHash = config.pageHash(window.location.href);
    var markSet = [];
    Object.keys(localStorage).filter(function (key) {
      if (domain === true) {
        return key.indexOf(pageHashPrefix) === 0;
      } else {
        return key === pageHash;
      }
    }).forEach(function (key) {
      try {
        var _marks = JSON.parse(localStorage.getItem(key) || '{}').marks;
        markSet = markSet.concat(_marks);

        if (retainTexts) {
          // ??????????????????
          var historys = JSON.parse(localStorage.getItem("history_".concat(pageHashPrefix)) || '[]');
          localStorage.setItem("history_".concat(pageHashPrefix), JSON.stringify(historys.concat(_marks.map(function (item) {
            return item.text;
          }))));
        }
      } catch (error) {
        console.error(error);
      }

      localStorage.removeItem(key);
      delete MarkStore[key];
    }); // ??????????????????????????????

    clearDomSideEffect(markSet);
  }
  /**
   * ???????????????
   */


  setAfterMark(function (mi) {
    var pageHash = config.pageHash,
      getPageInfo = config.getPageInfo;
    var hash = pageHash(mi.href);
    var storeMi = mi;
    delete storeMi.textNodes.all;
    delete storeMi.container.elem;

    if (!MarkStore[hash]) {
      MarkStore[hash] = {
        marks: [storeMi],
        pageInfo: getPageInfo()
      };
    } else {
      MarkStore[hash].marks.push(storeMi);
    }

    window.localStorage.setItem(hash, JSON.stringify(MarkStore[hash]));
  });

  var DOMContentLoaded = new Promise(function (resolve) {
    window.addEventListener('load', function () {
      const editIframe = document.getElementById("myEditor323_ifr");
      window.selfIframe = editIframe.contentDocument;
      let cssLink = window.selfIframe.createElement("link");
      cssLink.href = "webmark.css";
      cssLink.rel = "stylesheet";
      cssLink.type = "text/css";
      window.selfIframe.head.appendChild(cssLink)
      setTimeout(function () {
        resolve();
      }, 10);
    });
  });

  function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var config = setConfig(options);
    var pageId = config.pageHash(window.location.href);
    var immediate = options.immediate,
      onUrlChange = options.onUrlChange,
      _options$delay = options.delay,
      delay = _options$delay === void 0 ? 500 : _options$delay;
    var cancelKey = 0;

    if (immediate) {
      DOMContentLoaded.then(renderAll);
    }

    if (onUrlChange) {
      var observer = new MutationObserver(function () {
        if (cancelKey !== 0) {
          clearTimeout(cancelKey);
        } // @ts-ignore


        cancelKey = setTimeout(function () {
          cancelKey = 0;
          var newPageId = config.pageHash(window.location.href);

          if (pageId !== newPageId) {
            pageId = newPageId;
            renderAll();
          }
        }, delay);
      });
      observer.observe(window.selfIframe.body, {
        childList: true,
        subtree: true
      });
    }
  }

  exports.init = init;
  exports.mark = core;
  exports.query = query;
  exports.remove = remove;
  exports.removeAll = removeAll;
  exports.renderAll = renderAll;
  exports.setConfig = setConfig;

  Object.defineProperty(exports, '__esModule', { value: true });

})));