var args = arguments[0] || {};

$.initialize = function() {
	loadPhotos();
}

function loadPhotos() {
	var rows = [];

	var photos = Alloy.Collections.photo || Alloy.Collections.instance("Photo");

	var where = {
		title: {
			"$exists": true
		}
	}

	photos.fetch({
		data: {
			order: '-created_at',
			where: where
		},
		success: function(model, response) {
			photos.each(function(photo) {
				var photoRow = Alloy.createController('feedRow', photo);
				rows.push(photoRow.getView());
			});
			$.feedTable.data = rows;
		},
		error: function(error) {
			alert("Error loading Feed " + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

OS_IOS && $.cameraButton.addEventListener('click', function(_event) {
	$.cameraButtonClicked(_event);
});

$.cameraButtonClicked = function(_event) {
 	Ti.Media.showCamera({
 		success: function(event) {
 			processImage(event.media, function(processResponse) {
 				if (processResponse.success) {
 					var rowController = Alloy.createController('feedRow', processResponse.model);

	 				if ($.feedTable.getData().length === 0) {
	 					$.feedTable.setData([]);
	 					$.feedTable.appendRow(rowController.getView(), true);
	 				} else {
	 					$.feedTable.insertRowBefore(0, rowController.getView(), true);
	 				}
 				} else {
 					alert('Error saving photo ' + processResponse.message);
 				}
 			});
 		},
 		cancel: function() {
 			// called when user cancels taking a picture
 		},
 		error: function(error) {
 			if (error.code == Ti.Media.NO_CAMERA) {
 				alert('Please run this test on device');
 			} else {
 				alert('Unexpected error: ' + error.code);
 			}
 		},
 		saveToPhotoGallery: false,
 		allowEditing: true,
 		mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
 	});
}

function processImage(_mediaObject, _callback) {
	var parameters = {
		"photo" : _mediaObject,
		"title" : "Sample Photo " + new Date(),
		"photo_sizes[preview]" : "200x200#",
		"photo_sizes[iphone]" : "320x320#",
		// We need this since we are showing the image immediately
		"photo_sync_sizes[]" : "preview"
	}

	var photo = Alloy.createModel('Photo', parameters);

	photo.save({}, {
		success: function(_model, _response) { debugger;
			Ti.API.info('success: ' + _model.toJSON());
			_callback({
				model: _model,
				message: null,
				success: true
			});
		},
		error: function(e) { debugger;
			Ti.API.error('error ' + e.message);
			_callback({
				model: parameters,
				message: e.message,
				success: false
			});
		}
	});
}