/*!
 * jquery dynamic menu plugin
 * Copyright 2011, Stefan Benicke (opusonline.at)
 * Dual licensed under the MIT or GPL Version 3 licenses.
 */
(function($) {
	
	var defaults = {
		speed: 1000,
		showSubMenu: function() {
			$(this).addClass('open').prev().addClass('hover');
		},
		hideSubMenu: function() {
			$(this).removeClass('open').prev().removeClass('hover');
		}
	};
	
	$.fn.dynamicMenu = function(options) {
		
		options = $.extend({}, options, defaults);
		
		return this.each(function() {
			
			var timer_list = [],
			_initSubMenu = function(id) {
				var $list = $(this),
				$sub = $list.children('ul').first();
				if ( ! $sub.length) return;
				return $list.mouseenter(_showSubMenu).mouseleave(_timeoutHiding).data({id: id, sub: sub});
			},
			_timeoutHiding = function() {
				var $list = $(this),
				id = $list.data('id'),
				$sub = $list.data('sub'),
				_hideSubMenu = function() {
					options.hideSubMenu.call($sub);
				};
				timer_list[id] = window.setTimeout(_hideSubMenu, options.speed);
			},
			_showSubMenu = function() {
				var $list = $(this),
				id = $list.data('id'),
				$sub = $list.data('sub');
				options.showSubMenu.call($sub);
				clearTimeout(timer_list[id]);
				_hideAllOtherMenuesInThisLevel($list, id);
			},
			_hideAllOtherMenuesInThisLevel = function($active_list, active_list_id) {
				var _hideAllExceptActive = function() {
					var $list = $(this),
					id = $list.data('id'),
					$sub = $list.data('sub');
					if (id == active_list_id) return;
					options.hideSubMenu.call($sub);
					clearTimeout(timer_list[id]);
				};
				$active_list.parent().find(list).each(_hideAllExceptActive);
			},
			list = $(this).find('li').filter(_initSubMenu);
		});
	};
	
})(jQuery);
