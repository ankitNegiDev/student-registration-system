// using DOMContentLoaded event to make sure that we only do dom manipulation once the DOM tree is created by the browser.

document.addEventListener("DOMContentLoaded", function callback() {
    // accessing the form inorder to apply the event listener on it (using event delegation)...to remove error dynamically..
    const studentForm = document.getElementById("student-form");
    console.log(studentForm);

    //? event listener for removing dynamic error.
    studentForm.addEventListener("input", function callback(event) {
        if (
            event.target &&
            event.target.matches(
                "input[type='text'], input[type='email'], input[type='tel'],textarea"
            )
        ) {
            removeValidationError(event.target);
        }
    });

    studentForm.addEventListener("change", function callback(event) {
        if (
            event.target &&
            event.target.matches('input[type="date"], select')
        ) {
            removeValidationError(event.target);
        }
    });

    // accessing all the input fields inorder to manipulate them.
    //? (1) accessing the name input field
    const studentName = document.getElementById("name");
    console.log(studentName);

    //? (1a) accessing image
    const studentImage = document.getElementById("student-image");
    console.log(studentImage);

    // adding event input to remove the error dynamically..
    /*
    studentName.addEventListener("input", function callback(event) {
        // removeValidationError(studentName); // we prefer event.target for best pratics...
        removeValidationError(event.target);
    });
    */

    /**
     * there is no point of accessing the value of studentName.value at the time when DOM content is loaded. because at this time it will have undefined because user did not enter any value at this point of time and it is no use of us.
     * this is the reason we do not do this 
            let studentName = document.getElementById("name");
            studentName = studentName.value; 
        doing this will create problem when we access the studentName later there it will directly print undefined because studentName.value have udnefined initially.
     */

    //? (2) accessing the student id input field
    const studentId = document.getElementById("student-id");
    console.log(studentId);
    /*
    studentId.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (3) accessing the student class input field
    const studentClass = document.getElementById("student-class");
    console.log(studentClass);
    /*
    studentClass.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (4) accessing the student roll number input field
    const studentRollNumber = document.getElementById("student-roll-number");
    console.log(studentRollNumber);
    /*
    studentRollNumber.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (5) accessing the student email input field
    const studentEmail = document.getElementById("student-email");
    console.log(studentEmail);
    /*
    studentEmail.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (6) accessing the student phone number input field
    const studentPhoneNumber = document.getElementById("student-phone-number");
    console.log(studentPhoneNumber);
    /*
    studentPhoneNumber.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (7) accessing the student date of birth input field
    const studentDateOfBirth = document.getElementById("student-date-of-birth");
    console.log(studentDateOfBirth);
    /*
    studentDateOfBirth.addEventListener("change", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (8) accessing the student gender
    const studentGender = document.getElementById("gender");
    console.log(studentGender);
    /*
    studentGender.addEventListener("change", function callback(event) {
        removeValidationError(event.target);
    })
    */

    //? (9) accessing the student address
    const studentAddress = document.getElementById("student-address");
    console.log(studentAddress);
    /*
    studentAddress.addEventListener("input", function callback(event) {
        removeValidationError(event.target);
    });
    */

    //? (10) accessing the add button
    const addButton = document.getElementById("add-btn");
    console.log(addButton);

    //? (11) accessing the student table
    const studentTable = document.getElementById("student-table");
    console.log(studentTable);

    //? (12) accessing the student table tbody where we will add new row dynamically
    const studentTableTbody = document.getElementById("student-table-t-body");
    console.log(studentTableTbody);

    //? (13) accessing the table container
    const tableContainer = document.getElementById("table-container");

    // writing function that will validate our input data ..
    /**
     * for validation we handel the edge case first or where our code can give wrong output...
     */

    //? (1) function to validate Student name.
    function isValidStudentName(studentName) {
        // handling non-string input for student name like number 1,2 etc.
        if (typeof studentName !== "string") {
            // console.log("1st");
            return false;
        }

        // trimming the extra spce
        let trimmedStudentName = studentName.trim();
        // now what if there is space b/w two words which is more then 2 then we use regex
        trimmedStudentName = trimmedStudentName.replace(/\s+/g, " ");

        // checking length what if we pass only space then ??
        if (trimmedStudentName.length === 0) {
            // console.log("2nd");
            return false;
        }

        // regex (regular expression object) validation
        const nameRegex = /^[\p{L}\s\-'’.]+$/u;
        const validRegexStudentName = nameRegex.test(trimmedStudentName);
        // test() will return boolean
        return validRegexStudentName;

        /**
            * Checks if a string (name) contains only valid characters: It makes sure that a name only contains unicode letters, spaces, hyphens, apostrophes, and dots.

            Ensures that there are no extra characters at the start or end: The anchors ^ and $ are important for ensuring that the string does not contain any leading or trailing characters that are not in our validation criteria.

            Handles international characters: By using \p{L} and the u flag, it ensures that a name from any language will be accepted, not just basic English.
             */
    }

    //? (2) function that will validate the student image
    function isValidStudentImage(fileInput) {
        if (fileInput.files.length === 0) {
            return false;
        }
        const selectedFile = fileInput.files[0];
        const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
        if (!allowedTypes.includes(selectedFile.type)) {
            return false;
        }
        return true;
    }

    //? (3) function to validate Student ID we set input type text in html.

    function isValidStudentId(studentId, options = {}) {
        if (typeof studentId !== "string") {
            return false;
        }
        // removing the extra spcess
        const trimmedStudentId = studentId.trim().toUpperCase();

        // setting the default value and if options object is provided then destructuring it.
        const {
            minLength = 3,
            maxLength = 8,
            allowedChars = /^[A-Z0-9-]+$/,
            startWithPrefix = null,
            enforcePrefix = false,
        } = options;

        if (
            startWithPrefix &&
            enforcePrefix &&
            !trimmedStudentId.startsWith(startWithPrefix)
        ) {
            return false;
        }

        // checking length of trimmedStudentId length is it ranging from 6 to 15 or not
        if (
            trimmedStudentId.length < minLength ||
            trimmedStudentId.length > maxLength
        ) {
            return false;
        }

        // checking is allowedChars are present in trimmedStudentId or not
        if (!allowedChars.test(trimmedStudentId)) {
            return false;
        }

        return true;
    }

    //? (4) function to validate the Student Class

    function isValidStudentClass(studentClass, options = {}) {
        if (typeof studentClass !== "string") {
            return false;
        }

        // trimming the extra spcess
        const trimmedStudentClass = studentClass.trim();

        // providing default value or if we provide any options object then destructuring it .

        const {
            minLength = 1, // Default minimum length of 1
            maxLength = 12, // Default max length of 12
            allowedChars = /^[\p{L}0-9\s-]+$/u, //Allow letters, numbers, spaces and hyphens
            allowedClasses = null, //No specific allowed classes by default we can pass our class explictely.
        } = options;

        // checking the length of the trimmedStudentClass
        if (
            trimmedStudentClass.length < minLength ||
            trimmedStudentClass.length > maxLength
        ) {
            return false;
        }

        // checking for allowed characters..
        if (!allowedChars.test(trimmedStudentClass)) {
            return false;
        }

        // checking for allwed classes explictely that we provide..
        if (allowedClasses) {
            if (!allowedClasses.includes(trimmedStudentClass)) {
                return false;
            }
        }

        return true;
    }

    //? (5) function to validate the student Roll Number

    function isValidStudentRollNumber(studentRollNumber, options = {}) {
        // checking typeof studentRollNumber must be string...
        if (typeof studentRollNumber !== "string") {
            return false;
        }

        // trimming extra spaces
        const trimmedStudentRollNumber = studentRollNumber.trim().toUpperCase();

        // providing default value or if we provide any options object then destructuring it .
        const {
            minLength = 4,
            maxLength = 8,
            allowedChars = /^[A-Z0-9/-]+$/, // Alphanumeric, hyphen, forward slash by default
            startWithPrefix = null,
            enforcePrefix = false,
        } = options;

        // checking prefix..
        if (startWithPrefix) {
            if (
                enforcePrefix &&
                !trimmedStudentRollNumber.startsWith(startWithPrefix)
            ) {
                return false;
            }
            //! check prefix logic once again -******************
            // else if ((!trimmedStudentRollNumber.startsWith(startWithPrefix)) && (trimmedStudentRollNumber.startsWith(startWithPrefix.slice(0, -1)))) {
            //     return false;
            // }
        }

        // checking length
        if (
            trimmedStudentRollNumber.length < minLength ||
            trimmedStudentRollNumber.length > maxLength
        ) {
            return false;
        }

        // checking allowed characters..
        if (!allowedChars.test(trimmedStudentRollNumber)) {
            return false;
        }

        return true;
    }

    //? (6) function that validate the student email...

    function isValidStudentEmail(studentEmail) {
        // checking type of studentEmail
        if (typeof studentEmail !== "string") {
            return false;
        }

        // trimming the extra space..
        const trimmedStudentEmail = studentEmail.trim();

        // checking that trimmedStudentEmail length must be greater then 0 means we are checking that user did not pass any empty string or invalid email like "test@.com", "","@example.com" etc.
        if (trimmedStudentEmail.length === 0) {
            return false;
        }

        // regex for general email validation
        const studentEmailRegex =
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // here test method will return true if our trimmedStudentEmail matches general email validation other wise it will return false.
        return studentEmailRegex.test(trimmedStudentEmail);
    }

    //? (7) function that validates student phone number

    function isValidStudentPhoneNumber(studentPhoneNumber, options = {}) {
        if (typeof studentPhoneNumber !== "string") {
            return false;
        }

        const trimmedStudentPhoneNumber = studentPhoneNumber.trim();

        // checking that user did not put it empty
        if (trimmedStudentPhoneNumber.length === 0) {
            return false;
        }

        // setting the value for the default options object if not provided if provided then we are destructuring it here ...
        const {
            minLength = 7, // Minimum number of digits
            maxLength = 15, // Max number of digits
            allowedChars = /^[0-9+()\s-]+$/, // Allows numbers, plus, spaces, parentheses, and hyphens
        } = options;

        // checking for the length of the trimmedStudentPhoneNumber..
        if (
            trimmedStudentPhoneNumber.length < minLength ||
            trimmedStudentPhoneNumber.length > maxLength
        ) {
            return false;
        }

        // checking for allowed characters ..
        if (!allowedChars.test(trimmedStudentPhoneNumber)) {
            return false;
        }

        return true;
    }

    //? (8) function that validate the date of birth...

    /**
     * here we assume that min age for the student to enroll in the course is 18 years and max age is 30 ... so why we are doing validation for the date isn't it already done by browser ... but the question is what if user set its date of birth like 2 years or 10 years or 1300 years etc or user set Future age like 09/04/2050 which is not valid so to validate all this we need write our custom logic... with default input type date.
     */

    function isValidStudentDateOfBirth(studentDateOfBirth, options = {}) {
        if (typeof studentDateOfBirth !== "string") {
            console.log("dob 1st");
            return false;
        }

        // setting the min and max age for user.. by default it will work since we can not pass the object from the input type=date..
        const { minAge = 18, maxAge = 30 } = options;
        const selectedDate = new Date(studentDateOfBirth);
        console.log(selectedDate);
        const currentDate = new Date();
        console.log(currentDate);
        const ageInMilliseconds = currentDate - selectedDate;
        //! const ageInYears = ageInMilliseconds / 1000 * 60 * 60 * 24 * 365.25;  error because we are dividing the age in millisedonds with 1000 not the whole (1000*60*60*24*365.25)
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        console.log(ageInYears);
        const ageInYearsRounded = Math.floor(ageInYears);
        console.log(ageInYearsRounded);
        // here 1sec = 1000 milliseconds , 1 minute = 60 sec , 1hr = 60 min, 1day = 24hrs, 1year = 365 days.

        return ageInYearsRounded >= minAge && ageInYearsRounded <= maxAge;
        // here if we pass age 50 then first operand is true but second operand evaluated to false so  false will be returned. and if age is 15 then first operand is false so && will not check even second condition. (short circutting)
    }

    //? (9) function that will validate the student gender
    function isValidStudentGender(studentGender) {
        if (!studentGender) {
            // alert("please select the gender");
            return false;
        }

        // checking that studentGender value is not empty because for default selected option "select gender" value is "" empty string...
        if (studentGender === "") {
            return false;
        }
        // if(studentGender==="Select Gender"){return true} this will not work because we use required in input that means user have to select either male,female,prefer not to say.
        return true;
    }

    //? (10) function that validate the address
    function isValidStudentAddress(studentAddress, options = {}) {
        if (typeof studentAddress !== "string") {
            return false;
        }
        const trimmedStudentAddress = studentAddress.trim();

        if (trimmedStudentAddress.length === 0) {
            return false;
        }
        const {
            minLength = 5,
            maxLength = 25,
            allowedChars = /^[\p{L}0-9\s.,#-]+$/u,
        } = options;

        if (
            trimmedStudentAddress.length < minLength ||
            trimmedStudentAddress.length > maxLength
        ) {
            return false;
        }

        if (!allowedChars.test(trimmedStudentAddress)) {
            return false;
        }
        return true;
    }

    //* moving our renderValidationError() and removeValidationError() outside the event Listener because it will add eventListener on each input all the time when user submit the button and we did not want that....

    // creating a function that will create a new error div and creating another function that will remove it once the user enter valid input data.
    //? creating a function that will add a dynamic error.
    function renderValidationError(inputField, errorMessage) {
        // remove any existing error.
        removeValidationError(inputField);
        const newErrorDiv = document.createElement("div");
        //! newErrorDiv.classList.add = ("error-message"); error we did not use = in adding the class
        // handling if we by mistake did not pass any error message.
        if (!errorMessage || errorMessage.length <= 0) {
            console.warn(
                `No error message provided for the input field: ${
                    inputField.id || inputField.name || "unknown field"
                }`
            );
            errorMessage = "Invalid input. Please check and try again.";
        }
        newErrorDiv.classList.add("error-message");
        // newErrorDiv.style.color = "red";
        newErrorDiv.textContent = errorMessage;
        inputField.insertAdjacentElement("afterend", newErrorDiv);
    }

    //? creating a function that will remove dynamic error
    function removeValidationError(inputField) {
        const existingErrorDiv = inputField.nextElementSibling;
        // checking if error div exist then remove it ...
        if (
            existingErrorDiv &&
            existingErrorDiv.classList.contains("error-message")
        ) {
            existingErrorDiv.remove();
        }
    }

    //? creating a function that will create the table row and its table data for us.
    function createTableRow(studentData) {
        const newTableRow = document.createElement("tr");
        newTableRow.classList.add("tbody-row");
        newTableRow.id = `student-row-${studentData.id}`;

        // creating and appending the table cells.

        // creating student name cell.
        const nameCell = document.createElement("td");
        // nameCell.textContent = studentData.name;
        // nameCell.classList.add("tbody-name-cell"); // no use of this

        // creating imageElement
        const imageElement = document.createElement("img");
        // Giving each image a unique ID //! keep in mind write logic for unique id...

        imageElement.id = `student-image-${studentData.id}`;
        imageElement.src = studentData.image || ""; // place holder for default image..
        imageElement.style.maxWidth = "70px";
        imageElement.style.maxHeight = "70px";

        // appending the image first..
        nameCell.appendChild(imageElement);
        // appending the student name with space..
        nameCell.append(" ", studentData.name);
        newTableRow.appendChild(nameCell);

        // creating student id cell
        const idCell = document.createElement("td");
        idCell.textContent = studentData.id;
        newTableRow.appendChild(idCell);

        // creating student student class cell
        const classCell = document.createElement("td");
        classCell.textContent = studentData.class;
        newTableRow.appendChild(classCell);

        // creating student roll number cell
        const rollNumberCell = document.createElement("td");
        rollNumberCell.textContent = studentData.rollNumber;
        newTableRow.appendChild(rollNumberCell);

        // creating student email cell
        const emailCell = document.createElement("td");
        emailCell.textContent = studentData.email;
        newTableRow.appendChild(emailCell);

        // creating student phone number cell
        const phoneNumberCell = document.createElement("td");
        phoneNumberCell.textContent = studentData.phoneNumber;
        newTableRow.appendChild(phoneNumberCell);

        // creating student date of birth cell
        const dobCell = document.createElement("td");
        dobCell.textContent = studentData.dob;
        newTableRow.appendChild(dobCell);

        // creating student gender cell
        const genderCell = document.createElement("td");
        genderCell.textContent = studentData.gender;
        newTableRow.appendChild(genderCell);

        // creating student address cell
        const addressCell = document.createElement("td");
        addressCell.textContent = studentData.address;
        newTableRow.appendChild(addressCell);

        // creating edit and delete button
        const actionsCell = document.createElement("td");
        actionsCell.classList.add("actions");
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        actionsCell.appendChild(deleteButton);

        newTableRow.appendChild(actionsCell);

        // returning the newTableRow
        return newTableRow;
    }

    //? creating a function that will validate form data.

    function validateFormData() {
        // now using all the validations function we will now validate the user input value and based on that we will throw error or show the alert.

        // validating the name using our custom isValidStudentName()

        let isValid = true; // this flag will track the form input data validations..
        // console.log("studnetName vlaue :",studentName.value)

        if (!studentName) {
            console.error(
                "The student name element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (!studentName.value || !isValidStudentName(studentName.value)) {
            /*
            alert(
                "Please enter a valid name (only letters,spaces, hyphens, apostrophes, and dots). eg : Ankit Negi,  Ankit Negi  , Bingo    Live, O'Malley, Bingo-Live, Ankuś"
            );
            */
            if (studentName.value === "") {
                // user did not write anything and submit the form
                const errorMessage = "Please enter your name";
                console.log(errorMessage);
                renderValidationError(studentName, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid name (only letters,spaces, hyphens, apostrophes, and dots). eg : Ankit Negi,  Ankit Negi  , Bingo    Live, O'Malley, Bingo-Live, Ankuś";
                renderValidationError(studentName, errorMessage);
            }
            isValid = false;
            // studentName.focus();
        }

        //! validating the student image using our custom function isValidStudentImage() function.
        if (!studentImage) {
            console.error(
                "The student image element is not found in the DOM check id is passed correctly or not"
            );
        }
        if (studentImage.files.length > 0) {
            if (!isValidStudentImage(studentImage)) {
                const selectedFile = studentImage.files[0];
                const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
                if (!allowedTypes.includes(selectedFile.type)) {
                    const errorMessage =
                        "Invalid file type, only PNG, JPEG or GIF images are allowed";
                    renderValidationError(studentImage, errorMessage);
                } else {
                    const errorMessage = "please select a valid image";
                    renderValidationError(studentImage, errorMessage);
                }
            }
        } else if (
            studentImage.files.length === 0 &&
            addButton.textContent !== "Update"
        ) {
            const errorMessage = "Please select an image";
            renderValidationError(studentImage, errorMessage);
            isValid = false;
        }

        // validating the student id using our custom isValidStudentId() functions.

        if (!studentId) {
            console.error(
                "The student id element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (!studentId.value || !isValidStudentId(studentId.value)) {
            /*
            alert(
                "Please enter a valid ID (only uppercase letters , numbers, and hyphens , 3-10 character long id are allowed)."
            );
            */
            if (studentId.value === "") {
                // user did not write anything and submit the form
                const errorMessage = "Please enter your id";
                renderValidationError(studentId, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid ID (only uppercase letters , numbers, and hyphens , 3-8 character long id are allowed).";
                renderValidationError(studentId, errorMessage);
            }
            isValid = false;
        }

        // validating the student class using our custom isValidStudentClass() function.
        if (!studentClass) {
            console.error(
                "The student class element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (!studentClass.value || !isValidStudentClass(studentClass.value)) {
            /*
            alert(
                "Please enter a valid Class (only letters, number, space, hyphen are allowed"
            );
            */
            if (studentClass.value === "") {
                const errorMessage = "Please enter your class name";
                renderValidationError(studentClass, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid Class which must be between 1 to 12 characters and (only letters, number, space, hyphen are allowe)";
                renderValidationError(studentClass, errorMessage);
            }
            isValid = false;
        }

        // validating the student roll number using our custom function isValidStudentRollNumber() function.
        if (!studentRollNumber) {
            console.error(
                "The student Roll Number element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (
            !studentRollNumber.value ||
            !isValidStudentRollNumber(studentRollNumber.value)
        ) {
            /*
            alert(
                "Please enter a valid student roll number (only letters, number, space , hyphen are allowed"
            );
            */
            if (studentRollNumber.value === "") {
                const errorMessage = "Please enter your roll number";
                renderValidationError(studentRollNumber, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid student roll number which must be between 4 and 8 characters and (only letters, number, space , hyphen are allowed) and min and max length 4-8 allowed";
                renderValidationError(studentRollNumber, errorMessage);
            }
            isValid = false;
        }

        // validating the student email using the custom function isValidStudentEmail() function.
        if (!studentEmail) {
            console.error(
                "The student Email element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (!studentEmail.value || !isValidStudentEmail(studentEmail.value)) {
            /*
            alert(
                "Please enter a valid email address in the format: example@domain.com. Email address can only include letters, numbers, periods, underscores, and hyphens before the @ symbol. Email address must have a @ symbol and a top-level domain."
            );
            */
            if (studentEmail.value === "") {
                const errorMessage = "Please enter your email address";
                renderValidationError(studentEmail, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid email address (only letters, numbers, periods, underscores, and hyphens before the @ symbol are allowed). Email address must have a @ symbol and a top-level domain.";
                renderValidationError(studentEmail, errorMessage);
            }
            isValid = false;
        }

        // validating the student phone numbeer using our custom function isValidStudentPhoneNumber()..
        if (!studentPhoneNumber) {
            console.error(
                "The student Email element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (
            !studentPhoneNumber.value ||
            !isValidStudentPhoneNumber(studentPhoneNumber.value)
        ) {
            /*
            alert(
                "Please enter a valid phone number (only digits, spaces, plus sign, parentheses, and hyphens are allowed. The number must be between 7 and 15 digits, e.g., +1 (555) 123-4567)"
            );
            */
            if (studentPhoneNumber.value === "") {
                const errorMessage = "Please enter your phone number";
                renderValidationError(studentPhoneNumber, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid phone number (only digits, spaces, plus sign, parentheses, and hyphens are allowed. The number must be between 7 and 15 digits, e.g., +1 (555) 123-4567)";
                renderValidationError(studentPhoneNumber, errorMessage);
            }
            isValid = false;
        }

        // validating the studnet date of birth using our custom function isValidStudentDateOfBirth()...
        if (!studentDateOfBirth) {
            console.error(
                "The student Date Of Birth element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (
            !studentDateOfBirth.value ||
            !isValidStudentDateOfBirth(studentDateOfBirth.value)
        ) {
            /*
            alert(
                "Please enter a date of birth that indicates an age between 18 and 30 years."
            );
            */
            if (studentDateOfBirth.value === "") {
                const errorMessage = "Please enter your date of birth";
                renderValidationError(studentDateOfBirth, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a date of birth that indicates an age between 18 and 30 years.";
                renderValidationError(studentDateOfBirth, errorMessage);
            }
            isValid = false;
        }

        // validating the student gender using our custom function isValidStudentGender()..
        if (!studentGender) {
            console.error(
                "The student Gender element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (
            !studentGender.value ||
            !isValidStudentGender(studentGender.value)
        ) {
            /*alert("Please enter a valid student Gender");*/
            const errorMessage =
                "Please select a gender from the provided options";
            renderValidationError(studentGender, errorMessage);
            isValid = false;
        }

        // validating the student address using our custom function isValidStudentAddress()...
        if (!studentAddress) {
            console.error(
                "The student Address element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (
            !studentAddress.value ||
            !isValidStudentAddress(studentAddress.value)
        ) {
            /*alert("please enter a valid student Address");*/
            if (studentAddress.value === "") {
                const errorMessage = "Please enter your address";
                renderValidationError(studentAddress, errorMessage);
            } else {
                const errorMessage =
                    "Please enter a valid address, which must be between 5 and 25 characters, and can only contain letters, numbers, spaces, periods, commas, hyphens, and hash symbols.";
                renderValidationError(studentAddress, errorMessage);
            }
            isValid = false;
        }

        /*
        if (!isValid) {
            return; //here we return because suppose if 4 input data were correct but 1 input data is incorrect then we don't want that a new tableRow created and this data is added to our table.. we will add data only when all the validations are passed...
        } else {
            return isValid; // only when isValid is true means our form data is validated and pass all our validation.
        }
        */
        return isValid;
    }

    //? creating a function that will focus on first invalid input field.
    function focusOnFirstInvalidInput() {
        // creating an array of object that holds input element and its validation function.
        const inputs = [
            { element: studentName, isValid: isValidStudentName },
            { element: studentImage, isValid: isValidStudentImage },
            { element: studentId, isValid: isValidStudentId },
            { element: studentClass, isValid: isValidStudentClass },
            { element: studentRollNumber, isValid: isValidStudentRollNumber },
            { element: studentEmail, isValid: isValidStudentEmail },
            { element: studentPhoneNumber, isValid: isValidStudentPhoneNumber },
            { element: studentDateOfBirth, isValid: isValidStudentDateOfBirth },
            { element: studentGender, isValid: isValidStudentGender },
            { element: studentAddress, isValid: isValidStudentAddress },
        ];

        for (const input of inputs) {
            if (!input.element.value || !input.isValid(input.element.value)) {
                if (input.element === studentImage) {
                    if (
                        studentImage.files.length > 0 &&
                        !isValidStudentImage(studentImage)
                    ) {
                        input.element.focus();
                        return;
                    } else if (
                        studentImage.files.length === 0 &&
                        addButton.textContent !== "Update"
                    ) {
                        input.element.focus();
                        return;
                    }
                } else {
                    input.element.focus();
                    return;
                }
            }
        }
    }

    //! Function to handle image conversion and data population
    /*async function handleImageConversion(fileInput, existingImageSrc = "") {
        if (fileInput.files.length === 0) {
            return existingImageSrc; // Return existing image src if no file selected
        }

        try {
            const base64Image = await convertImageToBase64(fileInput.files[0]);
            return base64Image;
        } catch (error) {
            console.error("Error converting image:", error);
            return existingImageSrc; //return existing image src on error
        }
    }*/
    //! updated handelImageConversion()
    async function handleImageConversion(fileInput, existingImageSrc = "") {
        if (fileInput.files.length === 0) {
            return existingImageSrc;
        }

        try {
            const compressedBase64Image = await compressAndConvertToBase64(
                fileInput.files[0]
            );
            return compressedBase64Image;
        } catch (error) {
            console.error("Error converting or compressing image:", error);
            return existingImageSrc;
        }
    }

    //! converting image to base64
    /*function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    }*/

    //! updated convertedImageToBase64
    function compressAndConvertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");

                    // Set desired width and height (e.g., 100x100)
                    const maxWidth = 100;
                    const maxHeight = 100;
                    const scale = Math.min(
                        maxWidth / img.width,
                        maxHeight / img.height
                    );

                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress and convert to base64
                    const compressedBase64 = canvas.toDataURL(
                        "image/jpeg",
                        0.7
                    );
                    resolve(compressedBase64);
                };

                img.onerror = () =>
                    reject(new Error("Error loading image for compression"));
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file); // Read file as base64
        });
    }

    // adding event listener on form
    /*studentForm.addEventListener("submit", function callback(event) {
        event.preventDefault();
        // this condition will ensure that all the fields must be having valid value
        /*
        if (!studentName.value || !studentId.value || !studentClass.value || !studentRollNumber.value || !studentEmail.value || !studentPhoneNumber.value || !studentDateOfBirth.value || !studentGender.value || !studentAddress.value) {
            alert("Please fill all the required fields.");
            return;
        }
        * instead of this we will create our custom function to check validation ...
        *

        if (addButton.textContent === "Update" && editRow) {
            // call the update logic
            if (!validateFormData()) {
                focusOnFirstInvalidInput();
                return;
            }
            let imageBase64 = "";
            if (studentImage.files.length > 0) {
                const imagevalidationResult = isValidStudentImage(studentImage);
            }

            const studentData = {
                name: studentName.value,
                id: studentId.value,
                class: studentClass.value,
                rollNumber: studentRollNumber.value,
                email: studentEmail.value,
                phoneNumber: studentPhoneNumber.value,
                dob: studentDateOfBirth.value,
                gender: studentGender.value,
                address: studentAddress.value,
            };
            // calling updateTableRow() funciton
            console.log("edit row in form event listener");
            console.log(editRow);
            updateTableRow(editRow, studentData);
            updateLocalStorage();
            resetEditState();
        } else {
            // call the add logic..
            if (!validateFormData()) {
                // if validation fails then focus on first invalid input field.
                focusOnFirstInvalidInput();
                return; // returning becuse we did not want to add invalid data.
            }

            // creating a new table row.
            /*
            * instead of this we will create a function that will create a table row and table data dynamically..
            const newTableRow = document.createElement("tr");
            console.log(newTableRow);
            newTableRow.innerHTML = `
            <td> ${studentName.value}</td>
            <td> ${studentId.value} </td>
            <td> ${studentClass.value} </td>
            <td> ${studentRollNumber.value}</td>
            <td> ${studentEmail.value} </td>
            <td> ${studentPhoneNumber.value} </td>
            <td> ${studentDateOfBirth.value} </td>
            <td> ${studentGender.value} </td>
            <td> ${studentAddress.value} </td>
            <td> <button> Edit </button> 
                <button> Delete </button>
            </td>
            `;
            

            // creating a object that will hold all the values that student passed on submitting the form..
            const studentData = {
                name: studentName.value,
                id: studentId.value,
                class: studentClass.value,
                rollNumber: studentRollNumber.value,
                email: studentEmail.value,
                phoneNumber: studentPhoneNumber.value,
                dob: studentDateOfBirth.value,
                gender: studentGender.value,
                address: studentAddress.value,
            };
            const newTableRow = createTableRow(studentData);
            // appending the newTableRow to the student table tbody
            studentTableTbody.appendChild(newTableRow);
            updateLocalStorage();
            studentForm.reset();
            checkScrollBarNeeded();
            studentName.focus();
        }
    });*/

    let editRow = null;
    studentForm.addEventListener("submit", async function callback(event) {
        event.preventDefault();
        console.log(
            "==============edit row in student form before update logic ========="
        );
        console.log(editRow);
        if (addButton.textContent === "Update" && editRow) {
            // call the update logic
            if (!validateFormData()) {
                focusOnFirstInvalidInput();
                return;
            }
            const existingImageSrc = editRow.querySelector("img")?.src || "";
            console.log(
                "existing image src in student form =========************"
            );
            console.log(existingImageSrc);
            const imageBase64 = await handleImageConversion(
                studentImage,
                existingImageSrc
            );
            const studentData = {
                name: studentName.value,
                id: studentId.value,
                class: studentClass.value,
                rollNumber: studentRollNumber.value,
                email: studentEmail.value,
                phoneNumber: studentPhoneNumber.value,
                dob: studentDateOfBirth.value,
                gender: studentGender.value,
                address: studentAddress.value,
                image: imageBase64,
            };
            console.log(
                "student data in add event listener before calling the update table row.."
            );
            console.log(studentData);
            console.log("edit row in form event listener");
            console.log(editRow);
            updateTableRow(editRow, studentData);
            updateLocalStorage();
            resetEditState();
        } else {
            // call the add logic..
            if (!validateFormData()) {
                // if validation fails then focus on first invalid input field.
                focusOnFirstInvalidInput();
                return; // returning becuse we did not want to add invalid data.
            }
            const imageBase64 = await handleImageConversion(studentImage);
            const studentData = {
                name: studentName.value,
                id: studentId.value,
                class: studentClass.value,
                rollNumber: studentRollNumber.value,
                email: studentEmail.value,
                phoneNumber: studentPhoneNumber.value,
                dob: studentDateOfBirth.value,
                gender: studentGender.value,
                address: studentAddress.value,
                image: imageBase64,
            };
            const newTableRow = createTableRow(studentData);
            studentTableTbody.appendChild(newTableRow);
            updateLocalStorage();
            studentForm.reset();
            checkScrollBarNeeded();
            studentName.focus();
        }
    });
    // edit form data logic ..
    /**
     ** step 1 => identifying which table row edit button is clicked..
     *? step 2 => getting the parent of the clicked edit button so in this step we identifying which row user want to edit..
     ** step 3 => extrating the table row data
     *? step 4 => populating extracted data into the form so that user can edit it.
     ** step 5 => now chaning the add button to update button.
     *? step 6 => revert back to add button.
     */

    // ============================== EDIT AND DELETE ====================

    // Variable to keep track of the row being that being edited

    //? creating a function that will extract table row data.
    function extractTableRowData(row) {
        // now reteriving the data first.
        const tableData = Array.from(row.querySelectorAll("td"));
        // now extracting table row data

        // extracting the image
        const imageElement = row.querySelector("img");
        const studentData = {
            name: tableData[0].textContent,
            id: tableData[1].textContent,
            class: tableData[2].textContent,
            rollNumber: tableData[3].textContent,
            email: tableData[4].textContent,
            phoneNumber: tableData[5].textContent,
            dob: tableData[6].textContent,
            gender: tableData[7].textContent,
            address: tableData[8].textContent,
            // Extract src or default to empty string
            image: imageElement ? imageElement.src : "",
        };
        console.log("student data in extract table row data");
        console.log(studentData);
        return studentData;
    }

    //? creating a function that will populate form with data.
    function populateForm(studentData) {
        studentName.value = studentData.name;
        studentId.value = studentData.id;
        studentClass.value = studentData.class;
        //! studentRollNumber.vlaue = studentData.rollNumber; //! error because of typo...
        studentRollNumber.value = studentData.rollNumber;
        studentEmail.value = studentData.email;
        studentPhoneNumber.value = studentData.phoneNumber;
        studentDateOfBirth.value = studentData.dob;
        studentGender.value = studentData.gender;
        studentAddress.value = studentData.address;

        const imageElement = document.getElementById(
            `student-image-${studentData.id}`
        );
        console.log("imageElemnti nside the populate form before if -------");
        if (imageElement && studentData.image) {
            imageElement.src = studentData.image;
        }
    }

    //? creating a function that will change add button to update
    function changeAddButtonToUpdate() {
        addButton.textContent = "Update";
    }

    //?  creating a function that will handel edit button click..
    function handleEditButtonClick(event) {
        // getting the clicked button.
        const clickedEditButton = event.target;
        console.log(clickedEditButton);
        const rowOfClickedButton = clickedEditButton.closest("tr");
        rowOfClickedButton.style.backgroundColor = "#7c7c7c9b";
        rowOfClickedButton.style.color = "#f9d66e";
        rowOfClickedButton.style.fontSize = "1rem";
        rowOfClickedButton.style.border = "2px solid #7a7a7a";
        console.log("row of clicked button --------------> ");
        console.log(rowOfClickedButton);
        if (rowOfClickedButton) {
            console.log(editRow);
            editRow = rowOfClickedButton;
            console.log("====================== edit row ============");
            console.log(editRow);
            const studentData = extractTableRowData(rowOfClickedButton);
            console.log("student data in handeledit button");
            console.log(studentData);
            populateForm(studentData);
            changeAddButtonToUpdate();
        }
    }

    //? creating a function that will update the table row with new data.
    /*function updateTableRow(row, studentData) {
        // Ensure the first cell contains the image and name
        const imageAndNameCell = row.cells[0];
        if (imageAndNameCell) {
            const existingImage = imageAndNameCell.querySelector("img");
            console.log("existing image in update table row ========> ");
            console.log(existingImage);
            if (existingImage) {
                existingImage.src = studentData.image || ""; // Update the image source if it exists
            } else {
                // If the image element doesn't exist, create a new one
                const newImage = document.createElement("img");
                newImage.src = studentData.image || "";
                newImage.alt = "Student Image";
                newImage.style =
                    "width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;";
                imageAndNameCell.innerHTML = ""; // Clear existing content
                imageAndNameCell.appendChild(newImage);
                imageAndNameCell.appendChild(
                    document.createTextNode(studentData.name)
                );
            }
        }

        // Update other cells
        row.cells[1].textContent = studentData.id;
        row.cells[2].textContent = studentData.class;
        row.cells[3].textContent = studentData.rollNumber;
        row.cells[4].textContent = studentData.email;
        row.cells[5].textContent = studentData.phoneNumber;
        row.cells[6].textContent = studentData.dob;
        row.cells[7].textContent = studentData.gender;
        row.cells[8].textContent = studentData.address;
    }*/
    
    function updateTableRow(row, studentData) {
        // Ensure the first cell contains the image and name
        const imageAndNameCell = row.cells[0];
        console.log("image and name cell in update table row");
        console.log(imageAndNameCell);
        if (imageAndNameCell) {
            // Clear the cell before appending the updated content
            imageAndNameCell.innerHTML = "";

            // Create and append the image element
            const newImage = document.createElement("img");
            newImage.src = studentData.image || "";
            newImage.alt = "Student Image";
            newImage.style =
                "width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;";
            imageAndNameCell.appendChild(newImage);

            // Create and append the name span element
            const nameSpan = document.createElement("span");
            nameSpan.textContent = studentData.name || "";
            imageAndNameCell.appendChild(nameSpan);
        }

        // Update other cells
        row.cells[1].textContent = studentData.id;
        row.cells[2].textContent = studentData.class;
        row.cells[3].textContent = studentData.rollNumber;
        row.cells[4].textContent = studentData.email;
        row.cells[5].textContent = studentData.phoneNumber;
        row.cells[6].textContent = studentData.dob;
        row.cells[7].textContent = studentData.gender;
        row.cells[8].textContent = studentData.address;
    }



    //? creating a funciton that will reset the edit state
    function resetEditState() {
        addButton.textContent = "Add";
        // reset the editRow variable to null after updating
        editRow = null;
        studentForm.reset();
        studentName.focus();
    }

    //? creating a function that will handel delete button click
    // Function to handle delete button click.
    function handleDeleteButtonClick(event) {
        const deleteButton = event.target;
        const rowToDelete = deleteButton.closest("tr");
        if (rowToDelete) {
            rowToDelete.remove();
            // Updating the local storage after row deletion
            updateLocalStorage();
            checkScrollBarNeeded();
        }
    }

    // adding a event listener on the studentTableTbody and we will use event delegation instead of adding individual event listener on the each edit button or delete button.
    studentTableTbody.addEventListener("click", function callback(event) {
        if (event.target && event.target.classList.contains("edit-btn")) {
            handleEditButtonClick(event);
            // console.log(event);
            // console.log("hii edit button event triggered");
        }
        // Delete row logic.
        if (event.target && event.target.classList.contains("delete-btn")) {
            handleDeleteButtonClick(event);
        }
    });

    // ================================== local storage ================================
    /**
     ** step 1 => creating a function that will fetch data from local storage if data existed.
     *? step 2 => if data existed then creating a function to render it if not then we will not render anything.
     ** step 3 => creating a function that will save data to local storage.
     *? step 4 => creating a function that will
     */

    // creating a constant variable which will store key for storing data in local storage .
    const STORAGE_KEY = "studentData";

    //? creating a function that will set|save data to local storage.
    function saveStudentDataToLocalStorage(studentDataArray) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studentDataArray));
    }

    //? creating a function that will fetch data from local storage.
    function fetchStudentDataFromLocalStorage() {
        // localStorage.getItem("key") will return null if key not found.
        const storedStudentData = localStorage.getItem(STORAGE_KEY);
        if (storedStudentData) {
            // returning the array of objects
            // JSON.parse() will convert the JSON string back to a JavaScript array of objects. it is just opposite of JSON.stringify()
            return JSON.parse(storedStudentData);
        } else {
            // returning an emtpy array if no data found in the local storage.
            return [];
        }
    }

    //? crating a function that will render the fetched data on the table.
    function renderStudentDataFromLocalStorage() {
        // fetchStudentDataFromLocalStorage() returns an array of student objects (or an empty array)
        const initialStudentStoredData = fetchStudentDataFromLocalStorage();
        // if the array is empty then forEach won't execute its callback function at all necessary because local storage may or may not have data initially.
        initialStudentStoredData.forEach((studentData) => {
            const newTableRow = createTableRow(studentData);
            studentTableTbody.appendChild(newTableRow);
        });

        // checkScrollBarNeeded();
    }
    // calling renderStudentDataFromLocalStorage() when the page load.
    renderStudentDataFromLocalStorage();

    //? creating a function that will update the local storage with current student data while adding data on table.
    function updateLocalStorage() {
        // first getting all the rows it is imp to get all rows because we did not want that we keep tracking each individual row for minor changes istead we will get all the rows and update it.
        const allRowsArray = Array.from(
            studentTableTbody.querySelectorAll("tr")
        );
        // applying map where we can get each row table data .
        // since map will return the new array where all the student data will be present.
        // const currentRow = allRowsArray[0];
        // console.log("current row =======================================");
        // console.log(currentRow);
        // console.log(currentRow.querySelector("img"));
        // console.log(currentRow.querySelector("img").closest("td"));
        const allStudentData = allRowsArray.map(function extractEachRowData(
            currentRow,
            index,
            rowsArray
        ) {
            const eachRowCellsArray = Array.from(
                currentRow.querySelectorAll("td")
            );
            // returning a object where it contain individual student data.
            return {
                name: eachRowCellsArray[0].textContent,
                id: eachRowCellsArray[1].textContent,
                class: eachRowCellsArray[2].textContent,
                rollNumber: eachRowCellsArray[3].textContent,
                email: eachRowCellsArray[4].textContent,
                phoneNumber: eachRowCellsArray[5].textContent,
                dob: eachRowCellsArray[6].textContent,
                gender: eachRowCellsArray[7].textContent,
                address: eachRowCellsArray[8].textContent,
                // image
                image: currentRow.querySelector("img")?.src || "",
            };
        });
        // calling saveStudentDataToLocalStorage()
        saveStudentDataToLocalStorage(allStudentData);
    }

    // ======================= adding dynamic scroll bar ==============

    const maxTableHeight = 48;
    const rowHeight = 70;

    //? creating a function that will check is scrollbar is needed or not ..
    function checkScrollBarNeeded() {
        const calculatedHeight = studentTableTbody.children.length * rowHeight;
        console.log("calculated heigh ", calculatedHeight);
        if (calculatedHeight > maxTableHeight) {
            tableContainer.style.maxHeight = maxTableHeight + "rem";
            // tableContainer.style.overflowX = "hidden";
        } else {
            tableContainer.style.maxHeight = null;
        }
    }
    checkScrollBarNeeded();

    // ================= changing color of gender and date of bith input field==============

    function handelValueChange(element) {
        if (element.value) {
            element.classList.add("has-value");
        } else {
            element.classList.remove("has-value");
        }
    }
    // Initial check, this is needed if the user refreshed the page
    handelValueChange(studentDateOfBirth);
    handelValueChange(studentGender);

    // adding event listener
    studentDateOfBirth.addEventListener("change", function () {
        handelValueChange(studentDateOfBirth);
    });

    studentGender.addEventListener("change", function () {
        handelValueChange(studentGender);
    });
});

// two task remaning for js
// task 1 => local storage
// task 2 => add vertical scrollbar dynamically.
