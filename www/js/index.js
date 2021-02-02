// Author: Govinda Lohani

/* this fuction is called when the page loads*/
$(document).ready(function(){

	// declare variables
	var employee;
	var employer;

	//dynamic server url
	var serverAddress= "http://192.168.0.8:3000";


	// function to handle user sign in
	function createAccount(){
		choice=document.getElementById("signInType");
		let username;
		let password;
		let phoneNumber;
		let signInType;
		let email;

		// read sign in details
		username=document.getElementById("username").value;
		password=document.getElementById("signInPassword").value;
		phoneNumber=document.getElementById("phoneNumber").value;
		signInType = choice.options[choice.selectedIndex].value;
		email=document.getElementById("email").value;


		// check if all the details are provided or not
		if(signInType=="Select how you recognize yourself"){
			alert("please select one of either employer or employee");
		}

		else if(username==""){
			alert("please provide username");
		}

		else if(password==""){
			alert("please provide password");
		}

		else if(email==""){
			alert("please provide email");
		}

		else{
			// create an object
		let signInData={signInType, username, password, phoneNumber, email};


		// send sign in details to the server			
			  $.ajax({
                    url: serverAddress+'/signIn',
                    type:'post',
                     data:{data:JSON.stringify(signInData)},
                     success: function(data)
                     {
                     	if(data=="yes")
							alert("Your account is created successfully");
						else if(data=="dupli")
							alert("This username already has an account");
                     },

                     error: function(e)
                     {  
                        alert("Your account cannot be created. Please try again");
                     }
                    }); 

		}

		

		
	}	


	// funtion to handle user log in
	function handleLogIn(){

		// read the log in details
		username=document.getElementById("logInUsername").value;
		password=document.getElementById("logInPassword").value;

		// check valid login details
		if(username==""){
			alert("please provide username");
		}

		else if(password==""){
			alert("please provide password");
		}

		else{
			//create an object to send
		logInData={username: username, password: password};


		// send login details to the server
		$.ajax({
                    url: serverAddress+'/logIn',
                    type:'post',
                     data:{data:JSON.stringify(logInData)},
                     success: function(data)
                     {
                     	if(data=="no")
							alert("Wrong password! please try again");
						else if(data=="acc")
							alert("this username does not have an account");
						else{
							recievedData=JSON.parse(data);

							// choose appropriate type
							if(recievedData.type=="employee"){
								localStorage.setItem("employee",JSON.stringify(recievedData.name));
								// open employee page
								window.open("employee.html");
							}

							else{
								localStorage.setItem("employer",JSON.stringify(recievedData.name));
								// Open employer page
								window.open("employer.html");

							}

						}
                     },

                     error: function(e)
                     {  
                        alert("Log in error. Please try again");
                     }
                    }); 

		}

		

	}

	//function to show employeeDetials
	function viewEmployeeDetails(){
		employee=JSON.parse(localStorage.getItem("employee"));
		document.getElementById("employeeName").innerHTML=employee;

	}

	
	
	// jQuery to target createAccont button	
	$("#createAccount").click(function(){createAccount();});

	//JQuery to target login button
	$("#logIn").click(function(){handleLogIn();});

			
		
});
