new WOW().init();

$(document).ready(function () {
  $(".header-hum").click(function () {
    $('.header-hum__line').toggleClass('open');
    $('.sp-header-nav').toggleClass('open');
    $('.header-hum__wrap').toggleClass('open');

  });

  $(".main").click(function () {
    $('.header-hum__line').removeClass('open');
    $('.sp-header-nav').removeClass('open');
    $('.header-hum__wrap').removeClass('open');
  });

  $(".header-nav__link").click(function () {
    $('.header-hum__line').removeClass('open');
    $('.sp-header-nav').removeClass('open');
    $('.header-hum__wrap').removeClass('open');
  });

  $('.more__link').hover(function () {
    //768px以上の時のみ
    if (window.innerWidth > 768) {
      $(this).find('.more__line').addClass('active');
      $(this).find('.more__line').removeClass('disactive');
    }
  }, function () {
    if (window.innerWidth > 768) {
      $(this).find('.more__line').removeClass('active');
      $(this).find('.more__line').addClass('disactive');
    }
  });

  $('.contact__link').hover(function () {
    $(this).find('.contact__line').addClass('active');
    $(this).find('.contact__line').removeClass('disactive');
  }, function () {
    $(this).find('.contact__line').removeClass('active');
    $(this).find('.contact__line').addClass('disactive');
  });

  $('.more__link--header').mouse(function () {
    $(this).find('.more__line').delay(500).addClass('active')
  });

});

$('.slick').slick({
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 3500,
  dots: true,
  arrows: false,
  responsive: [{
    breakpoint: 600,
    settings: {
      slidesToShow: 1,
    }
  }],
});

$('.faq__large').on('click', function () {
  $(".faq__large").not(this).removeClass("open");
  $(this).toggleClass("open");
  $(".faq__large").not(this).next().slideUp();
  $(this).next().slideToggle();
});



$('body').imagesLoaded(function () {
  $('.progress').delay(1000).fadeOut(500);
  $(".progress__img").delay(1000).fadeOut(100);
});

$(function () {
  $('a[href^="#"]').click(function () {
    var width = window.innerWidth;
    var adjust = -90;
    if (width < 480) {
      adjust = -60;
    }
    var speed = 400;
    var href = $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top + adjust;
    $('body,html').animate({
      scrollTop: position
    }, speed, 'swing');
    return false;
  });
});

!(function () {
  const viewport = document.querySelector('meta[name="viewport"]');

  function switchViewport() {
    const value =
      window.outerWidth > 420 ?
      'width=device-width,initial-scale=1' :
      'width=420';
    if (viewport.getAttribute('content') !== value) {
      viewport.setAttribute('content', value);
    }
  }
  addEventListener('resize', switchViewport, false);
  switchViewport();
})();