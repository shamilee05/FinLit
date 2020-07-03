$(document).ready(function () {

	var questionNumber = 0;		//Tracks number of questions displayed
	var questionBank = new Array();		//Will hold all questions as they are fetched from the JSON file
	
	var stage = "#game1";
	var stage2 = new Object;

	var questionLock=false;

	var result = new Array();		//Used to store results of the quiz: 1 for correct, 0 for incorrect
	var resultNumber = 0;
	
	var questionNosSecond = [];		//Stores all question numbers as they are fetched from the JSON file

	var cl;		//0 for beginner, 1 for intermediate and 2 for expert: required for fuzzy

	//question bank[i][5] will store the id of the correct answer 
	var score = 0;		//For fuzzy
	
	var overall_score = 0;

	var timer_clock = 30;

	var current_section;
	
	//To check if the user has asked for Info Bites
	var infoBites = "0";

	//To fetch proper question numbers
	var sbeg, ebeg, sint, eint, sep, eep;

	var pageTitle = document.title;

	//To fetch user details
	//Should be for every user (include in db)
	var userDetails, userID, name, username, email, password, banking_initiation_level, banking_initiation_score, tax_initiation_level=-1, tax_initiation_score=-1, investments_initiation_level=-1, investments_initiation_score=-1, loans_initiation_level=-1, loans_initiation_score=-1;
	var banking_secondary_level=-1, banking_secondary_score=-1, investments_secondary_level=-1, investments_secondary_score=-1, tax_secondary_level=-1, tax_secondary_score=-1, loans_secondary_level=-1, loans_secondary_score=-1;
	var banking_quiz_entry=0;
	var tax_quiz_entry=0;
	var investments_quiz_entry=0;
	var loans_quiz_entry=0;
	var banking_qno=0, tax_qno=0, investments_qno=0, loans_qno=0;

	//Fetch all details
	var xhttp_1 = new XMLHttpRequest();
	xhttp_1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			userDetails = JSON.parse(this.responseText);
			userID = userDetails._id;	
			name = userDetails.name;
			username = userDetails.username;
			email = userDetails.email;
			password = userDetails.password;
			banking_initiation_level = userDetails.banking_initiation_level;
			banking_initiation_score = userDetails.banking_initiation_score;
			tax_initiation_level = userDetails.tax_initiation_level;
			tax_initiation_score = userDetails.tax_initiation_score;
			investments_initiation_level = userDetails.investments_initiation_level;
			investments_initiation_score = userDetails.investments_initiation_score;
			loans_initiation_level = userDetails.loans_initiation_level;
			loans_initiation_score = userDetails.loans_initiation_score;
			banking_secondary_level = userDetails.banking_secondary_level;
			banking_secondary_score = userDetails.banking_secondary_score;
			banking_quiz_entry = userDetails.banking_quiz_entry;
			tax_secondary_level = userDetails.tax_secondary_level;
			tax_secondary_score = userDetails.tax_secondary_score;
			tax_quiz_entry = userDetails.tax_quiz_entry;
			investments_secondary_level = userDetails.investments_secondary_level;
			investments_secondary_score = userDetails.investments_secondary_score;
			investments_quiz_entry = userDetails.investments_quiz_entry;
			loans_secondary_level = userDetails.loans_secondary_level;
			loans_secondary_score = userDetails.loans_secondary_score;
			loans_quiz_entry = userDetails.loans_quiz_entry;
			banking_qno = userDetails.banking_qno;
			tax_qno = userDetails.tax_qno;
			investments_qno = userDetails.investments_qno;
			loans_qno = userDetails.loans_qno;
			
			//Before proceeding, check if they have attempted initiation for tax or investments and accordingly modify buttons
			var xhttp_2 = new XMLHttpRequest();
			xhttp_2.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var resp = JSON.parse(this.responseText);

					//Attempted Tax
					if(resp.tax_set==true) {
						userDetails.tax_initiation_level = resp.tax_init_level;
						userDetails.tax_initiation_score = resp.tax_init_score;
					}

					//Attempted Investments
					if(resp.invest_set==true) {
						userDetails.investments_initiation_level = resp.invest_init_level;
						userDetails.investments_initiation_score = resp.invest_init_score;
					}

					//Attempted Loans
					if(resp.loans_set==true) {
						userDetails.loans_initiation_level = resp.loans_init_level;
						userDetails.loans_initiation_score = resp.loans_init_score;
					}
					console.log(userDetails.tax_initiation_level);
					console.log(userDetails.investments_initiation_level);
					console.log(userDetails.loans_initiation_level);
				}
			}
			xhttp_2.open("GET","/sendTaxInvestLoans", true);
			xhttp_2.send();
			setTimeout(function () {
        if (pageTitle === "Profile") {
          document.getElementById("username").innerHTML =
            "Username: " + userDetails.username;
          //BANKING
          if (userDetails.banking_initiation_level == -1) {
            document.getElementById("banking_score_initiation").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("banking_score_initiation").innerHTML =
              userDetails.banking_initiation_level;
          }
          if (userDetails.banking_secondary_level == -1) {
            document.getElementById("banking_score_secondary").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("banking_score_secondary").innerHTML =
              userDetails.banking_secondary_level;
          }

          //TAX
          if (userDetails.tax_initiation_level == -1) {
            document.getElementById("tax_initiation_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("tax_initiation_level").innerHTML =
              userDetails.tax_initiation_level;
          }
          if (userDetails.tax_secondary_level == -1) {
            document.getElementById("tax_secondary_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("tax_secondary_level").innerHTML =
              userDetails.tax_secondary_level;
          }

          //INVESTMENT
          if (userDetails.investments_initiation_level == -1) {
            document.getElementById("investments_initiation_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("investments_initiation_level").innerHTML =
              userDetails.investments_initiation_level;
          }
          if (userDetails.investments_secondary_level == -1) {
            document.getElementById("investments_secondary_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("investments_secondary_level").innerHTML =
              userDetails.investments_secondary_level;
          }
          //LOANS
          if (userDetails.loans_initiation_level == -1) {
            document.getElementById("loans_initiation_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("loans_initiation_level").innerHTML =
              userDetails.loans_initiation_level;
          }
          if (userDetails.loans_secondary_level == -1) {
            document.getElementById("loans_secondary_level").innerHTML =
              "Not attempted";
          } else {
            document.getElementById("loans_secondary_level").innerHTML =
              userDetails.loans_secondary_level;
          }

        }
      }, 70);
			setTimeout(function() { 
				if(pageTitle==="Dashboard") {
					if(userDetails.tax_initiation_level==-1) {
						document.getElementsByClassName("taxbody")[0].innerHTML = "Since you are just starting out with Tax, we will need you to attempt the initiation quiz first";
						document.getElementsByClassName("taxclass")[1].remove();
					}
					else {
						document.getElementsByClassName("taxbody")[0].innerHTML = "You can attempt the secondary quiz now for Tax";
						document.getElementsByClassName("taxclass")[0].remove();
					}

					if(userDetails.investments_initiation_level==-1) {
						document.getElementsByClassName("investmentsbody")[0].innerHTML = "Since you are just starting out with Investments, we will need you to attempt the initiation quiz first";
						document.getElementsByClassName("investmentsclass")[1].remove();
					}
					else {
						document.getElementsByClassName("investmentsbody")[0].innerHTML = "You can attempt the secondary quiz now for Investments";
						document.getElementsByClassName("investmentsclass")[0].remove();
					}

					if(userDetails.loans_initiation_level==-1) {
						document.getElementsByClassName("loansbody")[0].innerHTML = "Since you are just starting out with Loans, we will need you to attempt the initiation quiz first";
						document.getElementsByClassName("loansclass")[1].remove();
					}
					else {
						document.getElementsByClassName("loansbody")[0].innerHTML = "You can attempt the secondary quiz now for Loans";
						document.getElementsByClassName("loansclass")[0].remove();
					}
				}
			}, 70);
		}
	}
	xhttp_1.open("GET","/ifLoggedIn", true);
	xhttp_1.send();

	setTimeout(function() {
		if(pageTitle==="Secondary Quiz") {
			//Fetch what section (domain) the user wants to attempt
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					current_section = this.responseText.split(" ")[0];
					infoBites =  this.responseText.split(" ")[1];
	
					var topbar = document.getElementById('topbar');
					if(current_section==="banking") {
						topbar.innerHTML = "Banking";
						sbeg = 1;
						ebeg = 15;
						sint = 16;
						eint = 30;
						sep = 31;
						eep = 45;
	
						if(infoBites==="0") {
							if(userDetails.banking_quiz_entry==0) {
								current_level = userDetails.banking_initiation_level;
								generate_secondquiz();
							}
							else if(userDetails.banking_quiz_entry==1) {
								current_level = userDetails.banking_secondary_level;
								overall_score = parseInt(userDetails.banking_secondary_score);
								questionNumber = parseInt(userDetails.banking_qno);
								getNextQuestion();
							}
						}
						else if(infoBites==="1") {
							showBites();
						}
					}
					else if(current_section==="tax") {
						topbar.innerHTML = "Tax";
						sbeg = 46;
						ebeg = 60;
						sint = 61;
						eint = 75;
						sep = 76;
						eep = 90;
	
						if(infoBites==="0") {
							if(userDetails.tax_quiz_entry==0) {
								current_level = userDetails.tax_initiation_level;
								generate_secondquiz();
							}
							else if(userDetails.tax_quiz_entry==1) {
								current_level = userDetails.tax_secondary_level;
								overall_score = parseInt(userDetails.tax_secondary_score);
								questionNumber = parseInt(userDetails.tax_qno);
								getNextQuestion();
							}
						}
						else if(infoBites==="1") {
							showBites();
						}
					}
					else if(current_section==="investments") {
						topbar.innerHTML = "Investments";
						sbeg = 91;
						ebeg = 105;
						sint = 106;
						eint = 120;
						sep = 121;
						eep = 135;
	
						if(infoBites==="0") {
							if(userDetails.investments_quiz_entry==0) {
								current_level = userDetails.investments_initiation_level;
								generate_secondquiz();
							}
							else if(userDetails.investments_quiz_entry==1) {
								current_level = userDetails.investments_secondary_level;
								overall_score = parseInt(userDetails.investments_secondary_score);
								questionNumber = parseInt(userDetails.investments_qno);
								getNextQuestion();
							}
						}
						else if(infoBites==="1") {
							showBites();
						}
					}

					else if(current_section==="loans") {
						topbar.innerHTML = "Loans";
						sbeg = 136;
						ebeg = 145;
						sint = 146;
						eint = 155;
						sep = 156;
						eep = 165;
	
						if(infoBites==="0") {
							if(userDetails.loans_quiz_entry==0) {
								current_level = userDetails.loans_initiation_level;
								generate_secondquiz();
							}
							else if(userDetails.loans_quiz_entry==1) {
								current_level = userDetails.loans_secondary_level;
								overall_score = parseInt(userDetails.loans_secondary_score);
								questionNumber = parseInt(userDetails.loans_qno);
								getNextQuestion();
							}
						}
						else if(infoBites==="1") {
							showBites();
						}
					}
				}
			};
			xhttp.open("GET","/findSection", true);
			xhttp.send();
		}
	}, 1000)

	//For displaying each question
	function displayQuestion() {

		console.log(questionNumber);
		console.log(questionBank[questionNumber]);

		var flag = 0;	//To check when an option was pressed
		var flag_correct = 0; //To check if the option selected was correct

		q1=questionBank[questionNumber][1];
		q2=questionBank[questionNumber][2];
		q3=questionBank[questionNumber][3];
		q4=questionBank[questionNumber][4];
		explanation=questionBank[questionNumber][6];
		hint=questionBank[questionNumber][7];

		$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div><div id="4" class="option">'+q4+'</div>');

		if(typeof(hint)==='string') {
			$(stage).append('<br><br><div class="hintButton"> Hint! <span class="hint">'+hint+'</span> </div>');
		}

		function onTimer() {
			timer.innerHTML = "Timer: " + timer_clock + " seconds";
			timer_clock--;
			console.log(timer_clock);
			if (timer_clock < 0) {
				alert('Time\'s up');
				timer_clock = 30;	//Rest but no scores
				return;
			}
			else if(flag == 1) {	//An option was selected hence, stop and rest the timer
				
				if(flag_correct == 1) {		//The correct option was selected
					if(timer_clock>=21 && timer_clock<=30) {	//Answered within the first 10 seconds
						overall_score = overall_score + 15;
					} else if(timer_clock>=11 && timer_clock<=20) {		//Took 10 to 20 seconds
						overall_score = overall_score + 10;
					} else if(timer_clock>=1 && timer_clock<=10) {		//Took 20 to 30 seconds
						overall_score = overall_score + 5;
					} else {
						//Took more than 30 seconds, no score awarded, do nothing
					}
				}

				timer_clock = 30;
				timer.innerHTML = "Timer";
				return;
			}
			else {
			  setTimeout(onTimer, 1000);
			}
		}

		onTimer();	//Start the timer after displaying question

		$('.option').click(function() {
			flag = 1;
			if(questionLock == false) {
				questionLock = true;	

				//correct answer
				if(this.id==questionBank[questionNumber][5]) {
					flag_correct = 1;
					$(stage).append('<div class="feedback1">CORRECT</div>');
					result[resultNumber] = 1;
					resultNumber++;
					score++;
				}

				//wrong answer	
				if(this.id!=questionBank[questionNumber][5]) {
					$(stage).append('<div class="feedback2">WRONG</div>');
					result[resultNumber] = 0;
					resultNumber++;
				}

				document.getElementById("explanation").innerHTML = explanation;

				// Get the modal
				var modal = document.getElementById("myModal");

				// Get the <span> element that closes the modal
				var span = document.getElementsByClassName("close")[0];

				modal.style.display = "block";

				// When the user clicks on <span> (x), close the modal
				span.onclick = function() {
					modal.style.display = "none";
					setTimeout(function(){changeQuestion()}, 1000);
				}

				// When the user clicks anywhere outside of the modal, close it
				window.onclick = function(event) {
					if (event.target == modal) {
						modal.style.display = "none";
						setTimeout(function(){changeQuestion()}, 1000);
					}
				}
			}
		})
	}

	//To get to the next question
	function changeQuestion() {

		questionNumber++;
		console.log(questionNumber);

		if(stage=="#game1") {
			stage2 = "#game1";
			stage = "#game2";
		} else {
			stage2 = "#game2";
			stage = "#game1";
		}

		if(questionNumber>=4) {
			if(current_level == 'expert') {
				cl = 2;
			}
			if(current_level == 'intermediate') {
				cl = 1;
			}
			if(current_level == 'beginner') {
				cl = 0;
			}
			var xhttp3 = new XMLHttpRequest();
			xhttp3.open("GET", "/fuzzy?score=" + score + "&cl=" + cl, true);
			xhttp3.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if(this.responseText == 0)
					{
						current_level = 'beginner';
					}
					if(this.responseText == 1)
					{
						current_level = 'intermediate';
					}
					if(this.responseText == 2)
					{
						current_level = 'expert';
					}
					$(stage).append('<div class="scoreText">Your score until now: '+overall_score+'</div>');
					$(stage).append('<div class="questionText">Your next question will be of level: '+current_level+'</div>');
					$(stage).append('<a href="javascript:getNextQuestion();" class="btn btn-light btn-custom-2 mt-4"> Show next question </a><br>');
					$(stage).append('<a href="javascript:saveDetails();" class="btn btn-light btn-custom-2 mt-4"> Save my Progress </a><br>');
					$(stage).append('<a href="/dashboard" class="btn btn-light btn-custom-2 mt-4"> Exit and return to the Dashboard</a><br>');
					console.log(result);
				}
			}
			xhttp3.send();
			console.log("Running fuzzy script"); 
		}
		else {	displayQuestion();	}

		$(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
		$(stage).animate({"right": "0px"},"slow", function() {$(stage).css('right','0px');questionLock=false;});
	}

	//Deciding the first four questions
	generate_secondquiz = function(length) {
		var nbeg = 0, nint = 0 , nexp = 0;		//Not being actually used, just to set number of questions from each section at first
		var n;

		var timer = document.getElementById('timer');
		timer.innerHTML = "Timer: " + timer_clock + " seconds";
		
		if(current_level == 'beginner') {
			nbeg = 2;	nint = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (ebeg - sbeg + 1)) + sbeg;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (eint - sint + 1)) + sint;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'intermediate') {
			nint = 2, nexp = 2;
			for(i=0; i<2; i++) {
				do
					n = Math.floor(Math.random() * (eint - sint + 1)) + sint;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
			for(i=2; i<4; i++) {
				do
					n = Math.floor(Math.random() * (eep - sep + 1)) + sep;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}
		else if(current_level == 'expert') {
			nint = 1; nexp = 3;
			do
				n = Math.floor(Math.random() * (eint - sint + 1)) + sint;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[0] = n;
			for(i=1; i<4; i++) {
				do
					n = Math.floor(Math.random() * (eep - sep + 1)) + sep;
				while(questionNosSecond.indexOf(n) !== -1)
				questionNosSecond[i] = n;
			}
		}

		console.log(questionNosSecond);		//Will display the question numbers of the first 4 questions selected

		$.getJSON('activity.json', function(data) {

			for(i=0; i<4; i++) {
				questionBank[i]=new Array;
				questionBank[i][0]=data.quizlist[questionNosSecond[i]-1].question;
				questionBank[i][1]=data.quizlist[questionNosSecond[i]-1].option1;
				questionBank[i][2]=data.quizlist[questionNosSecond[i]-1].option2;
				questionBank[i][3]=data.quizlist[questionNosSecond[i]-1].option3;
				questionBank[i][4]=data.quizlist[questionNosSecond[i]-1].option4;
				questionBank[i][5]=data.quizlist[questionNosSecond[i]-1].correct;
				questionBank[i][6]=data.quizlist[questionNosSecond[i]-1].explanation;

				//If the question has a hint, get that as well
				if(typeof(data.quizlist[questionNosSecond[i]-1].hint)==='string') {
					questionBank[i][7]=data.quizlist[questionNosSecond[i]-1].hint;
				}
				console.log(questionBank[i]);
			}

		})//Get the 4 questions and store them in questionBank

		setTimeout(displayQuestion, 1500);
    }
    
	//This will come into picture after the first 4 questions
	getNextQuestion = function(length) {
		var n;
		console.log("Number of questions displayed until now: "+questionNumber);
		$(stage).children("div").remove();
		$(stage).children("a").remove();
		$(stage).children("br").remove();

		if(current_level == 'beginner') {
			do
				n = Math.floor(Math.random() * (ebeg - sbeg + 1)) + sbeg;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'intermediate') {
			do
				n = Math.floor(Math.random() * (eint - sint + 1)) + sint;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}
		else if(current_level == 'expert') {
			do
				n = Math.floor(Math.random() * (eep - sep + 1)) + sep;
			while(questionNosSecond.indexOf(n) !== -1)
			questionNosSecond[questionNumber] = n;
		}

		console.log(n);		//Shows what question number has been selected

		$.getJSON('activity.json', function(data) {
			questionBank[questionNumber]=new Array;
			questionBank[questionNumber][0]=data.quizlist[questionNosSecond[questionNumber]-1].question;
			questionBank[questionNumber][1]=data.quizlist[questionNosSecond[questionNumber]-1].option1;
			questionBank[questionNumber][2]=data.quizlist[questionNosSecond[questionNumber]-1].option2;
			questionBank[questionNumber][3]=data.quizlist[questionNosSecond[questionNumber]-1].option3;
			questionBank[questionNumber][4]=data.quizlist[questionNosSecond[questionNumber]-1].option4;
			questionBank[questionNumber][5]=data.quizlist[questionNosSecond[questionNumber]-1].correct; 
			questionBank[questionNumber][6]=data.quizlist[questionNosSecond[questionNumber]-1].explanation; 

			//If the question has a hint, get that as well
			if(typeof(data.quizlist[questionNosSecond[questionNumber]-1].hint)==='string') {
				questionBank[questionNumber][7]=data.quizlist[questionNosSecond[questionNumber]-1].hint;
			}

			console.log(questionBank[questionNumber]);
		
		})//Get that question from the JSON file

		//Set scores before proceeding to display question
		if(result[resultNumber-4]==1) {
			score = score-1;
		}

		setTimeout(displayQuestion, 1500);
	}

	saveDetails = function(length) {
		if(current_section==="banking") {
			userDetails.banking_quiz_entry = 1;
			userDetails.banking_secondary_score = overall_score.toString();
			userDetails.banking_secondary_level = current_level;
			userDetails.banking_qno = questionNumber.toString();
		}
		else if(current_section==="tax") {
			userDetails.tax_quiz_entry = 1;
			userDetails.tax_secondary_score = overall_score.toString();
			userDetails.tax_secondary_level = current_level;
			userDetails.tax_qno = questionNumber.toString();
		}
		else if(current_section==="investments") {
			userDetails.investments_quiz_entry = 1;
			userDetails.investments_secondary_score = overall_score.toString();
			userDetails.investments_secondary_level = current_level;
			userDetails.investments_qno = questionNumber.toString();
		}
		else if(current_section==="loans") {
			userDetails.loans_quiz_entry = 1;
			userDetails.loans_secondary_score = overall_score.toString();
			userDetails.loans_secondary_level = current_level;
			userDetails.loans_qno = questionNumber.toString();
		}

		$(stage).append('<br><div class="scoreText"> Progress Saved! </div>');

		var xhttp_4 = new XMLHttpRequest();
		console.log(userDetails.loans_secondary_level);
		var userURL = "/updateUserProgress?banking_secondary_level="+userDetails.banking_secondary_level+"&banking_secondary_score="+userDetails.banking_secondary_score+"&tax_secondary_level="+userDetails.tax_secondary_level+"&tax_secondary_score="+userDetails.tax_secondary_score+"&investments_secondary_level="+userDetails.investments_secondary_level+"&investments_secondary_score="+userDetails.investments_secondary_score+"&loans_secondary_level="+userDetails.loans_secondary_level+"&loans_secondary_score="+userDetails.loans_secondary_score+"&banking_quiz_entry="+userDetails.banking_quiz_entry+"&tax_quiz_entry="+userDetails.tax_quiz_entry+"&investments_quiz_entry="+userDetails.investments_quiz_entry+"&loans_quiz_entry="+userDetails.loans_quiz_entry+"&banking_qno="+userDetails.banking_qno+"&tax_qno="+userDetails.tax_qno+"&investments_qno="+userDetails.investments_qno+"&loans_qno="+userDetails.loans_qno;
		console.log(userURL);
		
		xhttp_4.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				console.log(this.responseText);
			}
		}
		xhttp_4.open("GET",userURL, true);
		xhttp_4.send();
	}

	function showBites() {
		//sbeg and eep
		$(stage).children("div").remove();
		$(stage).children("a").remove();
		$(stage).children("br").remove();

		console.log(sbeg);
		console.log(eep);
		var n = Math.floor(Math.random() * (eep - sbeg + 1)) + sbeg;
		console.log(n);
		var info;

		$.getJSON('activity.json', function(data) {
			info = data.quizlist[n-1].explanation;
		})
		console.log(info);

		setTimeout(function() {
			$(stage).append('<br><div class="infoText">'+info+'</div>');
		},1000);

		$(stage).append('<a href="/dashboard" class="btn btn-light btn-custom-2 mt-4">Return to Dashboard</a><br><br>');
		$(stage).append('<button id="nextButton" class="btn btn-light btn-custom-2 mt-4">Show Next Bite</button><br><br>');

		$("#nextButton").button().click(function() {
			$(stage).children("div").remove();
			console.log(sbeg);
			console.log(eep);
			var n = Math.floor(Math.random() * (eep - sbeg + 1)) + sbeg;
			console.log(n);
			var info;

			$.getJSON('activity.json', function(data) {
				info = data.quizlist[n-1].explanation;
			})
			console.log(info);

			setTimeout(function() {
				$(stage).append('<div class="siema"><div class="infoText">'+info+'</div</div>');
			},2000);
		});
	}
});
