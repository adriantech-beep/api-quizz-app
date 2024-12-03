//quizz app API🏆

class QuizzApp {
  constructor() {
    // Array to hold the fetched questions so i dont need to push the data
    this.questions = [];
    this.score = 0;

    //this is for the parentelement of the question to be displayed
    this.sectionTopicQuestion = document.querySelector(
      ".section-topic__question"
    );
    this.sectionAnswerSelection = document.querySelector(
      ".section-answer__selection"
    );
    this.answerStatusContainer = document.querySelector(
      ".answer-status__container"
    );
    this.scoreCount = document.querySelector(".score-count");
    this.scoreCounterContainer = document.querySelector(
      ".score-counter__container"
    );
    this.finalScoreContainer = document.querySelector(
      ".final-score__container"
    );

    //methods that are binded
    this.addHiddenClass = this.addHiddenClass.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.correctAnswer = this.correctAnswer.bind(this);
    this.removeHiddenClass = this.removeHiddenClass.bind(this);
    this.finalScore = this.finalScore.bind(this);

    //event listeners
    this.startBtnButton = document.querySelector(".start-btn__button");
    this.startAgainBtn = document.querySelector(".start-again__btn");

    //event listeners to be clicked
    this.startBtnButton.addEventListener("click", () => this.fetchQuestions());
    this.startAgainBtn.addEventListener("click", () => this.fetchQuestions());
  }

  //this will initialize the fectching of the data
  async fetchQuestions() {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy"
      );
      if (!response.ok) throw new Error("Problem getting the data");
      const data = await response.json();

      // proccessed results and stored the data
      this.questions = data.results.map((result) => ({
        question: result.question,
        correctAnswer: result.correct_answer,
        wrongAnswers: result.incorrect_answers,
      }));

      this.displayQuestion(0); // this will display the first question
      this.startAgainBtn.classList.add("hidden");
      this.scoreCounterContainer.classList.remove("hidden");

      this.scoreCount.textContent = this.score = 0;
      this.finalScoreContainer.innerHTML = "";
    } catch (err) {
      console.log(err);
    }
  }

  displayQuestion(index) {
    this.addHiddenClass();

    if (index < this.questions.length) {
      const questionData = this.questions[index];

      //this will display the question
      const markUp = `
        <h5>Question Number:${index + 1}</h5>
        <p class="rendered-question">${questionData.question}</p>
        `;
      this.sectionTopicQuestion.innerHTML = "";
      this.sectionTopicQuestion.insertAdjacentHTML("afterbegin", markUp);

      const choices = [
        ...questionData.wrongAnswers,
        questionData.correctAnswer,
      ];

      ////////////////////////////////
      // this will shuffle the choices
      //this mutates the original array so that i dont need to store it on another variable
      choices.sort(() => Math.random() - 0.5);

      ////////////////////////////////
      // this will clear previous answers
      this.sectionAnswerSelection.innerHTML = "";

      //////////////////////////////////
      // this will create and append each choices
      choices.forEach((choice, idx) => {
        const markUp = `
                 <div class="select-answer" id="select-${idx + 1}">
                   <p>${choice}</p>
                </div>`;

        this.sectionAnswerSelection.insertAdjacentHTML("beforeend", markUp);
      });

      // this will add click event listeners to each choice
      choices.forEach((choice, idx) => {
        const answerElement = document.getElementById(`select-${idx + 1}`);
        answerElement.onclick = () => this.selectAnswer(choice, index);
      });
    } else {
      this.sectionTopicQuestion.innerHTML = "";
      this.sectionAnswerSelection.innerHTML = "";
      this.scoreCounterContainer.classList.add("hidden");
      this.startAgainBtn.classList.remove("hidden");
      this.finalScore();
    }
  }

  selectAnswer(selectedChoice, index) {
    const questionData = this.questions[index];
    const isCorrect = selectedChoice === questionData.correctAnswer;

    if (isCorrect) {
      this.correctAnswer("Correct☑️");
      this.score++;
      this.scoreCount.textContent = this.score;
    } else {
      this.correctAnswer("Wrong❌");
    }

    //this will call the next question
    setTimeout(() => {
      this.displayQuestion(index + 1);
    }, 1800);
  }

  correctAnswer(message) {
    const markUp = `
      <div class="answer-status__modal">
        <p>${message}</p>
      </div>
         `;
    this.answerStatusContainer.insertAdjacentHTML("beforeend", markUp);

    // Select the newly added message using traversing
    const messageElement = this.answerStatusContainer.lastElementChild;

    // Set timeout to fade out the message after a delay
    setTimeout(() => {
      messageElement.classList.remove("fade-in");
      messageElement.classList.add("fade-out");

      // Remove the element from the DOM after the fade-out animation is complete
      messageElement.addEventListener("animationend", () => {
        messageElement.remove();
      });
    }, 1800);
  }

  //method displaying final score
  finalScore() {
    const markUp = `
        <div class="final-score__modal">
          <h1>Final Score🎉</h1>
          <p>${this.score}</p>
        </div>`;
    this.finalScoreContainer.insertAdjacentHTML("afterbegin", markUp);
  }

  //adding hidden classes
  addHiddenClass() {
    document.querySelector(".start-btn").classList.add("hidden");
  }

  //removing hidden classes
  removeHiddenClass() {
    document.querySelector(".start-btn").classList.remove("hidden");
  }
}

const quizApp = new QuizzApp();
