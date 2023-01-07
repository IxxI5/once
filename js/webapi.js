// Web API: https://web-modules.dev/api/v1/
// WEB API Documentation: https://web-modules.dev/api/v1/documentation#/
/*
    Endpoints:

   feedback
   GET          /feedback
   POST         /feedback     -> posts a JSON string over the body

   content
   POST         /like/{id}        
   GET          /products/categories
   GET          /products/{amount}
   GET          /products/byCategory/{category_id}/{amount}
   GET          /testimonials/{amount}

   like
   POST         /like         -> posts a JSON string over the body

   products
   GET          /products/categories
   GET          /products/{amount}
   GET          /products/byCategory/{category_id/{amount}
*/

// Accessing the WEB API
export class webAPI {
  constructor(rootURL) {
    this.rootURL = rootURL;
  }

  // HTTP GET
  // define headers, authorization (JWT)
  async get(endpoint) {
    const url = `${this.rootURL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        // Authorization: "Bearer 31|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    });

    // Awaiting response.json()
    const data = await response.json();

    return data;
  }

  // HTTP POST
  async post(endpoint, jsonObj) {
    // fetch response and
    // define method (POST), headers, authorization (JWT) and body (as JSON text)
    const url = `${this.rootURL}${endpoint}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        // Authorization: "Bearer 31|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },

      // Convert JSON Object data to JSON string and place it to body
      body: JSON.stringify(jsonObj),
    });

    // Awaiting response.json()
    const data = await response.json();

    return data;
  }
}

/*
  example
  const rootURL = "https://web-modules.dev/api/v1";
  const api = new webAPI(rootURL);

  api.get("/products/12").then((data) => {
     console.log(data.products);
  });

  Hint: Call a function instead of console.log
*/
