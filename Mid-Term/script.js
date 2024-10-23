// script.js

// Function to load project description from a file and display it in the specified div
function loadDescription(fileName, descriptionId) {
    $.ajax({
        url: fileName,          // URL of the file to be loaded
        method: 'GET',          // HTTP method to fetch the file
        success: function (data) {
            // Replace newline characters with <br> for proper formatting
            const formattedData = data.replace(/\n/g, '<br>');
            // Insert the formatted content into the div with the given ID
            $('#' + descriptionId).html('<p>' + formattedData + '</p>');
            // Show the description div with a slide-down animation
            $('#' + descriptionId).slideDown();
        },
        error: function () {
            // Display an alert if there's an error loading the file
            alert('Failed to load the project details. Please try again later.');
        }
    });
}
