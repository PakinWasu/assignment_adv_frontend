const express = require('express');
const axios = require('axios');
const app = express();
var bodyParser = require('body-parser');
const path = require('path')


// const base_url = "http://localhost:3000";
const base_url = "http://node68420-inet-clinic.proen.app.ruk-com.cloud";


app.set('views', path.join(__dirname, "/public/views"))
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/treatment`);
        const treatments = response.data;
        res.render("treatment", { treatments });
    } catch (err) {
        console.error('Error fetching treatments:', err);
        res.status(500).send('Error fetching treatments');
    }
});


app.get("/add-doctor", (req, res) => {
    res.render("add-doctor");
});

// Route to handle form submission and add a new doctor to the database
app.post("/add-doctor",async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            department: req.body.department,
            contact: req.body.contact,
            date_of_birth: req.body.date_of_birth,
            doctor_detail: req.body.doctor_detail,
            medical_practice_license_number: req.body.medical_practice_license_number
        };
        await axios.post(base_url + '/doctor', data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/add-patient", (req, res) => {
    res.render("add-patient");
});

// Route to handle form submission and add a new doctor to the database
app.post("/add-patient",async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            date_of_birth: req.body.date_of_birth,
            blood_type: req.body.blood_type,
            weight: req.body.weight,
            height: req.body.height,
            contact: req.body.contact,
            patient_detail: req.body.patient_detail
        };
        await axios.post(base_url + '/patient', data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/add-treatment-detail", async (req, res) => {
    try {
        // Fetch all treatments to populate the treatment ID dropdown
        const treatmentsResponse = await axios.get(`${base_url}/treatment`);
        const treatments = treatmentsResponse.data;
        const treatmentID = req.query.treatmentID;
        res.render("add-treatment-detail", { treatments,treatmentID });
    } catch (err) {
        console.error('Error fetching treatments:', err);
        res.status(500).send('Error fetching treatment data');
    }
});




// Route to handle form submission and add a new treatment detail to the database
app.post("/add-treatment-detail", async (req, res) => {
    try {
        const data = {
            treatmentID: req.body.treatmentID,
            timestamp: req.body.timestamp,
            next_treatment_date: req.body.next_treatment_date,
            dispensing_medicine: req.body.dispensing_medicine,
            latest_treatment_detail: req.body.latest_treatment_detail
        };

        await axios.post(`${base_url}/treatment-detail`, data);
        res.redirect("/"); // Redirect to treatment details page after successful addition
    } catch (err) {
        console.error('Error adding treatment detail:', err);
        res.status(500).send('Error');
    }
});



// Route to display the form for adding treatment
app.get("/add-treatment", async (req, res) => {
    try {
        // Fetch doctors from the database
        const doctorsResponse = await axios.get(`${base_url}/doctor`);
        const doctors = doctorsResponse.data; // Assuming this returns an array of doctors

        // Fetch patients from the database
        const patientsResponse = await axios.get(`${base_url}/patient`);
        const patients = patientsResponse.data; // Assuming this returns an array of patients

        // Render the add treatment form with doctors and patients
        res.render("add-treatment", { doctors, patients });
    } catch (err) {
        console.error('Error fetching doctors or patients:', err);
        res.status(500).send('Error fetching data');
    }
});


// Route to handle form submission for adding treatment
app.post("/add-treatment", async (req, res) => {
    try {
        const data = {
            doctorID: req.body.doctorID, // Get the doctorID from the form
            patientID: req.body.patientID, // Get the patientID from the form
            status: req.body.status, // Get the status from the form
            start_treatment_date: req.body.start_treatment_date, // Get start date
            last_treated_date: req.body.last_treated_date, // Get last treated date
            short_detail: req.body.short_detail // Get short detail
        };

        // Send the post request to add the treatment
        await axios.post(`${base_url}/treatment`, data); // Adjust the endpoint as needed

        res.redirect("/"); // Redirect to the main page after adding treatment
    } catch (err) {
        console.error('Error adding treatment:', err);
        res.status(500).send('Error adding treatment');
    }
});

app.get("/doctors", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/doctor`);
        const doctors = response.data; // Assuming the API returns an array of doctors
        res.render("doctors", { doctors });
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).send('Error fetching doctor data');
    }
});

