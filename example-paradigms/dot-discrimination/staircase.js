function staircase(dots_diff, accuracy, trialnum){



// Two Correct
	if(accuracy[1] == 1 & accuracy[0] == 1){


		if(trialnum < 7){
			dots_diff -= 0.4;
		}      
		else if (trialnum > 6 && trialnum < 12){
			dots_diff -= 0.2;
		} else if (trialnum > 11){
			dots_diff -= 0.1;
		}


	}


// Last one wrong
	if(accuracy[1] == 0) {
		


		if(trialnum < 7){
			dots_diff += 0.4;
		}      
		else if (trialnum > 6 && trialnum < 12){
			dots_diff += 0.2;
		} else if (trialnum > 11){
			dots_diff += 0.1;
		}



	}






	// Set a limit
    if (dots_diff <= 1) {dots_diff = 1;}




	var output = 
	{
		diff: dots_diff,
		accuracy: accuracy,
		trialnum: trialnum,
	};
	return output;


}