async function invoiceData(orderId) {
    console.log('orderiiidiifdddd:', orderId);
    let invoiceData;
    try {
        const response = await fetch(`/user/userinvoice?orderId=${orderId}`);
        const orderData = await response.json();
        console.log('INvoiceData:', orderData);

        invoiceData = orderData;

      
        createInvoice()
    } catch (err) {
        console.error('Error fetching data from orders:', err);
        throw err;
    }
    console.log('!!!!inovicedattta:',invoiceData);



 function createInvoice(){
    console.log('33333inovicedattta:',invoiceData.totalAmount);
    try{

        let count =1;


   
 
  
      
    var data = {


      
        // If not using the free version, set your API key
        // "apiKey": "123abc", // Get apiKey through: https://app.budgetinvoice.com/register
        
        // Customize enables you to provide your own templates
        // Please review the documentation for instructions and examples
        "customize": {
            //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
        },
        "images": {
            // The logo on top of your invoice
            "logo": "https://public.budgetinvoice.com/img/logo_en_original.png",
            // The invoice background
            "background": "https://i.pinimg.com/originals/62/63/5b/62635bfd6f5c20e3666f27e015191bde.jpg"
        },
        // Your own data
        "sender": {
            "company": "Biblio Boutiquq",
            "address": "Cyberpark, Calicut, kerala, India",
            "zip": "1234 AB",
            "city": "Calicut",
            "state": "Kerala",
            "country": "India",
            "contact ": "8078341847,jishnuanil255@gamil.com"
            //"custom1": "custom value 1",
            //"custom2": "custom value 2",
            //"custom3": "custom value 3"
        },
        // Your recipient
        "client": {
            "company": invoiceData.userDetails.firstname,
            "address": invoiceData.userAddress[0].streetaddress,
            "zip": invoiceData.userAddress[0].zipcode,
            "city": invoiceData.userAddress[0].city,
            "country":"India"
            // "custom1": "custom value 1",
            // "custom2": "custom value 2",
            // "custom3": "custom value 3"
        },
        "information": {
            // Invoice number
            "number": orderId,
            // Invoice data
            "date": invoiceData.orderDate
            // Invoice due date
         
        }, 
        // The products you would like to see on your invoice
        // Total values are being calculated automatically
        "products": invoiceData.productDetails.map(ele => ({
            
            "quantity": ele.quantity,
            "description": ele.productname,
            "tax-rate": 6,
            "price": ele.price,
         
        
        })),
       
           
       
    

     
        // The message you would like to display on the bottom of your invoice
        "bottom-notice": "Thankyou for your order",
        // Settings to customize your invoice
        "settings": {
            "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
            // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
            // "margin-top": 25, // Defaults to '25'
            // "margin-right": 25, // Defaults to '25'
            // "margin-left": 25, // Defaults to '25'
            // "margin-bottom": 25, // Defaults to '25'
            // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
            // "height": "1000px", // allowed units: mm, cm, in, px
            // "width": "500px", // allowed units: mm, cm, in, px
            // "orientation": "landscape", // portrait or landscape, defaults to portrait
        },
        // Translate your invoice to your preferred language
"translate": {      
            // "invoice": "FACTUUR",  // Default to 'INVOICE'
            // "number": "Nummer", // Defaults to 'Number'
            // "date": "Datum", // Default to 'Date'
            // "due-date": "Verloopdatum", // Defaults to 'Due Date'
            // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
            // "products": "Producten", // Defaults to 'Products'
            // "quantity": "Aantal", // Default to 'Quantity'
            // "price": "Prijs", // Defaults to 'Price'
            // "product-total": "Totaal", // Defaults to 'Total'
            // "total": "Totaal", // Defaults to 'Total'
            // "vat": "btw" // Defaults to 'vat'
        },
    };

 
easyinvoice.createInvoice(data, function (result) {
  easyinvoice.download('myInvoice.pdf', result.pdf);
  //	you can download like this as well:
  //	easyinvoice.download();
  //	easyinvoice.download('myInvoice.pdf');   
});
    
}catch(err){
    console.error('Error in data',err)
}

}
      
}