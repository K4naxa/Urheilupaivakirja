import "./Register.css";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [error, setError] = useState("");

  const [role, setRole] = useState(""); // student or teacher
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [phone, setPhone] = useState("");
  const [sport, setSport] = useState("");
  const [group, setGroup] = useState("");
  const [office, setOffice] = useState("");

  return (
    <div className="container">
      <div className="registerContainer">
        <div className="header">Rekisteröinti</div>
        <div className="mainContainer">
          <div className="roleContainer">
            <input
              type="radio"
              name="roleRadio"
              defaultChecked
              id="studentRadio"
            />
            <label htmlFor="studentRadio">Opiskelija</label>
            <input type="radio" name="roleRadio" id="teacherRadio" />
            <label htmlFor="teacherRadio">Opettaja</label>
          </div>
          <div className="inputRow">
            <div className="inputContainer">
              <p>Etunimi</p>{" "}
              <input
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
