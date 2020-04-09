import React, { Fragment, useState } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {
  Avatar, Button, Container, CssBaseline, makeStyles, Typography, Grid, Link
} from '@material-ui/core';
import {
  CoronavirusTextField, CoronavirusRadio, FieldList
} from "../components/FormComponents/FormFields";
import { CoronavirusDatePicker } from "../components/FormComponents/datePickers/DatePicker";

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


  // async formSubmit() {
  //   const authenticated = await this.props.auth.isAuthenticated();
  //   if (authenticated !== this.state.authenticated) {
  //     const user = await this.props.auth.getUser();
  //     this.setState({ authenticated, user });
  //   }
  // }

  const formSubmit = async (e, position) => {
    e.preventDefault();
    await getUserLocation();
    // await createNewUser();
    await createNewPerson();
    //let newIllnessCall = await createNewIllness();


  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async function (position) {
        console.log(`1st function:`);
        console.log(position)
         setPersonState({ ...personState, lat: position.coords.latitude, lon: position.coords.longitude });
         
      })
    }
  }

  const createNewUser = () => {
    API.createUser(userState)
      .then(result => {
        console.log(`2nd function:`);
        console.log(result);
        setPersonState({ ...personState, UserID: result.data.id });
        setIllnessState({ ...illnessState, UserID: result.data.id });
        return result;
      })
      // setPersonState({...personState, [userID]:res.id}))
      .catch(function (err) {
        console.log(err);
      })
  }

  const createNewPerson = () => {

    API.createPerson(personState)
      .then(result => {
        console.log(`3rd function:`);
        console.log(result);
        return result;
      }
      )
      .catch(function (err) {
        console.log(err);
      })
  }

  // const createNewIllness = async () => {

  //   API.createIllness(illnessState)
  //     .then(
  //       (result) => {
  //         console.log(`4th function:`);
  //         console.log(result);
  //         return result;
  //       }
  //     )
  //     .catch(function (err) {
  //       console.log(err);
  //     })
  // }

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
    lon: 0,
    smoking: "never",
    preExistingConditions: "false",
    listPreExistingConditions: "",
    sick: "false",
    UserID: 0
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
    dateOfRecovery: new Date(),
    UserID: 0
  })

  const classes = useStyles();

  const fields = FieldList;

  const handleInputChange = (key, value, context) => {
    switch (context) {
      case "user":
        setUserState({ ...userState, [key]: value });
        break;
      case "person":
        setPersonState({ ...personState, [key]: value })
        break;
      case "illness":
        setIllnessState({ ...illnessState, [key]: value })
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

      switch (field.fieldType) {
        case "input":
          return (<CoronavirusTextField
            key={key}
            field={field}
            value={value}
            handleChange={(e) => {
              const { id, value } = e.target;
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
              const { id, value } = e.target;
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