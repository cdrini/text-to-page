// REQUIRES he.js for security
window.PAGE_SCALE_FACTOR = 0.3;

function Pages() {
  var self = this;
  function Page(content, width, height, opts) {
    var self = this;
    // Parameter default values
    this.opts = opts || {};
    this.opts.fontSize = opts.fontSize || 12;
    this.opts.fontFamily = opts.fontFamily || "Times New Roman";
    this.width = width || "8.5in";
    this.height = height || "11in";
    this.content = content || "";
    this.content = he.encode(this.content);

    this.pageStyle = {
      width: self.width,
      height: self.height
    };
    this.pageStyle["margin-bottom"] = parseFloat(this.height)*-(1-PAGE_SCALE_FACTOR) + this.height.slice(-2);

    this.textStyle = {
      "font-family": self.opts.fontFamily,
      "font-size": self.opts.fontSize
    };

    this.stats = stringStats(this.content);

    this.elem = document.createElement('div');
    this.elem.setAttribute("class", "page-wrapper");
    this.elem.style.width = parseFloat(this.width)*PAGE_SCALE_FACTOR + this.height.slice(-2);
    this.elem.innerHTML = '<div class="metadata width">' + this.width + '</div>\
<div class="metadata height">' + this.height + '</div>\
<div class="page" style="' + ObjectToString(this.pageStyle) + '">\
  <div class="content" style="' + ObjectToString(this.textStyle) + '">' + this.content + '</div>\
</div>\
<div class="postdata">\
  <div class="metadata title">FEDs Midterm Check-in Infographic</div>\
  <div class="metadata word-count">' + this.stats +'</div>\
  <div class="metadata font">' + this.textStyle["font-family"] + ', ' + this.textStyle["font-size"] + '</div>\
          </div>';
    this.elem.content = this.elem.getElementsByClassName('content')[0];
    this.elem.page = this.elem.getElementsByClassName('page')[0];
    this.elem.metadata = {
      width: this.elem.getElementsByClassName('width')[0],
      height: this.elem.getElementsByClassName('height')[0],
      title: this.elem.getElementsByClassName('title')[0],
      wordCount: this.elem.getElementsByClassName('word-count')[0],
      font: this.elem.getElementsByClassName('font')[0]
    }
    
    this.update = function(content, width, height, opts) {
      this.width = width || this.width;
      this.height = height || this.height;
      if(width || height) {
        this.elem.style.width = parseFloat(this.width)*PAGE_SCALE_FACTOR + this.height.slice(-2);
        this.elem.page.style.width = this.width;
        this.elem.metadata.width.innerHTML = this.width;
        this.elem.page.style.height = this.height;
        this.elem.metadata.height.innerHTML = this.height;
        this.elem.page.style.marginBottom = parseFloat(this.height)*-(1-PAGE_SCALE_FACTOR) + this.height.slice(-2);
        
      }
      
      if(opts) {
        for (var attr in opts) {
          this.opts[attr] = opts[attr];
        }
        this.textStyle = {
          "font-family": self.opts.fontFamily,
          "font-size": self.opts.fontSize
        };
        this.elem.metadata.font.innerHTML = this.textStyle["font-family"] + ', ' + this.textStyle["font-size"];
        this.elem.content.style = ObjectToString(this.textStyle);
      }
      
      if(content || content === "") {
        this.content = he.encode(content);
        this.stats = stringStats(this.content);
        this.elem.content.innerHTML = this.content;
        this.elem.metadata.wordCount.innerHTML = this.stats;
      }
    };

  }
  
  this.pages = [];
  this.init = function(content, width, height, opts) {
    this.opts = opts || {};
    this.opts.fontSizes = this.opts.fontSizes || [12,11,10];
    
    this.update(content, width, height);
    return;
    for (var i=0; i < this.opts.fontSizes.length; i++) {
      var pageOpts = this.opts;
      pageOpts.fontSize = this.opts.fontSizes[i]+"px";
      var page = new Page(content, width, height, pageOpts);
      self.pages.push(page);
      document.getElementsByClassName("pages")[0].appendChild(page.elem);
    }
    
  };
  
  this.update = function(content, width, height, opts) {
    if (opts) {
      for(var attr in opts) {
        this.opts[attr] = opts[attr];
      }
    }
    
    for (var i=0; i < this.opts.fontSizes.length; i++) {
      var pageOpts = this.opts;
      pageOpts.fontSize = this.opts.fontSizes[i]+"px";
      if (i < this.pages.length) {
        self.pages[i].update(content, width, height, pageOpts);
      } else {
        var page = new Page(content, width, height, pageOpts);
        self.pages.push(page);
        document.getElementsByClassName("pages")[0].appendChild(page.elem);
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