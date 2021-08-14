let TC = document.querySelector(".ticket-container");//we are fetching  ticket conatiner as we have to change the color of it when someone clicks on the col of ticket from given 4

let allfilters=document.querySelectorAll(".filter");//we have 4 filter so we have to fetch them too.
let modalvisible = false;

let allTasks = localStorage.getItem("allTasks");
if(allTasks != null){
    allTasks = JSON.parse(allTasks);
    for(let i=0;i<allTasks.length;i++){
        let ticket = document.createElement("div");//NODE
        ticket.classList.add("ticket");
        ticket.innerHTML= `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
                            <div class="ticket-id">#${allTasks[i].ticketId}</div>
                            <div class="task">${allTasks[i].task}</div>`;
        TC.appendChild(ticket);
        ticket.addEventListener("click",function(e){
            if(e.currentTarget.classList.contains("active")){
                e.currentTarget.classList.remove("active");
            }
            else{
                e.currentTarget.classList.add("active");
            }
        });
    }
}
for(let i=0; i <allfilters.length;i++){
    allfilters[i].addEventListener("click",filterhandler);
}
//we will click on the desired filter and then children of filter = span.classlist gives all the classes implemented on span in an array from the [0] index gives first class then we split it from "-" pink-color-btn this gives = pink. now we have extracted the color of that ticket which is now clicked by the user now we have to implement it on the ticket-container.
//let filtercolor = (e.currentTarget.children[0].classList[0].split("-")[0]);
//TC.style.backgroundColor = filtercolor;
function filterhandler(e){
    let span = e.currentTarget.children[0];
    let spancss = getComputedStyle(span);//got aall the css of the span
    TC.style.backgroundColor = spancss.backgroundColor;//fetch the backgroundcolor
}

let selectedpriority;

let deletebtn = document.querySelector(".delete");
deletebtn.addEventListener("click" ,function(e){
    let selectedtickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));//array of allTasks
    for(let i=0 ; i<selectedtickets.length ; i++){
        selectedtickets[i].remove();
        let ticketid = selectedtickets[i].querySelector(".ticket-id").innerText;//getting the object's ticketid
        allTasks = allTasks.filter(function(data){//filter uses data 
            return (("#" + data.ticketId) != ticketid);//if true filter vo data rakhlega agar false to out
        });
    }
    localStorage.setItem("allTasks" , JSON.stringify(allTasks));//again ouch the updated object.
});

let addbtn = document.querySelector(".add");
addbtn.addEventListener("click",showmodal);



function showmodal(e){//function show themodal HTML when someone clicks on the "+" btn then this modal box opens when we add it HTML in the showmodal function.
    if(!modalvisible){
        let modal = document.createElement("div");//NODE 
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" data-typed="false" contenteditable="true">ENTER YOUR TASK HERE</div>
                            <div class="modal-priority-list">
                            <div class="modal-pink-filter modal-filter active"></div>
                            <div class="modal-blue-filter modal-filter"></div>
                            <div class="modal-green-filter modal-filter"></div>
                            <div class="modal-yellow-filter modal-filter"></div>
                        </div>`;
        TC.appendChild(modal);
        selectedpriority="pink";//default'
        let taskmodal = document.querySelector(".task-to-be-added");
            taskmodal.addEventListener("click" , function(e){
            if(e.currentTarget.getAttribute("data-typed") == "false"){
                e.currentTarget.innerHTML="";
                e.currentTarget.setAttribute("data-typed" , "true");
            }
        })
        modalvisible = true;
        taskmodal.addEventListener("keypress" , addticket.bind(this,taskmodal));
        let modalfilter = document.querySelectorAll(".modal-filter");
        for(let i=0 ; i<modalfilter.length ; i++){
            modalfilter[i].addEventListener("click" , selectpriority.bind(this,taskmodal));
        }

    }
    //STRING
    // let modal= ` <div class="modal">       
    //      <div class="task-to-be-added" data-typed="false" contenteditable="true">ENTER YOUR TASK HERE</div><!--1-->
    //      <div class="modal-priority-list"><!--2-->
    //          <div class="modal-pink-filter modal-filter active"></div>
    //          <div class="modal-blue-filter modal-filter"></div>
    //          <div class="modal-green-filter modal-filter"></div>
    //          <div class="modal-yellow-filter modal-filter"></div>
    //      </div>
    //  </div>`  
    //     TC.innerHTML = TC.innerHTML + modal;//to save the other content in the container as we add the modal as showmodal
     
}

function selectpriority(taskmodal , e){
    let activefilter = document.querySelector(".modal-filter.active");
    activefilter.classList.remove("active");
    selectedpriority = e.currentTarget.classList[0].split("-")[1];//modal-pink-filter =>pink
    e.currentTarget.classList.add("active");
    taskmodal.click();
    taskmodal.focus();
}

function addticket(taskmodal,e){
    if(e.key == "Enter" && e.shiftKey == false && taskmodal.innerText.trim() != ""){//trim removes all the spaces from the left as well ass the rright of the string
        let task = taskmodal.innerText;
        let id = uid();
        let ticket = document.createElement("div");//NODE
        ticket.classList.add("ticket");
        ticket.innerHTML= `<div class="ticket-color ticket-color-${selectedpriority}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="task">${task}</div>`;

        // STRING
        // let ticket = `<div class="ticket"> 
        //                 <div class="ticket-color ticket-color-${selectedpriority}"></div>
        //                 <div class="ticket-id">#kjdh</div>
        //                 <div class="task">${task}</div>
        //               </div> `
        document.querySelector(".modal").remove();
        modalvisible=false;
       // TC.innerHTML = TC.innerHTML + ticket;
        TC.appendChild(ticket);
        ticket.addEventListener("click",function(e){
            if(e.currentTarget.classList.contains("active")){
                e.currentTarget.classList.remove("active");
            }
            else{
                e.currentTarget.classList.add("active");
            }
        });
        //LOCAL STORAGE
        // allTasks is the item we have to check in local storage.
        let allTasks = localStorage.getItem("allTasks");//cheecking that we r adding the first ticket or there is something else present in the localstorage
        
        if(allTasks == null){//if its null
            let data = [{"ticketId" : id , "task" : task , "priority" : selectedpriority}];//make an object
            localStorage.setItem("allTasks" ,JSON.stringify(data));//set as key,value (value sholud be STRING)
        }
        else{
            let data = JSON.parse(allTasks);//making it as an object
            data.push({"ticketId" : id , "task" : task , "priority" : selectedpriority});//piuch that obj in the prev obj data
            localStorage.setItem("allTasks" ,JSON.stringify(data));//set in ls.
        }


    }
    else if(e.key == "Enter" && e.shiftKey == false){
        e.preventDefault();
        alert("ERROR! You entered a empty task");
    }

}

