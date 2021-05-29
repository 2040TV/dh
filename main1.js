const qqReg = /^([1-9]\d{4,9}$)|^暂无$/ //验证QQ号
const urlReg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/([-\w]+)*(\.[-\w]+)*)*([#?&]\w+=\w*)*$/i //验证url

$(function () {
  let timer
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop()
    const backTopDom = $('.back-top')

    //监听顶部置顶
    headerFixed()

    //监听懒加载渲染
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      lazyRender()
    }, 300)

    //监听分类激活
    sortActive()

    //监听返回顶部显示/隐藏
    scrollTop >= 100 ? backTopDom.addClass('show') : backTopDom.removeClass('show')
  })

  //导航高亮
  highLight();

  //懒加载
  const bannerDom = $('.banner')
  bannerDom.css('background-image', 'url("' + bannerDom.attr('data-src') + '")')
  lazyRender()

  //分类激活
  sortActive()

  //顶部置顶
  headerFixed()

  //移动端侧栏显示/隐藏
  $('.nav-bar').on('click', function () {
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
      $('.nav').removeClass('show')
      $('.transparent-mark').remove()
    } else {
      $(this).addClass('active')
      $('.nav').addClass('show')
      $('.header').append('<div class="transparent-mark"></div>')
    }
  })

  //点击遮罩层隐藏
  $(document).on('click', '.transparent-mark', function () {
    $('.nav-bar').removeClass('active')
    $('.nav').removeClass('show')
    $('.transparent-mark').remove()
  })

  //切换搜索方式
  const searchInputDom = $('.search-input'),
      searchFormDom = $('.search-form'),
      searchBtnDom = $('.search-btn')
  searchInputDom.focus()
  $('.search-type .item').on('click', function () {
    $('.search-type .item').removeClass('active')
    $(this).addClass('active')
    searchInputDom.focus()
    searchFormDom.attr('target', '_blank')
    switch ($(this).attr('data-type')) {
      case 'this':
        searchFormDom.attr('action', '../').attr('target', '_self')
        searchInputDom.attr('name', 'keyword')
        searchBtnDom.text('本站搜索')
        break
      case 'baidu':
        searchFormDom.attr('action', 'https://www.baidu.com/s?tn=none')
        searchInputDom.attr('name', 'wd')
        searchBtnDom.text('网页搜索')
        break
      case 'yingshi':
        searchFormDom.attr('action', 'https://api.2040tv.com/index.php/vod/search.html?wd=none')
        searchInputDom.attr('name', 'wd')
        searchBtnDom.text('影视搜索')
        break
      case 'sogou':
        searchFormDom.attr('action', 'https://www.bing.com/images/search?q=none')
        searchInputDom.attr('name', 'q')
        searchBtnDom.text('图片搜索');
        break
    }
  })

  //点击分类滚动
  $('.sort .move').on('click', function (e) {
    e.preventDefault()
    const href = $(this).attr('href'),
        pos = $(href).offset().top - ($(window).width() <= 767 ? 52 : 62)
    $('html').animate({
      scrollTop: pos
    }, 500)
  })

})

//导航高亮
function highLight() {
  const urlStr = location.href
  $('.nav > li > a').each(function () {
    const href = $(this).attr('href')
    if (urlStr === href && href !== '') {
      $(this).parent('li').addClass('active')
    } else {
      $(this).parent('li').removeClass('active')
    }
  })
}

//懒加载
function lazyRender() {
  $('.lazy-load').each(function () {
    const scrollTop = $(window).scrollTop(),
        windowHeight = $(window).height(),
        offsetTop = $(this).offset().top
    if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop && $(this).attr('data-src') !== $(this).attr('src')) {
      $(this).animate({opacity: 'toggle'}, 300, function () {
        $(this).attr('src', $(this).attr('data-src'))
        $(this).animate({opacity: 'toggle'}, 300)
      })
    }
  })
}

//顶部置顶
function headerFixed() {
  const headerDom = $('.header')
  if (headerDom.next('.banner').length === 0) {
    return
  }
  $(window).scrollTop() > 0 ? headerDom.addClass('fixed') : headerDom.removeClass('fixed')
}

