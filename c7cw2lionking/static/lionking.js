let dateOfFirst = window.location.pathname.split("/")[2];
console.log(" date of first ",dateOfFirst)
//let monthName = new Date(dateOfFirst).toLocaleDateString('en',{month:'long'});
let months = ["Jan","Feb","Mar","Apr","May","Jun","jul","Aug","Sep","Oct","Nov","Dec"];
let monthName = months[new Date(dateOfFirst).getMonth()];
let monthHTML = `
<table id="table">
 <caption>${monthName}</caption>
 <tr>
 <th>Mon</th>
 <th>Tue</th>
 <th>Wed</th>
 <th>Thu</th>
 <th>Fri</th>
 <th>Sat</th>
 <th>Sun</th>
 </tr>
</table>
`;
//start for calendar
document.getElementById('calendar').innerHTML = monthHTML;
function createDate(dt){
    let table = document.getElementById("table");
    var cdate = new Date(dt);
    var dategen = cdate.getDate()-cdate.getDay()+1;
    var sdate= new Date(cdate.setDate(dategen))
    var r =[];
    for (let i=0; i<6; i++)
    {
        row = document.createElement('tr');
        let week= [];
        for (let j=0; j<7; j++)
        {
            let b = new Date(sdate);
            b.setDate(sdate.getDate()+j+(i*7));
            let dateISO = b.toISOString();
            console.log("date iSO"+dateISO);
            let tdd = dateISO.split("T")[0];
            console.log("dateid"+tdd);
            td = document.createElement('td');
            td.innerHTML = new Date(tdd).getDate();
            console.log(td.innerHTML);
            td.setAttribute("id","d"+tdd);
            row.append(td);
            week.push(dateISO);
        }
        r.push(week);
        console.log(r)
        table.append(row);
    }
let todaysDate = new Date();
for(let td of document.querySelectorAll('td')){
    let dateOfBox = new Date(td.id.substring(1));
    let dayAfter = new Date(dateOfBox.getTime()+1000*60*60*24);
    let isPastClass = '';
    if (dayAfter<=todaysDate){
        isPastClass = 'past'
    };

    let daynum = td.innerText;
    td.innerHTML = `<div class='box ${isPastClass}'><div class=daynum>${daynum}</div><div id=availabilty></div></div>`;
}


fetch('https://tw.igs.farm/lionking/all.json')
  .then(r=>r.json())
  .then(r=>{
      let performances = r.data.getShow.show.performances;

      for(let p of performances){
          let pd = p.dates.performanceDate;
          let cellId = "d"+pd.split("T")[0];
          let cell = document.getElementById(cellId);
          if (cell !== null){
              let performanceDiv = document.createElement('div');
              performanceDiv.classList.add(p.performanceTimeDescription);
              let line1 = document.createElement('div');
              line1.innerHTML = `<div class='dot ${p.availabilityStatus}'></div> ${pd.substr(11,5)}`;
              let line2 = document.createElement('div');
              line2.classList.add('price');
              line2.innerHTML = `from £${p.price.minPrice}`;
              performanceDiv.append(line1,line2);
              performanceDiv.onclick = ()=>{
                  if (cell.firstElementChild.classList.contains('past')){
                      alert('not available');
                      return;
                  }
                  document.getElementById('calendar').classList.add('hide');
                  console.log("I should be getting data for: ",p.id);
                  let subtolal=0;
                  fetch('https://tw.igs.farm/lionking/692A2B01-A607-4616-9409-9696D905340D')
                    .then(r=>r.json())
                    .then(r=>{
                        for(let s of r.seats){
                            let d = document.createElement('div');
                            d.classList.add('seat');
                            d.classList.add('Z'+s.zone);
                            d.style.left = (s.x /2 + 500) + 'px';
                            d.style.top = (s.y /2 + 200)  + 'px';
                            if (s.available){
                                d.classList.add('available');
                            }
                            document.getElementById('seats').append(d);
                            let c=document.createElement('div');
                            
                            d.onclick=()=>{
                                let a=document.createElement('div');
                                if(s.available){
                                    alert("seat is available");
                                    let zoneid=s.zone;
                                    console.log(r.zones[s.zone]);
                                    
                                    let deftk=r.zones[zoneid].defaultTicket;
                                    console.log("Default tickets id "+deftk);
                                    
                                    console.log("Total fail " +r.zones[s.zone].tickets.total);
                                    console.log("Total "+r.zones[s.zone].tickets[deftk].total);
                                    let price=r.zones[zoneid].tickets[deftk].total;
                                    console.log("Total gen "+price);
                                    
                                    subtolal=parseInt(subtolal)+parseInt(price);
                                    console.log("this is sub total"+subtolal);
                                    c.innerHTML=`price is:  ${price}`;
                                    document.getElementById('afc').append(c);
                                    document.getElementById('afc1').innerHTML=`total price: ${subtolal}`
                                    
                                }
                                else{
                                    alert("seat is not available")
                                }
                            }
                            
                        document.getElementById('seats').append(c);
                        };
                    })
              }
              cell.querySelector('.box').append(performanceDiv);
          }
      }
  })
}
createDate(dateOfFirst)


