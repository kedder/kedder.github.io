var app = angular.module("PigTimesBird", []);

app.controller("Game", function($scope, $timeout) {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function Problem() {
        var a, b;
        this.a = a = getRandomInt(1, $scope.level + 2);
        this.b = b= getRandomInt(1, $scope.level + 2);
        this.x = null;
        this.correct = false;
        this.incorrect = false;
        this.answer = null;
        this.id = Math.max(a, b) == b ? a + "x" + b : b + "x" + a;

        this.check = function() {
            this.answer = this.a * this.b;
            this.correct = this.answer == this.x;
            this.incorrect = !this.correct;
        }
    }

    function generateProblemCombinations() {
        var combinations = [];
        for (var i=1; i<10; i++) {
            for (var j=i; j<10; j++) {
                combinations.push(i+'x'+j);
            }
        }
        return combinations;
    }

    function loadState() {
        $scope.previousProblems =
            JSON.parse(localStorage.getItem("previousProblems")) || $scope.previousProblems;
        $scope.stats =
            JSON.parse(localStorage.getItem("stats")) || $scope.stats;
        $scope.level =
            JSON.parse(localStorage.getItem("level")) || $scope.level;

        if ($scope.stats.unsolved == undefined) {
            $scope.stats.unsolved = generateProblemCombinations();
            $scope.stats.goal = $scope.stats.unsolved.length;
        }
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
        $scope.stats.unsolved = generateProblemCombinations();
        $scope.stats.goal = $scope.stats.unsolved.length;
    }

    function registerCorrect(problem) {
        $scope.stats.correct++;

        // Remove problem from unsolved set
        var probidx = $scope.stats.unsolved.indexOf(problem.id);
        if (probidx >= 0) {
            $scope.stats.unsolved.splice(probidx, 1);
        }
    }

    function registerIncorrect(problem) {
        $scope.stats.incorrect++;

        // Add problem to unsolved set
        var probidx = $scope.stats.unsolved.indexOf(problem.id);
        if (probidx === -1) {
            $scope.stats.unsolved.push(problem.id);
        }
    }

    function updateStats() {
        if ($scope.problem.correct) {
            registerCorrect($scope.problem);
        }
        if ($scope.problem.incorrect) {
            registerIncorrect($scope.problem);
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

    $scope.calcProgress = function() {
        return (1 - $scope.stats.unsolved.length / $scope.stats.goal) * 100;
    }
});