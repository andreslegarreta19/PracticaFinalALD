angular.module('CategoriaAdminApp', [])
.controller('CategoriaController', ['$scope', '$http', function($scope, $http) {
    $scope.categories = [];
    $scope.currentCategory = {};

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

    $scope.loadCategories = function() {
        $http.get('http://localhost:8080/api/categorias', requestOptions)
        .then(function(response) {
            console.log(response.data); 
            $scope.categories = response.data.categorias;
        })
        .catch(function(error) {
            console.error('Error loading categories:', error);
        });
    };

    $scope.loadCategories(); 

    $scope.openEditorCategory = function(category) {
        $scope.currentCategory = category ? angular.copy(category) : {};
        $('#categoryModal').modal('show');
    };

    $scope.saveEditorCategory = function() {
        if ($scope.currentCategory.id) {
            $http.put(`http://localhost:8080/api/categorias/${$scope.currentCategory.id}`, $scope.currentCategory, requestOptions)
            .then(function(response) {
                $scope.loadCategories();
                $('#categoryModal').modal('hide');
            })
            .catch(function(error) {
                console.error('Error updating category:', error);
            });
        } else {
            $http.post('http://localhost:8080/api/categorias', $scope.currentCategory, requestOptions)
            .then(function(response) {
                $scope.loadCategories();
                $('#categoryModal').modal('hide');
            })
            .catch(function(error) {
                console.error('Error adding category:', error);
            });
        }
    };

    $scope.deleteCategory = function(id) {
        $http.delete(`http://localhost:8080/api/categorias/${id}`, requestOptions)
        .then(function(response) {
            $scope.loadCategories();
        })
        .catch(function(error) {
            console.error('Error deleting category:', error);
        });
    };

}]);