//分类激活
function sortActive() {
  if ($('.sort').length === 0) {
    return
  }
  $('.sort .move').removeClass('active').each(function () {
    const href = $(this).attr('href'),
        scrollTop = $(window).scrollTop(),
        windowHeight = $(window).height(),
        offsetTop = $(href).offset().top
    if (offsetTop < (scrollTop + windowHeight) && offsetTop > scrollTop) {
      $(this).addClass('active')
      return false
    }
  })
}

//返回顶部
function backTop() {
  $('html,body').animate({
    scrollTop: '0'
  }, 500)
}

//检测输入
function checkInput(options) {
  for (const item of options) {
    const dom = $('#' + item.id)
    const value = dom.val()
    if (dom.attr('disabled') || (item.optional && !value)) {
      continue
    }
    let result
    if (item.reg) {
      result = item.reg.test(value)
    } else if (item.minLength) {
      result = value.length >= item.minLength
      item.msg = '长度不可少于' + item.minLength + '位'
    } else {
      result = !!value
    }
    if (!result) {
      layer.msg(item.msg, {
        anim: 6,
        time: 500
      })
      dom.focus()
      return false
    }
  }
  return true
}

//申请收录
function addApply() {
  if (checkInput([
    {
      id: 'name',
      msg: '请输入名称'
    }, {
      id: 'sortId',
      msg: '请选择分类'
    }, {
      id: 'sortId',
      msg: '请选择分类'
    }, {
      id: 'qq',
      msg: '请输入正确的QQ号',
      reg: qqReg,
      optional: true
    }, {
      id: 'domain',
      msg: '请输入正确的域名',
      reg: urlReg,
    }, {
      id: 'captcha',
      msg: '请输入验证码'
    }
  ])) {
    $.ajax({
      type: 'POST',
      url: '/include/api.php?act=apply_add',
      data: $('#apply-add').serialize(),
      beforeSend: () => {
        layer.load(2)
      },
      success: (result) => {
        layer.closeAll('loading')
        setTimeout(() => {
          if (result.code !== 200) {
            return layer.alert('错误代码：' + result.code + '<br/>错误信息：' + result.msg, {
              anim: 6
            })
          }
          layer.msg(result.msg, {
            time: 1000
          }, () => {
            location.reload()
          })
        }, 250)
      },
      error: () => {
        layer.closeAll('loading')
        setTimeout(() => {
          layer.msg('系统错误，请检查网络或联系管理员', {
            anim: 6,
            time: 1000,
          })
        }, 250)
      }
    })
  }
}

//点赞功能
function addLove(dom, id) {
  $.ajax({
    type: 'POST',
    url: '/include/api.php?act=site_love',
    data: {id},
    success: (result) => {
      if (result.code !== 200) {
        return layer.msg(result.msg, {
          anim: 6,
          time: 500
        })
      }
      layer.msg('点赞成功', {
        time: 500
      })
      $(dom).html('<i class="fa fa-thumbs-up fa-fw active" aria-hidden="true"></i>&nbsp;已赞&nbsp;[' + result.data.love + ']')
    },
    error: () => {
      layer.msg('系统错误，请检查网络或联系管理员', {
        anim: 6,
        time: 1000,
      })
    }
  })
}

//运行代码
(function() {
	window.onload = function() {
		var e = "将HTML代码粘在此处，点击运行即可。",
		t = document.getElementById("codeinp"),
		n = document.getElementById("btclear"),
		r = document.getElementById("btrun");
		t.onfocus = function() {
			var n = t.value;
			n == e && (t.value = "")
		},
		t.onblur = function() {
			var n = t.value;
			n == "" && (t.value = e)
		},
		n.onclick = function() {
			t.value = "",
			t.focus()
		},
		r.onclick = function() {
			var n = t.value;
			if (n != e) {
				var r = window.open("", "", "");
				r.opener = null,
				r.document.write(n),
				r.document.close()
			} else alert("请将需要运行的HTML填写到输入框后再运行！", "alert", "运行提示")
		}
	}
})()