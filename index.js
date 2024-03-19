document.addEventListener("DOMContentLoaded", function() {

            function generateUniqueID() {
                return 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            }

        // Loop through all forms on the page
        document.querySelectorAll('form').forEach(function(form) {
            form.addEventListener('submit', function(e) {
                // Prevent the form from submitting normally
                e.preventDefault();

                // Generate a unique identifier for this submission
                var uniqueID = generateUniqueID();


                let fieldsArray = [];
                
                Array.from(form.elements).forEach((element) => {
                // Explicitly filter for user-interactive input types
                const inputTypes = ['text', 'email', 'tel', 'number', 'select-one', 'radio', 'checkbox', 'textarea'];
                if (inputTypes.includes(element.type) && !element.name.startsWith("label-")) {
                    if ((element.type === 'radio' || element.type === 'checkbox') && !element.checked) {
                        return; // Skip unchecked radios/checkboxes
                    }

                    // For select elements, use the selected option's value
                    let value = element.value;
                    if (element.type === 'select-one') {
                        value = element.options[element.selectedIndex].value;
                    }

                    let fieldLabel = element.name;
                    // Attempt to find a human-readable label if a corresponding hidden label input exists
                    const hiddenLabel = form.querySelector(`input[type='hidden'][name='label-${element.name}']`);
                    if (hiddenLabel) {
                        fieldLabel = hiddenLabel.value;
                    } else {
                        // Fallback: Try to use the text content of an associated label; otherwise, use the name attribute
                        const associatedLabel = form.querySelector(`label[for="${element.id}"]`);
                        if (associatedLabel) {
                            fieldLabel = associatedLabel.textContent.trim();
                        }
                    }

                    fieldsArray.push({ "field": fieldLabel, "value": value });
                }
            });
                
                console.log('fieldsArray',fieldsArray);
                
                /*
                formData.forEach((value, key) => {
                    fieldsArray.push({ "field": key, "value": value.toString() });
                });
                */

                const company = "1710833931162x233471620314562560";

                // Check for a custom form title element, otherwise use the form's name attribute
                const formTitleElement = form.querySelector('.dmform-title');
                const formName = formTitleElement ? formTitleElement.textContent : form.getAttribute('name');
                const formId = form.getAttribute('id');

                var webhookUrl = 'https://d197.bubble.is/site/gonzy/version-4i/api/1.1/wf/embedded-form-submission/initialize';

                // Create the request to send the form data
                fetch(webhookUrl, {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body:JSON.stringify({
                        fields:fieldsArray,
                        submissionId:uniqueID.toString(),
                        formName:formName,
                        company:company,
                        formId:formId
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        });
    });
