angular.module('VideoAdminApp', [])
.controller('VideoController', ['$scope', '$http', function($scope, $http) {
    $scope.videos = [];
    $scope.currentVideo = {};

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

    $scope.loadVideos = function() {
        $http.get('http://localhost:8080/api/videos', requestOptions)
        .then(function(response) {
            $scope.videos = response.data.videos;
        })
        .catch(function(error) {
            console.error('Error loading videos:', error);
        });
    };

    $scope.loadVideos(); 

    $scope.openEditorVideo = function(video) {
        $scope.currentVideo = video ? angular.copy(video) : {};
        $('#videoModal').modal('show');
    };

    $scope.saveEditorVideo = function() {
        if ($scope.currentVideo.id) {
            $http.put(`http://localhost:8080/api/videos/${$scope.currentVideo.id}`, $scope.currentVideo, requestOptions)
            .then(function(response) {
                $scope.loadVideos();
                $('#videoModal').modal('hide');
            })
            .catch(function(error) {
                console.error('Error updating video:', error);
            });
        } else {
            $http.post('http://localhost:8080/api/videos', $scope.currentVideo, requestOptions)
            .then(function(response) {
                $scope.loadVideos();
                $('#videoModal').modal('hide');
            })
            .catch(function(error) {
                console.error('Error adding video:', error);
            });
        }
    };

    $scope.deleteVideo = function(id) {
        $http.delete(`http://localhost:8080/api/videos/${id}`, requestOptions)
        .then(function(response) {
            $scope.loadVideos();
        })
        .catch(function(error) {
            console.error('Error deleting video:', error);
        });
    };

}]);
