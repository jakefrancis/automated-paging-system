# automated-paging-system

## Background
This is an automated paging system I created for my chemistry departments use.

Wifi is non existent in many parts of my plant and the main way to contact someone in the field is an old school pager.
Many areas of the plant are radio sensitive so carrying a cell-phone is prohibitied.
During a significant upgrade to our effulent radiation monitoring system, our department was required to grab five or six additional samples manually every 12 hour shift.

These samples were on a repeating time (i.e. every 6, 10, 12 hours)
The samples are legally required to be obtained, in order to measure any radiation we are releasing to the general public. 
This lead to a situation where it was easy to forget to obtain these additional samples. 

This was especially true if working an overnight shift.

I created this system to help prevent myself and fellow chemistry staff from missing these required samples.

## Overview

The site is not mobile friendly because it is intended only to be used on a desktop computer.

I analyzed a separate plant paging website was with chrome development tools to reverse engineer the form data needed to send messages to pagers

This version of the code prints to the developer console when an alarm is going off. 

The system works by leaving the web app running in the browser. Most computer's I use never go to sleep so it will send a page at the designated time.

There is no FORM action endpoint in the version of the code because the system only works on the plants local network. 

[Live Version](https://jake-aps.netlify.app/)





