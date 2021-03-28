/*
Object literal to store Chem FRM user names
  ~key: will be e.g. "Jake Francis"
  ~value: will be "francis_jacob"
Object literal to store EIS messages.
  ~this will contain Event Names 
  ~Also a default messages
Object to store active EIS Alarms
  ~will store active event names
  ~Hour and minutes when the alarm goes off
  ~A boolean to check if the alarm has been set
Module to populate the EIS Alarm object/Message Object
  ~which event and message
    ~pulls from EIS messages object
  ~takes intitial alarm time in hours and minutes
  ~If it repeats?
    ~if so how many times perday? or how many hours
    ~create additional instances with the EIS Active Alarm Module
  ~ability to delete alarms
  ~ability to create custom alarms
Module to check if a current time is Equal to any Active EIS Alarms
  ~updates a time variable to determine the current time every second 
  ~cycles through each key : value pair of the EIS alarms and verifies the Hours and Minutes
    ~will populate the form with:
      ~Key: Event Name as SUBJ
      ~Value: Default message as MSG
      ~FRM will be determined from an object Literal
      ~When it activates it needs to prevent it from sending 60 messages in one minutes
*/

window.onbeforeunload = function (e) {
  e = e || window.event;

  
  if (e) {
      e.returnValue = 'Closing the window will cause all active alarms to be deleted!\r\n are you really sure you want to do this?';
  }

  // For Safari
  return 'Any string';
};


//creates one currentTime object//
let currentTime = new Date();

//directory of user names//
const USERS = {
  "Jake Francis": "francis_jacob",
}

let recipientsArr = []
//directory of messages tied to a specific event//
const MESSAGES = {
    'Custom'   : ``,
    'Event 27' : `Event27 is coming due`,
    'Event 28' : `Event28 is coming due`,
    'Event 29' : `Event29 is coming due`,    
}

//storage for the Active Alarms//
let activeAlarms = [];
//holds index location of alarms that need to be deleted. 
let deletionArray=[];


//Alarm connstructor function//
let Alarm = function(event,message, hours, minutes,repeat,howOften,...recipients){
  this.recipients = recipients;
  this.sent = false
  this.event = event
  this.message = message
  this.hours = hours
  this.minutes = minutes
  this.repeat = repeat
  this.howOften = howOften
  this.id = event + hours + minutes
  this.seconds = 0
  this.timeRemaining = ''
  let frm = 'EIS-Paging System'  
   this.sendEventNotice = function(){
    document.MYFORM.MSG.value = this.message;
    document.MYFORM.SUBJECT.value = this.recipients;
    document.MYFORM.FRM.value = frm;
    document.MYFORM.submit();
  }
}

//will create or delete alarms in the activeAlarms database//
const alarmHandler = (() => {
  const createActiveAlarm = (event,message,hours,minutes,repeat,howOften,sent,...recipients) =>{
    let alarm = new Alarm(event,message,hours,minutes,repeat,howOften,sent,...recipients)
     activeAlarms.push(alarm)
  }
   const deleteActiveAlarm = (uniqueID) => {
      let index = deletionArray.indexOf(uniqueID);          
          deletionArray.splice(index,1)
          activeAlarms.splice(index,1)
   }
  return {
    createActiveAlarm,
    deleteActiveAlarm
  }

})();



//process that runs continuous checking every second to see if an alarm has gone off//

//this whole bit is ugly reconfigure to more maintainable code//


const checkAlarms = setInterval(function(){ 
   getTime();
  updateAlarmTime(activeAlarms)
  }, 1000) 




function disableField(){
  if(document.getElementById('repeat').checked == true){
   document.getElementById('howOften').disabled = false
  }
  else{
    document.getElementById('howOften').disabled = true
  }
}

disableField()

let header = document.getElementById('header')
let userContainer = document.getElementById('userContainer')

function userList(){
let users = document.getElementById('users')
  for(key in USERS)
  {
   let names = document.createElement('option')
   names.value = USERS[key];
   names.textContent = key;
   users.appendChild(names);
  }

};

//userList();

function createList(id,obj){
  let list = document.getElementById(id)
  for (key in obj){
    let names = document.createElement('option')
    names.value = obj[key];
    names.textContent = key;
    list.appendChild(names)
  }
}

function populateMessageArea() {
  let events = document.getElementById('event')
  let eventMessage = events.options[events.selectedIndex].text;
  let messages = document.getElementById('messages') 
  messages.value = null;
  messages.textContent = null;
  messages.value = MESSAGES[eventMessage]
  messages.textContent = MESSAGES[eventMessage]
}



createList('users',USERS)
createList('event', MESSAGES)
populateMessageArea();

let alarmContainer = document.getElementById('alarmContainer');

