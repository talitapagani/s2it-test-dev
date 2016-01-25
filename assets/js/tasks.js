/**
 * @file Angular.js + VanilaCSS CRUD
 * @copyright Talita Pagani 2016
 * @namespace app
 */
(function(angular) {

    'use strict';

    /**
    * The AngularJS module 'TaskTest'
    * 
    * @class app.TaskTest
    * @memberof app
    */
    var app = angular.module('TasksTest', []);

    /**
    * Factory for Local Storage
    *
    * @class app.LocalStorage
    * @memberof app
    */
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

    /**
    * TasksTest single controller
    *
    * @class app.TaskTest.TaskMgmt
    *
    * @param {string} controllerName - The name of the controller, binding the HTML
    * @param {Object[]} [dependencies] - The $scope and other dependencies 
    * @param {function} callback - Callback function passing the current scope and modules/factory to be used inside the controller
    * @property {number} tasks.taskID - The ID of some active task in edit or delete mode. Bing the input field.
    * @property {string} tasks.name - Binding for the input field of the task to be added/edited
    * @property {string} tasks.description - Binding for the input field of the task to be added/edited
    * @property {boolean} tasks.showModal - A flag to show or hide the Add/Edit modal dialog
    * @property {boolean} tasks.showModalDelete - A flag to show or hide the Delete modal dialog
    * @property {boolean} tasks.edit - Flag indicating if the task is being edited of it's adding a new task
    * @property {boolean} tasks.loading - Flag to show/hide the 'loading wheel' feedback
    * @property {Object[]} tasks.list - Return the tasks saved at LocalStorage in JSON format or initiate a new array if LocalStorage is empty
    * @property {Object} tasks.current - Scoped cache for the task that is being edited
    */
    app.controller('TaskMgmt', ['$scope', '$timeout', 'LocalStorage', function ($tasks, $timeout, LocalStorage) {

        $tasks.showModal = false;
        $tasks.showModalDelete = false;
        $tasks.edit = false;
        $tasks.loading = false;
        $tasks.list = LocalStorage.getItem("dbTasks") ? JSON.parse(LocalStorage.getItem("dbTasks")) : [];
        $tasks.current = null;

        /** 
        * @name getTask
        * @function
        * @memberOf app.TaskTest.TaskMgmt
        * @description Return the Task object and its index in the task list array
        * @param {number} taskId - The unique ID of the task to be edited/deleted
        * @return {Object}
        */
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

        /** 
        * @name editTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Show the Add/Edit modal dialog and enable edit mode if a task id is specified
        * @param {number} taskId - The unique ID of the task to be edited
        */
        $tasks.editTask = function (taskId) {
            $tasks.showModal = true;
            $tasks.edit = true;

            // Stores in the controller cache the current task to be edited
            $tasks.current = getTask(taskId)["obj"];

            $tasks.taskID = taskId;
            $tasks.name = $tasks.current.name;
            $tasks.description = $tasks.current.description;
        };

        /** 
        * @name addTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Show the Add/Edit modal dialog in the 'add' mode (default)
        */
        $tasks.addTask = function () {
            $tasks.showModal = true;
        };

        /** 
        * @name deleteTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Show the Delete modal dialog and store the id of the task to be deleted in the scope
        * @param {number} taskId - The unique ID of the task to be deleted
        */
        $tasks.deleteTask = function (taskId) {
            $tasks.showModalDelete = true;

            $tasks.taskID = taskId;
        };

        /** 
        * @name updateTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Update an existing task or create a new task, both in the scope and LocalStorage
        * @param {number} taskId - The unique ID of the task to be edited
        * @param {Object} form - The add/edit form to be reset after submit
        */
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

        /** 
        * @name confirmDeleteTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Perform the delete of the selected task after user confirms. Update the scope array and LocalStorage
        * @param {number} taskId - The unique ID of the task to be deleted
        */
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

        /** 
        * @name cancel
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Cancel the Add/Edit/Delete operation and close the modal dialog
        * @param {number} [form] - the form to be reset
        * @param {string} [option] - closes de delete modal if 'Delete' is specified, otherwise, closes Add/Edit modal
        */
        $tasks.cancel = function (form, option) {
            if(option == "Delete") {
                $tasks.taskID = null;
                $tasks.showModalDelete = false;
            } else {
                $tasks.taskID = null;
                $tasks.name = '';
                $tasks.description = '';
                $tasks.showModal = false;
                $tasks.edit = false;
                form.$setPristine();
                form.$setUntouched();
            }
        };

        /** 
        * @name finishTask
        * @function
        * @memberof app.TaskTest.TaskMgmt
        * @description Change the status of a task. Update the scope list and LocalStorage
        * @param {number} index - The index in the array
        * @param {boolean} taskDone - the status of the task: 'true' for done and 'false' for in progress
        */
        $tasks.finishTask = function(index, taskDone) {

            $tasks.list[index].done = taskDone;

            localStorage.setItem("dbTasks", JSON.stringify($tasks.list));

        }
    }]);

})(window.angular);