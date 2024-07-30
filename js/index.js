document.addEventListener('DOMContentLoaded', () => {
	const video = document.getElementById('video');
	const snap = document.getElementById('snap');
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
	const photo = document.getElementById('photo');
	const gallery = document.getElementById('gallery');
	const infoPhoto = document.getElementById('infoPhoto');

	// Solicitud de acceso a la cámara
	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then((stream) => {
			video.srcObject = stream;
		})
		.catch((error) => {
			console.error('Error al intentar acceder a la cámara', error);
		});

	// Tomar foto
	snap.addEventListener('click', () => {
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Convertir canvas a URL
		const dataURL = canvas.toDataURL('image/png');
		photo.setAttribute('src', dataURL);
		photo.style.display = 'block';

		// Llamar a función para guardar foto en el localStorage
		savePhoto(dataURL);
		displayPhotos();
	});

	// Guardar foto en el localStorage
	function savePhoto(dataURL) {
		let photos = JSON.parse(localStorage.getItem('photos')) || [];
		photos.push(dataURL);
		localStorage.setItem('photos', JSON.stringify(photos));
	}

	// Mostrar fotos en la galería
	function displayPhotos() {
		let photos = JSON.parse(localStorage.getItem('photos')) || [];
		gallery.innerHTML = '';
		if (photos.length === 0) {
			gallery.innerHTML =
				'<p class="info-gallery">No hay fotos en la galería.</p>';
		} else {
			photos.forEach((photoURL, index) => {
				let imgContainer = document.createElement('div');
				imgContainer.classList.add('gallery-item');

				let img = document.createElement('img');
				img.src = photoURL;
				img.classList.add('gallery-photo');
				infoPhoto.classList.add('show-info-photo');
				imgContainer.appendChild(img);

				let deleteButton = document.createElement('button');
				deleteButton.textContent = 'Eliminar';
				deleteButton.classList.add('delete-button');
				deleteButton.addEventListener('click', () => {
					deletePhoto(index);
				});

				imgContainer.appendChild(deleteButton);
				gallery.appendChild(imgContainer);
			});
		}
	}

	// Eliminar foto
	function deletePhoto(index) {
		let photos = JSON.parse(localStorage.getItem('photos')) || [];
		photos.splice(index, 1);
		localStorage.setItem('photos', JSON.stringify(photos));
		displayPhotos();
	}

	// Mostrar galería al cargar la página
	displayPhotos();
});
