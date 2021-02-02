// Author: Govinda Lohani
/* this fuction is called when the page loads*/
$(document).ready(function(){

	//$( ".date-input-css" ).datepicker();

	// declare variables
	var employee;
	var employer;
	var payRateOfEmployees = 25.57;

	//dynamic server url
	var serverAddress= "http://192.168.0.8:3000";


	
	//function to show employerDetials
	function init(){
		employer=JSON.parse(localStorage.getItem("employer"));
		document.getElementById("employerName").innerHTML="Employer Name: "+employer;

		//to set the employee list in post roster view
		getEmployeeList("employeeName");
		//to set the employee list in working hours view
		getEmployeeList("employee_Name");
		//to set the employee list in payslip view
		getEmployeeList("paySlipEmployeeName");
	}

	//function to post roster
	function postRoster(){
		employee=document.getElementById("employeeName").value;
		rosterData=document.getElementById("rosterData").value;
		fromDate=document.getElementById("fromDate").value;
		toDate=document.getElementById("toDate").value;

		if(rosterData == "" || fromDate == "" || toDate == "" || employee == "") {
			alert("Fill all the fields!");
			console.log("fill all the fields");
			return false;
		}

		var userData= getUserData(employee);
		var userEmail = userData.email;
		console.log(userEmail);

		// create object
		sendObject={employeeName: employee, rosterData: rosterData, employerName: employer, fromDate:fromDate, toDate:toDate};

		// send roster to the server
		// send sign in details to the server			
			  $.ajax({
                    url: serverAddress+'/sendRoster',
                    type:'post',
                     data:{data:JSON.stringify(sendObject)},
                     success: function(data)
                     {
						 alert("Your roster data is stored by the server");
						 var emp_name = document.getElementById("employeeName");
						 emp_name[0].selected = true;
						 document.getElementById("fromDate").value = "";
						 document.getElementById("toDate").value = "";
						 document.getElementById("rosterData").value = "";

						 var mailObj = {employee: employee, fromDate:fromDate, toDate:toDate, rosterData:rosterData, email: userEmail}

						 sendMail(mailObj);
                     },

                     error: function(e)
                     {  
                        alert("Cannot send roster please try again");
                     }
                    }); 


	}

	//function to send an email to employee
	function sendMail(userMailDetails) {

		var mailSubject = "Roster for " + userMailDetails.fromDate +" to "+ userMailDetails.toDate;

		displayFromDate = new Date(userMailDetails.fromDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'}); 
		displayToDate = new Date(userMailDetails.toDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'});
		
		var greeting = "<h2>Hi "+ userMailDetails.employee +",<h2></br>";
		var dateText = "<p>This is you Roster from " + displayFromDate +" to "+ displayToDate + "<p></br>";
		var roster = "<p>"+ userMailDetails.rosterData +"<p></br>";
		var mailBody = greeting+dateText+roster;


		Email.send({
			SecureToken : "2d8e3bd5-12ab-416b-b190-868b8b997440",
			To : userMailDetails.email,
			From : "govindalohani@cqumail.com",
			Subject : mailSubject,
			Body : mailBody
		}).then(
		  //message => alert(message)
		);
	}

	//returns user details
	function getUserData(username){
		// create an object
		sendObject={username: username};

		userData = null;

		// send employee name to the server			
			  $.ajax({
                    url: serverAddress+'/getUserDetails',
                    type:'post',
					 data:{data:JSON.stringify(sendObject)},
					 async: false,
                     success: function(data)
                     {
                     	// create an oject
						recievedData=JSON.parse(data);
						console.log(recievedData);
						
						 userData=recievedData;
                     },

                     error: function(e)
                     {  
                        alert("Cannot get user data. Please try again");
                     }
					});
		return userData;
	}


	// function to view employer details
	function viewEmployerDetails(){
		// read employee name
		employer=JSON.parse(localStorage.getItem("employer"));
		// create an object
		sendObject={username: employer};
		// send employee name to the server			
			  $.ajax({
                    url: serverAddress+'/getUserDetails',
                    type:'post',
                     data:{data:JSON.stringify(sendObject)},
                     success: function(data)
                     {
                     	// create an oject
						 recievedData=JSON.parse(data);
						 console.log(recievedData);

                     	employerName=recievedData.username;
                     	phoneNumber=recievedData.phoneNumber;

                     	// change view
                     	document.getElementById("detailName").innerHTML=employerName;
                     	document.getElementById("detailNumber").innerHTML=phoneNumber;

                     },

                     error: function(e)
                     {  
                        alert("Cannot get user data. Please try again");
                     }
                    }); 
	}


	//to populate the select option of emopoyee
	function getEmployeeList(selectBoxID=""){
		sendObject={username: "employee"};
		// send employee name to the server			
			  $.ajax({
                    url: serverAddress+'/getEmployeeList',
                    type:'post',
                     data:{data:JSON.stringify(sendObject)},
                     success: function(data)
                     {
						//console.log(data);
						// create an oject
						recievedData=JSON.parse(data);
						console.log(data);
						
						$(recievedData).each(function( index, item) {
							console.log(item);
							employeeName=item.username;
							$("#"+selectBoxID).append('<option value="' + employeeName + '">' + employeeName + '</option>');
						});
                     },

                     error: function(e)
                     {  
                        alert("Cannot get user data. Please try again");
                     }
                    }); 
	}

	//function to post working hours details
	function postWorkingHours(){
		employee=document.getElementById("employee_Name").value;
		hoursWorked=document.getElementById("hoursWorked").value;
		fromDate=document.getElementById("from_Date").value;
		toDate=document.getElementById("to_Date").value;

		if(hoursWorked == "" || fromDate == "" || toDate == "" || employee == "") {
			alert("Fill all the fields!");
			console.log("fill all the fields");
			return false;
		}

		// create object
		sendObject={employeeName: employee, hoursWorked: hoursWorked, employerName: employer, fromDate:fromDate, toDate:toDate};

		// send roster to the server
		// send sign in details to the server			
			  $.ajax({
                    url: serverAddress+'/saveWorkedHours',
                    type:'post',
                     data:{data:JSON.stringify(sendObject)},
                     success: function(data)
                     {
						 alert("Working hours is stored on the server");
						 var emp_name = document.getElementById("employee_Name");
						 emp_name[0].selected = true;
						 document.getElementById("from_Date").value = "";
						 document.getElementById("to_Date").value = "";
						 document.getElementById("hoursWorked").value = "";
                     },

                     error: function(e)
                     {  
                        alert("Cannot save data. please try again!");
                     }
                    }); 


	}

	//function to send payslip email to employee 
	function sendPayslipToEmployee(){

		employee=document.getElementById("paySlipEmployeeName").value;

		if(employee == "null") {
			alert("Please select employee!");
			return false;
		}

		var userData= getUserData(employee);
		var userEmail = userData.email;
		console.log(userEmail);

		var returnedObject = getStartEndOfLastWeek(); //this function returns the dates of last week starting from Monday and ending Sunday

		var fromDate = returnedObject.weekStart.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		  });
		
		var toDate = returnedObject.weekEnd.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		  });

		console.log("lastMonday: "+lastMonday + " lastSunday: "+ lastSunday);

		// create an object
		sendObject={username: employee, fromDate:fromDate, toDate:toDate};
		// send employee name to the server			
			  $.ajax({
                    url: serverAddress+'/getRoster',
                    type:'post',
                     data:{data:JSON.stringify(sendObject)},
                     success: function(data)
                     {
                     	// create an oject
						 recievedData=JSON.parse(data);
						 console.log(recievedData);

						employerName=recievedData.employerName;
						workedHours=recievedData.workedHours;
						salary = workedHours * payRateOfEmployees;

						displayFromDate = new Date(fromDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'}); 
						displayToDate = new Date(toDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'});
						var payWorkedHours=(workedHours)?workedHours:"You have not worked in this period";
						var payRate =payRateOfEmployees;
						var paySalary=(salary)?"$"+salary:"";

						var mailObj = {employee: employee, fromDate:displayFromDate, toDate:displayToDate, payWorkedHours:payWorkedHours, payRate:payRate, paySalary:paySalary, email: userEmail};
						sendPayslipMail(mailObj);

                     },

                     error: function(e)
                     {  
                        alert("Cannot read roster data. Please try again");
                     }
                    }); 
	}

	//function to send an payslip email to employee
	function sendPayslipMail(userMailDetails) {

		var mailSubject = "PaySlip for " + userMailDetails.fromDate +" to "+ userMailDetails.toDate;
		
		var greeting = "<h2>Hi "+ userMailDetails.employee +",<h2></br>";
		var dateText = "<p>This is you PaySlip from " + userMailDetails.fromDate +" to "+ userMailDetails.toDate + "<p></br>";
		
		var paySlip = "<p>Total Hours Worked: "+ userMailDetails.payWorkedHours +"<p></br>"+
						"<p>PayRate: "+ userMailDetails.payRate +"<p></br>"+
						"<p>Direct Deposit: "+ userMailDetails.paySalary +"<p></br>";
		var mailBody = greeting+dateText+paySlip;

		Email.send({
			SecureToken : "2d8e3bd5-12ab-416b-b190-868b8b997440",
			To : userMailDetails.email,
			From : "govindalohani@cqumail.com",
			Subject : mailSubject,
			Body : mailBody
		}).then(
		  message => alert(message)
		);
	}

	//get last week from and to date
	function getStartEndOfLastWeek() {
		var beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
		var beforeOneWeek2 = new Date(beforeOneWeek);
		day = beforeOneWeek.getDay()
		diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
		lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
		lastSunday = new Date(beforeOneWeek2.setDate(diffToMonday + 6));

		returnObj = {weekStart : lastMonday, weekEnd: lastSunday};

		return returnObj;
	}

	
	//target viewEmployerDetails
	$("#viewEmployerDetails").click(function(){viewEmployerDetails();});

	// taget post roster
	$("#postRosterData").click(function(){postRoster();});

	//save working hours details
	$("#btnPostHours").click(function(){postWorkingHours();});

	//calling send payslip email on button click event
	$("#btnEmailPay").click(function(){sendPayslipToEmployee();});

	init();
	
		
});
