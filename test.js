// using DOMContentLoaded event to make sure that we only do dom manipulation once the DOM tree is created by the browser.

//! ------------------ indexdb of browser......... -----------
document.addEventListener("DOMContentLoaded", function callback() {
    const dbName = "studentDB";
    const storeName = "images";

    // Open IndexedDB
    function openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            // Setup schema version and create object store if it doesn't exist
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                }
            };

            request.onerror = () => {
                reject("Error opening IndexedDB");
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                resolve(db);
            };
        });
    }

    function saveImageToIndexedDB(imageData) {
        return new Promise((resolve, reject) => {
            openIndexedDB()
                .then((db) => {
                    const transaction = db.transaction(
                        [storeName],
                        "readwrite"
                    );
                    const store = transaction.objectStore(storeName);

                    const imageBlob = dataURItoBlob(imageData); // Convert base64 to Blob

                    const request = store.add({
                        id: Date.now(),
                        image: imageBlob,
                        name: "studentImage",
                    });

                    request.onsuccess = function () {
                        resolve(request.result);
                    };

                    request.onerror = function () {
                        reject("Error saving image");
                    };
                })
                .catch((error) => {
                    reject("Error opening IndexedDB: " + error);
                });
        });
    }

    function fetchImageFromIndexedDB(imageId) {
        return new Promise((resolve, reject) => {
            openIndexedDB()
                .then((db) => {
                    const transaction = db.transaction([storeName], "readonly");
                    const store = transaction.objectStore(storeName);

                    const request = store.get(imageId);

                    request.onsuccess = function () {
                        if (request.result) {
                            resolve(request.result.image);
                        } else {
                            reject("Image not found");
                        }
                    };

                    request.onerror = function () {
                        reject("Error fetching image");
                    };
                })
                .catch((error) => {
                    reject("Error opening IndexedDB: " + error);
                });
        });
    }

    // Helper to convert base64 to Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(",")[1]);
        const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([uintArray], { type: mimeString });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();

        // Validate form data first
        if (!validateFormData()) {
            focusOnFirstInvalidInput();
            return;
        }

        const imageBase64 = await handleImageConversion(studentImage);

        // Save the image to IndexedDB
        const imageId = await saveImageToIndexedDB(imageBase64);

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
            imageId: imageId, // Store the image reference (ID)
        };

        // Now store the student data in localStorage
        let storedStudents = fetchStudentDataFromLocalStorage();
        storedStudents.push(studentData);
        saveStudentDataToLocalStorage(storedStudents);

        // Reset form and update the table
        studentForm.reset();
        renderStudentDataFromLocalStorage();
    }

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

    //? (2) accessing the student id input field
    const studentId = document.getElementById("student-id");
    console.log(studentId);

    //? (3) accessing the student class input field
    const studentClass = document.getElementById("student-class");
    console.log(studentClass);

    //? (4) accessing the student roll number input field
    const studentRollNumber = document.getElementById("student-roll-number");
    console.log(studentRollNumber);

    //? (5) accessing the student email input field
    const studentEmail = document.getElementById("student-email");
    console.log(studentEmail);

    //? (6) accessing the student phone number input field
    const studentPhoneNumber = document.getElementById("student-phone-number");
    console.log(studentPhoneNumber);

    //? (7) accessing the student date of birth input field
    const studentDateOfBirth = document.getElementById("student-date-of-birth");
    console.log(studentDateOfBirth);

    //? (8) accessing the student gender
    const studentGender = document.getElementById("gender");
    console.log(studentGender);

    //? (9) accessing the student address
    const studentAddress = document.getElementById("student-address");
    console.log(studentAddress);

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

    function isValidStudentDateOfBirth(studentDateOfBirth, options = {}) {
        if (typeof studentDateOfBirth !== "string") {
            console.log("dob 1st");
            return false;
        }

        const { minAge = 18, maxAge = 30 } = options;
        const selectedDate = new Date(studentDateOfBirth);
        console.log(selectedDate);
        const currentDate = new Date();
        console.log(currentDate);
        const ageInMilliseconds = currentDate - selectedDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        console.log(ageInYears);
        const ageInYearsRounded = Math.floor(ageInYears);
        console.log(ageInYearsRounded);

        return ageInYearsRounded >= minAge && ageInYearsRounded <= maxAge;
    }

    //? (9) function that will validate the student gender
    function isValidStudentGender(studentGender) {
        if (!studentGender) {
            // alert("please select the gender");
            return false;
        }

        if (studentGender === "") {
            return false;
        }

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
        let isValid = true; // this flag will track the form input data validations..
        // console.log("studnetName vlaue :",studentName.value)

        if (!studentName) {
            console.error(
                "The student name element is not found in the DOM check id is passed correctly or not"
            );
            return false;
        }
        if (!studentName.value || !isValidStudentName(studentName.value)) {
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
        console.log(imageElement); // correctly getting the image ..
        console.log(imageElement.closest("td")); // correctly getting the parent of the image.
        if (imageElement && studentData.image) {
            imageElement.src = studentData.image;
            console.log("imageElement inside populate form");
            console.log(imageElement); // correct
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
    function updateTableRow(row, studentData) {
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

    studentTableTbody.addEventListener("click", function callback(event) {
        if (event.target && event.target.classList.contains("edit-btn")) {
            handleEditButtonClick(event);
        }
        // Delete row logic.
        if (event.target && event.target.classList.contains("delete-btn")) {
            handleDeleteButtonClick(event);
        }
    });

    // ================================== local storage ================================
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
            return JSON.parse(storedStudentData);
        } else {
            // returning an emtpy array if no data found in the local storage.
            return [];
        }
    }

    //? crating a function that will render the fetched data on the table.
    async function renderStudentDataFromLocalStorage() {
        const students = fetchStudentDataFromLocalStorage();
        for (const student of students) {
            // Render student data (excluding the image)
            const studentRow = createTableRow(student);

            // Fetch and display the image
            const imageBlob = await fetchImageFromIndexedDB(student.imageId);
            const imageUrl = URL.createObjectURL(imageBlob);
            studentRow.querySelector(".student-image").src = imageUrl; // Assuming you have a class for the image element

            studentTableTbody.appendChild(studentRow);
        }
    }

    // calling renderStudentDataFromLocalStorage() when the page load.
    renderStudentDataFromLocalStorage();

    //? creating a function that will update the local storage with current student data while adding data on table.
    function updateLocalStorage() {
        const allRowsArray = Array.from(
            studentTableTbody.querySelectorAll("tr")
        );
        const allStudentData = allRowsArray.map(function extractEachRowData(
            currentRow
        ) {
            const eachRowCellsArray = Array.from(
                currentRow.querySelectorAll("td")
            );

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
                imageId: currentRow.querySelector("img")?.dataset.imageId || "", // Store image reference (ID)
            };
        });

        saveStudentDataToLocalStorage(allStudentData);
    }

    // ======================= adding dynamic scroll bar ==============

    const maxTableHeight = 45.8;
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
