var app = angular.module("PigTimesBird", []);

app.controller("Game", function($scope, $timeout) {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function Problem() {
        this.a = getRandomInt(1, $scope.level + 2);
        this.b = getRandomInt(1, $scope.level + 2);
        this.x = null;
        this.correct = false;
        this.incorrect = false;
        this.answer = null;

        this.check = function() {
            this.answer = this.a * this.b;
            this.correct = this.answer == this.x;
            this.incorrect = !this.correct;
        }

    }

    function loadState() {
        $scope.previousProblems =
            JSON.parse(localStorage.getItem("previousProblems")) || $scope.previousProblems;
        $scope.stats =
            JSON.parse(localStorage.getItem("stats")) || $scope.stats;
        $scope.level =
            JSON.parse(localStorage.getItem("level")) || $scope.level;

        console.log($scope.previousProblems);
        console.log($scope.stats);
    }

    function saveState() {
        localStorage.setItem('previousProblems',
                             JSON.stringify($scope.previousProblems));
        localStorage.setItem('stats',
                             JSON.stringify($scope.stats));
        localStorage.setItem('level',
                             JSON.stringify($scope.level));
    }

    function newGame() {
        $scope.previousProblems = [];

        $scope.stats = {
            correct: 0,
            incorrect: 0,
            total: 0,
            xp: 0
        }
        $scope.problem = new Problem();
    }

    function updateStats() {
        if ($scope.problem.correct) {
            $scope.stats.correct++;
        }
        if ($scope.problem.incorrect) {
            $scope.stats.incorrect++;
        }
        $scope.problem.total++;
    }

    function rememberProblem() {
        $scope.previousProblems.unshift($scope.problem);
        if ($scope.previousProblems.length > 10) {
            $scope.previousProblems.pop();
        }
    }

    $scope.level = 1;
    newGame();
    loadState();

    $scope.checkAnswer = function() {
        $scope.problem.check();

        rememberProblem();
        updateStats();
        saveState();

        $timeout(function() {
            $scope.problem = new Problem();
        }, 1000);
    }

    $scope.advance = function(inc) {
        $scope.level += inc;
        $scope.problem = new Problem();
        saveState();
    }

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.newGame = function() {
        newGame();
        saveState();
    }
});