(function(angular) {

'use strict';

var app = angular.module('TasksTest', []);

app.controller('TaskMgmt', function ($scope) {

        $scope.showModalAdd = false;
        $scope.showModalEdit = false;
        $scope.showModalDelete = false;
        $scope.tasks = { 'taskList': JSON.parse(localStorage.getItem("dbTasks")) || [] };
        $scope.nextIndex = 1;

        console.log($scope.tasks.taskList);

        // callback for ng-click 'editUser':
        $scope.editTask = function (taskId) {
            //$location.path('/task-detail/' + taskId);
            $scope.showModalEdit = true;
        };

        $scope.createTask = function () {
            $scope.showModalAdd = true;
        };

        // callback for ng-click 'deleteUser':
        $scope.deleteTask = function (taskId) {
            $scope.showModalDelete = true;
        };

        $scope.confirmDeleteTask = function(taskId) {
            //TaskFactory.delete({ id: taskId });
            //$scope.tasks = TasksFactory.query();
        };

        $scope.updateTask = function () {
            //TaskFactory.update($scope.task);
            //$location.path('/index');
        };

        $scope.createNewTask = function () {
            var tsk = JSON.stringify({
                'id': $scope.nextIndex,
                'name': $("#addName").val(),
                'description': $("#addDescription").val()
            });

            $scope.tasks.taskList.push(tsk);
            localStorage.setItem("dbTasks", JSON.stringify($scope.tasks.taskList));

            console.log(localStorage.getItem("dbTasks"));

            $scope.showModalAdd = false;

            $scope.nextIndex++;
        }

        // callback for ng-click 'cancel':
        $scope.cancel = function (option) {
            //$location.path('/index');
            switch(option) {
                case "Add":
                    $("#frmAdd input").each(function() {
                        $(this).val("");
                    });
                   $scope.showModalAdd = false;
                   break;
                case "Edit":
                    $("#frmEdit input").each(function() {
                        $(this).val("");
                    });
                   $scope.showModalEdit = false;
                   break;
                case "Delete":
                   $scope.showModalDelete = false;
                   break; 
            }
        };

        //$scope.tasks = JSON.parse(localStorage.getItem("dbTasks"));
    });

})(window.angular);