// for form validation we use regex
/**
 *  regex expression is like a very detailed set of instructions for finding something specific in a document. It tells our computer: "Look for these characters in this specific order, possibly with some variations." But it doesn't tell our computer what to do with that information once it finds it. It needs a bigger program, for example a javascript program, to put those instructions to use.
 * Regex is considered a Domain Specific Language.
 * It's a language which is used to describe patterns within text. These patterns are then used by other programs to find, match, or manipulate text
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
 */

/**
 ** Understanding this regex Expression  (^[a-zA-Z\s]+$) for studentName

    ^ : This is the "start of string" anchor. It means the pattern must match from the very beginning of the input.

    [a-zA-Z\s] : This is a character class. It matches:
        a-z: Any lowercase letter from 'a' to 'z'.
        A-Z: Any uppercase letter from 'A' to 'Z'.
        \s: Any whitespace character (spaces, tabs, newlines, etc.).

    +: This is a quantifier. It means "one or more occurrences" of the preceding element (the character class in this case). So, it needs at least one of those characters.

    $: This is the "end of string" anchor. It means the pattern must match to the very end of the input.


 *? Pros (Why It Might Seem Okay Initially):

    Basic Alpha-Numeric Characters: It allows for standard letters that are common in names.

    Whitespace: It allows spaces for first and last name or more.

    Simple: It's a relatively easy regex to read and understand.

    Preventing Symbols and Numbers: it does a good job of preventing invalid symbol and numbers in a name input field


 *? Cons (Why It's Problematic):

    Ignores Many Valid Characters:

        Hyphens: Many names use hyphens (e.g., "Mary-Jane").
        Apostrophes: Names like "O'Malley" are common.
        Accented Characters: Names with accents (e.g., "José," "François") will be rejected.

    Non-Latin Characters: Names in languages that don't use the Latin alphabet (e.g., Arabic, Chinese, Russian) will be rejected.


 ** Permits Bad Inputs:

    It accepts inputs with leading and trailing spaces, or multiple spaces in a row which might not be intended

    It will accept inputs that contains just spaces

    Too Restrictive: It might exclude valid names unnecessarily, which can be frustrating for users.

 *todo => to avoid these issue we will write our custom logic and regex expression to make our validation works well for all input that user gives and preventing the necessary ones.
 */

/**
 ** regex (regular expression object) validation
    const nameRegex = /^[\p{L}\s\-'’.]+$/u;

    const validRegexStudentName = nameRegex.test(trimmedStudentName);

    // test() will return boolean

    return validRegexStudentName;

    * Checks if a string (name) contains only valid characters: It makes sure that a name only contains unicode letters, spaces, hyphens, apostrophes, and dots.

    * Ensures that there are no extra characters at the start or end: The anchors ^ and $ are important for ensuring that the string does not contain any leading or trailing characters that are not in our validation criteria.

    * Handles international characters: By using \p{L} and the u flag, it ensures that a name from any language will be accepted, not just basic English.

*/




// why the input type = number can be problametic using it with studentId and contact number
/**
 ** Key Issues with type="number"

    Browser Variability: Browsers handle type="number" differently. Some might strip leading zeros, others might allow decimal points, etc. This leads to inconsistencies.

    Limited Character Sets: The input usually tries to restrict the user to numeric inputs, often preventing common characters like spaces, hyphens, or plus signs.

    User Experience: Browsers often use spinners or other interfaces that aren't suitable for non-numeric data, and could confuse users.

    Data Type Confusion: Even though you are limiting the user to number inputs, the value attribute will still return a string, which will have to be converted to number by parsing.

    Form Submission Weirdness: If you try to pass non-number values with type="number", different behaviors can happen depending on the browser and how it interprets those non-numbers.

    Invalid Inputs: browsers have inconsistent and complicated ways of error handling and user interface.


 *? Why type="text" with JavaScript is Better

    Full Control: Your JavaScript code has absolute control over what input is valid, allowing for highly customized rules with the use of regular expressions, length, or other rules.

    Consistency: You avoid inconsistent browser behavior with input types.

    Clear Validation: The validation is clear in code, as it shows what's valid and what's not.

    User Friendly: You can write your code to provide helpful and very specific feedback to the user.

    No Browser Conflicts: You avoid any input type restriction conflicts and can focus on your own custom logic
 */


