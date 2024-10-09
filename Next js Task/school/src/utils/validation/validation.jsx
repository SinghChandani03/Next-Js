

// login form Validation function

export const login_validation = (name, value) => {
    const emailInput = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const passwordInput = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (name === 'email') {
        return (!value.match(emailInput) ? 'Enter a valid email' : '');
    } else if (name === 'password') {
        return (!value.match(passwordInput) ? 'Password must be at least 8 characters long' : '');
    } else {
        return '';
    }
};


 // sign up form Validation function

 export const signup_validation = (name, value) => {

    const emailInput = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const passwordInput = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const nameInput = /^\s*(.{5,10})\s*$/;

    if (name === 'fname') {
        return (!value.match(nameInput) ? 'First Name must be at least 5 characters long' : '');
    }
    else if (name === 'lname') {
        return (!value.match(nameInput) ? 'Last Name must be at least 5 characters long' : '');
    }
    else if (name === 'email') {
        return (!value.match(emailInput) ? 'Enter a valid email' : '');
    }
    else if (name === 'password') {
        return (!value.match(passwordInput) ? 'Password must be at least 8 characters long like - Abc@1214455' : '');
    }
    return '';
};


// student from validation function

export const student_validation = (name, value) => {
    const photoInput = /\.(jpg|jpeg|png|gif)$/;
    const enrollInput = /^(\d{12})$/;
    const nameInput = /^\s*(.{5,30})\s*$/;
    const addressInput = /^\s*(.{5,30})\s*$/;
    const phoneInput = /^(\d{10})$/;;

    if (name === 'photo') {
        // If value is empty, return error message
        if (!value) {
            return 'Please select a photo';
        }
        // If value is a File, validate file extension
        if (value instanceof File) {
            const fileName = value.name.toLowerCase();
            return (!fileName.match(photoInput) ? 'Select png, jpg, jpeg, gif extension file' : '');
        }
    } 
    else if (name === 'enrollment') {
        return (!value.match(enrollInput) ? 'Enter 12 digit valid enrollment number' : '');
    }
    else if (name === 'name') {
        return (!value.match(nameInput) ? 'Name must be at least 5 characters long' : '');
    }
    else if (name === 'address') {
        return (!value.match(addressInput) ? 'Enter valid address' : '');
    }
    else if (name === 'phone') {
        return (!value.match(phoneInput) ? 'Enter 10 digit valid phone number' : '');
    }
    else if (name === 'department') {
        return (!value ? 'Select at least one department' : '');
    }

    return '';
};



//Project form validation function

const isValidDate = (dateString) => {
    // Regular expression to match YYYY-MM-DD format
    const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(dateFormat)) {
        return false;
    }
    // Parse the date and check if it's valid
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        return false;
    }
    return true;
};

const isDateInPast = (dateString) => {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate < currentDate;
};

export const project_validation = (name, value) => {
    const idInput = /^(\d{6})$/;
    const titleInput = /^\s*(.{5,30})\s*$/;
    const descInput = /^\s*(.{10,100})\s*$/;

    if (name === 'pid') {
        return (!value.match(idInput) ? 'Enter 6 digit valid id' : '');
    }
    else if (name === 'title') {
        return (!value.match(titleInput) ? 'Title must be at least 5 characters long' : '');
    }
    else if (name === 'status') {
        return (!value ? 'Select at least one status value' : '');
    }
    else if (name === 'description') {
        return (!value.match(descInput) ? 'Enter description between 10-50 character' : '');
    }
    else if (name === 'sdate') {
        if (!isValidDate(value)) {
            return 'Select a valid date';
        }
        if (isDateInPast(value)) {
            return 'Please select a start date that is not in the past';
        }
    }
    else if (name === 'edate') {
        if (!isValidDate(value)) {
            return 'Select a valid date';
        }
        if (isDateInPast(value)) {
            return 'Please select an end date that is not in the past';
        }
    }
    return '';
};


