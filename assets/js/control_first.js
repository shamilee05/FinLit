$(document).ready(function () {
	
	var questionNumber = 0;		//Tracks number of questions displayed
	var questionBank = []	//Stores the 9 questions
	
	var stage = "#game1";
	var stage2 = new Object;

	var questionLock = false;
	var numberOfQuestions;		//Will basically be 9 throughout

	var result = new Array();		//Used to store results of the quiz: 1 for correct, 0 for incorrect
	var resultNumber = 0;

	var user_category;	//Will be a single alphabet response from the classifier script
	var current_level;	//Will actually store the user level

	//questionBank[i][5] will store the id of the correct answer
	var score = 0;

	//To fetch proper question numbers
	var sbeg, ebeg, sint, eint, sep, eep;

	//Fetch what section (domain) the user wants to attempt
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			current_section = this.responseText.split(" ")[0];
		  	console.log(current_section);

			if(current_section==="banking") {
				document.getElementById('topbar').innerHTML = "Initiation Quiz for Banking";
				sbeg = 1;
				ebeg = 15;
				sint = 16;
				eint = 30;
				sep = 31;
				eep = 45;
			}
			else if(current_section==="tax") {
				document.getElementById('topbar').innerHTML = "Initiation Quiz for Tax";
				sbeg = 46;
				ebeg = 60;
				sint = 61;
				eint = 75;
				sep = 76;
				eep = 90;
			}
			else if(current_section==="investments") {
				document.getElementById('topbar').innerHTML = "Initiation Quiz for Investments";
				sbeg = 91;
				ebeg = 105;
				sint = 106;
				eint = 120;
				sep = 121;
				eep = 135;
			}
			else if(current_section==="loans") {
				document.getElementById('topbar').innerHTML = "Initiation Quiz for Loans";
				sbeg = 136;
				ebeg = 145;
				sint = 146;
				eint = 155;
				sep = 156;
				eep = 165;
			}

			setTimeout(function() {
				//Get those 9 questions from the JSON file
				$.getJSON('activity.json', function(data) {
					var arr = generate_firstquiz(3);
					var q_number;
					var num = 0;
	
					//For every question in the question bank 
					for(i=0; i<data.quizlist.length; i++) {
						q_number = Number(data.quizlist[i].q_id);	
						console.log("Displaying question number next")
						console.log(q_number)
						if(arr.indexOf(q_number)>=0)	//Search q_number in arr
						{
							questionBank[num]=new Array;
							questionBank[num][0]=data.quizlist[i].question;
							questionBank[num][1]=data.quizlist[i].option1;
							questionBank[num][2]=data.quizlist[i].option2;
							questionBank[num][3]=data.quizlist[i].option3;
							questionBank[num][4]=data.quizlist[i].option4;
							questionBank[num][5]=data.quizlist[i].correct; 
							console.log(questionBank[num]);
							num++;
						}
					}
	
					console.log("Displaying all 9 questions and their options next")
					console.log(questionBank)
					numberOfQuestions=questionBank.length;		//This would be 9
					
					displayQuestion();	
				})
			}, 1000)
		}
	};
	xhttp.open("GET","/findSection", true);
	xhttp.send();


	//Randomly select 3 questions each from the beginner, intermediate and expert sections to curate a list of 9 questions for the Initiation Quiz
	generate_firstquiz = function(length) {
		var arr = [];
		var n;
		for(var i=0; i<3; i++) {
			do
				n = Math.floor(Math.random() * (ebeg - sbeg + 1)) + sbeg;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		for(var i=3; i<6; i++) {
			do
				n = Math.floor(Math.random() * (eint - sint + 1)) + sint;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		for(var i=6; i<9; i++) {
			do
				n = Math.floor(Math.random() * (eep - sep + 1)) + sep;
			while(arr.indexOf(n) !== -1)
			arr[i] = n;
		}
		console.log(arr);
		return arr;
	}
	
	
	function displayQuestion() {

		console.log(questionNumber);
		console.log(questionBank[questionNumber]);

		q1=questionBank[questionNumber][1];
		q2=questionBank[questionNumber][2];
		q3=questionBank[questionNumber][3];
		q4=questionBank[questionNumber][4];

		$(stage).append('<div class="questionText">'+questionBank[questionNumber][0]+'</div><div id="1" class="option">'+q1+'</div><div id="2" class="option">'+q2+'</div><div id="3" class="option">'+q3+'</div><div id="4" class="option">'+q4+'</div>');

		$('.option').click(function() {
			if(questionLock == false) {
				questionLock = true;	

				//correct answer
				if(this.id==questionBank[questionNumber][5]) {
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

				setTimeout(function(){changeQuestion()}, 1000);
			}
		})
	}


	function changeQuestion() {

		questionNumber++;
		console.log(questionNumber);

		if(stage=="#game1") { 
			stage2="#game1";stage="#game2";
		}	else { 
			stage2="#game2";stage="#game1";
		}

		if(questionNumber<numberOfQuestions) {	//This condition will be false when all 9 questions have been displayed
			displayQuestion();
		} else {	//When 9 = 9
			displayFinalSlide();
		}
		
		$(stage2).animate({"right": "+=800px"},"slow", function() {$(stage2).css('right','-800px');$(stage2).empty();});
		$(stage).animate({"right": "0px"},"slow", function() {$(stage).css('right','0px');questionLock=false;});
	}


	function displayFinalSlide() {

		var xhttp = new XMLHttpRequest();

		function reqListener (data) {
			user_category = this.responseText;
			console.log(user_category);
			current_level = user_category.trim();
			if(current_level == 'e') {
				current_level = 'expert';
			}
			if(current_level == 'i') {
				current_level = 'intermediate';
			}
			if(current_level == 'b') {
				current_level = 'beginner';
			}
		}

		xhttp.addEventListener("load", reqListener);
		xhttp.open("GET", "/ip?q1="+result[0]+'&q2='+result[1]+'&q3='+result[2]+'&q4='+result[3]+'&q5='+result[4]+'&q6='+result[5]+'&q7='+result[6]+'&q8='+result[7]+'&q9='+result[8], true);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				new Promise(resolve => { 
					setTimeout(function() { 
						$(stage).append('<div class="questionText">You have finished the quiz!<br><br>Total questions: '+numberOfQuestions+'<br>Correct answers: '+score+'<br>Your current level is '+current_level+'</div><br><br>');
						if(current_section==="tax") {
							$(stage).append('<a href="/dashboard?section=tax&level='+current_level+'&score='+score+'" class="btn btn-light btn-custom-2 mt-4"> Go to the Dashboard </a>');
						}
						else if(current_section==="investments") {
							$(stage).append('<a href="/dashboard?section=invest&level='+current_level+'&score='+score+'" class="btn btn-light btn-custom-2 mt-4"> Go to the Dashboard </a>');
						}
						else if(current_section==="loans") {
							$(stage).append('<a href="/dashboard?section=loans&level='+current_level+'&score='+score+'" class="btn btn-light btn-custom-2 mt-4"> Go to the Dashboard </a>');
						}
						else {
							$(stage).append('<a href="/dashboard" class="btn btn-light btn-custom-2 mt-4"> Proceed to Register </a>');
						}
						//When a user goes to the dashboard, they should not see the Initiation quiz links for tax and investments
					}, 2000); 
				}); 
			}
		};

		xhttp.send();

		setTimeout(function() {
			//Setting cookie
			var d = new Date();
			d.setTime(d.getTime() + (20*24*60*60*1000));
			var expires = "expires=" + d.toUTCString();
			console.log(expires); 
			document.cookie = "Current Level = " + current_level + ", Score out of 9 = " + score + ", Section = " + current_section + "," + expires; 

			console.log(document.cookie);
			console.log("Current user level is " + current_level);

			if(current_section==="banking") {
				var xhttp_1 = new XMLHttpRequest();
				xhttp_1.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						console.log(this.responseText);
					}
				}
				xhttp_1.open("GET", "/cookiesHandler?cookie="+ document.cookie, true);
				xhttp_1.send();
			}
		}, 2000);
	}
});