// if we think that student id are always or most of time are number then ?
/**
 ** Why treat Student IDs as Strings?

    Leading Zeros: If we treat a student ID as a number then we could lose leading zeros. For example, a student ID like 0012345 would be interpreted as 12345 if it was treated as a JavaScript number. String representation allows for preservation of these zeros

    Alphanumeric Characters: Many student ID systems include letters as part of the ID (e.g., A23456, STU1234). Treating it as a string allows for storing and validating these characters.

    Hyphens or Other Special Characters: Some institutions use hyphens or other special characters in their student IDs (e.g., 2023-1234, A12-B567). Strings handle these characters seamlessly.

    Data Consistency: If we have a database storing student IDs as strings and we want a validation function that operates on strings to maintain consistency

    Input Flexibility: By accepting a string input, the function is more flexible. It can be used for validating IDs that happen to be purely numbers, while still being able to handle IDs with other characters if required by the ID system being used.
 */


//todo => The value property of an <input> element always returns a string, regardless of the type attribute (e.g., text, number, tel, etc.).




// isValidStudentName() function test case
/**
    console.log(isValidName("John Doe"));      // true => "John Doe"
    console.log(isValidName("  John Doe  "));  // true => "John Doe"
    console.log(isValidName("John    Doe"));  // true  => "John Doe"
    console.log(isValidName("O'Malley"));      // true  => "O'Malley"
    console.log(isValidName("Mary-Jane"));    // true   => "Mary-Jane"
    console.log(isValidName("José"));         // true  => "José"
    console.log(isValidName("   "));          // false => "" error
    console.log(isValidName(""));             // false  => error
    console.log(isValidName("John123"));       // false
    console.log(isValidName("John!"));         // false
    console.log(isValidName(123));           // false
    console.log(isValidName("a".repeat(256))) // true;
 */





// how we can dynamically add the new error div after the input in the dom
/**
 ** the reason why we did not writting error div in dom is because we want to create error div only when user fails to input the valid data or submit the form without inputing any data into it..

 * insertAdjacentElement allows us to insert an element relative to another element's position in the DOM. we can place the new element in one of four positions:
    beforebegin: Before the target element itself.
    afterbegin: Inside the target element, before its first child.
    beforeend: Inside the target element, after its last child.
    afterend: After the target element itself.
 * for our case we will use afterend.
    eg => studentNameInput.insertAdjacentElement("afterend", newStudentNameErrorDiv);
 */


// in function renderValidationError we can use either classList.add  or className
/**
 * the reason we use className is because we are calling renderValidationError() multiple times and we don't want that on each call a new class add with same name " then this is not going to happen".
 * calling classList.add("error-message") multiple times in renderValidationError() will not add the same class ("error-message") multiple times. because =>
    The classList.add() method checks whether the class already exists before adding it.
    If the class is already present, it does nothing.
* This ensures that duplicate classes are never added to the class attribute.

 */


// input imp points.
/**
 * inputField.id  => will return the value of the id attribute of the input field, if it's set.
 * inputField.name => will return the value of the name attribute of the input field, if it's set.
 * inputField.value => will return the value of that user type in the input box and it will be alwys string independent of input type .
 */





// to remove error that we render dynamically what we need to use "input" or "change " event
/**
 ** input event => 
    * Fired when the value of an element changes after the element is changed by user interaction.
    *? Triggered by:
        Typing, pasting, or deleting text in an <input>, <textarea> or content editable elements.
        Selecting values from a dropdown in <select> element
        Toggling checkboxes or radio buttons, or selecting a date in <input type="date">, <input type = "checkbox">, <input type="radio"> elements
    * Best for Real-time validation, dynamic UI updates, text input fields for better user experience.

 ** change event => 
    * Fired when the value of an element has been changed and the element loses focus.
    *? Triggered by:
        Making a selection in a <select> element (dropdown).
        Clicking on a checkbox or radio button.
        Selecting a date in a <input type="date"> element.
        Modifying the value of an input field and then moving away from the focus of the input element.
    * Best for: Select boxes, checkboxes, radio buttons, date pickers, and when we want the action to occur after the user has completed the interaction.

 ** Why change event is not valid for All Inputs in my case
        *? Delayed Feedback: 
            The biggest drawback is the delay in feedback. The change event will not fire until the user has finished interacting with the input field and focus has moved away, and this means the user will not know if they have made a mistake until they have moved away from the field.

        *? Poor User Experience: 
            Users won't see immediate feedback as they type, which can be frustrating and lead to multiple validation errors after they submit the form.

        *? Not Real-Time: 
            If you want to dynamically update the UI based on input, the change event will not work, as it does not fire until focus is lost.
 */

