// REQUIRES he.js to script injection
window.PAGE_SCALE_FACTOR = 0.3;



function Pages() {
  var self = this;
  
  function Page(content, userOpts) {
    var self = this;
    
    // Default Options
    var opts = {
      title: "",
      fontSize: 12,
      fontFamily: "Times New Roman",
      width: "8.5in",
      height: "11in"
    };
    if(typeof userOpts !== 'undefined') {
      for(var o in opts) {
        if(typeof userOpts[o] !== 'undefined') {
          opts[o] = userOpts[o];
        }
      }
    }
    if(typeof content === 'undefined') {
      content = "";
    }
    content = he.encode(content);

    var pageStyle = {
      width: opts.width,
      height: opts.height
    };
    pageStyle["margin-bottom"] = parseFloat(opts.height)*-(1-PAGE_SCALE_FACTOR) + opts.height.slice(-2);

    var textStyle = {
      "font-family": opts.fontFamily,
      "font-size": opts.fontSize
    };

    var stats = stringStats(content);

    var elem = document.createElement('div');
    elem.setAttribute("class", "page-wrapper");
    elem.style.width = parseFloat(opts.width)*PAGE_SCALE_FACTOR + opts.height.slice(-2);
    elem.innerHTML =
'<div class="metadata width">' + opts.width + '</div>\
<div class="metadata height">' + opts.height + '</div>\
<div class="page" style="' + ObjectToString(pageStyle) + '">\
  <div class="content" style="' + ObjectToString(textStyle) + '">' + content + '</div>\
</div>\
<div class="postdata">\
  <div class="metadata title">' + opts.title + '</div>\
  <div class="metadata word-count">' + stats +'</div>\
  <div class="metadata font">' + textStyle["font-family"] + ', ' + textStyle["font-size"] + '</div>\
          </div>';
    elem.content = elem.querySelector('.content');
    elem.page = elem.querySelector('.page');
    elem.metadata = {
      width: elem.querySelector('.width'),
      height: elem.querySelector('.height'),
      title: elem.querySelector('.title'),
      wordCount: elem.querySelector('.word-count'),
      font: elem.querySelector('.font')
    }
    this.elem = elem;
    
    this.update = function(newContent, newOpts) {
      var dimensionsChanged = false;
      if(typeof newOpts !== 'undefined') {
        for(var o in opts) {
          if(typeof newOpts[o] !== 'undefined') {
            if((o === 'width' || o === 'height') && newOpts[o] !== opts[o]) {
              dimensionsChanged = true;
            }
            opts[o] = newOpts[o];
          }
        }
        textStyle = {
          "font-family": opts.fontFamily,
          "font-size": opts.fontSize
        };
        elem.metadata.font.innerHTML = textStyle["font-family"] + ', ' + textStyle["font-size"];
        elem.content.style = ObjectToString(textStyle);
      }
      if(dimensionsChanged) {
        elem.metadata.title.innerHTML = opts.title;
        elem.style.width = parseFloat(opts.width)*PAGE_SCALE_FACTOR + opts.height.slice(-2);
        elem.page.style.width = opts.width;
        elem.metadata.width.innerHTML = opts.width;
        elem.page.style.height = opts.height;
        elem.metadata.height.innerHTML = opts.height;
        elem.page.style.marginBottom = parseFloat(opts.height)*-(1-PAGE_SCALE_FACTOR) + opts.height.slice(-2);
        
      }
      
      if(newContent || newContent === "") {
        content = he.encode(newContent);
        stats = stringStats(newContent);
        elem.content.innerHTML = newContent;
        elem.metadata.wordCount.innerHTML = stats;
      }
    };

  }
  
  var pages = [];
  
    // Default Options
    var opts = {
      title: "",
      fontSizes: [12,11,10],
      fontFamily: "Times New Roman",
      width: "8.5in",
      height: "11in"
    };
  this.init = function(content, userOpts) {
    if(typeof userOpts !== 'undefined') {
      for(var o in opts) {
        if(typeof userOpts[o] !== 'undefined') {
          opts[o] = userOpts[o];
        }
      }
    }
    
    self.update(content, opts);
    /*
    for (var i=0; i < this.opts.fontSizes.length; i++) {
      var pageOpts = this.opts;
      pageOpts.fontSize = this.opts.fontSizes[i]+"px";
      var page = new Page(content, width, height, pageOpts);
      self.pages.push(page);
      document.getElementsByClassName("pages")[0].appendChild(page.elem);
    }
    */
    
  };
  
  this.update = function(content, newOpts) {
    if(typeof newOpts !== 'undefined') {
      for(var o in opts) {
        if(typeof newOpts[o] !== 'undefined') {
          opts[o] = newOpts[o];
        }
      }
    }
    
    for (var i=0; i < opts.fontSizes.length; i++) {
      var pageOpts = opts;
      // Note a copy HAS NOT been created; this is just an alias
      pageOpts.fontSize = opts.fontSizes[i]+"px";
      if (i < pages.length) {
        pages[i].update(content, pageOpts);
      } else {
        var page = new Page(content, pageOpts);
        pages.push(page);
        document.querySelector(".pages").appendChild(page.elem);
      }
    }
  };
}

function ObjectToString(obj) {
  var result = '';
  for (var property in obj) {
    result += property + ': ' + obj[property]+'; ';
  }
  return result;
}

function stringStats(str) {
  var spaces = 0,
      wordCount = 0,
      fullCharCount = 0,
      smallCharCount = 0;
  
  if(str) {
    spaces = str.match(/\s/g);
    spaces = spaces ? spaces.length : 0;
    
    wordCount = str.match(/[^\s]\s/g);
    wordCount = wordCount ? wordCount.length : 0;
    if (str && !str.slice(-1).match(/\s/)) {
      wordCount++;
    }
    fullCharCount = str.length;
    smallCharCount = fullCharCount - spaces;
  }
  return wordCount + " words | " + smallCharCount + " (" + fullCharCount + ") chars";
}