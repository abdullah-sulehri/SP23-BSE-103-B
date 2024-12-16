


function loadDescription(fileName, descriptionId) {
    $.ajax({
        url: fileName,          
        method: 'GET',          
        success: function (data) {
           
            const formattedData = data.replace(/\n/g, '<br>');
            
            $('#' + descriptionId).html('<p>' + formattedData + '</p>');
            
            $('#' + descriptionId).slideDown();
        },
        error: function () {
            
            alert('Failed to load the project details. Please try again later.');
        }
    });
}