// what i am using and why
/**
 *? (1) studentName (input type text):
        Event: input
        Reason: if we want real-time feedback as the user types allowing them to see if their input is valid or not immediately and also remove any previous errors.
        using input event we can provide an improved user experience where if user has fixed the issue in the input box then the error goes away dynamically.

 *? (2) studentId (input type text):
        Event: input
        Reason: Similar to studentName we use input for real-time validation as user types the ID. Users should get immediate feedback about their actions, such as if a specific character is not allowed.

 *? (3) studentClass (input type text):
        Event: input
        Reason: we use input for providing immediate feedback on the validity of input. If the user is in the middle of typing the class and types something wrong, then the error will show immediately.

 *? (4) studentRollNumber (input type text):
        Event: input
        Reason: Similar to the above inputs.

 *? (5) studentEmail (input type email):
        Event: input
        Reason: we want real-time validation to give feedback to user as user type the email especially for ensuring that user have entered the correct email format.

 *? (6) studentPhoneNumber (input type tel):
        Event: input
        Reason: similar to rest of input.

 *? (7) studentDateOfBirth (input type date):
        Event: change
        Reason: here for the case of date of birth of user we want that the validation  happen only when the user selects a date from the date picker, and when the user has completed that process.

 *? (8) studentGender (Select Element):
        Event: change
        Reason: The change event makes sense here since the user will make a selection from a dropdown and the validation is only needed after the selection is completed and the dropdown loses focus.

 *? (9) studentAddress (textarea)
        Event: input
        Reason: Users should get immediate feedback in the textarea while typing an address.
 */


// now do we need to attach individual event listener on the each input field or can we use event delegation ??
/**
 ** Event delegation is a pattern where we attach a single event listener to a parent element instead of attaching individual listeners to each of its child elements. When an event occurs on a child element, it "bubbles up" the DOM tree to its parent, and the parent's event listener catches the event, and we can then check the event.target to see which child element actually triggered it.
 *? Event Bubbling: When an event occurs on an element, the browser first handles the event on that specific element and then "bubbles" that event up to all of the parent elements until it reaches the root of the DOM tree. The parent elements then also have the chance to respond to that event.

 * instead of attaching individual event listener we will attach event listener on form and use event delegation ..
 */


// matches() method
/**
 *  matches() is a method that is available on DOM elements (nodes). It checks if the element itself matches a specified CSS selector or not.
 * The matches() method takes a string representing a CSS selector as an argument. The selector allows us to target elements based on various criteria, like their tag name, id, class, attribute, etc
 * matches() returns true if the element matches the CSS selector, and returns false if the element does not match the selector.
 * this method is very useful with event delegation, where the event handler is only attached to a parent, but we need to find out which element triggered the event.
 *  The browser will perform these matches() checks very efficiently and is useful for larger applications with hundreds of inputs.
 */

// "onSubmit" and "submit"
/**
 * onSubmit is a attribute , submit is a dom events.
 */




// how the event callback is executing since js is synchronous and read code line by line isn't is like going back to top of code to fire the input event ??
/**
 * we are not going back in the code. What's happening is that the event is put in an event queue, and the browser is constantly checking for these events. When the call stack is free, then the event is taken from the event queue, and the function that is associated with the event is executed. All the code that we wrote within the DOMContentLoaded function is executed in sequential order from top to bottom, however, it has now setup the event listeners, and then the browser is waiting for these events to occur. When those events occur, that is when the functions are executed.
 * it is just like how the asynchronous code of setTimeout or promise or async await works ... same thing is happening here .. the event callback are put in the microtask queue and event loop will check is callstack is empty or not if yes then it will move the callback from the respective queue to callstack and executing it so it might feels like that js is going top of code to execute event callback but actually it is not happening..
 */



// ======================= edit and delete logic ========================
/**
 ** How closest() Works:
        It starts at the current element (clickedEditButton in our case).
        It checks if the current element matches the given selector ("tr").
        If it matches then it returns that element.
        If it doesn't match then it moves to the immediate parent element and repeats the check.
        It continues moving up the DOM tree, checking each ancestor, until it either finds a match or reaches the root of the document (the <html> element). If it reaches the root without finding a match, it returns null.
 */




// difference b/w row.querySelector() and document.querySelector()
/**
 ** row.querySelectorAll('td')
    Scope: This searches for all <td> elements that are descendants of the element referenced by the row variable. It's a scoped search. It only looks within the row element and its children, grandchildren, and so on.

    Context: It's typically used when we want to get the <td> elements within a specific table row.

    Result: Returns a NodeList containing only the <td> elements that are descendants of the row element.

 ** document.querySelectorAll('td')

    Scope: This searches for all <td> elements in the entire document. It's a global search. It starts from the root of the document (<html> element) and finds all matching elements, regardless of where they are located in the document's structure.

    Context: It's used when we want to get all the <td> elements on the entire webpage, regardless of which table or row they belong to.

    Result: Returns a NodeList containing all the <td> elements in the document.
 */


// row.cells[0] or 1,2,3 etc.
/**
 * row.cells[0] means "give me the first <td> element inside this row". row.cells[1] means "give me the second <td> element inside this row", and so on.
 */



