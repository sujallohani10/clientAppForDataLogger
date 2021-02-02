// Author: Govinda Lohani
/* this fuction is called when the page loads*/
$(document).ready(function(){

	// declare variables
	var employee;
	var employer
	var payRateOfEmployees = 25.57;

	//dynamic server url
	var serverAddress= "http://192.168.0.8:3000";
	
	//function to show employeeDetials
	function init(){
		employee=JSON.parse(localStorage.getItem("employee"));
		document.getElementById("employeeName").innerHTML="Employee Name: "+employee;

	}

	//function return the current week start and end date
	function getStartEndOfWeek() {
		var startDay = 1; //0=sunday, 1=monday etc.
		var currDate = new Date();
		console.log("currDate: "+currDate);
		var d = currDate.getDay(); //get the current day
		var weekStart = new Date(currDate.valueOf() - (d<=0 ? 7-startDay:d-startDay)*86400000); //rewind to start day
		var weekEnd = new Date(weekStart.valueOf() + 6*86400000); //add 6 days to get last day

		returnObj = {weekStart : weekStart, weekEnd: weekEnd};

		return returnObj;
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

	// function to view employee details
	function viewEmployeeDetails(){
		// read employee name
		employee=JSON.parse(localStorage.getItem("employee"));

		var returnedObject = getStartEndOfWeek();

		var fromDate = returnedObject.weekStart.toLocaleDateString("en-US");
		var toDate = returnedObject.weekEnd.toLocaleDateString("en-US");

		console.log("weekStart: "+fromDate + " weekEnd: "+ toDate);



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

                     	employerName=recievedData.employerName;
                     	rosterData=recievedData.rosterData;

						displayFromDate = new Date(fromDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'}); 
						displayToDate = new Date(toDate).toLocaleString('en-us',{month:'long', year:'numeric', day:'numeric'});
                     	// change view
						document.getElementById("employerName").innerHTML=employerName;
						document.getElementById("date").innerHTML="Starts from "+displayFromDate+ " to "+displayToDate;
                     	document.getElementById("rosterContent").innerHTML=rosterData;

                     },

                     error: function(e)
                     {  
                        alert("Cannot read roster data. Please try again");
                     }
                    }); 
	}


	//function to view payslip details 
	function viewPaySlipDetails(){
		// read employee name
		employee=JSON.parse(localStorage.getItem("employee"));

		var returnedObject = getStartEndOfLastWeek();

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

                     	// change view
						 document.getElementById("payFromDate").innerHTML=displayFromDate;
						 document.getElementById("payToDate").innerHTML=displayToDate;
						 document.getElementById("payWorkedHours").innerHTML=(workedHours)?workedHours:"You have not worked in this period";
						 document.getElementById("payRate").innerHTML=payRateOfEmployees;
						 document.getElementById("paySalary").innerHTML=(salary)?"$"+salary:"";

                     },

                     error: function(e)
                     {  
                        alert("Cannot read roster data. Please try again");
                     }
                    }); 
	}

	//returns user details
	function getUserData(){
		employee=JSON.parse(localStorage.getItem("employee"));

		// create an object
		sendObject={username: employee};

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
						
						document.getElementById("emp_name").innerHTML=recievedData.username;
						document.getElementById("emp_email").innerHTML=recievedData.email;
						document.getElementById("emp_num").innerHTML=recievedData.phoneNumber;
                     },

                     error: function(e)
                     {  
                        alert("Cannot get user data. Please try again");
                     }
					});
	}

	
	// taget profile details button
	$("#viewProfileDetails").click(function(){getUserData();});

	// taget roster details
	$("#viewEmployeeDetails").click(function(){viewEmployeeDetails();});

	// taget pay slip
	$("#viewEmployeePaySlip").click(function(){viewPaySlipDetails();});

	init();
	
		
});
