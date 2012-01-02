/*!
 * jquery dynamic menu plugin
 * Copyright 2011, Stefan Benicke (opusonline.at)
 * Dual licensed under the MIT or GPL Version 3 licenses.
 */
(function($) {
	
	var defaults = {
		speed: 200,
		delay: 350,
		timeout: 1000,
		showSubMenu: function() {
			//$(this).addClass('open').prev().addClass('hover');
			$(this).stop(true, true).slideDown(defaults.speed).prev().addClass('hover');
			//$(this).stop(true, true).fadeIn(defaults.speed).prev().addClass('hover');
		},
		hideSubMenu: function() {
			//$(this).removeClass('open').prev().removeClass('hover');
			//$(this).slideUp(defaults.speed).prev().removeClass('hover');
			$(this).fadeOut(defaults.speed).prev().removeClass('hover');
		}
	},
	w = window;
	
	$.fn.dynamicMenu = function(options) {
		
		options = $.extend({}, options, defaults);
		
		return this.each(function() {
			
			var $menu = $(this),
			show_timer_list = [],
			hide_timer_list = [],
			_initSubMenu = function(id) {
				var $list = $(this),
				$sub = $list.children('ul').first();
				if ( ! $sub.length) return;
				var $parents = $list.parentsUntil($menu, 'li');
				return $list.mouseenter(_timeoutShow).mouseleave(_timeoutHide).data({id: id, sub: $sub, parents: $parents});
			},
			_timeoutShow = function() {
				var $list = $(this),
				data = $list.data(),
				_clearParentsTimer = function() {
					var parent_id = $(this).data('id');
					clearTimeout(hide_timer_list[parent_id]);
				},
				_showSubMenu = function() {
					options.showSubMenu.call(data.sub);
					clearTimeout(hide_timer_list[data.id]);
					_hideAllOtherMenuesInThisLevel($list, data.id);
				};
				data.parents.each(_clearParentsTimer);
				show_timer_list[data.id] = w.setTimeout(_showSubMenu, options.delay);
				return false;
			},
			_timeoutHide = function() {
				var data = $(this).data(),
				_hideSubMenu = function() {
					options.hideSubMenu.call(data.sub);
				};
				clearTimeout(show_timer_list[data.id]);
				hide_timer_list[data.id] = w.setTimeout(_hideSubMenu, options.timeout);
			},
			_hideAllOtherMenuesInThisLevel = function($active_list, active_list_id) {
				var _hideAllExceptActive = function() {
					var data = $(this).data();
					if (data.id == active_list_id) return;
					options.hideSubMenu.call(data.sub);
					clearTimeout(hide_timer_list[data.id]);
				};
				$active_list.parent().find(list).each(_hideAllExceptActive);
			},
			list = $menu.find('li').filter(_initSubMenu);
		});
	};
	
})(jQuery);
