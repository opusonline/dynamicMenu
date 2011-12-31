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
				return $list.mouseenter(_showSubMenu).mouseleave(_timeoutHiding).data('id', id);
			},
			_timeoutHiding = function() {
				var $list = $(this),
				$sub = $list.children('ul').first(),
				id = $list.data('id'),
				_hideSubMenu = function() {
					options.hideSubMenu.call($sub);
				};
				timer_list[id] = window.setTimeout(_hideSubMenu, options.speed);
			},
			_showSubMenu = function() {
				var $list = $(this),
				id = $list.data('id'),
				$sub = $list.children('ul').first(),
				$parent = $list.parent('ul');
				options.showSubMenu.call($sub);
				clearTimeout(timer_list[id]);
				_hideAllOtherMenuesInThisLevel($parent, id);
			},
			_hideAllOtherMenuesInThisLevel = function($parent_ul, active_list_id) {
				var _hideAllExceptMe = function() {
					var $list = $(this),
					id = $list.data('id');
					if (id == active_list_id) return;
					var $sub = $list.children('ul').first();
					options.hideSubMenu.call($sub);
				};
				$parent_ul.find(list).each(_hideAllExceptMe);
			},
			list = $(this).find('li').filter(_initSubMenu);
		});
	};
	
})(jQuery);
