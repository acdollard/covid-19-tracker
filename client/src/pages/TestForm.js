import React, { Fragment, useState } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Avatar, Box, Button, Container, CssBaseline,FormControlLabel, 
  FormControl, FormLabel, makeStyles, TextField, Typography,
  Radio, RadioGroup, Grid, Link
} from '@material-ui/core';
import { 
   CoronavirusTextField, CoronavirusRadio, FieldList
} from "../components/FormComponents/FormFields";
import {CoronavirusDatePicker} from "../components/FormComponents/datePickers/DatePicker";

//import API routes 
import API from "../utils/API"



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function TestForm() {


  const formSubmit = async (e, position) => {
    e.preventDefault();
    await getUserLocation();
    await createNewUser();
    await createNewPerson();

  }


  const createNewUser = () => {
    const newUser = {
      email: userState.email,
      password: userState.password
    }
    API.createUser(newUser)
    .then(result=>{
      console.log(result);
      setPersonState({...personState, userID: result.data.id})
  })
  // setPersonState({...personState, [userID]:res.id}))
    .catch(function(err) {
      console.log(err);
    })
  }

  const createNewPerson = () => {
    const newPerson = {
    firstName: personState.firstName,
    lastName: personState.lastName,
    age: personState.age,
    dateOfBirth: personState.dateOfBirth,
    sex: personState.sex,
    lat: personState.lat,
    long: personState.long,
    smoking: personState.smoking,
    preExistingConditions: personState.preExistingConditions,
    listPreExistingConditions: personState.listPreExistingConditions,
    sick: personState.sick,
    UserId: personState.userID
    }
    API.createPerson(newPerson)
    .then(
      (res) => {
        console.log(res);
      }
    )
    .catch(function(err) {
      console.log(err);
    })
  }

  
  


  const [userState, setUserState] = useState({
    email: "",
    password: ""
  });
  
  //////////// Reminder to create a function for converting dob to age
  const [personState, setPersonState] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    dateOfBirth: new Date(),
    sex: "female",
    lat: 0,
    long: 0,
    smoking: "never",
    preExistingConditions: "false",
    listPreExistingConditions: "",
    sick: "false",
    userID: 0 
  });
  
  const [illnessState, setIllnessState] = useState({
    tested: "false",
    dateOfTest: new Date(),
    dateOfOnset: new Date(),
    symptoms: "",
    hospitalized: "false",
    dateOfHospitalization: new Date(),
    intensiveCare: "false",
    death: "false",
    dateOfRecovery: new Date()
  })
  
  const classes = useStyles();
  
  const fields = FieldList;
  
  const getUserLocation = () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        console.log(position);
        setPersonState({...personState, lat:position.coords.latitude, long:position.coords.longitude});
        // setPersonState({...personState, long:position.coords.longitude})
      })
    }
  }

  const handleInputChange = (key, value, context) => {
    switch (context){
      case "user":
        setUserState({ ...userState, [key]: value});
        break;
      case "person":
        setPersonState({ ...personState, [key]:value })
        break;
      case "illness":
        setIllnessState({ ...illnessState, [key]:value})
        break;
      default:
        console.log(`unexpected context type: ${context}`);
    }
  }

  const getFormFields = () => {
    return fields.map(field => {
      const key = field.id;
      const value = (field.context === "user") ? userState[key] : 
                    (field.context === "person") ? personState[key] : illnessState[key];

      switch (field.fieldType){
        case "input":
          return (<CoronavirusTextField
            key={key}
            field={field}
            value={value}
            handleChange={(e) => {
              const {id, value} = e.target;
              handleInputChange(id, value, field.context);
            }}
          />);
        case "date":
          return (<CoronavirusDatePicker
            key={key}
            field={field}
            value={value}
            // Must pass in date as the first property here in order to expose the formatted date (or stringDate)
            handleChange={(date, stringDate) => handleInputChange(key, stringDate, field.context)}
          />);
        case "radio":
          return (<CoronavirusRadio
            key={key}
            field={field}
            value={value}
            handleChange={(e) => {
              const {id, value} = e.target;
              handleInputChange(key, value, field.context);
            }}
          />)
        default:
          break;
      }
      
    })
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Please enter your test result and some relevant personal information that will help researchers track the spread of coronavirus.
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            {getFormFields()}

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={formSubmit}
          >
            Submit
          </Button>
          {/* Commenting the following out to be used in a later version */}
          {/* <Grid container justify="flex-end">
                      <Grid item>
                          <Link href="#" variant="body2">
                              Already have an account? Sign in
                          </Link>
                      </Grid>
                  </Grid> */}
        </form>
      </div>
    </Container>
  );
}