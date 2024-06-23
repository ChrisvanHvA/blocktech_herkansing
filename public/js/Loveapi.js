

// Define the API key and endpoint
const apiKey = '4ff93e69-734c-451e-8332-171c7e295a9a'; // Replace with your actual API key
const endpoint = 'https://api.apiverve.com/v1/lovecalculator';

// Function to fetch love calculator result
async function getLoveCalculation(name1, name2) {
    // Construct the URL with query parameters
    const url = `${endpoint}?name1=${encodeURIComponent(name1)}&name2=${encodeURIComponent(name2)}`;
    
    try {
        // Make the GET request
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching love calculation:', error);
    }
}

// Event listener for the form submit
document.getElementById('loveForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name1 = document.getElementById('name1').value;
    const name2 = document.getElementById('name2').value;
    const result = await getLoveCalculation(name1, name2);
console.log(result);
console.log(result.data.lovePercentage);
    // Display the result
    document.getElementById('result').innerText = JSON.stringify(result.data.response);
    

    // Update the progress bar
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = `${result.data.lovePercentage}`;
    progressBar.innerText = `${result.data.lovePercentage}`;

});