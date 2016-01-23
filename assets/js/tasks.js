(function(angular) {

    'use strict';

    var app = angular.module('TasksTest', []);

    /* Garante que o local storage será um módulo do Angular */
    app.factory("LocalStorage", function() {
        var LS = {};
        LS.getItem = function(key) {
            return localStorage[key];
        };
        LS.setItem = function(key, value) {
            localStorage[key] = value;
            return value;
        };

        return LS;
    });

    app.controller('TaskMgmt', ['$scope', '$timeout', 'LocalStorage', function ($tasks, $timeout, LocalStorage) {

        $tasks.showModal = false;
        $tasks.showModalDelete = false;
        $tasks.edit = false;
        $tasks.loading = false;
        $tasks.list = LocalStorage.getItem("dbTasks") ? JSON.parse(LocalStorage.getItem("dbTasks")) : [];
        $tasks.current = null;

        console.log($tasks.list.length);

        // Private function, accessible only by the controller
        function getTask(taskId) {

            // Using 'let' to ensure that the variables will work only on this scope
            let i = 0, l = $tasks.list.length, task = { "obj": null, "index": 0 };

            for(; i < l; i++) {
                if ($tasks.list[i].id == taskId) {
                    task["obj"] = $tasks.list[i];
                    task["index"] = i;
                }
            }

            return task;

        }

        $tasks.editTask = function (taskId) {
            $tasks.showModal = true;
            $tasks.edit = true;

            // Stores in the controller cache the current task to be edited
            $tasks.current = getTask(taskId)["obj"];

            $tasks.taskID = taskId;
            $tasks.name = $tasks.current.name;
            $tasks.description = $tasks.current.description;
        };

        $tasks.addTask = function () {
            $tasks.showModal = true;
        };

        $tasks.deleteTask = function (taskId) {
            $tasks.showModalDelete = true;

            $tasks.taskID = taskId;
        };

        $tasks.updateTask = function (taskId, form) {

            if($tasks.name !== "" && $tasks.description !== "") {

                $tasks.showModal = false;
                $tasks.loading = true;

                if(taskId) {
                    $tasks.current.name = $tasks.name;
                    $tasks.current.description = $tasks.description;

                    $tasks.edit = false;
                } else {
                    // Generate a unique ID: if PerformanceTimeline API is available, 
                    // round performance.now(), which is the high precision timer,
                    // otherwise, use Date.getTime() as fallback
                    var id_gen = (window.performance && typeof window.performance.now === "function") ? Math.floor(performance.now()) : Math.floor(new Date().getTime());

                    $tasks.list.push({
                        id: id_gen,
                        name: $tasks.name,
                        description: $tasks.description,
                        done: false
                    });
                }

                console.log($tasks.list);

                localStorage.setItem("dbTasks", JSON.stringify($tasks.list));

                form.$setPristine();
                form.$setUntouched();

                $tasks.taskID = null;
                $tasks.name = '';
                $tasks.description = '';

                $timeout(function() {
                    $tasks.loading = false;
                }, 2000);
            }
        };

        $tasks.confirmDeleteTask = function(taskId) {

            $tasks.showModalDelete = false;
            $tasks.loading = true;

            let index = getTask(taskId)["index"];

            $tasks.list.splice(index, 1);

            localStorage.setItem("dbTasks", JSON.stringify($tasks.list));

            $tasks.taskID = null;

            $timeout(function() {
                $tasks.loading = false;
            }, 2000);
        };

        // callback for ng-click 'cancel':
        $tasks.cancel = function (form, option) {
            switch(option) {
                case "Delete":
                    $tasks.taskID = null;
                    $tasks.showModalDelete = false;
                    break;
                default:
                    $tasks.taskID = null;
                    $tasks.name = '';
                    $tasks.description = '';
                    $tasks.showModal = false;
                    $tasks.edit = false;
                    form.$setPristine();
                    form.$setUntouched();
                    break;
            }
        };

        $tasks.finishTask = function(index, taskDone) {

            $tasks.list[index].done = taskDone;

            localStorage.setItem("dbTasks", JSON.stringify($tasks.list));

        }
    }]);

})(window.angular);