app.get("/patients", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/patient`);
        const patients = response.data; // Assuming the API returns an array of patients
        res.render("patients", { patients });
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).send('Error fetching patient data');
    }
});



app.get('/treatment-details/:treatmentID', async (req, res) => {
    const treatmentID = req.params.treatmentID;

    try {
        const response = await axios.get(`${base_url}/treatment-details/${treatmentID}`);
        const treatmentDetails = response.data;

        if (treatmentDetails.length === 0) {
            return res.redirect(`/add-treatment-detail?treatmentID=${treatmentID}`);
        }

        res.render('treatment-details', { treatmentDetails });
    } catch (err) {
        console.error('Error fetching treatment details:', err);

        return res.redirect(`/add-treatment-detail?treatmentID=${treatmentID}`);
    }
});


app.get("/update-doctor/:id", async (req, res) => {
    try {
        const response = await axios.get(base_url + '/doctor/' + req.params.id);
        res.render("update-doctor", { doctor: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.post("/update-doctor/:id", async (req, res) => {
    try {
        const doctorID = req.params.id;
        const data = {
            name: req.body.name,
            department: req.body.department,
            contact: req.body.contact,
            date_of_birth: req.body.date_of_birth,
            doctor_detail: req.body.doctor_detail,
            medical_practice_license_number: req.body.medical_practice_license_number
        };
        await axios.put(base_url + '/doctor/' + doctorID, data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/update-patient/:id", async (req, res) => {
    try {
        const response = await axios.get(`${base_url}/patient/${req.params.id}`);
        res.render("update-patient", { patient: response.data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching patient data');
    }
});

app.post("/update-patient/:id", async (req, res) => {
    try {
        const patientID = req.params.id;

        const data = {
            name: req.body.name,
            date_of_birth: req.body.date_of_birth,
            blood_type: req.body.blood_type,
            weight: req.body.weight,
            height: req.body.height,
            contact: req.body.contact,
            patient_detail: req.body.patient_detail
        };

        await axios.put(`${base_url}/patient/${patientID}`, data);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating patient');
    }
});
app.get("/update-treatment-detail/:id", async (req, res) => {
    try {
        // Fetch the treatment detail data by its ID
        const response = await axios.get(`${base_url}/treatment-detail/${req.params.id}`);
        res.render("update-treatment-detail", { treatmentDetail: response.data });
    } catch (err) {
        console.error('Error fetching treatment detail:', err);
        res.status(500).send('Error fetching treatment detail data');
    }
});


// Route to handle form submission and update treatment detail
app.post("/update-treatment-detail/:id", async (req, res) => {
    try {
        const treatmentDetailID = req.params.id;

        // Collect the data from the form fields
        const data = {
            treatmentID: req.body.treatmentID,
            timestamp: req.body.timestamp,
            next_treatment_date: req.body.next_treatment_date,
            dispensing_medicine: req.body.dispensing_medicine,
            latest_treatment_detail: req.body.latest_treatment_detail
        };

        // Send the update request to the API or database
        await axios.put(`${base_url}/treatment-detail/${treatmentDetailID}`, data);

        // Redirect to the treatment detail or another relevant page after updating
        res.redirect("/");
    } catch (err) {
        console.error('Error updating treatment detail:', err);
        res.status(500).send('Error updating treatment detail');
    }
});
app.get("/update-treatment-detail/:id", async (req, res) => {
    try {
        // Fetch the treatment detail data by its ID
        const response = await axios.get(`${base_url}/treatment-detail/${req.params.id}`);
        res.render("update-treatment-detail", { treatmentDetail: response.data });
    } catch (err) {
        console.error('Error fetching treatment detail:', err);
        res.status(500).send('Error fetching treatment detail data');
    }
});

// Route to handle form submission and update treatment detail
app.post("/update-treatment-detail/:id", async (req, res) => {
    try {
        const treatmentDetailID = req.params.id;

        // Collect the data from the form fields
        const data = {
            treatmentID: req.body.treatmentID,
            timestamp: req.body.timestamp,
            next_treatment_date: req.body.next_treatment_date,
            dispensing_medicine: req.body.dispensing_medicine,
            latest_treatment_detail: req.body.latest_treatment_detail
        };

        // Send the update request to the API or database
        await axios.put(`${base_url}/treatment-detail/${treatmentDetailID}`, data);

        // Redirect to the treatment detail or another relevant page after updating
        res.redirect("/");
    } catch (err) {
        console.error('Error updating treatment detail:', err);
        res.status(500).send('Error updating treatment detail');
    }
});

app.get("/update-treatment/:id", async (req, res) => {
    try {
        // Fetch the treatment data by its ID
        const response = await axios.get(`${base_url}/treatment/${req.params.id}`);
        res.render("update-treatment", { treatment: response.data });
    } catch (err) {
        console.error('Error fetching treatment:', err);
        res.status(500).send('Error fetching treatment data');
    }
});

// Route to handle form submission and update treatment
app.post("/update-treatment/:id", async (req, res) => {
    try {
        const treatmentID = req.params.id;

        // Collect the data from the form fields
        const data = {
            doctorID: req.body.doctorID,
            patientID: req.body.patientID,
            status: req.body.status,
            start_treatment_date: req.body.start_treatment_date,
            last_treated_date: req.body.last_treated_date,
            short_detail: req.body.short_detail
        };

        // Send the update request to the API or database
        await axios.put(`${base_url}/treatment/${treatmentID}`, data);

        // Redirect to a relevant page after updating
        res.redirect("/");
    } catch (err) {
        console.error('Error updating treatment:', err);
        res.status(500).send('Error updating treatment');
    }
});

app.get("/delete-patient/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/patient/' + req.params.id);
            res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

app.get("/delete-doctor/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/doctor/' + req.params.id);
            res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
app.get("/delete-treatment-detail/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/treatment-detail/' + req.params.id);
            res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});
app.get("/delete-treatment/:id", async (req, res) => {
    try {
        await axios.delete(base_url + '/treatment/' + req.params.id);
            res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
