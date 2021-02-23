GAME_MAX = 10;

function randomInt(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

function generateProblem() {

    var a = randomInt(0, GAME_MAX);
    var b = randomInt(0, GAME_MAX - a);
    var x = a + b;
    var problem = {
        a: a,
        op: "+",
        b: b,
        x: x,
    }
    return problem;
}

function checkAnswer(problem, answer) {
    return problem.x == answer;
}

function runTimer(app) {
    app.timer.started = true;
    setTimeout(() => {
        if (!app.timer.started) {
            return
        }
        app.timer.countdown -= 1;
        if (app.timer.countdown > 0) {
            runTimer(app)
        }
        else {
            app.timer.started = false;
            app.gameOver();
        }
    }, 1000);
}


function runGame() {
    var app = new Vue({
      el: '#app',
      data: {
        message: 'Hello Vue!',
        problem: generateProblem(),
        answer: null,
        haveAnswer: false,
        correct: null,
        correctCount: 0,
        answers: [],
        timer: {
            countdown: 60,
            started: false,
        },
        gameover: false,
      },
      methods: {
          check: function() {
              this.correct = checkAnswer(this.problem, this.answer);
              this.answers.push(this.correct);
              this.haveAnswer = true;
              if (this.correct) {
                  this.correctCount += 1;
                  this.newProblem();
              }
              return false;
          },
          changed: function() {
              var correct = checkAnswer(this.problem, this.answer);
              if (correct) {
                  this.answers.push(correct);
                  this.correctCount += 1;
                  setTimeout(this.newProblem, 200)
              }
          },
          newProblem: function() {
              this.answer = null;
              this.problem = generateProblem();
          },
          restart: function() {
            this.gameover = false;
            this.timer.countdown = 60;
            this.correctCount = 0;
            this.problem = generateProblem();
            this.answers = [];
            this.haveAnswer = false;
            runTimer(this);
            document.getElementById("answer-input").focus();
          },
          gameOver() {
              this.gameover = true;
          }
      }
    })
    runTimer(app);
}
