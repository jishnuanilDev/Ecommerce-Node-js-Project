
// Function to show the coupon modal
function showCoupons(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  const modal = document.getElementById('couponModal');
  modal.style.display = 'block';
}


// Function to close the coupon modal
function closeModal() {
  const modal = document.getElementById('couponModal');
  modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function (event) {
  const modal = document.getElementById('couponModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};




 
function continueToCheckout() {
  event.preventDefault();

  var cashOnDeliverySelected = document.getElementById('f-option6').checked;
  var OnlineSelected = document.getElementById('f-option5').checked;
  var paymentMethod;

  if (cashOnDeliverySelected) {
    paymentMethod = 'cashOnDelivery';
  } else if (OnlineSelected) {
    paymentMethod = 'onlinePayment';
  } else {
    alert("Please select your payment method.");
    return;
  }

  var selectedAddressIndex = document.querySelector('input[name="selectedAddress"]:checked');

  if (selectedAddressIndex) {
    document.getElementById('selectedAddressIndex').value = selectedAddressIndex.value;
    document.forms[document.forms.length - 1].submit();
  } else {
    alert("Please select an address before continuing to checkout.");
  }

  // fetch('/confirmCheckoutCOD', {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     paymentMethod: paymentMethod,
  //   }),
  // })
  // .then(response => {
  //   console.log('stage 1 checked ok')
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   } console.log('stage ok perfect')
  // })
  // .then(data => {
  //   const orderId = data.orderId;
  //   const orderAmount = data.orderAmount;

  //   console.log("Orderrrrrrrrrrr ID:", orderId);
  //   console.log("Orderrrrrrrrr Amount:", orderAmount);
  // })
  // .catch(error => {
  //   console.error('Fetch error:', error);
  // });
    
    
          function initiateRazorpayPayment(orderId) {
            const options = {
              key: "rzp_test_lyhW5HCWaB5v8H",
              amount: orderAmount,
              currency: "INR",
              name: "Biblio boutique",
              description: "Payment for Order",
              order_id: orderId,
              handler: function (response) {
                console.log("Payment response:", response);
    
                if (response.razorpay_payment_id) {
    
                  console.log("Payment successful:", response);
                
                  handleRazorpaySuccess();
                  
               
                } else {
                  console.log("Payment failed:", response);
                }
              },
    
              prefill: {
                name: "<%= user.firstname %>",
                email: "<%= user.email %>",
                contact: "<%= user.phone %>",
              },
              theme: {
                color: "#F37254",
              },
            };
    
            const rzp = new Razorpay(options);
            rzp.open();
          }
    
          initiateRazorpayPayment(orderId);
    
          const handleRazorpaySuccess = () => {
    
     
    
            console.log("Before defining orderDetails");
    
    const orderDetails = {
      items:orderItems,
      totalAmount: orderAmount,
    };
    
    console.log("After defining orderDetails");
    
    
    
    fetch("/orderConfirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
       orderDetails: orderDetails
      }),
    })
      .then((response) => {
        console.log("Fetch successful. Received response:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Data received:", data);
      
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
      });
    
    console.log("After fetch");
    
    window.location.href = '/orderPlaced';
    
    };
      
  } 




 

    // Get the link and the form container
    var couponLink = document.getElementById("couponLink");
    var couponForm = document.getElementById("couponForm");
  
    // Add an event listener for the link click
    couponLink.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
  
      // Toggle the visibility of the form container
      couponForm.style.display = couponForm.style.display === "none" ? "block" : "none";
    });



    // Get the payment info element
    var paymentInfo = document.getElementById("payment-info");
  
    // Add an event listener for radio button changes
    document.querySelectorAll('input[name="payment-method"]').forEach(function(radio) {
      radio.addEventListener("change", function() {
        // Update the payment info based on the selected payment method
        if (radio.id === "razorPay") {
          paymentInfo.textContent = "";
        } else if (radio.id === "credit-debit") {
          paymentInfo.textContent = "";
        }
        // Add more conditions for additional payment methods as needed
      });
    });

  



    function validateForm() {
        // Check if the terms and conditions checkbox is checked
        var termsCheckbox = document.getElementById('f-option8');
        if (!termsCheckbox.checked) {
            alert('Please accept the terms and conditions.');
            return false; // Prevent form submission
        }

        // Additional validation logic can be added here if needed   

        return true; // Allow form submission
    }


    async function makeWalletPay() {
      event.preventDefault();
    

    
      var selectedAddressIndex = document.querySelector('input[name="selectedAddress"]:checked');
    
      if (selectedAddressIndex) {
        console.log('walletAddress:',selectedAddressIndex)
        document.getElementById('selectedAddressIndex').value = selectedAddressIndex.value;
        document.forms[document.forms.length - 1].submit();
        try{
           selectedAddressIndex =  document.getElementById('selectedAddressIndex').value
          const response = await fetch(`/walletCheckout?AdressIndex=${selectedAddressIndex}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
         
            }),
          })
        
          const data = await response.json();
          window.location.href = '/orderPlaced';
        }catch(err){
          console.error('address data and wallet fetch not working')
        }
        window.location.href = '/orderPlaced';

      } else {
        alert("Please select an address before continuing to checkout.");
      }
           




    }
          
      



    