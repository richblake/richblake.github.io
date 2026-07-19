// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// Simples — page enhancements
// (Galleries via Masonry + Fluidbox, image/video/table wrapping.)
//
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(function ($) {

	'use strict';

	function pageFunctions() {

		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Galleries

		var galleryCount = 0;

		$('.gallery').each(function () {

			var $this = $(this);

			galleryCount++;
			var thisId = 'gallery-' + galleryCount;
			$this.attr('id', thisId);

			// Set up gallery container
			$this.append('<div class="gallery__wrap"></div>');

			// Move images into the wrap
			$this.children('img').each(function () {
				$(this).appendTo('#' + thisId + ' .gallery__wrap');
			});

			// Wrap each image in an item + lightbox link
			$this.find('.gallery__wrap img').each(function () {
				var imageSrc = $(this).attr('src');
				$(this).wrapAll('<div class="gallery__item"><a href="' + imageSrc + '" class="gallery__item__link"></div></div>').appendTo();
			});

			$this.imagesLoaded(function () {

				// Grid layout
				$this.addClass('gallery--grid');

				// Use masonry layout
				$this.children('.gallery__wrap').masonry({
					itemSelector: '.gallery__item',
					transitionDuration: 0
				});

				// Init fluidbox
				$this.find('.gallery__item__link').fluidbox({
					loader: true
				});

				// Show gallery once initialized
				$this.addClass('gallery--on');

			});

		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Images

		$('.single p > img').each(function () {
			var thisP = $(this).parent('p');
			$(this).insertAfter(thisP);
			$(this).wrapAll('<div class="image-wrap"></div>');
			thisP.remove();
		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Videos

		$('.single iframe').each(function () {

			// If it's YouTube or Vimeo
			if ($(this).attr('src').indexOf('youtube') >= 0 || $(this).attr('src').indexOf('vimeo') >= 0) {

				var width = $(this).attr('width');
				var height = $(this).attr('height');
				var ratio = (height / width) * 100;

				// Wrap in responsive video container
				$(this).wrapAll('<div class="video-wrap"><div class="video" style="padding-bottom:' + ratio + '%;"></div></div>');

			}

		});



		// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Tables

		// Wrap tables so wide ones can scroll sideways.
		// The wrapper is focusable and labelled so keyboard users can scroll it too.
		$('.single table').each(function () {
			$(this).wrapAll('<div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable table"></div>');
		});

	}

	// Run functions on load
	$(function () {
		pageFunctions();
	});

})(jQuery);
