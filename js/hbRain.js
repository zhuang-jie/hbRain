(function($){

	/**
	*随机整数
	*/
	function randomInteger(low, high) {
		return low + Math.floor(Math.random() * (high - low));
	}

	/**
	*随机小数
	*/
	function randomFloat(low, high) {
		return low + Math.random() * (high - low);
	}
	

	/**
	* 红包雨插件
	*/
	var hbRain = function(option){
		this.data = {
			el: '#petalbox',
			hbImg: null,
			hbWidth: 65,
			number: 50,
			page: 1,
			scale: 0.5,
			minDropDuration: 3,
			maxDropDuration: 6.5,
			delay: 4
		};
		if( option && $.isPlainObject(option) ){
			$.extend(this.data,option);
		}

		if($(this.data.el).length > 0){
			$(this.data.el).css({
				position: 'fixed',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
				background: 'rgba(0,0,0,.45)',
				transitionDuration: '250ms',
				visibility: 'hidden',
				opacity: 0
			});
		}
	};

	
	hbRain.prototype = {
		open: function(callback){
			// 打开 红包雨
			$(this.data.el).css({
				visibility: 'visible',
				opacity: 1
			});
			this._init();
			typeof callback == "function" && callback();
		},

		_close: function(){
			// 关闭 红包雨
			$(this.data.el).css({
				visibility: 'hidden',
				opacity: 0
			});
		},

		_init: function(){
			for(var j=1; j<=this.data.page; j++){

				for(var i=0; i<this.data.number; i++){
					var box = this._createHbBox(j-1);
					$(this.data.el).append(box);
					
					this._bindTransitionEnd($(box));
				}
			}
		},
		_bindTransitionEnd: function ($el){
			var _t = this;
			var css = $el.data();
			
			setTimeout(function(){
				$el.css(css);
				// 绑定 transitionend 事件
				$el.one('webkitTransitionEnd mozTransitionEnd MSTransitionEnd otransitionend transitionend', function(){
					console.log($(_t.data.el).find('.hbRain').length);
					$(this).remove();
					if( $(_t.data.el).find('.hbRain').length <=0 ){
						_t._close();
					}
					return false;
				});
			},20);
		},

		_createHbBox: function(page){
			var data = this.data,
				hbDiv = document.createElement('div'),
				image,
				W = $(window).width(),
				H = $(window).height(),
				halfW = W/2-data.hbWidth/2;

			if(data.hbImg && data.hbImg !== ''){
				image = document.createElement('img');
				if(data.hbImg instanceof Array && data.hbImg.length>0){
					image.src = data.hbImg[randomInteger(0,data.hbImg.length)];
				}else if(typeof data.hbImg === 'string'){
					image.src = data.hbImg;
				}
				$(image).css({
					display: 'block',
					width: '100%'
				});
				$(hbDiv).append(image);
			}

			/* 随机下落时间 */
			var minDropDuration = data.minDropDuration,
				maxDropDuration = data.maxDropDuration;
			var dropDuration = randomFloat(minDropDuration, maxDropDuration)+'s';
			// 随机delay时间
			var d = data.delay,
				delay = randomFloat(0+(d*page),d+(d*page))+'s';

			//随机下落地点
			var tLeft = randomInteger(0,W+100)-(halfW+100);
			var translate = 'scale(1) translate('+tLeft+'px, '+(H+100)+'px)';
			

			$(hbDiv).addClass('hbRain').data({
				transform: translate,
				transitionDuration: dropDuration,
				transitionDelay: delay
			}).css({
				width: data.hbWidth,
				transform: 'scale('+data.scale+') translate(0,0)',
				position: 'absolute',
				transitionTimingFunction: 'ease-out',
				top: -100,
				left: halfW
			});

			return hbDiv;
		}
	};

	


	window.hbRain = hbRain;
	$.hbRain = function(option){
		return new hbRain(option);
	};
})($);