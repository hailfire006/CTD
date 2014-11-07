
// create variable to hold variables - avoid naming collisions
var Images = {
	IMAGE_BASE_PATH: 'images',
	imageCache: [], // map String -> Image
	getImage: function(entity) {
		return getImage(entity.imageCategory, entity.imageName);
	},
	getImage: function(imageCategory, imageName) {
		if (imageCategory && imageName) { // if both parameters defined
			var imagePath = Images.IMAGE_BASE_PATH + '/' + imageCategory + '/' + imageName;
			var image = Images.imageCache[imagePath];
			// load image if it isn't cached
			if (!image) {
				image = new Image();
				image.src = imagePath;
				Images.imageCache[imagePath] = image;
			}
			return image;
		}
	},
};
