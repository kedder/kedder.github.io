GAME_MAX = 20;

function randomNormalBM() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}
function randomUniform(start, end) {
  var rnd = Math.random();
  return Math.round(rnd * (end - start)) + start;
}

function randomNormal(start, end) {
  var rnd = randomNormalBM();
  return Math.round(rnd * (end - start)) + start;
}

function generateProblem() {
    console.log("")
    var sign = Math.random() < 0.5 ? "+" : "-";
    var total = randomUniform(2, GAME_MAX);
    var a = randomNormal(0, total);
    var b = total - a;
    if (sign === "-") {
      var problem = {
          a: total,
          op: "-",
          b: a,
          x: b,
      }
    }
    else {
      var problem = {
          a: a,
          op: "+",
          b: b,
          x: total,
      }
    }
    console.log("NEW PROBLEM", problem);
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
