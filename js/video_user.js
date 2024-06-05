angular.module('VideoUserApp', [])
.controller('VideoUserController', ['$scope', '$http', function($scope, $http) {
    $scope.categories = [];

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se ha encontrado un token.');
        return;
    }

    const requestOptions = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    $http.get('http://localhost:8080/api/categorias', requestOptions)
    .then(function(response) {
        const categories = response.data.categorias;
        const categoryPromises = categories.map(category => {
            return $http.get(`http://localhost:8080/api/videosByCategory?categoria_id=${category.id}`, requestOptions)
                .then(function(response) {
                    response.data.videos.forEach(video => {
                        if (!video.thumbnail) {
                            video.thumbnail = `https://img.youtube.com/vi/${getYouTubeVideoId(video.url)}/0.jpg`;
                        }
                    });
                    category.videos = response.data.videos;
                    return category;
                });
        });

        Promise.all(categoryPromises).then(function(result) {
            $scope.categories = result;
            $scope.$apply();
        });
    })
    .catch(function(error) {
        console.error('Error loading categories and videos:', error);
    });

    function getYouTubeVideoId(url) {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}]);