// local storage logic notes
/**
 *? localStorage.setItem(STORAGE_KEY, JSON.stringify(studentDataArray));
        ** local storage => 
            * localStorage is a property of the window object (which is usually implied in web browser JavaScript) that provides access to the browser's local storage API.

            * Local storage is a web storage mechanism that allows us to store key-value pairs in the user's browser. The data remains available even if the browser is closed and reopened (until the user clears browser data).

            * It is just like storing data on client-side meaning that data is stored in the user's browser not on a server.
        
        ** .setItem()
            * .setItem() is a method of the localStorage object that is used to set or update a value associated with a specified key.
            * It takes two arguments:
                * first is the key which is a string that represent the name by which we will access the stored value.
                * second is the value which is the actual data that we want to store. The value must be a string in case of local storage if we try to store any other datatype it will be implicitly converted to string if not then error will be thrown. 
                * just because of this if we try to store object then js will implicitly convert it to string and it become ['object objet'] due to type coercion that js do.

        ** STORAGE_KEY
            * STORAGE_KEY is a variable that holds the string that we will use as the key to identify our student data.
            * the reason that we create a key is because we are accessing it at multiple places that's why we create a variable and stored in it.
        
        ** JSON.stringify(studentDataArray)
            * studentDataArray is the actual data we want to store which is an array of  objects where each object represents individual student information.

            * JSON.stringify() is a JavaScript method that converts a JavaScript object or array into a JSON (JavaScript Object Notation) string.

            * since Local storage can only store strings and JSON.stringify() ensures that our student data object is converted into a string. inorder to store it in local storage.
 */



// renderStudentDataFromLocalStorage () logic
/**
 ** forEach() logic why we using if we have [] empty array return by fetchedStudentFromLocalStorage().
    * If we run forEach() on an empty array the callback function that we provided to forEach will not execute at all. This is because there are no elements in the array to iterate over. the reason we are applying for each is because we are not sure that is there any data is on local storage or not....  if we as devloper explicitely set some test case data then there will be always data when the page load but if we did not set any data then there will be no data untill user enter their info and add it.

 * the reason we create newTableRow because assume that we had 4 student information and if we refresh the page all the data will be gone but since we are using local storage to store it so on refresh the data will be fetched first then render on the page.
 * The reason for fetching and rendering from local storage is to maintain
    * (1) data persistence across page refreshes. If we didn't use local storage all the data entered by the user would disappear on every page refresh.

 * The renderStudentDataFromLocalStorage function retrieves student data from localStorage and displays it in the table on the page. 
 * The initialStudentStoredData variable holds the array of student objects thae we  fetched from localStorage using fetchStudentDataFromLocalStorage() function.

 * If the array is empty (no data stored yet) then forEach method will not execute the callback function.

 * The forEach method is applied because
    * - As developers we can't guarantee that localStorage will always have data.
    * - If no test data is set in localStorage then it will remain empty until users enter their information.
    * - Using forEach ensures graceful handling of both scenarios (with or without stored data).

 * For each student we create a new table row using the createTableRow function and append it to studentTableTbody.

 * This ensures that even after a page refresh the stored student data is retrieved and displayed correctly.
 */


// why we are using updateLocalStorage() function we had saveDataToLocalStorage() ??
/**
 * the reason is that if we use only saveDataToLocalStorage() function then we have to write the logic of taking data from the html that user enter and then arrgae it in correct format and then save it to local storage.. 
 * so making sepration of concern we create updateLocalStorage() function which handel reterving data from the html and organize it and then call saveDataToLocalStorage() to save to local storage...
 * another imp point is that we did not want to call our saveDataToLocalStorage() when the user update the previously saved data then save data will add new data in the local storage.... so to avoid this we use updateLocalStorage() which handel that when user update any data then updateLocalStorage() will take all the table row (each student data) and pass to it save data function where it add updated data..
 */




// why we see a weird thing that if we create a error div then it is block but inside the form where form is display flex and direction is coloum, but div is behaving inline means it have only width upto its content ?? how
/**
 ** Flex Container Behavior:

    When a block-level element is directly inside a flex container, it will try to occupy as much space as its content, but not the remaining space from its parent unless you force it to do so.

    Flex items do not expand to take full width of flex container by default unless you tell them to do so.

    This can be confusing because normally div elements will take full width of their container but not in case of flex.

 ** The "Inline" Appearance:

    What you're seeing (the error div appearing to only be as wide as its content) is that the div is trying to be as wide as its content, but not the full width of the container.

    It is still a block element and occupies a block, however, its width is controlled by its content.

    The div is not behaving as an inline element, but it is only taking up width based on the width of its content.

 *? Why This Happens?
    Flexbox tries to use its own size.
    flex uses the content to calculate and size elements, and will not make the element occupy full space.
 */