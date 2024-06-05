angular.module('WebVideosApp', [])
.controller('LoginController', ['$scope', '$http', function($scope, $http) {
    $scope.userData = {
        email: '',
        password: ''
    };
    $scope.authenticate = function() {
       
        const loginData = {
            email: $scope.userData.email,
            passwd: $scope.userData.password
        };
   
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");

        const loginRequestOptions = {
            method: "POST",
            headers: loginHeaders,
            body: JSON.stringify(loginData),
            redirect: "follow"
        };

        fetch("http://localhost:8080/api/auth/login", loginRequestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (result.error) {
                    alert("Error en la autenticación: " + result.error);
                    return;
                }
                alert("Inicio de sesión exitoso.");
                localStorage.setItem('token', result.token);
                localStorage.setItem('userRole', result.role); 

                if (result.role === 'admin') {
                    window.location.href = 'videos.html'; 
                } else {
                    window.location.href = 'video_user.html'; 
                }
            })
            .catch(error => console.error('Error durante la autenticación:', error));
    };
}]);
