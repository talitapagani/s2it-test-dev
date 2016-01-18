(function(angular) {

var app = angular.module('ngtasks.controllers', []);

app.controller('TaskMgmt', ['$scope', 'TasksFactory', 'TaskFactory', '$location',
    function ($scope, UsersFactory, UserFactory, $location) {

        // callback for ng-click 'editUser':
        $scope.editTask = function (taskId) {
            $location.path('/task-detail/' + taskId);
        };

        // callback for ng-click 'deleteUser':
        $scope.deleteTask = function (taskId) {
            TaskFactory.delete({ id: taskId });
            $scope.tasks = TasksFactory.query();
        };

        // callback for ng-click 'createUser':
        $scope.createNewtask = function () {
            $location.path('/task-creation');
        };

        $scope.tasks = TasksFactory.query();
    }]);

app.controller('TaskDetailMgmt', ['$scope', '$routeParams', 'TaskFactory', '$location',
    function ($scope, $routeParams, TaskFactory, $location) {

        // callback for ng-click 'updateUser':
        $scope.updateTask= function () {
            TaskFactory.update($scope.task);
            $location.path('/index');
        };

        // callback for ng-click 'cancel':
        $scope.cancel = function () {
            $location.path('/index');
        };

        $scope.task = TaskFactory.show({id: $routeParams.id});
    }]);

app.controller('TaskCreationMgmt', ['$scope', 'TasksFactory', '$location',
    function ($scope, TasksFactory, $location) {

        // callback for ng-click 'createNewUser':
        $scope.createNewTask = function () {
            TasksFactory.create($scope.task);
            $location.path('/index');
        }
    }])

angular.module('ngtasks', ['ngtasks.filters', 'ngtasks.services', 'ngtasks.directives', 'ngtasks.controllers']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/index', {templateUrl: 'index.html', controller: 'TaskMgmt'});
        $routeProvider.when('/user-detail/:id', {templateUrl: 'task-detail.html', controller: 'TaskDetailMgmt'});
        $routeProvider.when('/user-creation', {templateUrl: 'task-creation.html', controller: 'TaskCreationMgmt'});
        $routeProvider.otherwise({redirectTo: '/index'});
    }]);

})(window.angular);