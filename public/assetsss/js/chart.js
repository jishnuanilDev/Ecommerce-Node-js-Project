function showDateChart(){


    let orderData = [];

    let myChart;
    let mostRecentDate;



    function updateChart(selectedDate) {
 

   const filteredData = orderData.filter(item => {
    console.log('item.date:', item, typeof item);
    console.log('seleDate:', selectedDate, typeof selectedDate);
    const itemDate = new Date(item._id).toISOString().split('T')[0];
    console.log('Formatted itemDate:', itemDate);

    return itemDate === selectedDate;
});
let sum = 0;
       
        console.log('filterd data:',filteredData)
        const labels = filteredData.map(item => item._id);
     
        const data = filteredData.reduce((sum, item) => sum + item.count, 0);

console.log('data:',data)
          console.log('labels:',labels);
   

        const ctx = document.getElementById('orderChart')

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Orders',
                    data: [data],
                    backgroundColor: 'rgb(78, 115, 223)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                }],
            },
            options: {
                scales: {
                    x: {
                      
                    },
                    y: [{
                        suggestedMin: 3,
                    }],
                },
                plugins: {
                 
                },
            },
        });
    }

    const datePicker = document.getElementById('datePicker');
    datePicker.addEventListener('change', async (event) => {
        const selectedDate = event.target.value;

        try {
            const response = await fetch(`/admin/userorders/graph?date=${selectedDate}`);
            const newData = await response.json();
            console.log('new data:',newData)
            orderData = newData;

        
    
            updateChart(selectedDate);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

 
    fetch(`/admin/userorders/most-recent-date`)
        .then(response => response.json())
        .then(mostRecentDate => {
          
            datePicker.value = mostRecentDate; 
            return fetch(`/admin/userorders/graph?date=${mostRecentDate}`);
        })
        .then(response => response.json())
        .then(initialData => {
   
           
            orderData = initialData;
            updateChart(datePicker.value);
        })
        .catch(error => {
            console.error('Error fetching most recent date:', error);
        });

    }


document.addEventListener('DOMContentLoaded',()=>{
    showYearlyChart();

});

    async function showYearlyChart() {
        let orderData = [];
        let myChart;
      
      
    
        try {
            const response = await fetch(`/admin/userorders/graphyear`);
            const newData = await response.json();
           
            orderData = newData;
         
            


        
    
         
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
      

   

        const chart = document.getElementById('orderChart').getContext('2d');

       
        const labels = Object.keys(orderData);
        const data = Object.values(orderData);



      
        if (myChart) {
          myChart.destroy();
        }
      
        myChart = new Chart(chart, {
          type: 'bar',
          data: {
            labels: labels ,
            datasets: [{
              label: 'Number of Orders',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              
            }],
          },
          options: {
            scales: {
              xAxis: [{
                type: 'time',
                time: {
                  unit: 'day',
                },
                ticks: { 
                  source: 'labels', 
                },
              }],
              yAxis: [{
                beginAtZero: true,
              }],
            },
            plugins: {
                tooltip: {
                    enabled: false,
                  },
            },
          },
        });
      }
      



       function showMonthlyChart() {
        let orderData = [];
        let myChart;

      
      
        var monthYear = document.getElementById('monthYear');
      monthYear.addEventListener('change', async (event)=>{
        const selectedYear = event.target.value;

        console.log('year for month :',selectedYear)

        try {
            const response = await fetch(`/admin/userorders/graphmonth?year=${selectedYear}`);
            const newData = await response.json();
           console.log('newddata:',newData);
            orderData = newData;
         
            

            createChart ();
        
    
         
        } catch (error) {
            console.error('Error fetching data:', error);
        } 
      })
      
    
       function createChart (){

  
      console.log('orderdddata:',orderData);
        const chart = document.getElementById('orderChart').getContext('2d');

       
        const labels = Object.keys(orderData);
        const data = Object.values(orderData);


        console.log('labels:',labels);
        console.log('data:',data);
      
        if (myChart) {
          myChart.destroy();
        }
      
        myChart = new Chart(chart, {
          type: 'bar',
          data: {
            labels: labels ,
            datasets: [{
              label: 'Number of Orders',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
               
            }],
          },
          options: {
            scales: {
              xAxis: [{
                type: 'time',
                time: {
                  unit: 'day',
                },
                ticks: { 
                  source: 'labels', 
                },
              }],
              yAxis: [{
                beginAtZero: true,
              }],
            },
            plugins: {  
                tooltip: {
                    enabled: false,
                  },
            },
          },
        });
      }

    }


