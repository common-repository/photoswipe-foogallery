jQuery(function($) {
	var PhotoSwipe = window.PhotoSwipe,
		PhotoSwipeUI_Default = window.PhotoSwipeUI_Default;

	$('body').on('click', '.foogallery-container a[data-size]', function(e) {
		if( !PhotoSwipe || !PhotoSwipeUI_Default ) {
			return;
		}

		e.preventDefault();
		openPhotoSwipe( this );
	});

	var parseThumbnailElements = function(gallery, el) {
		var elements = $(gallery).find('a[data-size]').has('img'),
			galleryItems = [],
			index;

		elements.each(function(i) {
			var $el = $(this),
				size = $el.data('size').split('x'),
				caption;

			if($el.attr('data-caption-title') && $el.attr('data-caption-title') != '') {
                caption = $el.attr('data-caption-title');
			} else if( $el.next().hasClass('.wp-caption-text') ) {
				// image with caption
				caption = $el.next().text();
			} else if($el.next().prop('tagName') == 'FIGCAPTION') {
				// image with caption
				caption = $el.next().text();
			} else if( $el.parent().next().hasClass('.wp-caption-text')) {
				// gallery icon with caption
				caption = $el.parent().next().text();
			} else if( $el.parent().next().prop('tagName') == 'FIGCAPTION') {
				// gallery icon with caption
				caption = $el.parent().next().text();
			} else {
				caption = $el.attr('title');
			}

			galleryItems.push({
				src: $el.attr('href'),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				title: caption,
				msrc: $el.find('img').attr('src'),
				el: $el
			});
			if( el === $el.get(0) ) {
				index = i;
			}
		});

		return [galleryItems, parseInt(index, 10)];
	};

	var openPhotoSwipe = function( element, disableAnimation ) {
		var pswpElement = $('.pswp').get(0),
			galleryElement = $(element).parents('.gallery, .hentry, .main, body').first(),
			gallery,
			options,
			items, index;

		items = parseThumbnailElements(galleryElement, element);
		index = items[1];
		items = items[0];

		options = {
			index: index,
			getThumbBoundsFn: function(index) {
				var image = items[index].el.find('img'),
					offset = image.offset();

				return {x:offset.left, y:offset.top, w:image.width()};
			},
			showHideOpacity: true,
			history: false
		};

		if(disableAnimation) {
			options.showAnimationDuration = 0;
		}

		// Pass data to PhotoSwipe and initialize it
		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

});