let alarmParameters = {
  addRecipient: function(){
      recipientsArr.push(document.getElementById('users').value)
      document.getElementById('recipients').textContent = 
        recipientsArr.join(', ')
  },
  removeRecipient: function(){
    recipientsArr.pop()
    document.getElementById('recipients').textContent = recipientsArr.join(', ')
  },
  addAlarm: function(){    
    let events = document.getElementById('event');
    let eventMessage = events.options[events.selectedIndex].text;
    let message = document.getElementById('messages')
    let time = document.getElementById('time').value.split('')
    let hours= (function(){
    let hours = null
        if (time[0] == "0"){
          hours = time[1]
          return Number(hours)
        }
        else {
          hours = time[0] + time[1]
          return Number(hours)
        }
    })();
  let minutes = (function(){
      let minutes = null
     if (time[3] == "0"){
          minutes = time[4]
          return Number(minutes)
        }
        else {
          minutes = time[3] + time[4]
          return Number(minutes)
        }
        
  })();          
  let repeat = document.getElementById('repeat').checked;
  let howOften = document.getElementById('howOften').value;
  if(recipientsArr.length === 0) {
    window.alert('Add at least one recipient')
    return
  }
  let recipients = recipientsArr.join(',');  
  alarmHandler.createActiveAlarm(eventMessage,message.value, hours,minutes,repeat,howOften,recipients);            
  alarmElements.refreshActiveAlarms();
  alarmElements.drawActiveAlarms(activeAlarms);
  }
  
}



let alarmElements = {

  
refreshActiveAlarms: function(){
      
      let child = alarmContainer.lastElementChild
      while(child != null){
        alarmContainer.removeChild(child)
        child = alarmContainer.lastElementChild
      }
      deletionArray = []
    
        
},
  
  
drawActiveAlarms: function(arr){
      let leng = arr.length
      for (let i = 0; i < leng; i++){
        let container = document.createElement('div')
          container.setAttribute('class', 'activeAlarm centered')
         alarmContainer.appendChild(container)
        
       for (key in arr[i]){
          let hours = 0;
          let minutes = 0;
          let heading = document.createElement('h3');
          let element = document.createElement('p');
          let button = document.createElement('button');
          let message = document.createElement('p');
          let recipients = document.createElement('p');
          switch (key) {
              case 'event':                
                heading.textContent = `${arr[i][key]} at ${arr[i].hours}:${arr[i].minutes}`;
                heading.setAttribute('id', 'EventTitle')
                heading.setAttribute('class', 'alarmName')
                container.appendChild(heading);
                break;
            case 'hours':
                hours = arr[i][key];
                break;
            case 'minutes':
                minutes = arr[i][key];
                break;
            case 'id':
                let id = `deleteindex`+ i
                deletionArray.push(id)
                button.addEventListener('click', function(){
                if(window.confirm('Do you really want to delete this alarm?')) {
                alarmHandler.deleteActiveAlarm(id);
                alarmElements.refreshActiveAlarms();
                alarmElements.drawActiveAlarms(activeAlarms);
                }
            })
            button.textContent = "X"
            button.setAttribute('id', id)
            button.setAttribute('class', 'exitButton') 
            container.appendChild(button)
           
                break;
                
            case 'timeRemaining':
                let time = arr[i][key][0];
                element.textContent = arr[i][key];
                element.setAttribute('class', 'remainingTime')
                element.setAttribute('id', 'remaining'+i)
                container.appendChild(element);
                break;
              
            case 'message':
                message.textContent = arr[i][key];
                message.setAttribute('class', 'message');
                container.appendChild(message);
              
              
                break;
              
            case 'recipients':
                recipients.textContent = arr[i][key];
                recipients.setAttribute('class', 'recipients');
                container.appendChild(recipients);
              
              
                break;
              
          }
        
        
          if(key == 'id'){
            
          }
        }
      }
}

}

function updateAlarmTime(arr){
  for(let i = 0; i < arr.length; i++){
    let timeElement = document.getElementById('remaining' + i)
    timeElement.textContent = arr[i].timeRemaining
  }
}


function getTime(){
   currentTime = new Date();
  let currentHours = currentTime.getHours();
  let currentMinutes = currentTime.getMinutes();
  let currentSeconds = currentTime.getSeconds();

    for(let alarm of activeAlarms){     
       if(alarm.hours == currentHours && alarm.minutes == currentMinutes && alarm.sent == false){
          console.log(alarm.id + " is going off")
          alarm.sendEventNotice()
          alarm.sent = true;
          if(alarm.repeat){
            alarm.hours = alarm.hours + Number(alarm.howOften)

            if(alarm.hours >= 24){
              alarm.hours = alarm.hours - 24;
      
              }
          }
        }
        else if(alarm.minutes != currentMinutes && alarm.sent == true){
          alarm.sent = false;
        }
           
      let hoursRemaining = alarm.hours  - currentHours
      let minutesRemaining = alarm.minutes -1 - currentMinutes
      let secondsRemaining = alarm.seconds - currentSeconds      
      
      if(alarm.minutes <= currentMinutes){
        hoursRemaining -= 1
      }      
      
      if((alarm.hours - currentHours) === 0 && alarm.minutes <= currentMinutes){
        hoursRemaining = 23
      }
      if(hoursRemaining < 0){
        hoursRemaining += 24
      }
      if(hoursRemaining < 10){
        hoursRemaining = `0${hoursRemaining}`
      }
      if(minutesRemaining < 0){
        minutesRemaining += 60
      }
      if(minutesRemaining < 10){
        minutesRemaining = `0${minutesRemaining}`
      }
      if(secondsRemaining < 0){
        secondsRemaining += 60
      }
      if(secondsRemaining < 10){
        secondsRemaining = `0${secondsRemaining}`
      }          
      alarm.timeRemaining = `Time Remaining:${hoursRemaining}:${minutesRemaining}:${secondsRemaining}`
  }
}

getTime();
alarmElements.drawActiveAlarms(activeAlarms);

