angular.module('UserAdminApp', [])
.controller('UserController', ['$scope', '$http', function($scope, $http) {
    $scope.users = [];
    $scope.currentUser = {};
    $scope.newUser = {};

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

    $scope.loadUsers = function() {
        $http.get('http://localhost:8080/api/usuarios', requestOptions)
        .then(function(response) {
            $scope.users = response.data.usuarios;
        })
        .catch(function(error) {
            console.error('Error loading users:', error);
        });
    };

    $scope.loadUsers(); 

    $scope.openAddUserModal = function() {
        $scope.newUser = {};
        $('#addUserModal').modal('show');
    };

    $scope.openEditUserModal = function(user) {
        $scope.currentUser = angular.copy(user);
        $('#editUserModal').modal('show');
    };

    $scope.addUser = function() {
        $http.post('http://localhost:8080/api/usuarios', $scope.newUser, requestOptions)
        .then(function(response) {
            $scope.loadUsers();
            $('#addUserModal').modal('hide');
        })
        .catch(function(error) {
            console.error('Error adding user:', error);
        });
    };

    $scope.saveEditorUser = function() {
        if ($scope.currentUser.id) {
            $http.put(`http://localhost:8080/api/usuarios/${$scope.currentUser.id}`, $scope.currentUser, requestOptions)
            .then(function(response) {
                $scope.loadUsers();
                $('#editUserModal').modal('hide');
            })
            .catch(function(error) {
                console.error('Error updating user:', error);
            });
        }
    };

    $scope.deleteUser = function(id) {
        $http.delete(`http://localhost:8080/api/usuarios/${id}`, requestOptions)
        .then(function(response) {
            $scope.loadUsers();
        })
        .catch(function(error) {
            console.error('Error deleting user:', error);
        });
    };

}]);
