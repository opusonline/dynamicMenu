/*!
 * jquery dynamic menu plugin
 * Copyright 2011, Stefan Benicke (opusonline.at)
 * Dual licensed under the MIT or GPL Version 3 licenses.
 */
(function($) {
	
	var defaults = {
		timeout: 1000,
		speed: 200,
		showSubMenu: function() {
			//$(this).addClass('open').prev().addClass('hover');
			$(this).stop(true, true).slideDown(defaults.speed).prev().addClass('hover');
		},
		hideSubMenu: function() {
			//$(this).removeClass('open').prev().removeClass('hover');
			$(this).slideUp(defaults.speed).prev().removeClass('hover');
		}
	};
	
	$.fn.dynamicMenu = function(options) {
		
		options = $.extend({}, options, defaults);
		
		return this.each(function() {
			
			var $menu = $(this),
			timer_list = [],
			_initSubMenu = function(id) {
				var $list = $(this),
				$sub = $list.children('ul').first();
				if ( ! $sub.length) return;
				var $parents = $list.parentsUntil($menu, 'li');
				return $list.mouseenter(_showSubMenu).mouseleave(_timeoutHiding).data({id: id, sub: $sub, parents: $parents});
			},
			_showSubMenu = function() {
				var $list = $(this),
				id = $list.data('id'),
				$sub = $list.data('sub'),
				_clearParentsTimer = function() {
					var id = $(this).data('id');
					clearTimeout(timer_list[id]);
				};
				options.showSubMenu.call($sub);
				clearTimeout(timer_list[id]);
				$list.data('parents').each(_clearParentsTimer);
				_hideAllOtherMenuesInThisLevel($list, id);
				return false;
			},
			_timeoutHiding = function() {
				var $list = $(this),
				id = $list.data('id'),
				$sub = $list.data('sub'),
				_hideSubMenu = function() {
					options.hideSubMenu.call($sub);
				};
				timer_list[id] = window.setTimeout(_hideSubMenu, options.timeout);
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
			list = $menu.find('li').filter(_initSubMenu);
		});
	};
	
})(jQuery);
